/**
 * Модуль 'Компонент кнопка'.
 *
 * @description
 */
define('js!SBIS3.CONTROLS.SwitcherBase', ['js!SBIS3.CORE.Control','js!SBIS3.CONTROLS._FormWidgetMixin'], function(Control, FormWidgetMixin) {

   'use strict';

   /**
    * Контрол переключатель. Переключатель - это особый контрол, который наследуется прямо от базового класса.
    * Во-первых, это не кнопка и не чекбокс, т.к. переключатель имеет два текстовых обозначения, и два различных состояния (кнопка - только caption).
    * Во-вторых это не группа радиобаттонов, т.к. в группе динамический набор сущностей, количеством и содержимым которых можно управлять, а в переключателе всегда две, строго определенных.
    * Данный класс поведенческий.
    * @class SBIS3.CONTROLS.SwitcherBase
    * @extends SBIS3.CORE.Control
    */

   var SwitcherBase = Control.Control.extend( [FormWidgetMixin], /** @lends SBIS3.CONTROLS.SwitcherBase.prototype */ {
      $protected: {
         _switcher : null,
         _position : null,
         _state: '',
         _options: {
            /**
             * @typedef {Object} StateEnum
             * @variant on Включен
             * @variant off Выключен
             */
            /**
             * @cfg {StateEnum} Состояние по умолчанию (on/off)
             */
            state: 'off',
            /**
             * @cfg {String} Текст при включенном состоянии
             */
            stateOn: '',
            /**
             * @cfg {String} Текст при выключенном состоянии
             */
            stateOff: ''
         }
      },

      $constructor: function() {
         var self = this;
         this._position = $('.js-controls-Switcher__position',self._container.get(0));
         this._switcher = $('.js-controls-Switcher__toggle',self._container.get(0));
         this._state = this._options.state;
         this._switcher.bind('mouseup',function(){
            if (self._state == 'on') {
               self.setState('off');
            } else {
               self.setState('on');
            }
         });
         //Предотвращаем выделение
         this._switcher.bind('mousedown',function() {
            return false;
         });
      },
      /**
       * Устанавливает состояние (on/off)
       * @param {String} state
       */
      setState: function(state) {
         if (state == 'on' || state == 'off'){
            this._state = state;
         }
      },
      /**
       * Получить состояние
       */
      getState: function() {
         return this._state;
      },

      setValue: function(value){
         this.setState(value);
      },

      getValue: function(){
         return this.getState();
      },
	  /**
       * Установить текст на выключенном состоянии
       * @param text
       */
      setStateOff: function(text){
         this._options.stateOff = text;
      },
	  /**
       * Установить текст на включенном состоянии
       * @param text
       */
      setStateOn: function(text){
         this._options.stateOn = text;
      }

   });

   return SwitcherBase;

});