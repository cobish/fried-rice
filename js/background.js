// 默认取消代理
var pac = "var FindProxyForUrl = function(url, host){return 'DIRECT';}";
var config = {
  mode: "pac_script",
  pacScript: {
    data: pac
  }
};

chrome.proxy.settings.set({value: config, scope: 'regular'}, function() {});


// 设置 storage
chrome.storage.sync.get('status', function(result) {
  if (result.status === undefined) {
    chrome.storage.sync.set({ 'status': 0 });
  }
});