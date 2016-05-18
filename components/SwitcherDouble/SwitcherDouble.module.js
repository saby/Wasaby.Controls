define('js!SBIS3.CONTROLS.SwitcherDouble', ['js!SBIS3.CORE.Control', 'html!SBIS3.CONTROLS.SwitcherDouble', 'js!SBIS3.CONTROLS.Clickable', 'js!SBIS3.CONTROLS.FormWidgetMixin', 'js!SBIS3.CONTROLS.Checkable'], function(Control, dotTplFn, Clickable, FormWidgetMixin, Checkable) {

   'use strict';
   /**
    * Контрол, отображающий двухпозиционный переключатель для поддержания макетов online.sbis.ru.
    * Данный переключатель отличается от обычного {@link Switcher} только внешне, функционально они одинаковы.
    * Можно настроить:
    * <ol>
    *    <li>{@link state} - начальное состояние;</li>
    *    <li>{@link stateOn} - текст подписи при включенном состоянии;</li>
    *    <li>{@link stateOff} - текст подписи при выключенном состоянии.</li>
    * </ol>
    * @class SBIS3.CONTROLS.SwitcherDouble
    * @extends $ws.proto.Control
    * @mixes SBIS3.CONTROLS.FormWidgetMixin
    * @initial
    * <component data-component='SBIS3.Engine.SwitcherDouble'>
    *    <option name="stateOff">Выкл</option>
    *    <option name="stateOn">Вкл</option>
    * </component>
    * @control
    * @demo SBIS3.CONTROLS.Demo.MySwitcherDoubleOnline
    * @public
    * @cssModifier controls-SwitcherDouble__primary
    * @author Крайнов Дмитрий Олегович
    *
    * @ignoreOptions validators independentContext contextRestriction extendedTooltip element linkedContext handlers
    * @ignoreOptions autoHeight autoWidth context horizontalAlignment isContainerInsideParent modal owner stateKey
    * @ignoreOptions subcontrol verticalAlignment parent
    *
    * @ignoreMethods applyEmptyState applyState findParent getAlignment getEventHandlers getEvents getExtendedTooltip
    * @ignoreMethods getId getLinkedContext getMinHeight getMinSize getMinWidth getOwner getOwnerId getParentByClass
    * @ignoreMethods getParentByName getParentByWindow getStateKey getTopParent getUserData hasEvent hasEventHandlers
    * @ignoreMethods isDestroyed isSubControl makeOwnerName once sendCommand setOwner setStateKey setUserData setValue
    * @ignoreMethods subscribe unbind unsubscribe unsubscribeFrom
    *
    * @ignoreEvents onDragIn onDragMove onDragOut onDragStart onDragStop onStateChanged onTooltipContentRequest onChange
    * @ignoreEvents onFocusIn onFocusOut onKeyPressed onReady
    */
   var SwitcherDouble = Control.Control.extend( [Clickable, FormWidgetMixin, Checkable], /** @lends SBIS3.CONTROLS.SwitcherDouble.prototype */ {
      _dotTplFn: dotTplFn,
      $protected: {
         _textContainer: {},
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
             * @translatable
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
             * @translatable
             */
            stateOff: '',
            disposition: 'horizontal'
         }
      },

      $constructor: function() {
         this._textContainer.off = $('.js-controls-SwitcherDouble__textOff',this._container.get(0));
         this._textContainer.on = $('.js-controls-SwitcherDouble__textOn',this._container.get(0));
         this._container.bind('mousedown' , function(e) { e.preventDefault(); });
         this._switcher = $('.js-controls-Switcher__toggle', this._container.get(0));
      },

      _clickHandler : function(e) {
         if (e.target == this._textContainer.off.get(0)) {
            if (this.isEnabled()) {
               this.setChecked(false);
            }
         }
         else if (e.target == this._textContainer.on.get(0)) {
            if (this.isEnabled()) {
               this.setChecked(true);
            }
         }
         else {
            if (e.target == this._switcher.get(0) || this._switcher.find(e.target).length) {
               if (this.isEnabled()) {
                  if (this._options.checked == true) {
                     this.setChecked(false);
                  } else {
                     this.setChecked(true);
                  }
               }
            }
         }
      },

      setChecked: function(checked) {
         SwitcherDouble.superclass.setChecked.apply(this, arguments);
         var newState;
         if (checked) {
            this._options.state = 'on';
         }
         else {
            this._options.state = 'off';
         }
         var oppositeState = (this._options.state == 'on') ? 'off' : 'on';

         this._switcher.addClass('controls-SwitcherDouble-' + this._options.state + '-toggled').removeClass('controls-SwitcherDouble-' + oppositeState + '-toggled');
         this._textContainer[oppositeState].addClass('controls-SwitcherDouble__unselected');
         this._textContainer[this._options.state].removeClass('controls-SwitcherDouble__unselected');
      },


      setState: function(state) {
         if (state == 'on' || state == 'off'){
            this.setChecked(state == 'on');
            this._notifyOnPropertyChanged('state');
         }
      },

      getState: function() {
         return this._options.state;
      },

      setStateOff: function(text){
         SwitcherDouble.superclass.setStateOff.call(this,text);
         this._textContainer['off'].html(text);
      },

      setStateOn: function(text){
         SwitcherDouble.superclass.setStateOn.call(this,text);
         this._textContainer['on'].html(text);
      }
   });

   return SwitcherDouble;
});