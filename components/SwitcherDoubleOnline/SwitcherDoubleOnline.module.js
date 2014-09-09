/**
 * Модуль 'Компонент кнопка'.
 *
 * @description
 */
define('js!SBIS3.Engine.SwitcherDoubleOnline', ['js!SBIS3.CONTROLS.Switcher', 'html!SBIS3.Engine.SwitcherDoubleOnline', 'css!SBIS3.Engine.SwitcherDoubleOnline'], function(Switcher, dotTplFn) {

   'use strict';
   /**
    * Класс определяет отображение двухпозиционного переключателя для поддержания макетов online.sbis.ru
    * @class SBIS3.Engine.SwitcherDoubleOnline
    * @extends SBIS3.CONTROLS.Switcher
    * @mixes SBIS3.CONTROLS._FormWidgetMixin
    * @control
    */
   var SwitcherDoubleOnline = Switcher.extend( /** @lends SBIS3.Engine.SwitcherDoubleOnline.prototype */ {
      _dotTplFn: dotTplFn,
      $protected: {
         _textOff : null,
         _textOn : null,
         _options: {

         }
      },

      $constructor: function() {
         var self = this;
         this._textOff = $('.js-controls-SwitcherDoubleOnline__textOff',self._container.get(0));
         this._textOn = $('.js-controls-SwitcherDoubleOnline__textOn',self._container.get(0));
         this._textOff.bind('mouseup',function(){
            self.setState('off');
         });
         this._textOn.bind('mouseup',function(){
            self.setState('on');
         });
      },

      setState: function(state) {
         var self = this;
         Switcher.superclass.setState.call(this,state);
         if (state == 'on'){
            self._position.addClass('controls-Switcher__rightPosition').removeClass('controls-Switcher__leftPosition');
            self._textOff.addClass('controls-SwitcherDoubleOnline__unselected');
            self._textOn.removeClass('controls-SwitcherDoubleOnline__unselected');
         } else {
            self._position.addClass('controls-Switcher__leftPosition').removeClass('controls-Switcher__rightPosition');
            self._textOn.addClass('controls-SwitcherDoubleOnline__unselected');
            self._textOff.removeClass('controls-SwitcherDoubleOnline__unselected');
         }
      }

   });

   return SwitcherDoubleOnline;
});