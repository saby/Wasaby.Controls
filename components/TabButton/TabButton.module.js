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
      _drawIcon: function(icon) {
         var newIcon = $('<span></span>').addClass(this._options._iconClass);
         this.getContainer().find('.controls-TabButton__icon').html(newIcon);
      }
   });

   return TabButton;

});