define('js!SBIS3.CONTROLS.ToggleButtonBase', ['js!SBIS3.CONTROLS.ButtonBase', 'js!SBIS3.CONTROLS._DataBindMixin'], function(ButtonBase, DataBindMixin) {

   'use strict';

   /**
    * Поведенческий класс, задающий поведение кнопки с залипанием.
    * Отличается от обычной кнопки тем, что сохраняется состояние checked (“Нажата/Не нажата”). При клике - checked меняется на противоположный
    * @class SBIS3.CONTROLS.ToggleButtonBase
    * @extends SBIS3.CONTROLS.ButtonBase
    */

   var ToggleButtonBase = ButtonBase.extend( [DataBindMixin],/** @lends SBIS3.CONTROLS.ToggleButtonBase.prototype */{
      $protected: {
         _checked : false,
         _options: {
            /**
             * @cfg {Boolean} Признак активности кнопки в начальном состоянии
             * Возмозможные значения:
             * <ul>
             *    <li>true - кнопка нажата/ чекбокс с галочкой/ радиокнопка выбрана;</li>
             *    <li>false - кнопка не нажата/ чекбокс пустой/ радиокнопка пустая.</li>
             * </ul>
             * @see setChecked
             */
            checked: false,
            /**
             * @cfg {Boolean} Наличие неопределённого значения
             * Возможные значения:
             * <ul>
             *    <li>true - есть неопределённое значение;</li>
             *    <li>false - нет неопределённого значения.</li>
             * </ul>
             */
            threeState: false
         }
      },

      $constructor: function() {
         this._publish('onChange');
         if (!this._options.threeState) {
            this._checked = !!(this._options.checked);
         } else {
            this._checked = (this._options.checked === false || this._options.checked === true) ? this._options.checked : null;
         }
      },

      /**
       * Устанавливает состояние кнопки.
       * @param {Boolean} flag Признак состояния кнопки true/false.
       * @example
       * <pre>
       *     var btn = this.getChildControlByName(("myButton");
       *        btn.setChecked(true);
       * </pre>
       * @see checked
       * @see isChecked
       * @see setValue
       */
      setChecked: function(flag) {
         if (flag === true) {
            this._container.addClass('controls-ToggleButton__checked');
            this._container.removeClass('controls-ToggleButton__null');
            this._checked = true;
         } else
         if (flag === false) {
            this._container.removeClass('controls-ToggleButton__checked');
            this._container.removeClass('controls-ToggleButton__null');
            this._checked = false;
         } else {
            if (this._options.threeState) {
               this._container.removeClass('controls-ToggleButton__checked');
               this._container.addClass('controls-ToggleButton__null');
               this._checked = null;
            }
         }
         this.saveToContext('Checked', this._checked);
         this._notify('onChange', this._checked);
      },

      /**
       * Признак текущего состояния кнопки.
       * Возможные значения:
       * <ul>
       *    <li>true - кнопка нажата/ чекбокс с галочкой/ радиокнопка выбрана;</li>
       *    <li>false - кнопка не нажата/ чекбокс пустой/ радиокнопка пустая.</li>
       * </ul>
       * @see checked
       * @see setChecked
       * @see getValue
       */
      isChecked: function() {
         return this._checked;
      },

      _clickHandler : function() {
         if (!this._options.threeState) {
            this.setChecked(!(this.isChecked()));
         } else {
            if (this._checked === true){
               this.setChecked(false);
            } else
            if (this._checked === false){
               this.setChecked(null);
            } else  {
               this.setChecked(true);
            }
         }
      },
     /**
      * Изменить текущее состояние кнопки.
      * @param {Boolean} value Новое состояние.
      * @example
      * <pre>
      *     var btn = this.getChildControlByName("myButton");
      *        btn.setValue(true)
      * </pre>
      * @see setChecked
      * @see getValue
      * @see isChecked
      */
      setValue: function(value){
         this.setChecked(value);
      },
     /**
      * Возвращает текущее состояние кнопки.
      * @returns {Boolean}
      * @example
      * <pre>
      *     var btn = this.getChildControlByName("myButton");
      *        btn.getValue();
      * </pre>
      * @see isChecked
      * @see checked
      * @see setChecked
      * @see setValue
      */
      getValue: function(){
         return this.isChecked();
      }

   });

   return ToggleButtonBase;

});