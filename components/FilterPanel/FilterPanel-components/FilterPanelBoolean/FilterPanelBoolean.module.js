define('js!SBIS3.CONTROLS.FilterPanelBoolean', [
   'js!SBIS3.CORE.CompoundControl',
   'js!SBIS3.CONTROLS.IFilterItem',
   'tmpl!SBIS3.CONTROLS.FilterPanelBoolean',
   'tmpl!SBIS3.CONTROLS.FilterPanelBoolean/resources/ContentTemplate',
   'js!SBIS3.CONTROLS.CheckBox', 'css!SBIS3.CONTROLS.FilterPanelBoolean'], function (CompoundControl, IFilterItem, dotTplFn, ContentTemplate) {

var
    /**
     * Класс контрола "Чекбокс", который применяется для панели фильтров {@link SBIS3.CONTROLS.FilterPanel} в качестве редактора фильтра.
     * <br/>
     * По умолчанию для контрола установлено фиксированое имя - "controls-FilterPanelBoolean__CheckBox".
     * При создании собственного редактора, наследуясь от класса SBIS3.CONTROLS.FilterPanelBoolean, для контрола вы должны использовать только это имя.
     * @class SBIS3.CONTROLS.FilterPanelBoolean
     * @extends SBIS3.CORE.CompoundControl
     * @public
     *
     * @mixes SBIS3.CONTROLS.IFilterItem
     *
     * @author Авраменко Алексей Сергеевич
     */
   FilterPanelBoolean = CompoundControl.extend([IFilterItem],/** @lends SBIS3.CONTROLS.FilterPanelBoolean.prototype  */{
        /**
         * @event onValueChange Происходит при изменении значения контрола.
         * @param {$ws.proto.EventObject} eventObject Дескриптор события.
         * @remark
         * Изменение значения можно производить с помощью метода {@link setValue}.
         */
      _dotTplFn: dotTplFn,
      $protected: {
         _options: {
             /**
              * @cfg {Content} Устанавливает шаблон отображение редактора.
              */
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
      /**
       * Устанавливает значение.
       * @remark
       * При использовании метода происходит событие {@link onValueChange}.
       * @param {Boolean} value
       * @see getValue
       */
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
      /**
       * Возвращает значение.
       * @param {Boolean} value
       * @see setValue
       */
      getValue: function() {
         return this._options.value;
      },
        /**
         * Устанавливает текстовое значение.
         * @param {Boolean} value
         * @see getTextValue
         */
      setTextValue: function(textValue) {
         if (textValue !== this._options.textValue) {
            this._options.textValue = textValue;
            this._notifyOnPropertyChanged('textValue');
         }
      },
      /**
       * Возвращает текстовое значение.
       * @param {Boolean} value
       * @see setTextValue
       */
      getTextValue: function() {
         return this._options.textValue;
      }
   });

   return FilterPanelBoolean;

});
