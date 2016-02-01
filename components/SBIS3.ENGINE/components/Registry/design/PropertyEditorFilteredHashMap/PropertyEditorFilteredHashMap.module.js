define('js!genie.PropertyEditorFilteredHashMap',
   [
      'js!genie.PropertyEditorStandardHashMap',
      'js!genie.HashMapKeyEditor'
   ],
   function (parent, HashMapKeyEditor) {
      var PropertyEditorFilteredHashMap = parent.extend({
         $protected: {
            _options: {
               filteredOpts: {}
            }
         },

         getFilteredConfig: function () {
            var cfg = PropertyEditorFilteredHashMap.superclass.getFilteredConfig.apply(this, arguments),
               self = this,
               filteredCfg = [];
            cfg.map(function (item, name, index) {
               if (!self._options.filteredOpts[name]) {
                  filteredCfg.push(item);
               }
            });
            filteredCfg.map = function (func) {
               for (var i = 0; i < this.length; i++) {
                  func(this[i], this[i].getName(), i);
               }
            };
            filteredCfg.isEmpty = function () {
               return this.length === 0;
            };
            return filteredCfg;
         },

         _redrawEvent: function (e, name, array, command) {
            if (name === this.getName()) {
               this._redraw();
            }
         },

         addElement: function (container) {
            var self = this,
               variants = this.getConfig().getDescription().variants;
            self.showPopup(HashMapKeyEditor, {
               variants: variants,
               handlers: {
                  'onKeyAdded': function (e, keyName, keyValue, keyIdx) {
                     if (keyName && !self._options.filteredOpts[keyName]) {
                        self.getConfig().blockOnChange(function () {
                           self.closePopup();
                           self.getConfig().add(keyName, keyValue, keyIdx);
                           self._redraw(true);
                        });
                     }
                  }
               },
               keyNameValidator: function () {
                  var val = this.getStringValue();
                  if (self._options.filteredOpts[val]) {
                     return 'Name can not be "' + val + '"';
                  }
                  return true;
               }
            }, container);
         }
      });
      return PropertyEditorFilteredHashMap;
   });