define('js!SBIS3.CORE.ToggleButtonBase', ['js!SBIS3.CORE.ButtonBase'], function(ButtonBase) {

   'use strict';

   /**
    * Поведенческий класс задающий поведение кнопки с залипанием.
    * Отличается от обычной кнопки тем, что сохраняется состояние checked (“Нажатая/Не нажатая”). При клике - checked меняется на противоположный
    * @class SBIS3.CORE.ToggleButtonBase
    * @extends SBIS3.CORE.ButtonBase
    */

   var ToggleButtonBase = ButtonBase.extend(/** @lends SBIS3.CORE.ToggleButtonBase.prototype */{
      $protected: {
         _checked : false,
         _options: {
            /**
             * @cfg {Boolean} Выбрана кнопка по умолчанию или нет
             */
            checked: false,
            /**
             * @cfg {Boolean} Есть третье, неопределенное, значение или нет
             */
            threeState: false
         }
      },

      $constructor: function() {
         this._checked = !!(this._options.checked);
      },

      /**
       * Устанавливает состояние кнопки
       * @param {Boolean} flag
       */

      setChecked: function(flag) {
         if (flag === true) {
            this._container.addClass('core-ToggleButton__checked');
            this._checked = true;
         }
         else {
            this._container.removeClass('core-ToggleButton__checked');
            this._checked = false;
         }
      },

      /**
       * Получить состояние кнопки
       */

      isChecked: function() {
         return this._checked;
      },

      _clickHandler : function() {
         this.setChecked(!(this.isChecked()));
      }

   });

   return ToggleButtonBase;

});