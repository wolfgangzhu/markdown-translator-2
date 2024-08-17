# Markdown 翻译器

其他语言：[中文](./README.zh.md)

> 使用 Azure 文本翻译 API 直接翻译 markdown 文件

## 先决条件

从以下位置获取文本翻译 API 密钥[Azure 认知服务](https://docs.microsoft.com/en-us/azure/cognitive-services/translator/translator-text-how-to-signup)

## 快速上手

### 用作 cli

```bash
# install cli
npm install markdown-translator -g

# set key and region from Azure Text Translate API
md-translator set --key <your key>
md-translator set --region <your region>

# do translate
md-translator translate --src README.md --dest README.zh.md --to zh

# get more information
md-translator --help
```

### 用作二进制文件

> 在没有 Node 环境的情况下运行 markdown-translator

*   使用 Azure 文本翻译 API 更新config.json。
*   跑`npm run dist:mac`要针对 macOS 和`npm run dist:win`对于 Windows。
*   像 cli 一样运行 dist 二进制文件，例如，`./markdown-translator translate --src README.md --dest README.zh.md --to zh`

> 根据您的平台修改 dist 脚本。如需了解更多信息，请访问：[这里](https://github.com/zeit/pkg)

### 用作模块

```bash
# install module
npm install markdown-translator
```

```javascript
const markdownTranslate = require('markdown-translator')
markdownTranslate({
  // Give either a filepath
  src: pathToSrcFile,
  // Or pass in the text directly
  text: markdownContent,

  from: languageToTranslateFrom,
  to: languageToTranslateTo,
  subscriptionKey: yourSubscriptionKey,
  region: theRegionOfYourAzureInstance,
}).then((res) => {
  // deal with result
})
```

请注意，有一些固执己见的默认值：默认情况下，from 是 'en'，到 'zh'。
region 参数是可选的。
