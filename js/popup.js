class Popup {
  constructor () {
    this.proxy = new Proxy();
    this.storage = new Storage();
    this.$content = $('#content');

    this.status = false;
    this.hosts = undefined;
    this.delegate = [];

    this.init();
  }

  init () {
    this.renderList();
    this.bindEvent();
  }

  renderList () {
    const statusPromise = this.storage.get('status');
    const hostsPromise = this.storage.get('hosts');
    const delegatePromise = this.storage.get('delegate');

    Promise.all([statusPromise, hostsPromise, delegatePromise])
    .then(([status, hosts, delegate]) => {
      this.delegate = delegate || [];

      if (hosts) {
        this.hosts = hosts;
        Object.keys(hosts).forEach(item => {
          this.renderHostItem(item);
        });
      }
      
      if (status) {
        this.status = status;
        $('input[name="switch"]').prop('checked', status);

        if (hosts) {
          const hostMap = this.delegate.reduce((obj, item) => {
            obj = Object.assign(obj, hosts[item]);
            return obj;
          }, {});
          
          const pac = this.proxy.on(hostMap);
          this.proxy.setProxy(pac);
        }
      }
    });
  }

  renderHostItem (project) {
    const checked = (this.delegate.indexOf(project) !== -1) ? 'checked' : '';
    const tmpl = `
      <div class="cell">
        <label>
          <input 
            type="checkbox" 
            name="delegate" 
            data-key="${project}"
            ${checked}>
          ${project}
        </label>
      </div>
    `;

    this.$content.append(tmpl);
  }

  bindEvent () {
    this.bindHrefSettingEvent();
    this.bindSwitchEvent();
    this.bindDelegateEvent();
  }

  bindHrefSettingEvent () {
    $('#openBackground').on('click', function () {
      window.open(chrome.extension.getURL('html/background.html'));
    });
  }

  bindSwitchEvent () {
    const _this = this;

    $('input[name="switch"]').on('change', function () {
      const isChecked = $(this).is(':checked');
      let pac;

      if (isChecked) {
        if (_this.hosts) {
          const hostMap = _this.delegate.reduce((obj, item) => {
            obj = Object.assign(obj, _this.hosts[item]);
            return obj;
          }, {});
          
          pac = _this.proxy.on(hostMap);
        } else {
          pac = _this.proxy.off();
        }
      } else {
        pac = _this.proxy.off();
      }

      _this.storage.set({ 'status': isChecked });
      _this.proxy.setProxy(pac);
    });
  }

  bindDelegateEvent () {
    const _this = this;

    this.$content.on('change', 'input[name="delegate"]', function () {
      const $self = $(this);
      const isChecked = $self.is(':checked');
      const project = $self.attr('data-key');

      if (isChecked) {
        _this.delegate.push(project);
      } else {
        const index = _this.delegate.indexOf(project);
        _this.delegate.splice(index, 1);
      }

      _this.storage.set({ 'delegate': _this.delegate });

      if (_this.hosts) {
        const hostMap = _this.delegate.reduce((obj, item) => {
          obj = Object.assign(obj, _this.hosts[item]);
          return obj;
        }, {});
        
        const pac = _this.proxy.on(hostMap);
        _this.proxy.setProxy(pac);
      }
    });
  }
}

new Popup();