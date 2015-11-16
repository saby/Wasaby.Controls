define('js!SBIS3.CONTROLS.MenuIcon', ['js!SBIS3.CONTROLS.IconButton', 'js!SBIS3.CONTROLS.ContextMenu', 'js!SBIS3.CONTROLS.PickerMixin', 'js!SBIS3.CONTROLS.DSMixin', 'js!SBIS3.CONTROLS.MenuButtonMixin', 'html!SBIS3.CONTROLS.MenuIcon'], function(IconButton, ContextMenu, PickerMixin, DSMixin, MenuButtonMixin, dotTplFn) {

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
    * @author Крайнов Дмитрий Олегович
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
    * @mixes SBIS3.CONTROLS.DSMixin
    * @mixes SBIS3.CONTROLS.MenuButtonMixin
    *
    * @cssModifier controls-Menu__hide-menu-header скрыть заголовок у выпадающего меню
    * @cssModifier controls-IconButton__round-border круглый бордер вокруг иконки
    */

   var MenuIcon = IconButton.extend( [PickerMixin, DSMixin, MenuButtonMixin], /** @lends SBIS3.CONTROLS.MenuIcon.prototype */ {
      _dotTplFn: dotTplFn,
      _hasHeader: false,
      $protected: {
         _options: {
            pickerClassName: 'controls-MenuIcon__Menu'
         }
      },

      init: function(){
         this._container.addClass('controls-MenuIcon');
         if (this._container.hasClass('controls-IconButton__round-border')){
            this._options.pickerClassName += ' controls-IconButton__round-border';
         }
         if (this._container.hasClass('icon-24') && !this._container.hasClass('controls-Menu__hide-menu-header')){
            this._options.pickerClassName += ' controls-Menu__big-header';
         }
         this.reload();
         MenuIcon.superclass.init.call(this);
      },

      setItems: function(items) {
         MenuIcon.superclass.setItems.call(this, items);
         var displayValue = (this.getItems().length > 1) ? 'inline-block' : 'none';
      },

      _clickHandler: function () {
         if (this._dataSet.getCount() > 1) {
            $('.controls-MenuIcon__header', this._container).toggleClass('controls-MenuIcon__header-hidden', this._container.hasClass('controls-Picker__show'));
            this.togglePicker();
         } else {
            if (this._dataSet.getCount() == 1) {
               var id = this._dataSet.at(0).getKey();
               this._notify('onMenuItemActivate', id);
            }
         }
      },
      _dataLoadedCallback : function() {
         if (this._picker) this.hidePicker();
      }

   });

   return MenuIcon;

});