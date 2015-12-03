
define('js!SBIS3.CONTROLS.Switcher', ['js!SBIS3.CORE.Control', 'html!SBIS3.CONTROLS.Switcher', 'js!SBIS3.CONTROLS.Checkable', 'js!SBIS3.CONTROLS.Clickable'], function(Control, dotTplFn, Checkable, Clickable) {

   'use strict';

   /**
    * Контрол, отображающий обычный переключатель.
    * Можно настроить:
    * <ol>
    *    <li>{@link state} - начальное состояние;</li>
    *    <li>{@link stateOn} - текст подписи при включенном состоянии;</li>
    *    <li>{@link stateOff} - текст подписи при выключенном состоянии.</li>
    * </ol>
    * @class SBIS3.CONTROLS.Switcher
    * @extends $ws.proto.Control
    * @mixes SBIS3.CONTROLS.Checkable
    * @mixes SBIS3.CONTROLS.Clickable
    * @control
    * @author Крайнов Дмитрий Олегович
    * @demo SBIS3.CONTROLS.Demo.MySwitcher
    * @public
    * @initial
    * <component data-component='SBIS3.CONTROLS.Switcher'>
    *     <option name='checked' type="boolean">true</option>
    * </component>
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

   var Switcher = Control.Control.extend([Checkable, Clickable], /** @lends SBIS3.CONTROLS.Switcher.prototype */ {
      _dotTplFn: dotTplFn,
      _clickHandler : function() {
         this.setChecked(!this._options.checked);
      }

   });

   return Switcher;

});