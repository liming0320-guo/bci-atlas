param(
  [int]$Port = 8080
)

$ErrorActionPreference = "Stop"
$root = (Resolve-Path -LiteralPath $PSScriptRoot).Path.TrimEnd("\")
$listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Any, $Port)
$mimeTypes = @{
  ".html"       = "text/html; charset=utf-8"
  ".css"        = "text/css; charset=utf-8"
  ".js"         = "application/javascript; charset=utf-8"
  ".json"       = "application/json; charset=utf-8"
  ".webmanifest" = "application/manifest+json; charset=utf-8"
  ".svg"        = "image/svg+xml"
  ".png"        = "image/png"
  ".ico"        = "image/x-icon"
  ".md"         = "text/markdown; charset=utf-8"
  ".txt"        = "text/plain; charset=utf-8"
  ".pdf"        = "application/pdf"
}

function Get-LanAddresses {
  try {
    return [System.Net.Dns]::GetHostAddresses([System.Net.Dns]::GetHostName()) |
      Where-Object {
        $_.AddressFamily -eq [System.Net.Sockets.AddressFamily]::InterNetwork -and
        -not [System.Net.IPAddress]::IsLoopback($_) -and
        $_.ToString() -notlike "169.254.*"
      } |
      Select-Object -ExpandProperty IPAddressToString -Unique
  }
  catch {
    return @()
  }
}

function Send-Response {
  param(
    [System.Net.Sockets.NetworkStream]$Stream,
    [int]$StatusCode,
    [string]$StatusText,
    [string]$ContentType,
    [byte[]]$Body,
    [bool]$HeadOnly = $false
  )

  $header = "HTTP/1.1 $StatusCode $StatusText`r`n" +
    "Content-Type: $ContentType`r`n" +
    "Content-Length: $($Body.Length)`r`n" +
    "Cache-Control: no-cache`r`n" +
    "X-Content-Type-Options: nosniff`r`n" +
    "Connection: close`r`n`r`n"
  $headerBytes = [System.Text.Encoding]::ASCII.GetBytes($header)
  $Stream.Write($headerBytes, 0, $headerBytes.Length)
  if (-not $HeadOnly -and $Body.Length -gt 0) {
    $Stream.Write($Body, 0, $Body.Length)
  }
  $Stream.Flush()
}

try {
  $listener.Start()
}
catch {
  Write-Host "无法启动服务器：$($_.Exception.Message)" -ForegroundColor Red
  Write-Host "请尝试其他端口，例如：.\start-ipad.ps1 -Port 8090"
  exit 1
}

Write-Host ""
Write-Host "BCI Atlas · iPad 局域网服务器" -ForegroundColor Green
Write-Host "项目目录：$root"
Write-Host "按 Ctrl+C 停止。iPad 与电脑必须连接同一个 Wi-Fi。"
Write-Host ""

$addresses = @(Get-LanAddresses)
if ($addresses.Count -gt 0) {
  foreach ($address in $addresses) {
    Write-Host "  iPad 打开：http://${address}:$Port" -ForegroundColor Cyan
  }
}
else {
  Write-Host "  未自动识别局域网 IP，请在 Windows 网络设置中查看 IPv4 地址。" -ForegroundColor Yellow
}
Write-Host ""
Write-Host "如无法访问，请允许 Windows 防火墙中的“专用网络”访问。"
Write-Host ""

try {
  while ($true) {
    $client = $listener.AcceptTcpClient()
    try {
      $client.ReceiveTimeout = 5000
      $stream = $client.GetStream()
      $reader = [System.IO.StreamReader]::new(
        $stream,
        [System.Text.Encoding]::ASCII,
        $false,
        1024,
        $true
      )
      $requestLine = $reader.ReadLine()
      if ([string]::IsNullOrWhiteSpace($requestLine)) {
        continue
      }

      while ($true) {
        $headerLine = $reader.ReadLine()
        if ([string]::IsNullOrEmpty($headerLine)) {
          break
        }
      }

      $parts = $requestLine.Split(" ")
      if ($parts.Length -lt 2 -or $parts[0] -notin @("GET", "HEAD")) {
        $body = [System.Text.Encoding]::UTF8.GetBytes("Method not allowed")
        Send-Response $stream 405 "Method Not Allowed" "text/plain; charset=utf-8" $body
        continue
      }

      $method = $parts[0]
      $urlPath = ($parts[1] -split "\?")[0]
      try {
        $urlPath = [System.Uri]::UnescapeDataString($urlPath)
      }
      catch {
        $body = [System.Text.Encoding]::UTF8.GetBytes("Bad request")
        Send-Response $stream 400 "Bad Request" "text/plain; charset=utf-8" $body
        continue
      }

      if ($urlPath -eq "/") {
        $urlPath = "/index.html"
      }
      $relativePath = $urlPath.TrimStart("/") -replace "/", [System.IO.Path]::DirectorySeparatorChar
      $candidate = [System.IO.Path]::GetFullPath((Join-Path $root $relativePath))
      $isInsideRoot = $candidate -eq $root -or
        $candidate.StartsWith($root + [System.IO.Path]::DirectorySeparatorChar, [System.StringComparison]::OrdinalIgnoreCase)

      if (-not $isInsideRoot -or -not (Test-Path -LiteralPath $candidate -PathType Leaf)) {
        $body = [System.Text.Encoding]::UTF8.GetBytes("Not found")
        Send-Response $stream 404 "Not Found" "text/plain; charset=utf-8" $body ($method -eq "HEAD")
        continue
      }

      $extension = [System.IO.Path]::GetExtension($candidate).ToLowerInvariant()
      $contentType = if ($mimeTypes.ContainsKey($extension)) {
        $mimeTypes[$extension]
      }
      else {
        "application/octet-stream"
      }
      $body = [System.IO.File]::ReadAllBytes($candidate)
      Send-Response $stream 200 "OK" $contentType $body ($method -eq "HEAD")

      $clientAddress = $client.Client.RemoteEndPoint.Address.ToString()
      Write-Host ("[{0}] {1} {2}" -f $clientAddress, $method, $urlPath) -ForegroundColor DarkGray
    }
    catch {
      Write-Host "请求处理失败：$($_.Exception.Message)" -ForegroundColor Yellow
    }
    finally {
      $client.Close()
    }
  }
}
finally {
  $listener.Stop()
  Write-Host ""
  Write-Host "服务器已停止。"
}
