define('js!SBIS3.CONTROLS.SwitcherDouble', ['js!SBIS3.CONTROLS.SwitcherBase', 'html!SBIS3.CONTROLS.SwitcherDouble'], function(SwitcherBase, dotTplFn) {

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
    * @extends SBIS3.CONTROLS.SwitcherBase
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
   var SwitcherDouble = SwitcherBase.extend( /** @lends SBIS3.Engine.SwitcherDouble.prototype */ {
      _dotTplFn: dotTplFn,
      $protected: {
         _textContainer: {},
         _options: {
            disposition: 'horizontal'
         }
      },

      $constructor: function() {
         this._textContainer.off = $('.js-controls-SwitcherDouble__textOff',this._container.get(0));
         this._textContainer.on = $('.js-controls-SwitcherDouble__textOn',this._container.get(0));
         this._container.bind('mousedown' , function(e) { e.preventDefault(); });
      },

      _clickHandler : function(e) {
         if (e.target == this._textContainer.off.get(0)) {
            if (this.isEnabled()) {
               this.setState('off');
            }
         }
         else if (e.target == this._textContainer.on.get(0)) {
            if (this.isEnabled()) {
               this.setState('on');
            }
         }
         else {
            if (e.target == this._switcher.get(0) || this._switcher.find(e.target).length) {
               SwitcherDouble.superclass._clickHandler.call(this);
            }
         }
      },

      setState: function(state) {
         SwitcherDouble.superclass.setState.call(this,state);
         var oppositeState = (state == 'on') ? 'off' : 'on';
         if (state =='on' || state == 'off') {
            this._switcher.addClass('controls-SwitcherDouble-' + state + '-toggled').removeClass('controls-SwitcherDouble-' + oppositeState + '-toggled');
            this._textContainer[oppositeState].addClass('controls-SwitcherDouble__unselected');
            this._textContainer[state].removeClass('controls-SwitcherDouble__unselected');
         }
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