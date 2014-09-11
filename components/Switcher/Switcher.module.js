/**
 * Модуль 'Компонент кнопка'.
 *
 * @description
 */
define('js!SBIS3.CONTROLS.Switcher', ['js!SBIS3.CONTROLS.SwitcherBase', 'html!SBIS3.CONTROLS.Switcher', 'css!SBIS3.CONTROLS.Switcher'], function(SwitcherBase, dotTplFn) {

   'use strict';

   /**
    * Класс определяет отображение в виде обычного переключателя.
    * @class SBIS3.CONTROLS.Switcher
    * @extends SBIS3.CONTROLS.SwitcherBase
    * @mixes SBIS3.CONTROLS._FormWidgetMixin
    * @control
    */

   var Switcher = SwitcherBase.extend( /** @lends SBIS3.CONTROLS.Switcher.prototype */ {
      _dotTplFn: dotTplFn,
      $protected: {
         _options: {

         }
      },

      $constructor: function() {

      },

      setState: function(state) {
         Switcher.superclass.setState.call(this,state);
         if (state == 'on'){
            this._switcher.addClass('controls-Switcher__toggle__position-on');
            this._position.html(this._options.stateOn);
         } else {
            if (state == 'off') {
               this._switcher.removeClass('controls-Switcher__toggle__position-on');
               this._position.html(this._options.stateOff);
            }
         }
      }
   });

   return Switcher;

});