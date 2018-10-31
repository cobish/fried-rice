(function () {
  var proxy = {
    on: function FindProxyForURL (url, host) {
      if (host == 'www.baidu.com') {
        return 'PROXY 192.168.145.72';
      }
    
      return 'DIRECT';
    },

    off: function FindProxyForURL () {
      return 'DIRECT';
    }
  };

  // 设置代理
  function setProxy (pac) {
    var config = {
      value: {
        mode: 'pac_script',
        pacScript: {
          data: pac.toString()
        }
      },
      scope: 'regular'
    };

    chrome.proxy.settings.set(config, function() {});
  }

  chrome.storage.sync.get('status', function(result) {
    var status = +result.status;
    $('input[name="switch"]').eq(status).trigger('click');
  });

  // radio 切换
  $('input[name="switch"]').on('click', function () {
    var val = +this.value;
    var pac;

    if (val === 0) {
      pac = proxy.off;
    } else {
      pac = proxy.on;
    }

    chrome.storage.sync.set({ 'status': val });
    setProxy(pac);
  });

  $('#openBackground').on('click', function () {
    window.open(chrome.extension.getURL('html/background.html'));
  });
})();
