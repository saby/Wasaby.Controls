/**
 * Модуль 'Компонент кнопка'.
 *
 * @description
 */
define('js!SBIS3.Engine.SwitcherDoubleOnline', ['js!SBIS3.CONTROLS.SwitcherBase', 'html!SBIS3.Engine.SwitcherDoubleOnline', 'css!SBIS3.Engine.SwitcherDoubleOnline'], function(SwitcherBase, dotTplFn) {

   'use strict';
   /**
    * Класс определяет отображение двухпозиционного переключателя для поддержания макетов online.sbis.ru
    * @class SBIS3.Engine.SwitcherDoubleOnline
    * @extends SBIS3.CONTROLS.SwitcherBase
    * @mixes SBIS3.CONTROLS._FormWidgetMixin
    * @control
    */
   var SwitcherDoubleOnline = SwitcherBase.extend( /** @lends SBIS3.Engine.SwitcherDoubleOnline.prototype */ {
      _dotTplFn: dotTplFn,
      $protected: {
         _switcher : null,
         _position : null,
         _textOff : null,
         _textOn : null,
         _options: {

         }
      },

      $constructor: function() {
         var self = this;
         this._position = $('.js-controls-SwitcherDoubleOnline__position',self._container.get(0));
         this._switcher = $('.js-controls-SwitcherDoubleOnline__toggle',self._container.get(0));
         this._textOff = $('.js-controls-SwitcherDoubleOnline__textOff',self._container.get(0));
         this._textOn = $('.js-controls-SwitcherDoubleOnline__textOn',self._container.get(0));

         this._textOff.bind('mouseup',function(){
            self.setState('off');
         });

         this._textOn.bind('mouseup',function(){
            self.setState('on');
         });

         this._switcher.bind('mouseup',function(e){
            if (self._options.state == 'on') {
               self.setState('off');
            } else {
               self.setState('on');
            }
         });
      },

      setState: function(state) {
         var self = this;
         SwitcherDoubleOnline.superclass.setState.call(this,state);
         if (state == 'on'){
            self._position.addClass('controls-SwitcherDoubleOnline__rightPosition').removeClass('controls-SwitcherDoubleOnline__leftPosition');
            self._textOff.addClass('controls-SwitcherDoubleOnline__unselected');
            self._textOn.removeClass('controls-SwitcherDoubleOnline__unselected');
         } else {
            self._position.addClass('controls-SwitcherDoubleOnline__leftPosition').removeClass('controls-SwitcherDoubleOnline__rightPosition');
            self._textOn.addClass('controls-SwitcherDoubleOnline__unselected');
            self._textOff.removeClass('controls-SwitcherDoubleOnline__unselected');
         }
      }

   });


   return SwitcherDoubleOnline;

});