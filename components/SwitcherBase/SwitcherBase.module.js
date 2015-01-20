/**
 * Модуль 'Компонент кнопка'.
 *
 * @description
 */
define('js!SBIS3.CONTROLS.SwitcherBase', ['js!SBIS3.CORE.Control', 'js!SBIS3.CONTROLS.ClickMixin', 'js!SBIS3.CONTROLS.FormWidgetMixin'], function(Control, ClickMixin, FormWidgetMixin) {

   'use strict';

   /**
    * Контрол переключатель. Переключатель - это особый контрол, который наследуется прямо от базового класса.
    * Во-первых, это не кнопка и не чекбокс, т.к. переключатель имеет два текстовых обозначения, и два различных состояния (кнопка - только caption).
    * Во-вторых это не группа радиобаттонов, т.к. в группе динамический набор сущностей, количеством и содержимым которых можно управлять, а в переключателе всегда две, строго определенных.
    * Данный класс поведенческий.
    * @class SBIS3.CONTROLS.SwitcherBase
    * @extends $ws.proto.Control
    */

   var SwitcherBase = Control.Control.extend( [ClickMixin, FormWidgetMixin], /** @lends SBIS3.CONTROLS.SwitcherBase.prototype */ {
      $protected: {
         _switcher : null,
         _position : null,
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
      },
      _clickHandler : function() {
         if (this.isEnabled()) {
            if (this._options.state == 'on') {
               this.setState('off');
            } else {
               this.setState('on');
            }
         }
      },
      _notifyOnActivated : function() {
         this._notify('onActivated', this._options.state);
      },
      /**
       * Устанавливает состояние (on/off)
       * @param {String} state
       */
      setState: function(state) {
         if (state == 'on' || state == 'off'){
            this._options.state = state;
         }
      },
      /**
       * Получить состояние
       */
      getState: function() {
         return this._options.state;
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