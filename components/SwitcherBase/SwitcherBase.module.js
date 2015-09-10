/**
 * Модуль 'Компонент кнопка'.
 *
 * @description
 */
define('js!SBIS3.CONTROLS.SwitcherBase', ['js!SBIS3.CORE.Control', 'js!SBIS3.CONTROLS.Clickable', 'js!SBIS3.CONTROLS.FormWidgetMixin'], function(Control, Clickable, FormWidgetMixin) {

   'use strict';

   /**
    * Контрол переключатель. Переключатель - это особый контрол, который наследуется прямо от базового класса.
    * Во-первых, это не кнопка и не чекбокс, т.к. переключатель имеет два текстовых обозначения, и два различных
    * состояния (кнопка - только caption).
    * Во-вторых это не группа радиобаттонов, т.к. в группе динамический набор сущностей, количеством и содержимым
    * которых можно управлять, а в переключателе всегда две, строго определенных.
    * Данный класс поведенческий.
    * @class SBIS3.CONTROLS.SwitcherBase
    * @extends $ws.proto.Control
    * @public
    * @author Крайнов Дмитрий Олегович
    *
    * @ignoreOptions validators independentContext contextRestriction extendedTooltip element linkedContext handlers
    * @ignoreOptions autoHeight autoWidth context horizontalAlignment isContainerInsideParent modal owner stateKey
    * @ignoreOptions subcontrol verticalAlignment parent
    */

   var SwitcherBase = Control.Control.extend( [Clickable, FormWidgetMixin], /** @lends SBIS3.CONTROLS.SwitcherBase.prototype */ {
      $protected: {
         _switcher : null,
         _position : null,
         _options: {

            /**
             * @cfg {String} Начальное состояние переключателя
             * Опция задаёт состояние переключателя, с которым построится контрол.
             * @example
             * <pre>
             *     <option name="state">on</option>
             * </pre>
             * @variant on Включен.
             * @variant off Выключен.
             * @see setState
             * @see setStateOff
             * @see setStateOn
             */
            state: 'off',
            /**
             * @cfg {String} Текст при включенном состоянии
             * @example
             * <pre>
             *     <option name="stateOn">Скрыть</option>
             * </pre>
             * @see state
             * @see setState
             * @see setStateOff
             * @see setStateOn
             */
            stateOn: '',
            /**
             * @cfg {String} Текст при выключенном состоянии
             * @example
             * <pre>
             *     <option name="stateOff">Показать</option>
             * </pre>
             * @see state
             * @see setState
             * @see setStateOff
             * @see setStateOn
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
       * Устанавливает состояние.
       * Метод установки текущего состояния переключателя.
       * @param {String} state Состояние переключателя: on/off.
       * @example
       * <pre>
       *     if (NumberTextBox.getNumericValue() < 19) {
       *        control.setState("off");
       *     }
       * </pre>
       * @see state
       * @see getState
       * @see setStateOff
       * @see setStateOn
       * @see stateOff
       * @see stateOn
       */
      setState: function(state) {
         if (state == 'on' || state == 'off'){
            this._options.state = state;
         }
      },
      /**
       * Получить состояние.
       * Метод получения состояния, заданного либо опцией {@link state}, либо методом {@link setState}.
       * @returns {String} Состояние переключателя: "on"/"off".
       * @example
       * <pre>
       *     if (control.getState() == "on") {
       *        textBox.setText("Задачи");
       *     }
       * </pre>
       * @see state
       * @see setState
       */
      getState: function() {
         return this._options.state;
      },
      /**
       * @noShow
       */
      setValue: function(value){
         this.setState(value);
      },
      /**
       * @noShow
       */
      getValue: function(){
         return this.getState();
      },
	  /**
       * Устанавливает текст на выключенном состоянии.
       * Метод установки текста переключателя в выключенном состоянии.
       * @param text Текст переключателя.
       * @example
       * <pre>
       *     if (a == "Задачи") {
       *        control.setStateOff("Скрыть задачи");
       *     }
       * </pre>
       * @see state
       * @see setState
       * @see stateOff
       * @see stateOn
       * @see setStateOn
       */
      setStateOff: function(text){
         this._options.stateOff = text;
      },
	  /**
       * Устанавливает текст на включенном состоянии.
       * Метод установки текста переключателя во включённом состоянии.
       * @param text Текст переключателя.
       * @example
       * <pre>
       *     if (a == "Задачи") {
       *        control.setStateOn("Показать задачи");
       *     }
       * </pre>
       * @see state
       * @see setState
       * @see stateOff
       * @see stateOn
       * @see setStateOff
       */
      setStateOn: function(text){
         this._options.stateOn = text;
      }

   });

   return SwitcherBase;

});