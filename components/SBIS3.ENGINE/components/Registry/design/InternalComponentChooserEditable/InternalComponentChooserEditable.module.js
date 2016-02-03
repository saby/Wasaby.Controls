define('js!genie.InternalComponentChooserEditable',
   [
      'js!genie.InternalComponentChooser',
      'js!genie.PropertyEditorSimple',
      'js!genie.InternalComponentChooser/resources/getComponentMetaByName',
      'html!genie.InternalComponentChooserEditable',
      'js!SBIS3.CONTROLS.ComboBox'
   ],
   function(InternalComponentChooser, PropertyEditorSimple, getComponentMetaByName, dotTplFn) {
      var InternalComponentChooserEditable = PropertyEditorSimple.extend({
         _dotTplFn: dotTplFn,
         $protected:{
            _options: {
               editorConfig: {
                  filterByType: null
               }
            }
         },
         init: function() {
            InternalComponentChooserEditable.superclass.init.call(this);
            var self = this;

            this._updateCompList();
            this._input.subscribe('onSelectedItemChange', function(e, value, text){
               self.emitValue(value || text);
            });
            this._input.subscribe('onTextChange', function (e, text) {
               self.emitValue(text);
            });
         },

         // проставляет текущее выбранное значение, вызывается при смене опции (в том числе при отмене действия)
         initComboBox: function(){
            var value = $ws.core.clone(this.getConfig().getValue(this.getFullName()));
            if (value){
               this.setValue(value);
            }
         },
         getValue: function () {
            var result = '',
               input = this.getInput();
            if (input) {
               result = input.getValue() || input.getText();
            }
            return result;
         },
         setValue: function(value) {
            var dataSet = this._input._dataSet,
               record = dataSet && dataSet.getRecordByKey(value);
            if (record) {
               this._input.setSelectedItem(value);
            }
            else {
               this._input.setText(value);
            }
         },

         _updateCompList: function() {
            var
               self = this,
               doc = this.getActivePage().getDocument(),
               root = doc.getRootComponentMeta(),
               moduleName = self.getActivePage().getDescriptor().getRequireName(),
               newItems = [];
            //[{
            //      key: '',
            //      title: 'Not Selected'
            //   }];
            var recursiveWalk = function(componentMeta, areaName) {
               doc.modelChildrenIterate(componentMeta, areaName, function(compArr){
                  for (var i = 0; i < compArr.length; i++) {
                     if (self._filterComponent(compArr[i])) {
                        newItems.push({key: moduleName + '/' + compArr[i].Config.getValue('ws-config.name'), title: self._prepareControlName(compArr[i])});
                     }
                     recursiveWalk(compArr[i], null);
                  }
               });
            };
            recursiveWalk(root, null);
            this._input.setItems(newItems);
            this.initComboBox();
         },

         _prepareControlName: function(comp) {
            var type = comp.Config.getType(),
               name = comp.Config.getValue('ws-config.name');
            //Если контрол из ws, то оставляем его тип (без неймспейса),
            //если контрол не из ws, то оставляем весь/частично
            type = type.replace(/ws:SBIS3.CORE./g, '');
            type = type.replace(/ws:SBIS3./g, '');
            type = type.replace(/ws:/g, '');
            type += ' - ' + name;
            return type;
         },

         /**
          * Фильтрация выводимых компонент
          * @param compModelObj - объект модели компонента
          * @returns {Boolean}
          * @private
          */
         _filterComponent: function(compModelObj){
            // Если у компонента есть имя, то добавляем в список
            return compModelObj.Config.getValue('ws-config.name') &&
               (!this._options.editorConfig.filterByType || this._options.editorConfig.filterByType === compModelObj.Config.getType().replace(/ws:/g, ''));
         }
      });

      return InternalComponentChooserEditable;
   });