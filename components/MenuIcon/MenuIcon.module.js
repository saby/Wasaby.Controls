define('js!SBIS3.CONTROLS.MenuIcon', ['js!SBIS3.CONTROLS.IconButton', 'js!SBIS3.CONTROLS.ContextMenu', 'js!SBIS3.CONTROLS.PickerMixin', 'js!SBIS3.CONTROLS.CollectionMixin', 'js!SBIS3.CONTROLS.MenuButtonMixin', 'html!SBIS3.CONTROLS.IconButton'], function(IconButton, ContextMenu, PickerMixin, CollectionMixin, MenuButtonMixin, dotTplFn) {

   'use strict';

   /**
    * Кнопка с выпадающим меню
    * @class SBIS3.CONTROLS.MenuIcon
	* @demo SBIS3.CONTROLS.Demo.MyMenuIcon
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
    * @mixes SBIS3.CONTROLS.CollectionMixin
    * @mixes SBIS3.CONTROLS.MenuButtonMixin
    */

   var MenuIcon = IconButton.extend( [PickerMixin, CollectionMixin, MenuButtonMixin], /** @lends SBIS3.CONTROLS.MenuIcon.prototype */ {
      _dotTplFn: dotTplFn,
      _hasHeader: false,
      $protected: {
         _options: {
         }
      },

      init: function(){
         MenuIcon.superclass.init.call(this);
         this._container.addClass('controls-MenuIcon');
         this._initMenu();
      },

      _initMenu: function(){
         if (this.getItems().getItemsCount() > 1) {
            if (!this._hasHeader) {
               var header = $('<span class="controls-MenuIcon__header controls-MenuIcon__header-hidden">\
                            <i class="controls-MenuIcon__headerLeft"></i>\
                            <i class="controls-MenuIcon__headerRight"></i>\
                         </span>');
               this.getContainer().append(header);
               this._hasHeader = true;
            }
         } else {
            $('.controls-MenuIcon__header', this._container).remove();
            this._container.removeClass('controls-Picker__show');
            this._hasHeader = false;
         }
      },

      _clickHandler: function () {
         if (this.getItems().getItemsCount() > 1) {
            $('.controls-MenuIcon__header', this._container).toggleClass('controls-MenuIcon__header-hidden', this._container.hasClass('controls-Picker__show'));
            this.togglePicker();
         } else {
            if (this.getItems().getItemsCount() == 1) {
               var id = this.getItems().getKey(this.getItems().getNextItem());
               this._notify('onMenuItemActivate', id);
            }
         }
      },

      _setWidth: function(){
         var self = this;
         this._picker.getContainer().css({
            'min-width': self._container.outerWidth() - this._border + 15 // для обводки кнопки
         });
      },

      _setPickerContent: function(){
         var self = this;
         this._picker.subscribe('onClose', function(){
            self._closeHandler();
         });
         this._picker._container.addClass('controls-MenuIcon__Menu');
         var whiteLine = $('<span class="controls-MenuIcon__Menu-whiteLine" style="height: 1px; background: #ffffff; position: absolute; top: -1px;"></span>')
            .width(this._container.outerWidth() + 4);
         this._picker.getContainer().append(whiteLine);
      },

      _closeHandler: function(){
         $('.controls-MenuIcon__header', this._container).addClass('controls-MenuIcon__header-hidden');
      }
   });

   return MenuIcon;

});