/*global define, $, $ws*/
define('js!SBIS3.CONTROLS.MenuButtonNew', ['js!SBIS3.CONTROLS.Button', 'js!SBIS3.CONTROLS.ContextMenuNew', 'js!SBIS3.CONTROLS.PickerMixin',
      'js!SBIS3.CONTROLS.ListControlMixin', 'js!SBIS3.CONTROLS.MenuButtonNewMixin', 'html!SBIS3.CONTROLS.MenuButton',
      'js!SBIS3.CONTROLS.HierarchyControlMixin','js!SBIS3.CONTROLS.TreeControlMixin', 'js!SBIS3.CONTROLS.Data.Utils','js!SBIS3.CONTROLS.MenuButtonNewView'],
   function(Button, ContextMenu, PickerMixin,
      ListControlMixin, MenuButtonMixin, dotTplFn,
      HierarchyControlMixin, TreeControlMixin, DataUtils, MenuButtonView) {

   'use strict';

   /**
    * Кнопка с выпадающим меню
    * @class SBIS3.CONTROLS.MenuButtonNew
    * @extends SBIS3.CONTROLS.Button
    * @demo SBIS3.CONTROLS.Demo.MyMenuButton Пример кнопки с выпадающим меню
    * @control
    * @initial
    * <component data-component='SBIS3.CONTROLS.MenuButton'>
    *    <option name='caption' value='Кнопка с меню'></option>
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
    * @public
    * @author Ганшин Ярослав Олегович
    * @category Buttons
    * @mixes SBIS3.CONTROLS.PickerMixin
    * @mixes SBIS3.CONTROLS.ListControlMixin
    * @mixes SBIS3.CONTROLS.MenuButtonMixin
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

   var MenuButton = Button.extend( [PickerMixin, ListControlMixin, MenuButtonMixin, HierarchyControlMixin, TreeControlMixin], /** @lends SBIS3.CONTROLS.MenuButtonNew.prototype */ {
      _dotTplFn: dotTplFn,
      $protected: {
         _header: null,

         _options: {
            pickerClassName: 'controls-MenuButton__Menu'
         },
         _viewConstructor: MenuButtonView

      },

      destroy: function(){
         MenuButton.superclass.destroy.call(this);
      },

      _onAlignmentChangeHandler: function(alignment){
         this._getView().changeAligment(alignment);
      },


      _clickHandler: function(){
         var items = this.getItemsProjection(),
            children  = items.getChildren(items.getRoot()),
            count = children.getCount();
         if (count > 1) {
            this.togglePicker();

         } else if (count == 1) {
            var id = (DataUtils.getItemPropertyValue(children.at(0).getContents(),  this._options.keyField));
            this._notify('onMenuItemActivate', id);
         }
      },
      /**
       * Скрывает/показывает меню у кнопки
       */
      togglePicker: function(){
         var view = this._getView();
         view.recalcWidth();
         MenuButton.superclass.togglePicker.call(this);
         view.tooglePickerHandler();
      },



      _initializePicker: function(){
         MenuButton.superclass._initializePicker.call(this);
         var self = this;
         this._picker._oppositeCorners.tl.horizontal.top = 'tr';
         this._picker._oppositeCorners.tr.horizontal.top = 'tl';
         this._picker.subscribe('onDrawItems', function(){
            self._picker.recalcPosition(true);
         });
         this._getView().setPicker(this._picker);
      },

      _setPickerContent: function(){
         var self = this;
         this._picker.subscribe('onClose', function(){
            self._getView().closeHandler();
         });
      },

      _dataLoadedCallback : function() {
         var count = this.getItems().getChildren().getCount(),
            withData = (count > 1);
         this._getView().setViewWithData(withData);
         if (this._picker){
            this.hidePicker();
         }
      }

   });

   return MenuButton;

});