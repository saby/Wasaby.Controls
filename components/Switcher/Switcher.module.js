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
         _switcher : null,
         _position : null,
         _options: {

         }
      },

      $constructor: function() {
         var self = this;
         this._position = $('.js-controls-Switcher__position',self._container.get(0));
         this._switcher = $('.js-controls-Switcher__toggle',self._container.get(0));

         this._switcher.bind('mouseup',function(e){
            if (self._options.state == 'on') {
               self.setState('off');
            } else {
               self.setState('on');
            }
         });
         //Предотвращаем выделение
         this._switcher.bind('mousedown',function(e) {
            return false;
         });
      },

      setState: function(state) {
         var self = this;
         Switcher.superclass.setState.call(this,state);
         if (state == 'on'){
            self._position.addClass('js-controls-Switcher__rightPosition').removeClass('js-controls-Switcher__leftPosition').html(self._options.stateOn);
         } else {
            self._position.addClass('js-controls-Switcher__leftPosition').removeClass('js-controls-Switcher__rightPosition').html(self._options.stateOff);
         }
      }

   });

   return Switcher;

});