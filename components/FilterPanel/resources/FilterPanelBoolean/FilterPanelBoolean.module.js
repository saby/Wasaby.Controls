define('js!SBIS3.CONTROLS.FilterPanelBoolean', [
   'js!SBIS3.CORE.CompoundControl',
   'js!SBIS3.CONTROLS.IFilterItem',
   'tmpl!SBIS3.CONTROLS.FilterPanelBoolean',
   'tmpl!SBIS3.CONTROLS.FilterPanelBoolean/resources/ContentTemplate',
   'js!SBIS3.CONTROLS.CheckBox'], function (CompoundControl, IFilterItem, dotTplFn, ContentTemplate) {

var
   FilterPanelBoolean = CompoundControl.extend([IFilterItem],/**@lends SBIS3.CONTROLS.FilterPanelBoolean.prototype  */{
      _dotTplFn: dotTplFn,
      $protected: {
         _options: {
            checkBoxContentTemplate: ContentTemplate
         },
         _checkClickByTap: false,
         _checkBox: null
      },

      $constructor: function() {
         this._publish('onValueChange');
      },

      init: function() {
         FilterPanelBoolean.superclass.init.apply(this, arguments);
         this._checkBox = this.getChildControlByName('controls-FilterPanelBoolean__CheckBox');
         this._checkBox.subscribe('onCheckedChange', this._onCheckedChange.bind(this));
      },

      _onCheckedChange: function(event, checked) {
         this.setValue(checked);
      },

      setValue: function(value) {
         if (value !== this._options.value) {
            this.setTextValue(this._prepareTextValue(value));
            this._options.value = !!value;
            this._notifyOnPropertyChanged('value');
            this._notify('onValueChange', this._options.value);
            this._checkBox.setChecked(this._options.value);
         }
      },

      _prepareTextValue: function(value) {
         return value ? this._options.caption : '';
      },

      getValue: function() {
         return this._options.value;
      },

      setTextValue: function(textValue) {
         if (textValue !== this._options.textValue) {
            this._options.textValue = textValue;
            this._notifyOnPropertyChanged('textValue');
         }
      },

      getTextValue: function() {
         return this._options.textValue;
      },

      destroy: function() {
         this._checkBox.unsubscribe('onCheckedChange');
         FilterPanelBoolean.superclass.destroy.apply(this, arguments);
      }
   });

   return FilterPanelBoolean;

});