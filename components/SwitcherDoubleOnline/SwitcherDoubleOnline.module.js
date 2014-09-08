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
         _options: {

         }
      },

      $constructor: function() {
         var self = this;
         this._position = $('.js-controls-SwitcherDoubleOnline__position',self._container.get(0));
         this._switcher = this._container;

         this._switcher.bind('mouseup',function(e){
            e.preventDefault();
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
            self._position.addClass('controls-SwitcherDoubleOnline__rightPosition').removeClass('controls-SwitcherDoubleOnline__leftPosition').html(self._options.stateOn);
         } else {
            self._position.addClass('controls-SwitcherDoubleOnline__leftPosition').removeClass('controls-SwitcherDoubleOnline__rightPosition').html(self._options.stateOff);
         }
      }

   });


   return SwitcherDoubleOnline;

});