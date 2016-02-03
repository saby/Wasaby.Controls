define('js!genie.RegistryAreaEditor',
   [
      'js!genie.PropertyEditorStandardArray',
      'css!genie.RegistryAreaEditor'
   ],
   function (PropertyEditorStandardArray) {
      'use strict';
      var RegistryAreaEditor = PropertyEditorStandardArray.extend({
         _relatedOption: undefined,
         _origCfg: undefined,
         $constructor: function () {
            this.initCfg();
         },

         initCfg: function () {
            if (this._initCfg) {
               return;
            }
            this._initCfg = true;
            this._origCfg = this._options.config;
            var optName = this._origCfg.getName();
            this._relatedOption = this._origCfg.getTopParent().getChildByName(optName);
         },

         getConfig: function () {
            this.initCfg();
            return this._relatedOption;
         },

         getName: function () {
            return this._options.config.getName();
         },

         addElement: function (container, element) {
            var self = this;
            this.getConfig().blockOnChange(function () {
               var res = self.getConfig().map(function (item) {
                  var id = item.getValue().id;
                  if (/^group\-(\d)*$/.test(id)) {
                     return parseInt(id.split('-')[1]);
                  }
                  return 0;
               });
               var max = Math.max.apply(undefined, res);
               if (!isFinite(max)) {
                  max = 0;
               }
               self.getConfig().add({id: 'group-' + (max + 1), content: ''});
            });
         },

         _redraw: function (fOpenPopup) {
            this.initCfg();
            var
               self = this,
               tooltip = $('.genie-PropertyGrid__arrayTooltip', this.getContainer().get(0)),
               cfgValue = this._origCfg.getValue() || '',
               resetLine = $('<div class="genie-PropertyGrid__arrayItem registryAreaEditor__item">' +
               '<span class="genie-PropertyGrid__nameValue ' + (cfgValue === '' ? 'selected' : '') + '">Not selected</span></div>');
            this._itemsContainer.empty();
            this._itemsContainer.append(resetLine);
            resetLine.click(function() {
               self._origCfg.setValue('');
               self._itemsContainer.find('.selected').removeClass('selected');
               resetLine.addClass('selected');
               return false;
            });
            // Скрываем подсказку, если есть элементы
            tooltip.css('display', this.getFilteredConfig().isEmpty() ? 'block' : 'none');
            this._itemsContainer.css('display', this.getFilteredConfig().isEmpty() ? 'none' : 'block');

            this.getFilteredConfig().map(function (item, key, index) {
               var itemId = item.getChildByName('id').getValue(),
                  line = $('<div class="genie-PropertyGrid__arrayItem registryAreaEditor__item">' +
                  '<span class="genie-PropertyGrid__nameValue ' + (cfgValue === itemId ? 'selected' : '') + '">' +
                  itemId + '</span></div>'),
                  lineRemove = $('<div class="genie-PropertyGrid__arrayItemRemove"></div>').appendTo(line),
                  lineEdit = $('<div class="genie-PropertyGrid__arrayItemEdit"></div>').appendTo(line);
                  //keyNameField = line.find('.genie-PropertyGrid__nameField');

               // remove
               lineRemove.click({item: item, key: key, index: index}, function (e) {
                  self.getConfig().remove(e.data.key);
                  return false;
               });
               // edit
               lineEdit.click({item: item, key: key, index: index}, self._onEditLineClick.bind(self));
               // select
               line.click({item: item, key: key, index: index, line: line}, self._onLineClick.bind(self));

               self._itemsContainer.append(line);
            });
            if (fOpenPopup) {
               $('.genie-PropertyGrid__arrayItem:last .genie-PropertyGrid__arrayItemEdit', this._itemsContainer.get(0)).click();
            }
         },

         _onLineClick: function (e) {
            this._origCfg.setValue(e.data.item.getValue().id);
            this._itemsContainer.find('.selected').removeClass('selected');
            e.data.line.addClass('selected');
            return false;
         },

         _onEditLineClick: function (e) {
            var self = this;
            this.showPopup(this.getPopupConstructor(e.data.item), {
               configRoot: e.data.item,
               parent: this,
               filter: (this.getConfig().filtered || e.data.item.filtered) ? '' : this.getFilter(),
               key: e.data.key
            }, e.target);
            this.once('onClosePopup', function () {
               self._redraw();
            });
            return false;
         }
      });
      return RegistryAreaEditor;
   });