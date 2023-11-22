
> 官方文档：https://developer.chrome.com/docs/

## runtime

## tabs

使用 `chrome.tabs` API 与浏览器的选项卡系统进行交互。您可以使用此 API 在浏览器中创建、修改和重新排列选项卡。

- create

## action

- onClicked               点击扩展图标
- setBadgeText            设置徽标文案（徽标浮在扩展图标上）
- setBadgeTextColor       设置会标文案颜色
- setBadgeBackgroundColor 设置徽标背景颜色


## 管理插件的生命周期和选项
- onInstalled             首次安装扩展程序、扩展程序更新到新版本以及 Chrome 更新到新版本时触发
- onStartup               扩展程序启动时
- openOptionsPage()       打开扩展程序的选项页
- reload()                重新加载应用程序或扩展
- requestUpdateCheck()    请求立即对此应用程序/扩展程序进行更新检查
- setUninstallURL()