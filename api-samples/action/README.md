

## 管理插件的生命周期和选项
- onInstalled             首次安装扩展程序、扩展程序更新到新版本以及 Chrome 更新到新版本时触发
- onStartup               扩展程序启动时
- openOptionsPage()       打开扩展程序的选项页
- reload()                重新加载应用程序或扩展
- requestUpdateCheck()    请求立即对此应用程序/扩展程序进行更新检查
- setUninstallURL()