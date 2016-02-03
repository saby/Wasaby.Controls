define('js!genie.RegistryDefaultTab',
   [
      'js!genie.PropertyEditorSimple',
      'html!genie.RegistryDefaultTab',
      'js!SBIS3.CONTROLS.ComboBox'
   ], function (PropertyEditorSimple, dotTplFn) {
      var RegistryDefaultTab = PropertyEditorSimple.extend({
         _dotTplFn: dotTplFn,
         _relatedOpt: undefined,
         initEditor: function () {
            // опция из конфигурации ws-config.tabs
            this._relatedOpt = this.getConfig().getTopParent().getChildByName('tabs');
            var cfgVal = this.getConfig().getValue(),
               items = [],
               self = this,
               i,
               hasOption = false,
               value = this._relatedOpt.getValue();

            this._relatedOpt.subscribe('onChange', this._onChange = function (event, name, val, oldVal) {
               var items = [],
                  value = self._relatedOpt.getValue(),
                  setNewKey = false;
               if (name.split('.').pop() === 'id') {
                  var curId = self.getInput().getValue();
                  if (oldVal === curId) {
                     setNewKey = true;
                     self.getInput().setValue(null);
                  }
               }
               for (i = 0; i < value.length; i++) {
                  items.push({key: value[i].id, title: (value[i].title || '') + ' [' + value[i].id + ']'});
               }
               self.getInput().setItems(items);
               if (setNewKey) {
                  self.getInput().setValue(val);
               }
            });

            for (i = 0; i < value.length; i++) {
               if (cfgVal === value[i].id) {
                  hasOption = true;
               }
               items.push({key: value[i].id, title: (value[i].title || '') + ' [' + value[i].id + ']'});
            }
            this.getInput().setItems(items);
            if (cfgVal !== undefined && hasOption) {
               this.getInput().setValue(cfgVal);
            }

            this.getInput().subscribe('onSelectedItemChange', function (e, val) {
               self.emitValue(val);
            });
         },
         destroy: function () {
            this._relatedOpt && this._relatedOpt.unsubscribe('onChange', this._onChange);
            RegistryDefaultTab.superclass.destroy.apply(this, arguments);
         }
      });
      return RegistryDefaultTab;
   });