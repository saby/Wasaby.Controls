define('SBIS3.CONTROLS/Switcher',
   [
      'Lib/Control/Control',
      'tmpl!SBIS3.CONTROLS/Switcher/Switcher',
      'SBIS3.CONTROLS/Mixins/Checkable',
      'SBIS3.CONTROLS/Mixins/Clickable',
      'css!SBIS3.CONTROLS/Switcher/Switcher'
   ],
   function(Control, dotTplFn, Checkable, Clickable) {

   'use strict';

   /**
    * Контрол, отображающий обычный переключатель.
    * @class SBIS3.CONTROLS/Switcher
    * @extends Lib/Control/Control
    * @mixes SBIS3.CONTROLS/Mixins/Checkable
    * @mixes SBIS3.CONTROLS/Mixins/Clickable
    * @author Журавлев М.С.
    * @demo Examples/Switcher/MySwitcher/MySwitcher
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
    *
    * @control
    * @public
    * @category Button
    * @initial
    * <component data-component='SBIS3.CONTROLS/Switcher'>
    *     <option name='checked' type="boolean">true</option>
    * </component>
    */

   var Switcher = Control.Control.extend([Checkable, Clickable], /** @lends SBIS3.CONTROLS/Switcher.prototype */ {
      _dotTplFn: dotTplFn,
      $protected: {
         _checkClickByTap: true
      },
      _clickHandler : function() {
         this.setChecked(!this._options.checked);
      }

   });

   return Switcher;

});