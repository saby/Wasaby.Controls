/*global define, $ws, $*/
define('js!SBIS3.CONTROLS.MenuLinkNew', ['js!SBIS3.CONTROLS.Link', 'js!SBIS3.CONTROLS.ListControlMixin',
      'js!SBIS3.CONTROLS.PickerMixin', 'js!SBIS3.CONTROLS.MenuButtonNewMixin',
      'js!SBIS3.CONTROLS.ContextMenuNew',
      'js!SBIS3.CONTROLS.HierarchyControlMixin', 'js!SBIS3.CONTROLS.MenuLinkNewView'],
   function(Link, ListControlMixin, PickerMixin, MenuButtonMixin, ContextMenu, HierarchyControlMixin, MenuLinkView) {

   'use strict';

   /**
    * Контрол, отображающий кнопку в виде ссылки и выпадающее из нее меню
    * @class SBIS3.CONTROLS.MenuLinkNew
    * @demo SBIS3.CONTROLS.Demo.MyMenuLink
    * @extends SBIS3.CONTROLS.ButtonBase
    * @author Крайнов Дмитрий Олегович
    * @initial
    * <component data-component='SBIS3.CONTROLS.MenuLink'>
    *    <option name='caption' value='Ссылка с меню'></option>
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
    * @mixes SBIS3.CONTROLS.ListControlMixin
    * @mixes SBIS3.CONTROLS.PickerMixin
    * @mixes SBIS3.CONTROLS.MenuButtonMixin
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
    */

   var MenuLink = Link.extend( [PickerMixin, ListControlMixin, MenuButtonMixin, HierarchyControlMixin], /** @lends SBIS3.CONTROLS.MenuLinkNew.prototype */ {
      $protected: {
         _zIndex: '',
         _options: {
            pickerClassName: 'controls-MenuLink__Menu'
         }
      },

      $constructor: function() {

      },

      setCaption: function(caption){
         Link.superclass.setCaption.call(this, caption);
         this._getView().setCaption(caption);
      },

      _initializePicker: function(){
         MenuLink.superclass._initializePicker.call(this);
         this._getView().setPicker(this._picker);
         this._setWidth();
      },

      _setWidth: function(){
         this._getView().setWidth();
      },

      _clickHandler: function(){
         var items = this.getItemsProjection(),
            children  = items.getChildren(items.getRoot()),
            count = children.getCount();
         if (count > 1) {
            this.togglePicker();
         } else if (count == 1) {
            var id = DataUtils.getItemPropertyValue(children.at(0).getContents(),  this._options.keyField);
            this._notify('onMenuItemActivate', id);
         }
      },

      _dataLoadedCallback: function(){
         if (this._picker) this.hidePicker();
      },

      _getViewTemplate: function() {
         return MenuLinkViewTemplate;
      }
   });

   return MenuLink;

});