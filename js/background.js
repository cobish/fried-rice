class Setting {
  constructor () {
    this.storage = new Storage();
    this.$content = $('#content');
    this.hosts = undefined;

    this.init();
  }

  init () {
    this.renderList();
    this.bindEvent();
  }

  renderList () {
    this.storage.get('hosts').then(res => {
      if (res === undefined) {
        res = {};
        this.storage.set({ 'hosts': res });
      } else {
        Object.keys(res).forEach(item => {
          this.renderAddItem(item);
        });
      }

      this.hosts = res;
      console.log(this.hosts);
    });
  }

  renderAddItem (project) {
    const tmpl = `
      <div class="cell">
        <div class="cell-project">
          <span>${project}</span>
          <span class="cell-operate">
            <a class="edit" data-key="${project}">修改</a>
            <a class="remove" data-key="${project}">删除</a>
          </span>
        </div>
        <div class="cell-host">
          <textarea spellcheck="false" placeholder="格式：192.168.0.1 www.baidu.com，换行支持多个"></textarea>
          <button class="confirm" data-key="${project}">确定</button>
          <button class="cancel">取消</button>
        </div>
      </div>
    `;

    this.$content.append(tmpl);
  }

  bindEvent () {
    this.bindAddEvent();
    this.bindEditEvent();
    this.bindRemoveEvent();
    this.bindConfirmEvent();
    this.bindCancelEvent();
  }

  bindAddEvent () {
    $('#add').click(() => {
      const project = prompt('请输入项目名：');

      if (!project) return;

      this.renderAddItem(project);

      this.hosts[project] = {};
      this.storage.set({ 'hosts': this.hosts });
    });
  }

  bindEditEvent () {
    const _this = this;

    this.$content.on('click', '.edit', function () {
      const $self = $(this);
      const project = $self.attr('data-key');
      
      const hostList = _this.hosts[project];
      const val = Object.keys(hostList).reduce((text, item) => {
        text += hostList[item] + ' ' + item + '\n';
        return text;
      }, '');

      const $cellHost = $self.parents('.cell').find('.cell-host');
      $cellHost.show();
      $cellHost.find('textarea').val(val);
    });
  }

  bindRemoveEvent () {
    const _this = this;

    this.$content.on('click', '.remove', function () {
      const $self = $(this);
      const project = $self.attr('data-key');
      const toDel = confirm(`确认删除“${project}”`);

      if (!toDel) return;

      $self.parents('.cell').remove();

      delete _this.hosts[project];
      _this.storage.set({ 'hosts': _this.hosts });
    });
  }

  bindConfirmEvent () {
    const _this = this;

    this.$content.on('click', '.confirm', function () {
      const $self = $(this);
      const $parent = $self.parents('.cell-host');
      const project = $self.attr('data-key');
      const val = $parent.find('textarea').val();

      let hostList = {};
      const arr = val.split('\n');
      arr.forEach(item => {
        if (item) {
          const host = item.split(' ');
          hostList[host[1]] = host[0];
        }
      });

      _this.hosts[project] = hostList;
      _this.storage.set({ 'hosts': _this.hosts });

      $parent.hide();
    });
  }

  bindCancelEvent () {
    this.$content.on('click', '.cancel', function () {
      $(this).parents('.cell-host').hide();
    });
  }
}

new Setting();
