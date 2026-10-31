# BCI Atlas · 脑机接口研究地图

一个零依赖、可离线使用的脑机接口文献导航网站。核心内容分为总览、主题地图、时间线、文献卡片库与研究空白五个页面。

## 发布成正常网址

公网网站需要一个静态托管平台，浏览器不能把一个 `file://` 文件自动变成互联网网址。项目已经按标准静态网站整理，可从下面两种方式中选择。

### 方式 A：GitHub Pages

1. 在 GitHub 创建一个空仓库，名称可使用 `bci-atlas`。
2. 把本项目文件推送到仓库的 `main` 分支。
3. 打开仓库的 `Settings → Pages`，把 Source 设为 `GitHub Actions`。
4. 推送后，`.github/workflows/pages.yml` 会自动生成仓库的 `dist/` 发布目录并部署。
5. 发布完成后，正常网址通常是 `https://你的用户名.github.io/bci-atlas/`。

工作流只发布网站运行文件，不会上传 `论文批注_中文/` 中的研究 PDF。

### 方式 B：Cloudflare Pages 或 Netlify

1. 解压或直接准备 `bci-atlas-ipad.zip`。
2. 在 Cloudflare Pages / Netlify 中选择静态站点或拖拽上传。
3. 按压缩包当前目录直接发布，不需要构建命令。
4. 在平台控制台启用 HTTPS，得到正常网址。

发布后打开 HTTPS 地址一次，即可在 iPad Safari 点击“分享 → 添加到主屏幕”。`_headers` 已包含 Service Worker 更新策略和基础安全响应头，支持该配置的托管平台会自动读取。

## 打开方式

直接双击 `index.html` 即可使用。也可以在当前目录启动本地静态服务器：

```powershell
python -m http.server 8000
```

然后访问 `http://localhost:8000`。

网站没有 npm、构建工具或外部 CDN 依赖，联网时点击 DOI 可进入出版商页面；断网时其余功能仍可用。

若要把网站直接上传到静态托管，可使用根目录中的 `bci-atlas-ipad.zip`；压缩包只包含网站运行文件，不包含原始论文 PDF。

## 在 iPad 上使用

### 同一 Wi‑Fi 临时访问

1. 双击 `start-ipad.cmd`，或在 PowerShell 中运行 `.\start-ipad.ps1`。
2. Windows 防火墙询问时，允许“专用网络”访问。
3. 让 iPad 与电脑连接同一个 Wi‑Fi，在 iPad Safari 打开脚本显示的地址，例如 `http://192.168.1.8:8080`。
4. 使用 `Ctrl+C` 停止服务器。iPad 上的个人数据仍保存在 Safari 本地，但停止服务后不能继续打开页面。

端口被占用时，可运行：

```powershell
.\start-ipad.ps1 -Port 8090
```

### 添加到 iPad 主屏幕

Safari 的离线缓存要求 HTTPS 安全连接。把整个项目文件夹部署到 GitHub Pages、Cloudflare Pages、Netlify 或其他 HTTPS 静态托管后：

1. 在 iPad Safari 打开部署地址，并等待页面完整加载一次。
2. 点击 Safari 的“分享”按钮。
3. 选择“添加到主屏幕”。
4. 以后从主屏幕图标打开，即可使用已缓存的网站内容。

`manifest.webmanifest`、`sw.js` 和 `icons/` 已提供主屏幕图标、应用名称和离线应用外壳。普通局域网 HTTP 地址可以正常浏览与保存批注，但不会启用 Service Worker 离线缓存。

更新种子文献或界面后，请同步提高 `sw.js` 中的 `CACHE_NAME` 版本，避免已安装的 iPad 主屏幕应用继续显示旧缓存。

### 迁移个人数据

电脑和 iPad 的浏览器数据默认互不相通。先在电脑打开“导入 / 导出 → 导出个人数据”，把 JSON 文件通过隔空投送或 iCloud 发到 iPad，再从 iPad 的网站导入。

## 当前内容

- 29 篇种子论文，时间跨度为 1973–2026。
- 7 个研究主题：范式与脑控、神经信号与接口、解码与人工智能、交流与神经假体、运动与神经康复、认知风险与疾病脑电、临床转化与治理。
- 9 个研究空白，每个空白均连接到证据论文与可操作问题。
- 论文题名、作者、年份、期刊与 DOI 于 2026-10-30 经 Crossref 核验；4 篇 2024–2026 年痴呆 / MCI 相关论文同时使用项目内 PDF 元数据复核。

中文“研究贡献”“阅读价值”和“关键边界”是编辑性导读，不是论文摘要的逐字翻译。研究空白的二维位置是策展判断，不是文献计量分数。

## 持续添加文献

网站内点击“添加文献”录入的论文会立即更新所有页面，数据保存在浏览器 `localStorage` 中，键名为：

```text
bci-atlas-personal-v1
```

个人数据包括：

- 新增文献
- 阅读状态：未开始、待读、在读、已读
- 收藏
- 个人批注
- 已追踪研究议题

建议定期通过“导入 / 导出”导出 JSON 备份，以便换浏览器或设备后恢复。

## 维护固定种子库

如需让新增文献成为项目固定内容，编辑 `data/papers.js`，在 `papers` 数组中追加对象：

```js
{
  id: "short-unique-id",
  title: "English title",
  titleZh: "中文阅读标题",
  authors: "Author et al.",
  year: 2026,
  venue: "Journal or Conference",
  doi: "10.xxxx/xxxxx",
  theme: "decoding",
  signal: "EEG",
  kind: "recent",
  impact: 3,
  tags: ["tag-1", "tag-2"],
  summary: "一句话研究贡献。",
  why: "为什么值得进入研究地图。",
  limitation: "关键边界与局限。"
}
```

可用主题 ID：

```text
paradigm
signal
decoding
communication
motor
cognition
translation
```

`signal` 建议使用 `EEG`、`ECoG`、`Intracortical`、`Non-invasive` 或 `Conceptual`。`kind` 使用 `classic`、`breakthrough` 或 `recent`。新增后刷新页面即可进入地图、时间线和筛选统计。

## 文件结构

```text
index.html       页面结构
styles.css       响应式视觉与布局
app.js           筛选、详情、批注、导入导出等交互
data/papers.js   种子论文、主题与研究空白
manifest.webmanifest  iPad 主屏幕配置
sw.js            离线缓存
icons/           网站图标
start-ipad.cmd   Windows 双击启动局域网服务器
start-ipad.ps1   无依赖局域网静态文件服务器
.github/workflows/pages.yml  GitHub Pages 自动发布
```

## 引用核验原则

- 种子论文只采用可定位的出版记录，提供 DOI 或本地原文。
- DOI 链接指向 `https://doi.org/`，不在站内复制受版权保护的全文。
- 新增论文时优先录入 DOI，系统会按 DOI、英文题名与中文题名去重。
- 对预印本、会议摘要和未经同行评议的技术报告，应在标签或局限中明确注明。
