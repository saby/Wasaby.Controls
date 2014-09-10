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
         _textOffContainer : null,
         _textOnContainer : null,
         _options: {
            disposition: 'horizontal'
         }
      },

      $constructor: function() {
         var self = this;
         this._textOffContainer = $('.js-controls-SwitcherDoubleOnline__textOff',self._container.get(0));
         this._textOnContainer = $('.js-controls-SwitcherDoubleOnline__textOn',self._container.get(0));
         this._textOffContainer.bind('mouseup',function(){
            self.setState('off');
         });
         this._textOnContainer.bind('mouseup',function(){
            self.setState('on');
         });
      },

      setState: function(state) {
         var self = this;
         SwitcherDoubleOnline.superclass.setState.call(this,state);
         if (state == 'on'){
            self._switcher.addClass('controls-SwitcherDoubleOnline-on-toggled').removeClass('controls-SwitcherDoubleOnline-off-toggled');
            self._textOffContainer.addClass('controls-SwitcherDoubleOnline__unselected');
            self._textOnContainer.removeClass('controls-SwitcherDoubleOnline__unselected');
         } else {
            self._switcher.addClass('controls-SwitcherDoubleOnline-off-toggled').removeClass('controls-SwitcherDoubleOnline-on-toggled');
            self._textOnContainer.addClass('controls-SwitcherDoubleOnline__unselected');
            self._textOffContainer.removeClass('controls-SwitcherDoubleOnline__unselected');
         }
      }
   });

   return SwitcherDoubleOnline;
});