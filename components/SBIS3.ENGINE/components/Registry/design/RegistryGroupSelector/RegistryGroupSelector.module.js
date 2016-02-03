define('js!genie.RegistryGroupSelector',
   [
      'js!genie.PropertyEditorSimple',
      'html!genie.RegistryGroupSelector',
      'js!SBIS3.CONTROLS.ComboBox'
   ], function (PropertyEditorSimple, dotTplFn) {
      'use strict';
      return PropertyEditorSimple.extend({
         _dotTplFn: dotTplFn,

         initEditor: function () {
            // одноименная опция в корне конфигурации, отвечающая за переключаемую область. Например, ws-config.mainArea
            var relatedOpt = this.getConfig().getTopParent().getChildByName(this.getName()),
               cfgVal = this.getConfig().getValue(),
               items = [{key: '', title: 'Not selected'}],
               self = this,
               i,
               hasOption = false;
            if (relatedOpt) {
               var value = relatedOpt.getValue();
               for (i = 0; i < value.length; i++) {
                  if (cfgVal === value[i].id) {
                     hasOption = true;
                  }
                  items.push({key: value[i].id, title: value[i].id});
               }
               this.getInput().setItems(items);
               if (cfgVal !== undefined && hasOption) {
                  this.getInput().setValue(cfgVal);
               }
            }

            this.getInput().subscribe('onSelectedItemChange', function (e, val) {
               self.emitValue(val);
            });
         }

      });
   });