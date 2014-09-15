define('js!SBIS3.CONTROLS.ToggleButtonBase', ['js!SBIS3.CONTROLS.ButtonBase'], function(ButtonBase) {

   'use strict';

   /**
    * Поведенческий класс, задающий поведение кнопки с залипанием.
    * Отличается от обычной кнопки тем, что сохраняется состояние checked (“Нажата/Не нажата”). При клике - checked меняется на противоположный
    * @class SBIS3.CONTROLS.ToggleButtonBase
    * @extends SBIS3.CONTROLS.ButtonBase
    */

   var ToggleButtonBase = ButtonBase.extend(/** @lends SBIS3.CONTROLS.ToggleButtonBase.prototype */{
      $protected: {
         _checked : null,
         _options: {
            /**
             * @cfg {Boolean} Выбрана кнопка по умолчанию или нет
             */
            checked: null,
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
         if (!this._options.threeState) {
            this._checked = !!(this._options.checked);
         } else {
            this._checked = (this._options.checked === false || this._options.checked === true) ? this._options.checked : null;
         }
      },

      /**
       * Установить состояние кнопки
       * @param {Boolean} flag
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
      },

      /**
       * Получить состояние кнопки
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

      setValue: function(value){
         this.setChecked(value);
      },

      getValue: function(){
         return this.isChecked();
      }

   });

   return ToggleButtonBase;

});