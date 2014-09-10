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
         var self = this;
         Switcher.superclass.setState.call(this,state);
         if (state == 'on'){
            self._position.addClass('controls-Switcher__rightPosition').removeClass('controls-Switcher__leftPosition').html(self._options.stateOn);
         } else {
            self._position.addClass('controls-Switcher__leftPosition').removeClass('controls-Switcher__rightPosition').html(self._options.stateOff);
         }
      }

   });

   return Switcher;

});