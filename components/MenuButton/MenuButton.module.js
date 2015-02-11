define('js!SBIS3.CONTROLS.MenuButton', ['js!SBIS3.CONTROLS.Button', 'js!SBIS3.CONTROLS.ContextMenu', 'js!SBIS3.CONTROLS.PickerMixin', 'js!SBIS3.CONTROLS.CollectionMixin', 'js!SBIS3.CONTROLS.MenuButtonMixin', 'html!SBIS3.CONTROLS.MenuButton'], function(Button, ContextMenu, PickerMixin, CollectionMixin, MenuButtonMixin, dotTplFn) {

   'use strict';

   /**
    * Кнопка с выпадающим меню
    * @class SBIS3.CONTROLS.MenuButton
    * @extends SBIS3.CONTROLS.ToggleButton
    * @mixes SBIS3.CONTROLS.PickerMixin
    * @mixes SBIS3.CONTROLS.CollectionMixin
    */

   var MenuButton = Button.extend( [PickerMixin, CollectionMixin, MenuButtonMixin], /** @lends SBIS3.CONTROLS.MenuButton.prototype */ {
      _dotTplFn: dotTplFn,
      $protected: {
         _options: {
         }
      },

      init: function(){
         MenuButton.superclass.init.call(this);
         this._initMenu();
      },

      _activatedHandler: function () {
         if (this.getItems().getItemsCount() > 1) {
            this._container.addClass('controls-Checked__checked');
            $('.controls-MenuButton__header', this._container).toggleClass('controls-MenuButton__header-hidden', !this._container.hasClass('controls-Checked__checked'));
            this.togglePicker();
         } else {
            if (this.getItems().getItemsCount() == 1) {
               var id = this.getItems().getKey(this.getItems().getNextItem());
               this._notify('onMenuItemActivate', id);
            }
         }
      },

      _initMenu: function(){
         var self = this;
         this.subscribe('onActivated', this._activatedHandler);

         if (this.getItems().getItemsCount() > 1) {
            $('.js-controls-MenuButton__arrowDown', self._container).show();
            this._container.removeClass('controls-MenuButton__withoutMenu');
         } else {
            $('.js-controls-MenuButton__arrowDown', self._container).hide();
            this._container.addClass('controls-MenuButton__withoutMenu');
         }

         var header = $('<span class="controls-MenuButton__header controls-MenuButton__header-hidden">\
                            <i class="controls-MenuButton__headerLeft"></i>\
                            <i class="controls-MenuButton__headerCenter"></i>\
                            <i class="controls-MenuButton__headerRight"></i>\
                         </span>');
         $('.controls-MenuButton__headerCenter', header).width(this._container.width() + 4);
         this.getContainer().append(header);
         $('.controls-MenuButton__header', this._container.get(0)).css({
            width: this._container.outerWidth(),
            height: this._container.outerHeight()
         });
      },

      togglePicker: function(){
         MenuButton.superclass.togglePicker.call(this);
         $('.controls-MenuButton__Menu-whiteLine', this._picker.container).width(this._container.outerWidth() + 8);
      },

      _setWidth: function(){
         var self = this;
         this._picker.getContainer().css({
            'min-width': self._container.outerWidth() - this._border + 15
         });
      },

      _setPickerContent: function(){
         var self = this;
         this._picker.subscribe('onClose', function(){
            self._closeHandler();
         });
         this._picker._container.addClass('controls-MenuButton__Menu');
         var whiteLine = $('<span class="controls-MenuButton__Menu-whiteLine" style="height: 1px; background: #ffffff; position: absolute; top: -1px;"></span>')
            .width(this._container.outerWidth() + 8);
         this._picker.getContainer().append(whiteLine);
      },

      _closeHandler: function(){
         this._container.removeClass('controls-Checked__checked');
         $('.controls-MenuButton__header', self._container).addClass('controls-MenuButton__header-hidden');
      }
   });

   return MenuButton;

});