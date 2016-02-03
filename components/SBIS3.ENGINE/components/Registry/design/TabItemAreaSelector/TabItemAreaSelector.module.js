define('js!genie.TabItemAreaSelector',
   [
      'js!genie.OperationPanelCustomEditor',
      'js!genie.RegistryAreaEditor',
      'html!genie.TabItemAreaSelector',
      'css!genie.TabItemAreaSelector'
   ],
   function (parent, editor, dotTplFn) {
      var TabItemAreaSelector;
      return TabItemAreaSelector = parent.extend({
         _dotTplFn: dotTplFn,
         getPopupConstructor: function () {
            return editor;
         },
         init: function () {
            TabItemAreaSelector.superclass.init.apply(this, arguments);
            var cfg = this._options.config,
               self = this;
            if (cfg) {
               var value = cfg.getValue() || '<no group>';
               this._container.find('.genie-PropertyGrid__title').append($('<div class="genie-TabItemAreaSelector__areaValue"></div>').text(value).attr('title', value));
               cfg.subscribe('onChange', this._onChange = function (event, name, value) {
                  value = value || '<no group>';
                  self._container.find('.genie-TabItemAreaSelector__areaValue').text(value).attr('title', value);
               }, this);

               // меняем связанное значение во всех закладках, если имзенилось название вкладки.
               var optName = cfg.getName(),
                  tabs = cfg.getTopParent().getChildByName('tabs');
               this._relatedOption = cfg.getTopParent().getChildByName(optName);
               this._relatedOption.subscribe('onChange', this._relatedOnChange = function (event, name, value, oldValue) {
                  var nameArr = name.split('.'),
                     checkTabsValues = function (newValue, oldValue) {
                        var res = tabs.map(function (item) {
                              if (item.getValue()[optName] == oldValue) {
                                 return item.getChildByName(optName);
                              }
                           });
                        for (var i = 0; i < res.length; i++) {
                           if (res[i]) {
                              res[i].setValue(newValue);
                           }
                        }
                     };
                  if (nameArr.length === 3 && nameArr.pop() === 'id') {
                     checkTabsValues(value, oldValue);
                  } else if (nameArr.length === 1 && oldValue === 'remove') {
                     checkTabsValues('', arguments[5].id);
                  }
               }, this);
            }
         },
         destroy: function () {
            this.getConfig().unsubscribe('onChange', this._onChange, this);
            this._relatedOption && this._relatedOption.unsubscribe('onChange', this._relatedOnChange, this);
            TabItemAreaSelector.superclass.destroy.apply(this, arguments);
         }
      });
   });