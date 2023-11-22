
/**
 * onInstalled: 安装扩展时触发
 */
chrome.runtime.onInstalled.addListener((_resson) => {
  chrome.tabs.create({
    url: "demo/index.html"
  })
})