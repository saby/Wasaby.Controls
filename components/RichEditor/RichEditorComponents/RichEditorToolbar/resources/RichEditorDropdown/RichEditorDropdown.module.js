
define('js!SBIS3.CONTROLS.RichEditor.RichEditorDropdown',
   [
      'js!SBIS3.CONTROLS.DropdownList',
      'html!SBIS3.CONTROLS.RichEditor.RichEditorDropdown/headerTemplate',
      'html!SBIS3.CONTROLS.RichEditor.RichEditorDropdown/itemTemplate',
      'js!SBIS3.CORE.MarkupTransformer',
      'js!SBIS3.CONTROLS.Utils.TemplateUtil',
      'Core/constants'
   ], function(DropdownList, headerTemplate, itemTemplate, MarkupTransformer, TemplateUtil, cConstants) {
   'use strict';
   //TODO: избавиться от этого модуля когда будет выполнено:https://inside.tensor.ru/opendoc.html?guid=ecf33863-cfeb-4357-bb37-3fd8a8d17c48&description=
   //Задача в разработку 20.07.2016 DropDownList сделать чтобы в headTemplate в опциях приходил объект с выбранными записями ( те кот...
   var
      RichEditorDropdown = DropdownList.extend({
         $protected : {
            _options : {
               multiselect: false,
               type: 'fastDataFilter',
               headTemplate: headerTemplate,
               itemTpl: itemTemplate,
               //TODO: 1 января 2017 после боя курантов и бокала шампанского подключиться удалённо к рабочему компьютеру и удалить этот код
               mode: cConstants.browser.isIE8 ? 'hover' : 'click'
            }
         },
         _modifyOptions: function (options) {
            options = RichEditorDropdown.superclass._modifyOptions.apply(this, arguments);
            options.pickerClassName = options.pickerClassName + ' controls-RichEditorDropdown__picker';
            return options;
         },
         _drawSelectedItems : function(id) {
            var
               pickerContainer;
            this._dataSource.read(id[0]).addCallback(function(record) {
               record = record.getRawData();
               pickerContainer = this._getPickerContainer();
               pickerContainer.find('.controls-DropdownList__item__selected').removeClass('controls-DropdownList__item__selected');
               pickerContainer.find('[data-id="' + id[0] + '"]').addClass('controls-DropdownList__item__selected');
               var headTpl = MarkupTransformer(TemplateUtil.prepareTemplate(this._options.headTemplate.call(this, record)))();
               this._pickerHeadContainer.html(headTpl);
               this._selectedItemContainer.html(headTpl);
               this._setHasMoreButtonVisibility();
            }.bind(this))
         }
      });
   return RichEditorDropdown;
});