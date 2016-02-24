/**
 * Модуль 'Компонент кнопка'.
 *
 * @description
 */
define('js!SBIS3.CONTROLS.TabButton',
   ['js!SBIS3.CONTROLS.RadioButtonBase', 'html!SBIS3.CONTROLS.TabButton','js!SBIS3.CONTROLS.IconMixin'], function (RadioButtonBase, dotTplFn,IconMixin) {

   'use strict';
   /**
    * Контрол, отображающий корешок закладки. Работает только в составе группы. В джине не вытаскивается
    * @class SBIS3.CONTROLS.TabButton
    * @extends SBIS3.CONTROLS.RadioButtonBase
    * @author Крайнов Дмитрий Олегович
    */
   var TabButton = RadioButtonBase.extend([IconMixin],/** @lends SBIS3.CONTROLS.TabButton.prototype */ {
      $protected: {
         _options: {
            /**
             * @cfg {String} С какой стороны контейнера отображать вкладку
             * @variant right с правой стороы
             * @variant left с левой стороны
             * @example
             * <pre>
             *     <option name="align">left</option>
             * </pre>
             */
            align: 'right'
         }
      },
      _dotTplFn: dotTplFn,

      $constructor: function () {
         if (this._options.icon){
            this.setIcon(this._options.icon);
         }
      },

      setEnabled: function(enabled) {
         var prev = this._options.enabled;

         enabled = !!enabled;
         //кнопку выключаем только, если allowChangeEnabled = true, дочерние включаем/выключаем всегда
         //_setupChildByAreaEnabled смотрит на опцию this._options.enabled
         this._options.enabled = enabled;

         //вызываем для всех детей безусловно, т.к. this._options.enabled корешка может не соответствовать состояниям вложенных контролов
         //TODO возможно стоит this._setupChildByAreaEnabled заменить на свою функцию
         $ws.helpers.forEach(this.getImmediateChildControls(), this._setupChildByAreaEnabled, this);

         //не выключаем вкладку, если она была включена, чтобы работало переключение вкладок
         if (this._options.allowChangeEnable) {
            this._setEnabled(this._options.enabled);
         } else {
            //возвращаем, что было
            this._options.enabled = prev;
         }

      },
      _drawIcon: function() {
         var newIcon = $('<span></span>').addClass(this._options._iconClass);
         this.getContainer().find('.controls-TabButton__icon').html(newIcon);
      }
   });

   return TabButton;

});