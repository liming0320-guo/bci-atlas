/*
 * BCI Atlas seed library
 * 元数据核验日期：2026-10-30
 * 来源：Crossref 公开元数据；2024–2026 的四篇 EEG 痴呆/MCI 论文另由本地 PDF 复核。
 * 新增论文时可直接在 papers 数组中追加同结构对象，或使用网站内的“添加文献”。
 */
window.BCI_SEED_DATA = {
  meta: {
    title: "BCI Atlas",
    version: 1,
    updated: "2026-10-30",
    scope:
      "以脑机接口的范式、神经信号、解码、交流、运动康复、认知临床与转化为核心的策展型文献库。",
  },

  themes: [
    {
      id: "paradigm",
      name: "范式与脑控",
      short: "范式",
      code: "PARADIGM",
      x: 50,
      y: 10,
      color: "#5c754e",
      description:
        "研究如何把意图变成可测量的脑活动：P300、感觉运动节律、SSVEP 与连续控制共同构成 BCI 的实验语言。",
      question: "怎样设计任务，让系统读到稳定、可学习、不过度消耗使用者的意图？",
      boundary: "从离散选择走向连续、自然、多任务控制。",
    },
    {
      id: "signal",
      name: "神经信号与接口",
      short: "信号",
      code: "SIGNAL",
      x: 16,
      y: 25,
      color: "#3e7088",
      description:
        "从头皮 EEG 到皮层 ECoG 与皮层内尖峰，不同接口在侵入性、带宽、空间精度和长期稳定性之间交换条件。",
      question: "在什么任务和时间尺度上，哪一种信号真正具备临床可用性？",
      boundary: "信号质量、手术风险、设备寿命与日常佩戴必须一起评价。",
    },
    {
      id: "decoding",
      name: "解码与人工智能",
      short: "解码",
      code: "DECODING",
      x: 84,
      y: 24,
      color: "#735c8a",
      description:
        "把神经动力学映射为光标、文字、声音或动作。研究重心从手工特征与线性分类器，走向跨模态深度学习和低标签校准。",
      question: "模型捕捉的是可泛化的神经计算，还是参与者与记录条件留下的指纹？",
      boundary: "跨被试、跨会话与跨设备的可重复性能仍比离线提升更稀缺。",
    },
    {
      id: "communication",
      name: "交流与神经假体",
      short: "交流",
      code: "COMMUNICATION",
      x: 89,
      y: 64,
      color: "#b4573f",
      description:
        "让严重运动或语言障碍者通过拼写、手写、语音合成与数字替身恢复表达，是 BCI 临床影响最直接的主线之一。",
      question: "怎样从“能解码若干词”走向随时可用、自然且可纠错的交流？",
      boundary: "中文、声调、多语混合、自由对话与情绪韵律仍缺少统一验证。",
    },
    {
      id: "motor",
      name: "运动与神经康复",
      short: "运动",
      code: "NEURO-MOTOR",
      x: 72,
      y: 88,
      color: "#397067",
      description:
        "从控制机械臂到驱动自身肌肉，闭环桥梁把运动意图、外部执行与感觉反馈重新组织成可学习的功能回路。",
      question: "闭环刺激与辅助设备能否带来超越自然恢复的长期功能改变？",
      boundary: "随机对照、居家长期使用与感觉反馈质量仍待补足。",
    },
    {
      id: "cognition",
      name: "认知风险与疾病脑电",
      short: "认知",
      code: "COGNITION",
      x: 28,
      y: 88,
      color: "#9c6a25",
      description:
        "把微状态、功能连接、图网络与深度学习用于 MCI、AD、FTD 等认知障碍的早期识别与分型。",
      question: "脑电异常能否从横断面的分类准确率，走向个体化预测与干预闭环？",
      boundary: "小样本、单中心和片段级泄漏风险仍是外部有效性的主要障碍。",
    },
    {
      id: "translation",
      name: "临床转化与治理",
      short: "转化",
      code: "TRANSLATION",
      x: 10,
      y: 62,
      color: "#6e6d62",
      description:
        "把实验室性能转化为安全、公平、可负担和可维护的服务，同时处理神经数据、身份、能动性与知情同意。",
      question: "谁受益、谁维护、谁拥有神经数据，失败时又如何保障使用者权益？",
      boundary: "技术指标之外，真实世界结局与数据治理需要进入研究设计本身。",
    },
  ],

  papers: [
    {
      id: "vidal-1973",
      title: "Toward Direct Brain-Computer Communication",
      titleZh: "走向直接的脑—机通信",
      authors: "Jacques J. Vidal",
      year: 1973,
      venue: "Annual Review of Biophysics and Bioengineering",
      doi: "10.1146/annurev.bb.02.060173.001105",
      theme: "paradigm",
      signal: "Conceptual",
      kind: "classic",
      impact: 5,
      tags: ["概念奠基", "直接通信", "脑电"],
      summary:
        "把脑电活动直接作为人机通信通道提出，奠定了“无需外周肌肉参与”的 BCI 研究议程。",
      why:
        "今天的研究问题几乎都能追溯到这条原始设想：从可测量的神经活动生成可用的交互信号。",
      limitation:
        "属于概念与技术展望，不是现代意义上的在线闭环系统；其价值在于定义问题。",
    },
    {
      id: "farwell-1988",
      title:
        "Talking off the top of your head: toward a mental prosthesis utilizing event-related brain potentials",
      titleZh: "用事件相关脑电位构建心理假体",
      authors: "L. A. Farwell, E. Donchin",
      year: 1988,
      venue: "Electroencephalography and Clinical Neurophysiology",
      doi: "10.1016/0013-4694(88)90149-6",
      theme: "paradigm",
      signal: "EEG",
      kind: "classic",
      impact: 5,
      tags: ["P300", "拼写器", "oddball"],
      summary:
        "将 P300 oddball 范式用于字符选择，展示了以注意力相关诱发电位实现通信的完整路径。",
      why:
        "P300 拼写器成为非侵入式 BCI 最容易复现的经典范式，也确立了刺激、选择与分类的接口结构。",
      limitation:
        "依赖稳定视觉注意和重复刺激，速度与用户体验受限于范式本身。",
    },
    {
      id: "pfurtscheller-1999",
      title:
        "Event-related EEG/MEG synchronization and desynchronization: basic principles",
      titleZh: "事件相关 EEG/MEG 同步与去同步：基本原理",
      authors: "G. Pfurtscheller, F. H. Lopes da Silva",
      year: 1999,
      venue: "Clinical Neurophysiology",
      doi: "10.1016/S1388-2457(99)00141-8",
      theme: "signal",
      signal: "EEG",
      kind: "classic",
      impact: 5,
      tags: ["ERD/ERS", "感觉运动节律", "时频分析"],
      summary:
        "系统阐明事件相关去同步/同步的生理与测量原理，为想象运动 BCI 提供了可解释的节律基础。",
      why:
        "它把 μ/β 节律变化从描述现象转化为控制信号，是运动想象范式的方法学基石。",
      limitation:
        "空间定位与个体差异仍是头皮 EEG 的限制；ERD/ERS 不能直接等同于单一皮层机制。",
    },
    {
      id: "birbaumer-1999",
      title: "A spelling device for the paralysed",
      titleZh: "面向瘫痪者的拼写装置",
      authors: "N. Birbaumer et al.",
      year: 1999,
      venue: "Nature",
      doi: "10.1038/18581",
      theme: "communication",
      signal: "EEG",
      kind: "classic",
      impact: 5,
      tags: ["慢皮层电位", "ALS", "临床验证"],
      summary:
        "利用慢皮层电位训练让严重瘫痪者自主选择字母，证明 BCI 可服务于真实交流需求。",
      why:
        "研究把工程演示推进到严重运动障碍人群，强调使用者训练与自主控制，而非只看分类器。",
      limitation:
        "训练周期长、信息传输率有限，长期负担与可用性需要更多临床研究。",
    },
    {
      id: "wolpaw-2000",
      title:
        "Brain-computer interface technology: a review of the first international meeting",
      titleZh: "脑机接口技术：首届国际会议综述",
      authors: "J. R. Wolpaw et al.",
      year: 2000,
      venue: "IEEE Transactions on Rehabilitation Engineering",
      doi: "10.1109/TRE.2000.847807",
      theme: "translation",
      signal: "Conceptual",
      kind: "classic",
      impact: 4,
      tags: ["领域定义", "共识", "康复工程"],
      summary:
        "明确 BCI 必须直接记录中枢神经活动、将其转换为输出并绕开正常神经肌肉通路。",
      why:
        "提供领域共同语言，也把性能、可用性、训练和临床评价放在同一框架内。",
      limitation:
        "早期综述对消费级设备、深度学习与神经数据治理的覆盖自然有限。",
    },
    {
      id: "wolpaw-2002",
      title: "Brain–computer interfaces for communication and control",
      titleZh: "服务于交流与控制的脑机接口",
      authors: "J. R. Wolpaw, N. Birbaumer, D. J. McFarland, G. Pfurtscheller, T. M. Vaughan",
      year: 2002,
      venue: "Clinical Neurophysiology",
      doi: "10.1016/S1388-2457(02)00057-3",
      theme: "paradigm",
      signal: "EEG",
      kind: "classic",
      impact: 5,
      tags: ["信号链", "感觉运动节律", "综述"],
      summary:
        "用采集—特征—转换—输出—反馈的闭环框架总结 BCI，并系统讨论使用者学习与系统适应。",
      why:
        "这是理解现代 BCI 架构最稳定的共同参照：性能不是单一算法结果，而是人机共同学习的产物。",
      limitation:
        "主要围绕 EEG 与实验室控制任务，尚未覆盖现代语音神经假体和长期植入的复杂问题。",
    },
    {
      id: "carmena-2003",
      title:
        "Learning to Control a Brain–Machine Interface for Reaching and Grasping by Primates",
      titleZh: "灵长类学习控制抓握与到达脑机接口",
      authors: "J. M. Carmena et al.",
      year: 2003,
      venue: "PLoS Biology",
      doi: "10.1371/journal.pbio.0000042",
      theme: "motor",
      signal: "Intracortical",
      kind: "classic",
      impact: 4,
      tags: ["学习", "运动皮层", "闭环控制"],
      summary:
        "猴子逐步学会用运动皮层群体活动控制光标与机械臂，并出现与工具使用相关的神经表征变化。",
      why:
        "把 BCI 从即时映射推向了可学习、可塑的闭环工具，说明使用者本身会改变控制策略。",
      limitation:
        "动物模型与短期记录不能直接外推到人类长期植入和日常功能。",
    },
    {
      id: "leuthardt-2004",
      title: "A brain–computer interface using electrocorticographic signals in humans",
      titleZh: "基于人体皮层脑电信号的脑机接口",
      authors: "E. C. Leuthardt, G. Schalk, J. R. Wolpaw, J. G. Ojemann, D. W. Moran",
      year: 2004,
      venue: "Journal of Neural Engineering",
      doi: "10.1088/1741-2560/1/2/001",
      theme: "signal",
      signal: "ECoG",
      kind: "classic",
      impact: 4,
      tags: ["ECoG", "高伽马", "皮层信号"],
      summary:
        "在临床监测患者中使用硬膜下 ECoG 控制计算机，展示比头皮 EEG 更高的空间与频带分辨率。",
      why:
        "确立 ECoG 作为介于非侵入式和皮层内记录之间的重要接口路线。",
      limitation:
        "需要开颅与临床适应证，记录时长与电极覆盖受临床流程限制。",
    },
    {
      id: "hochberg-2006",
      title:
        "Neuronal ensemble control of prosthetic devices by a human with tetraplegia",
      titleZh: "四肢瘫患者用神经元群体控制假肢设备",
      authors: "L. R. Hochberg et al.",
      year: 2006,
      venue: "Nature",
      doi: "10.1038/nature04970",
      theme: "communication",
      signal: "Intracortical",
      kind: "classic",
      impact: 5,
      tags: ["BrainGate", "微电极阵列", "四肢瘫"],
      summary:
        "植入运动皮层微电极阵列，使四肢瘫参与者能控制光标、电视与机械手，开启长期人类皮层内 BCI 研究。",
      why:
        "第一次以较完整的临床场景显示神经元群体活动可成为通用输出通道。",
      limitation:
        "单参与者、早期设备；解码稳定性、手术与长期生物相容性仍需持续验证。",
    },
    {
      id: "santhanam-2006",
      title: "A high-performance brain–computer interface",
      titleZh: "高性能脑机接口",
      authors: "G. Santhanam, S. I. Ryu, B. M. Yu, A. Afshar, K. V. Shenoy",
      year: 2006,
      venue: "Nature",
      doi: "10.1038/nature04968",
      theme: "decoding",
      signal: "Intracortical",
      kind: "classic",
      impact: 4,
      tags: ["群体解码", "光标", "高性能"],
      summary:
        "利用运动皮层群体活动与概率解码实现高速光标控制，强调神经群体信息量可支持快速交互。",
      why:
        "把研究焦点从“能否控制”推进到“控制性能能否接近自然交互”。",
      limitation:
        "任务仍是受限的二维光标选择；性能受训练、阵列质量和离线模型影响。",
    },
    {
      id: "velliste-2008",
      title: "Cortical control of a prosthetic arm for self-feeding",
      titleZh: "用皮层活动控制假肢完成自主进食",
      authors: "M. Velliste, S. Perel, M. C. Spalding, A. S. Whitford, A. B. Schwartz",
      year: 2008,
      venue: "Nature",
      doi: "10.1038/nature06996",
      theme: "motor",
      signal: "Intracortical",
      kind: "classic",
      impact: 4,
      tags: ["机械臂", "日常生活", "三维控制"],
      summary:
        "猴子用皮层活动控制机械臂抓取食物并送回嘴边，把 BCI 性能放进连续、目标导向的日常动作。",
      why:
        "展示了多自由度假肢控制的可行性，也暴露了视觉反馈与本体感觉缺失的问题。",
      limitation:
        "依赖视觉闭环，缺少自然触觉；动物结果尚不能直接代表人类长期居家使用。",
    },
    {
      id: "bin-2009",
      title:
        "An online multi-channel SSVEP-based brain–computer interface using a canonical correlation analysis method",
      titleZh: "基于典型相关分析的多通道在线 SSVEP 脑机接口",
      authors: "G. Bin, X. Gao, Z. Yan, B. Hong, S. Gao",
      year: 2009,
      venue: "Journal of Neural Engineering",
      doi: "10.1088/1741-2560/6/4/046002",
      theme: "paradigm",
      signal: "EEG",
      kind: "classic",
      impact: 4,
      tags: ["SSVEP", "CCA", "在线系统"],
      summary:
        "用多通道稳态视觉诱发电位与典型相关分析构建在线 BCI，降低训练需求并提升信息传输效率。",
      why:
        "SSVEP-CCA 路线后来成为高速非侵入式指令选择的重要基础。",
      limitation:
        "依赖视觉刺激和注视能力，长期使用可能疲劳，且对部分使用者不稳定。",
    },
    {
      id: "collinger-2013",
      title:
        "High-performance neuroprosthetic control by an individual with tetraplegia",
      titleZh: "四肢瘫个体实现高性能神经假肢控制",
      authors: "J. L. Collinger et al.",
      year: 2013,
      venue: "The Lancet",
      doi: "10.1016/S0140-6736(12)61816-9",
      theme: "motor",
      signal: "Intracortical",
      kind: "breakthrough",
      impact: 5,
      tags: ["七自由度", "机械臂", "临床转化"],
      summary:
        "参与者学习控制具备三维平移与四维旋转的机械臂，使多自由度神经假肢从演示走向功能任务。",
      why:
        "证明人类皮层内 BCI 可支持高维连续控制，并推动临床研究关注功能结局而非仅解码准确率。",
      limitation:
        "为少数参与者、实验室任务；设备便携性、可靠性、感觉反馈与成本仍限制推广。",
    },
    {
      id: "chen-2015",
      title: "High-speed spelling with a noninvasive brain–computer interface",
      titleZh: "非侵入式脑机接口实现高速拼写",
      authors: "X. Chen et al.",
      year: 2015,
      venue: "Proceedings of the National Academy of Sciences",
      doi: "10.1073/pnas.1508080112",
      theme: "paradigm",
      signal: "EEG",
      kind: "breakthrough",
      impact: 4,
      tags: ["SSVEP", "高速拼写", "非侵入式"],
      summary:
        "通过优化 SSVEP 刺激编码与解码，把非侵入式拼写速度推进到接近自然交流实用的量级。",
      why:
        "说明范式、刺激编码和信号处理协同设计可以显著改变非侵入式 BCI 的上限。",
      limitation:
        "受试者通常为健康人，视觉负荷、疲劳和长期可用性仍需验证。",
    },
    {
      id: "vansteensel-2016",
      title: "Fully Implanted Brain–Computer Interface in a Locked-In Patient with ALS",
      titleZh: "ALS 闭锁患者中的全植入脑机接口",
      authors: "M. J. Vansteensel et al.",
      year: 2016,
      venue: "New England Journal of Medicine",
      doi: "10.1056/NEJMoa1608085",
      theme: "communication",
      signal: "ECoG",
      kind: "breakthrough",
      impact: 5,
      tags: ["ALS", "全植入", "居家使用"],
      summary:
        "为 ALS 闭锁患者植入皮层表面电极，使其在家中无研究者持续监护时进行脑控拼写。",
      why:
        "把 BCI 的评价场景从实验室移到住所与护理环境，真实世界可用性由此成为核心问题。",
      limitation:
        "单病例与专用系统；信息传输率、夜间佩戴、照护者负担及长期失效仍需跟踪。",
    },
    {
      id: "lebedev-2017",
      title:
        "Brain-Machine Interfaces: From Basic Science to Neuroprostheses and Neurorehabilitation",
      titleZh: "脑机接口：从基础科学到神经假体与神经康复",
      authors: "M. A. Lebedev, M. A. L. Nicolelis",
      year: 2017,
      venue: "Physiological Reviews",
      doi: "10.1152/physrev.00027.2016",
      theme: "translation",
      signal: "Conceptual",
      kind: "breakthrough",
      impact: 5,
      tags: ["系统综述", "神经康复", "转化"],
      summary:
        "从神经科学、算法、假肢到康复系统梳理脑机接口，强调闭环与神经可塑性在长期效果中的角色。",
      why:
        "提供从器件到行为、从基础机制到临床应用的跨层框架，适合作为领域路线图。",
      limitation:
        "覆盖面广但写作时间较早；无法反映 2020 年后语音、大模型与流式交互的快速变化。",
    },
    {
      id: "willett-2021",
      title: "High-performance brain-to-text communication via handwriting",
      titleZh: "通过想象手写实现高性能脑到文本通信",
      authors: "F. R. Willett et al.",
      year: 2021,
      venue: "Nature",
      doi: "10.1038/s41586-021-03506-2",
      theme: "communication",
      signal: "Intracortical",
      kind: "recent",
      impact: 5,
      tags: ["手写解码", "脑到文本", "实时"],
      summary:
        "让四肢瘫参与者尝试手写字母，并用皮层内神经活动实时解码为文本，显著提高交流速度。",
      why:
        "它把复杂运动原语作为可复用的解码对象，证明“利用自然运动生成过程”可提升通信性能。",
      limitation:
        "需要长期植入与个体训练；字符集、纠错、跨会话漂移和多语言迁移仍需研究。",
    },
    {
      id: "chaudhary-2022",
      title:
        "Spelling interface using intracortical signals in a completely locked-in patient enabled via auditory neurofeedback training",
      titleZh: "经听觉神经反馈训练实现完全闭锁患者的皮层内拼写接口",
      authors: "U. Chaudhary et al.",
      year: 2022,
      venue: "Nature Communications",
      doi: "10.1038/s41467-022-28859-8",
      theme: "communication",
      signal: "Intracortical",
      kind: "recent",
      impact: 5,
      tags: ["完全闭锁", "ALS", "神经反馈"],
      summary:
        "通过听觉反馈训练完全闭锁 ALS 患者调节皮层活动，以皮层内信号完成拼写。",
      why:
        "挑战“完全闭锁者无法建立可靠交流”的边界，把训练、反馈与伦理问题放在同等位置。",
      limitation:
        "单病例、方法争议与长期可靠性问题并存；不能把少量成功回应直接扩展为通用系统。",
    },
    {
      id: "willett-2023",
      title: "A high-performance speech neuroprosthesis",
      titleZh: "高性能语音神经假体",
      authors: "F. R. Willett et al.",
      year: 2023,
      venue: "Nature",
      doi: "10.1038/s41586-023-06377-x",
      theme: "communication",
      signal: "Intracortical",
      kind: "recent",
      impact: 5,
      tags: ["语音解码", "ALS", "脑到语音"],
      summary:
        "从尝试说话的皮层活动中解码单词，并以语言模型提升连续语音输出，使 ALS 参与者更快交流。",
      why:
        "把 BCI 从离散字符推进到接近自然语速的表达，并展示神经解码与语言先验结合的潜力。",
      limitation:
        "词汇集与协议有限；语言先验可能补足错误，也可能带来语义偏置；多语与声调未充分验证。",
    },
    {
      id: "metzger-2023",
      title:
        "A high-performance neuroprosthesis for speech decoding and avatar control",
      titleZh: "兼顾语音解码与数字替身控制的高性能神经假体",
      authors: "S. L. Metzger et al.",
      year: 2023,
      venue: "Nature",
      doi: "10.1038/s41586-023-06443-4",
      theme: "communication",
      signal: "ECoG",
      kind: "recent",
      impact: 5,
      tags: ["ECoG", "语音合成", "avatar"],
      summary:
        "用高密度 ECoG 同步解码文本、语音与面部动作，并驱动可表达的数字化身。",
      why:
        "把交流从“输出词语”扩展到声音身份、面部表情与多模态表达，接近完整体验而非单向文本。",
      limitation:
        "系统复杂且依赖手术与大量训练；实时性、跨日稳定、个人声音权利和情感真实性需要评价。",
    },
    {
      id: "lorach-2023",
      title:
        "Walking naturally after spinal cord injury using a brain–spine interface",
      titleZh: "脑—脊接口帮助脊髓损伤者自然行走",
      authors: "H. Lorach et al.",
      year: 2023,
      venue: "Nature",
      doi: "10.1038/s41586-023-06094-5",
      theme: "motor",
      signal: "Intracortical",
      kind: "recent",
      impact: 5,
      tags: ["脑脊接口", "脊髓损伤", "神经康复"],
      summary:
        "把运动皮层意图转换为硬膜外脊髓刺激，绕过损伤部位，使慢性脊髓损伤参与者恢复站立与行走。",
      why:
        "展示了“脑读数—脊髓写入”的数字桥梁如何重新连接意图与身体，而不仅是替代肢体。",
      limitation:
        "参与者数量少、系统复杂且需手术；刺激参数、长期可塑性、居家安全与成本仍待研究。",
    },
    {
      id: "tang-2023",
      title:
        "Semantic reconstruction of continuous language from non-invasive brain recordings",
      titleZh: "从非侵入式脑记录重建连续语言的语义",
      authors: "J. Tang, A. LeBel, S. Jain, A. G. Huth",
      year: 2023,
      venue: "Nature Neuroscience",
      doi: "10.1038/s41593-023-01304-9",
      theme: "decoding",
      signal: "Non-invasive",
      kind: "recent",
      impact: 5,
      tags: ["fMRI", "语义解码", "语言"],
      summary:
        "结合非侵入式功能成像与语言模型，在合作参与者中重建连续语言的大意，而非逐字听写。",
      why:
        "把非侵入式解码推进到自然叙事与语义层面，同时让神经数据与思维隐私问题变得具体。",
      limitation:
        "需要受试者合作与个体训练，时间分辨率低；不能由此推断系统可在睡眠或非合作状态下任意读取思想。",
    },
    {
      id: "defossez-2023",
      title: "Decoding speech perception from non-invasive brain recordings",
      titleZh: "从非侵入式脑记录解码语音感知",
      authors: "A. Défossez et al.",
      year: 2023,
      venue: "Nature Machine Intelligence",
      doi: "10.1038/s42256-023-00714-5",
      theme: "decoding",
      signal: "Non-invasive",
      kind: "recent",
      impact: 4,
      tags: ["MEG/EEG", "对比学习", "语音感知"],
      summary:
        "用大规模 MEG/EEG 数据与自监督语音表示学习，在未见参与者上识别语音片段并定位相关脑区。",
      why:
        "证明非侵入式数据也能借迁移学习实现跨被试语音解码，为低资源 BCI 提供方法线索。",
      limitation:
        "任务是识别而非自由生成；对背景噪声、自然交互与语言多样性仍敏感。",
    },
    {
      id: "card-2024",
      title: "An Accurate and Rapidly Calibrating Speech Neuroprosthesis",
      titleZh: "高准确率、快速校准的语音神经假体",
      authors: "N. S. Card et al.",
      year: 2024,
      venue: "New England Journal of Medicine",
      doi: "10.1056/NEJMoa2314132",
      theme: "communication",
      signal: "Intracortical",
      kind: "recent",
      impact: 5,
      tags: ["快速校准", "ALS", "自由对话"],
      summary:
        "减少个体校准负担，使 ALS 参与者能用语音神经假体进行连续、可理解且较准确的交流。",
      why:
        "把“临床可行性”从能否解码转向每次启动需要多久、是否能维持日常对话。",
      limitation:
        "仍需手术与有限参与者验证；语言模型纠错贡献、长期漂移与跨环境稳定性需要进一步拆分。",
    },
    {
      id: "adebisi-2024",
      title:
        "EEG-Based Brain Functional Network Analysis for Differential Identification of Dementia-Related Disorders and Their Onset",
      titleZh: "基于 EEG 脑功能网络的痴呆相关障碍与阶段识别",
      authors: "A. T. Adebisi, H.-W. Lee, K. C. Veluvolu",
      year: 2024,
      venue: "IEEE Transactions on Neural Systems and Rehabilitation Engineering",
      doi: "10.1109/TNSRE.2024.3374651",
      theme: "cognition",
      signal: "EEG",
      kind: "recent",
      impact: 4,
      tags: ["PLI", "GCN", "MCI", "血管性痴呆"],
      summary:
        "用相位滞后指数构建脑功能网络，结合图指标与图卷积网络区分 MCI、AD、血管性痴呆和正常对照。",
      why:
        "将节点、边、图和疾病阶段串成可解释分析路径，适合作为网络方法进入认知临床的入口。",
      limitation:
        "小样本、单中心与阈值选择影响泛化；四分类准确率不能代替外部临床验证。",
    },
    {
      id: "lee-2025",
      title:
        "Diagnosis of Alzheimer’s Disease and Frontotemporal Dementia From Electroencephalography Signals",
      titleZh: "利用脑电信号诊断阿尔茨海默病与额颞叶痴呆",
      authors: "D.-G. Lee, S.-B. Lee",
      year: 2025,
      venue: "IEEE Transactions on Neural Systems and Rehabilitation Engineering",
      doi: "10.1109/TNSRE.2025.3575840",
      theme: "cognition",
      signal: "EEG",
      kind: "recent",
      impact: 3,
      tags: ["Hjorth", "AD/FTD", "可解释特征"],
      summary:
        "用时域 Hjorth 参数结合经典机器学习区分 AD、FTD 与认知正常，并考察特征与 MMSE 的关联。",
      why:
        "提供低复杂度、可解释的对照路线，说明少量统计特征也可能具有不错的分类信息。",
      limitation:
        "单一数据集与多个二分类任务；准确率与认知量表的相关性仍需跨中心前瞻验证。",
    },
    {
      id: "lalawat-2025",
      title:
        "NeuroFormer: A Deep Learning Framework for Alzheimer's Detection Using EEG Signals",
      titleZh: "NeuroFormer：面向阿尔茨海默病 EEG 的深度学习框架",
      authors: "R. S. Lalawat, N. Kushwaha, V. Bajaj, P. K. Padhy",
      year: 2025,
      venue: "IEEE Journal of Biomedical and Health Informatics",
      doi: "10.1109/JBHI.2025.3601658",
      theme: "cognition",
      signal: "EEG",
      kind: "recent",
      impact: 4,
      tags: ["Transformer", "动态图卷积", "AD/FTD"],
      summary:
        "融合频谱门控、注意力、动态图卷积与多尺度表示，在静息 EEG 上区分 AD、FTD 与认知正常。",
      why:
        "展示了端到端深度网络如何联合建模节律、通道关系与时间片段，是当前认知疾病 EEG 方法的一类代表。",
      limitation:
        "模块复杂、单数据集；受试者级隔离、外部验证与临床可解释性比消融增益更关键。",
    },
    {
      id: "littlejohn-2025",
      title:
        "A streaming brain-to-voice neuroprosthesis to restore naturalistic communication",
      titleZh: "恢复自然交流的流式脑到语音神经假体",
      authors: "K. T. Littlejohn et al.",
      year: 2025,
      venue: "Nature Neuroscience",
      doi: "10.1038/s41593-025-01905-6",
      theme: "communication",
      signal: "Intracortical",
      kind: "recent",
      impact: 5,
      tags: ["流式语音", "低延迟", "自然交流"],
      summary:
        "以流式方式把神经活动持续转换为语音，支持更接近自然对话节奏的即时表达与自我修正。",
      why:
        "把语音 BCI 的评价从离线词错率推进到延迟、轮次衔接和真实交流体验。",
      limitation:
        "仍是少数参与者与实验环境；语音自然度、长时稳定、实时纠错与伴随语义隐私问题需要研究。",
    },
    {
      id: "yin-2026",
      title:
        "Microstate-Specific Cross-Frequency Coupling Networks: A Spatiotemporal Framework for MCI Identification",
      titleZh: "微状态特异的跨频耦合网络：MCI 识别的时空框架",
      authors: "F. Yin et al.",
      year: 2026,
      venue: "CNS Neuroscience & Therapeutics",
      doi: "10.1002/cns.71036",
      theme: "cognition",
      signal: "EEG",
      kind: "recent",
      impact: 4,
      tags: ["微状态", "跨频耦合", "MCI"],
      summary:
        "在每种 EEG 微状态内部构建跨频相位同步网络，以空间、时间和频率三层信息区分 MCI 与健康对照。",
      why:
        "把“大脑当前处于什么状态”与“不同节律如何协调”结合起来，避免把整段静息数据平均成单一网络。",
      limitation:
        "44 人、单中心横断面；模板头模型、微状态稳定性与外部验证仍需补充。",
    },
  ],

  gaps: [
    {
      id: "gap-stability",
      category: "method",
      categoryLabel: "方法",
      x: 36,
      y: 83,
      maturity: "研究中",
      title: "跨日、跨会话与跨被试的稳定解码",
      thesis:
        "多数高性能结果仍来自有限参与者与短期记录，尚不清楚模型在电极变化、神经动力学漂移和日常状态波动下能维持多久。",
      why:
        "植入设备的维护成本、日常启动速度和临床可信度都取决于稳定性；离线峰值性能不能代替长期可用性。",
      questions: [
        "什么时间尺度的漂移可以用自适应校准解决，什么漂移意味着接口失效？",
        "跨会话性能下降中，多少来自电极变化，多少来自策略学习与状态改变？",
        "能否用自监督和少量标注，在新会话开始时快速恢复性能？",
      ],
      evidence: ["willett-2021", "card-2024", "defossez-2023", "lebedev-2017"],
    },
    {
      id: "gap-chinese-speech",
      category: "method",
      categoryLabel: "方法",
      x: 24,
      y: 91,
      maturity: "早期",
      title: "中文、声调与多语自然语音解码",
      thesis:
        "现有高影响力语音神经假体多以英语单词与语言模型为基础；声调、多语切换、方言和情绪韵律是否共享可迁移表征仍缺少系统证据。",
      why:
        "如果解码器直接继承英语语言先验，中文使用者可能面对额外偏置，跨语言交流也会暴露模型真正学到了什么。",
      questions: [
        "声调与元音/辅音是否需要在声学、音节或语言模型层联合解码？",
        "中英混说与方言切换能否在不解码语言标签的情况下自然完成？",
        "如何评价语音自然度、语义保真和说话者身份，而不只看词错率？",
      ],
      evidence: ["willett-2023", "metzger-2023", "littlejohn-2025"],
    },
    {
      id: "gap-home-use",
      category: "clinical",
      categoryLabel: "临床",
      x: 47,
      y: 76,
      maturity: "升温",
      title: "居家闭环中的长期可用性与自我维护",
      thesis:
        "“全植入”或“流式”并不等于“可长期独立使用”。无人值守启动、故障恢复、日常佩戴、网络与照护者依赖仍很少进入研究终点。",
      why:
        "临床价值发生在长期生活中，而非展示日；如果系统需要专家频繁介入，实际受益人群会显著缩小。",
      questions: [
        "如何定义和测量两周以上连续使用的有效性、可用性与故障恢复时间？",
        "使用者能否在无研究者协助时完成校准、纠错和关机？",
        "设备失效、感染或软件停服时，患者如何安全过渡？",
      ],
      evidence: ["vansteensel-2016", "card-2024", "littlejohn-2025"],
    },
    {
      id: "gap-cognition-loop",
      category: "clinical",
      categoryLabel: "临床",
      x: 42,
      y: 92,
      maturity: "升温",
      title: "认知风险从“分类”走向个体化预测与闭环干预",
      thesis:
        "MCI/AD/FTD 脑电研究仍以横断面分类和内部交叉验证为主，尚缺少纵向预测、外部多中心复核以及基于脑电状态的认知训练或神经调控闭环。",
      why:
        "一个稳定生物标志物的价值取决于它能否改变早期管理、分层入组或干预策略，而不只是一个更高的准确率。",
      questions: [
        "微状态、跨频耦合或功能网络的个体内变化能否先于量表评分？",
        "模型能否预测 MCI 转化、治疗反应或认知波动，而非只区分当前诊断？",
        "如何把分类结果转化为可解释、不过度承诺的临床决策支持？",
      ],
      evidence: ["adebisi-2024", "lee-2025", "lalawat-2025", "yin-2026"],
    },
    {
      id: "gap-sensory",
      category: "method",
      categoryLabel: "方法",
      x: 31,
      y: 73,
      maturity: "早期",
      title: "感觉反馈、具身感与人机共同学习",
      thesis:
        "多数系统优化视觉引导下的输出准确率，触觉/本体感觉反馈和可控身体归属感不足；使用者如何在数月尺度上重组策略也缺少统一测量。",
      why:
        "自然行动依赖预测、外部反馈与误差校正。缺少感觉闭环，系统可能“能用”但难以内化为身体或工具。",
      questions: [
        "不同感觉反馈时序和通道如何影响控制学习速度与疲劳？",
        "BCI 使用中的身体图式变化能否用行为、脑电或主观量表联合测量？",
        "闭环神经调控带来的可塑性是否具有任务特异性和持久性？",
      ],
      evidence: ["carmena-2003", "velliste-2008", "lorach-2023", "hochberg-2006"],
    },
    {
      id: "gap-calibration",
      category: "method",
      categoryLabel: "方法",
      x: 28,
      y: 86,
      maturity: "早期",
      title: "低标签、自监督与个性化少样本校准",
      thesis:
        "高性能解码常依赖大量个体化标注。非侵入式甚至植入式系统都需要更接近真实临床的少样本、无标签与持续学习方案。",
      why:
        "校准负担直接决定能否规模化；只报告受试者内离线性能会忽略冷启动、重新训练和标注成本。",
      questions: [
        "跨被试预训练能在多少个体数据下达到可用性能？",
        "无标签数据如何监测漂移，并避免自我强化错误？",
        "语言模型等外部先验应如何标注其贡献，避免掩盖神经信号本身的退化？",
      ],
      evidence: ["willett-2021", "defossez-2023", "tang-2023", "card-2024"],
    },
    {
      id: "gap-outcomes",
      category: "clinical",
      categoryLabel: "临床",
      x: 51,
      y: 94,
      maturity: "升温",
      title: "以功能结局而非词错率作为主要终点",
      thesis:
        "侵入式研究越来越多，但随机对照、独立生活、沟通自主、照护负担、可负担性与不良事件等结局仍不统一。",
      why:
        "临床决策需要知道系统改变何种生活能力，而不是只在特定词表上更快；监管与支付也需要对应证据。",
      questions: [
        "哪些患者报告结局与观察性功能量表适合作为跨设备共同终点？",
        "如何设计符合伦理的对照、盲法与长期随访，而不剥夺潜在受益？",
        "成本、可维护性与公平可及性应在什么阶段纳入研究设计？",
      ],
      evidence: ["collinger-2013", "chaudhary-2022", "lorach-2023", "card-2024"],
    },
    {
      id: "gap-benchmark",
      category: "governance",
      categoryLabel: "数据与治理",
      x: 58,
      y: 81,
      maturity: "升温",
      title: "跨模态统一基准、可复现性与数据治理",
      thesis:
        "EEG、ECoG、MEG 与皮层内记录在任务、预处理、评价和隐私约束上高度割裂，导致模型贡献难以横向比较，也阻碍公平的外部验证。",
      why:
        "没有共享任务与数据协议，就无法区分算法创新、数据集特征和设备差异；神经数据的敏感属性也使共享更复杂。",
      questions: [
        "如何建立同时覆盖非侵入式与植入式、健康与患者群体的分层基准？",
        "在隐私约束下，模型权重的开放、联邦学习与合成数据各自能替代什么？",
        "谁有资格访问、二次使用和从神经数据模型中获益？",
      ],
      evidence: ["leuthardt-2004", "chen-2015", "tang-2023", "willett-2023"],
    },
    {
      id: "gap-populations",
      category: "clinical",
      categoryLabel: "临床",
      x: 39,
      y: 66,
      maturity: "早期",
      title: "老龄、共病与低资源环境中的真实收益",
      thesis:
        "许多 BCI 研究集中于健康受试者或严格筛选的少数患者，认知障碍、共病、药物、疲劳、设备门槛与照护资源不足人群的收益仍不清楚。",
      why:
        "最容易受益的人往往也最难完成长时任务与复杂设备操作；平均性能可能掩盖了关键亚组的失败。",
      questions: [
        "认知波动、抑郁、疲劳和药物如何影响 BCI 学习与稳定性？",
        "极简交互、共享照护与低成本非侵入式方案能达到怎样的功能结果？",
        "如何在研究纳入标准中主动减少年龄、教育和技术经验造成的偏差？",
      ],
      evidence: ["birbaumer-1999", "lee-2025", "lalawat-2025", "yin-2026"],
    },
  ],
};
