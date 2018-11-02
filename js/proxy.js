class Proxy {
  on (hostMap) {
    let pac = 'function FindProxyForURL (url, host) {';
    pac += `
      var hostMap = ${JSON.stringify(hostMap)};
      if (hostMap[host]) return 'PROXY ' + hostMap[host];
    `;
    pac += `return 'DIRECT' }`;

    return pac.toString();
  }

  off () {
    const pac = function FindProxyForURL () {
      return 'DIRECT';
    }
    return pac.toString();
  }

  setProxy (pac) {
    const config = {
      value: {
        mode: 'pac_script',
        pacScript: {
          data: pac
        }
      },
      scope: 'regular'
    };

    chrome.proxy.settings.set(config, function() {});
  }
}