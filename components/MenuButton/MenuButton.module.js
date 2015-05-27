define('js!SBIS3.CONTROLS.MenuButton', ['js!SBIS3.CONTROLS.Button', 'js!SBIS3.CONTROLS.ContextMenu', 'js!SBIS3.CONTROLS.PickerMixin', 'js!SBIS3.CONTROLS.CollectionMixin', 'js!SBIS3.CONTROLS.MenuButtonMixin', 'html!SBIS3.CONTROLS.MenuButton'], function(Button, ContextMenu, PickerMixin, CollectionMixin, MenuButtonMixin, dotTplFn) {

   'use strict';

   /**
    * Кнопка с выпадающим меню
    * @class SBIS3.CONTROLS.MenuButton
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
    * @category Buttons
    * @mixes SBIS3.CONTROLS.PickerMixin
    * @mixes SBIS3.CONTROLS.CollectionMixin
    * @mixes SBIS3.CONTROLS.TreeMixin
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
    * @ignoreEvents onFocusIn onFocusOut onReady
    */

   var MenuButton = Button.extend( [PickerMixin, CollectionMixin, MenuButtonMixin], /** @lends SBIS3.CONTROLS.MenuButton.prototype */ {
      _dotTplFn: dotTplFn,
      $protected: {
         _header: null,
         _headerAlignment: {
            horizontal: 'left',
            vertical: 'top'
         },
         _options: {
         }
      },

      init: function(){
         var self = this;
         MenuButton.superclass.init.call(this);
         this._initMenu();
         $ws.helpers.trackElement(this._container, true).subscribe('onMove', function () {
            if (self._header) {
               self._header.css({
                  left: (self._headerAlignment.horizontal == 'left') ? self._container.offset().left : self._container.offset().left - 16,
                  top: (self._headerAlignment.vertical == 'top') ? self._container.offset().top + 1 : self._container.offset().top - 6
               });
            }
         });
      },

      destroy: function(){
         MenuButton.superclass.destroy.call(this);
         if(this._header)
            this._header.remove();
      },

      _initMenu: function(){
         if (this.getItems().getItemsCount() > 1) {
            $('.js-controls-MenuButton__arrowDown', this._container).show();
            this._container.removeClass('controls-MenuButton__withoutMenu');
         } else {
            $('.js-controls-MenuButton__arrowDown', this._container).hide();
            this._container.addClass('controls-MenuButton__withoutMenu');
            this._container.removeClass('controls-Picker__show');
            $('.controls-MenuButton__header', this._container).remove();
         }
      },

      _onAlignmentChangeHandler: function(alignment){
         var right = alignment.horizontalAlign == 'right',
             bottom = alignment.verticalAlign == 'bottom';
         this._header.toggleClass('controls-MenuButton__header-revert-horizontal', right).toggleClass('controls-MenuButton__header-revert-vertical', bottom);
         if (right){
            this._header.css('left', this._container.offset().left - 16);
            this._headerAlignment.horizontal = 'right';
         } else {
            this._header.css('left', this._container.offset().left);
            this._headerAlignment.horizontal = 'left';
         }
         if (bottom){
            this._header.css('top', this._container.offset().top - 6);
            this._headerAlignment.vertical = 'bottom';
         } else {
            this._header.css('top', this._container.offset().top + 1);
            this._headerAlignment.vertical = 'top';
         }
      },

      _clickHandler: function(){
         if (this.getItems().getItemsCount() > 1) {
            this._container.addClass('controls-Checked__checked');
            this.togglePicker();
            this._header.toggleClass('controls-MenuButton__header-hidden', !this._container.hasClass('controls-Checked__checked'));
         } else {
            if (this.getItems().getItemsCount() == 1) {
               var id = this.getItems().getKey(this.getItems().getNextItem());
               this._notify('onMenuItemActivate', id);
            }
         }
      },
      /**
       * Скрывает/показывает меню у кнопки
       */
      togglePicker: function(){
         if (!this._header) {
            this._createHeader();
         }
         MenuButton.superclass.togglePicker.call(this);
         this._header.css({
            left: (this._headerAlignment.horizontal == 'left') ? this._container.offset().left : this._container.offset().left - 16,
            top: (this._headerAlignment.vertical == 'top') ? this._container.offset().top + 1 : this._container.offset().top - 6,
            'z-index': this._picker._container.css('z-index') + 1
         });
      },

      _createHeader: function(){
         this._header = $('<span class="controls-MenuButton__header controls-MenuButton__header-hidden">\
                                  <i class="controls-MenuButton__headerLeft"></i>\
                                  <i class="controls-MenuButton__headerCenter"></i>\
                                  <i class="controls-MenuButton__headerRight"></i>\
                               </span>');
         $('.controls-MenuButton__headerCenter', this._header).width(this._container.outerWidth() - 23);
         this._header.css({
            width: this._container.outerWidth() + 18,  //ширина выступающей части обводки
            height: this._container.outerHeight()
         });
         $('body').append(this._header);
      },

      _setWidth: function(){
         var self = this;
         this._picker.getContainer().css({
            'min-width': self._container.outerWidth() - this._border + 18 //ширина выступающей части обводки
         });
      },

      _setPickerContent: function(){
         var self = this;
         this._picker.subscribe('onClose', function(){
            self._closeHandler();
         });
         this._picker._container.addClass('controls-MenuButton__Menu');
      },

      _closeHandler: function(){
         this._container.removeClass('controls-Checked__checked');
         if (this._header) {
            this._header.addClass('controls-MenuButton__header-hidden');
         }
      }
   });

   return MenuButton;

});