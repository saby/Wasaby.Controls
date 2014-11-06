/**
 * Модуль 'Компонент кнопка'.
 *
 * @description
 */
define('js!SBIS3.Engine.SwitcherDoubleOnline', ['js!SBIS3.CONTROLS.SwitcherBase', 'html!SBIS3.Engine.SwitcherDoubleOnline'], function(SwitcherBase, dotTplFn) {

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
         _textContainer: {},
         _options: {
            disposition: 'horizontal'
         }
      },

      $constructor: function() {
         var self = this;
         this._textContainer['off'] = $('.js-controls-SwitcherDoubleOnline__textOff',self._container.get(0));
         this._textContainer['on'] = $('.js-controls-SwitcherDoubleOnline__textOn',self._container.get(0));
         this._textContainer['off'].bind('mouseup', function () {
            if (self.isEnabled()) {
               self.setState('off');
            }
         });
         this._textContainer['on'].bind('mouseup', function () {
            if (self.isEnabled()) {
               self.setState('on');
            }
         });

      },

      setState: function(state) {
         var oppositeState = (state == 'on') ? 'off' : 'on';
         SwitcherDoubleOnline.superclass.setState.call(this,state);
         if (state =='on' || state == 'off') {
            this._switcher.addClass('controls-SwitcherDoubleOnline-' + state + '-toggled').removeClass('controls-SwitcherDoubleOnline-' + oppositeState + '-toggled');
            this._textContainer[oppositeState].addClass('controls-SwitcherDoubleOnline__unselected');
            this._textContainer[state].removeClass('controls-SwitcherDoubleOnline__unselected');
         }
      },

      setStateOff: function(text){
         SwitcherDoubleOnline.superclass.setStateOff.call(this,text);
         this._textContainer['off'].html(text);
      },

      setStateOn: function(text){
         SwitcherDoubleOnline.superclass.setStateOn.call(this,text);
         this._textContainer['on'].html(text);
      }
   });

   return SwitcherDoubleOnline;
});