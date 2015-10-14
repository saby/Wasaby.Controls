/*global define, $*/
define('js!SBIS3.CONTROLS.MenuIconNew', [
   'js!SBIS3.CONTROLS.IconButton', 'js!SBIS3.CONTROLS.ContextMenuNew', 'js!SBIS3.CONTROLS.PickerMixin',
   'js!SBIS3.CONTROLS.ListControlMixin',  'js!SBIS3.CONTROLS.MenuButtonNewMixin', 'html!SBIS3.CONTROLS.MenuIcon',
   'js!SBIS3.CONTROLS.MenuIconView', 'js!SBIS3.CONTROLS.Data.Utils', 'js!SBIS3.CONTROLS.HierarchyControlMixin',
   'js!SBIS3.CONTROLS.TreeControlMixin'
], function(IconButton, ContextMenu, PickerMixin,
      ListControlMixin, MenuButtonMixin, dotTplFn,
      MenuIconView, DataUtils, HierarchyControlMixin,
      TreeControlMixin ) {

   'use strict';

   /**
    * Кнопка с выпадающим меню
    * @class SBIS3.CONTROLS.MenuIcon
	 * @demo SBIS3.CONTROLS.Demo.MyMenuIconNew
    * @control
    * @initial
    * <component data-component='SBIS3.CONTROLS.MenuIcon'>
    *    <option name="icon">sprite:icon-24 icon-AddButton icon-primary</option>
    *    <options name="items" type="array">
    *        <options>
    *            <option name="id">1</option>
    *            <option name="title">Пункт1</option>
    *         </options>
    *         <options>
    *            <option name="id">2</option>
    *            <option name="title">Пункт2</option>
    *         </options>
    *      </options>
    * </component>
    * @extends SBIS3.CONTROLS.ToggleButton
    * @public
    * @author Ганшин Ярослав Олегович
    * @category Buttons
    *
    * @ignoreOptions independentContext contextRestriction extendedTooltip validators
    * @ignoreOptions element linkedContext handlers parent autoHeight autoWidth horizontalAlignment
    * @ignoreOptions isContainerInsideParent owner stateKey subcontrol verticalAlignment
    *
    * @ignoreMethods activate activateFirstControl activateLastControl addPendingOperation changeControlTabIndex
    * @ignoreMethods applyEmptyState applyState findParent getAlignment getEventHandlers getEvents getExtendedTooltip
    * @ignoreMethods getId getLinkedContext getMinHeight getMinSize getMinWidth getOwner getOwnerId getParentByClass
    * @ignoreMethods getParentByName getParentByWindow getStateKey getTopParent getUserData hasEvent hasEventHandlers
    * @ignoreMethods isDestroyed isSubControl makeOwnerName once sendCommand setOwner setStateKey setUserData setValue
    * @ignoreMethods subscribe unbind unsubscribe
    *
    * @ignoreEvents onDragIn onDragMove onDragOut onDragStart onDragStop onStateChanged onTooltipContentRequest onChange
    * @ignoreEvents onBeforeShow onAfterShow onBeforeLoad onAfterLoad onBeforeControlsLoad onKeyPressed onResize
    * @ignoreEvents onFocusIn onFocusOut onReady onDragIn onDragStart onDragStop onDragMove onDragOut
    *
    * @mixes SBIS3.CONTROLS.PickerMixin
    * @mixes SBIS3.CONTROLS.ListControlMixin
    * @mixes SBIS3.CONTROLS.MenuButtonNewMixin
    */

   var MenuIcon = IconButton.extend( [PickerMixin, ListControlMixin, MenuButtonMixin, HierarchyControlMixin, TreeControlMixin], /** @lends SBIS3.CONTROLS.MenuIcon.prototype */ {
      _dotTplFn: dotTplFn,
      _hasHeader: false,
      $protected: {
         _options: {
            pickerClassName: 'controls-MenuIcon__Menu'
         },
         _viewConstructor: MenuIconView
      },

      init: function(){
         MenuIcon.superclass.init.call(this);
         this._options._pickerClassName = this._getView().getPickerClassName();
      },

      _clickHandler: function() {
         var items = this.getItems(),
            children  = items.getChildren(),
            count = children.getCount();
         if (count > 1) {
            this.togglePicker();

         } else if (count === 1) {
            var id = (DataUtils.getItemPropertyValue(children.at(0).getContents(),  this._options.keyField));
            this._notify('onMenuItemActivate', id);
         }
      },

      _dataLoadedCallback: function() {
         if (this._picker) this.hidePicker();
      },

      _initializePicker: function(){
         MenuIcon.superclass._initializePicker.call(this);
         this._getView().setPicker(this._picker);
      }
   });

   return MenuIcon;

});