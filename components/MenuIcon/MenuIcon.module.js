define('js!SBIS3.CONTROLS.MenuIcon', ['js!SBIS3.CONTROLS.IconButton', 'js!SBIS3.CONTROLS.ContextMenu', 'js!SBIS3.CONTROLS.PickerMixin', 'js!SBIS3.CONTROLS.CollectionMixin', 'js!SBIS3.CONTROLS.MenuButtonMixin', 'html!SBIS3.CONTROLS.IconButton'], function(IconButton, ContextMenu, PickerMixin, CollectionMixin, MenuButtonMixin, dotTplFn) {

   'use strict';

   /**
    * Кнопка с выпадающим меню
    * @class SBIS3.CONTROLS.MenuButton
    * @extends SBIS3.CONTROLS.ToggleButton
    * @mixes SBIS3.CONTROLS.PickerMixin
    * @mixes SBIS3.CONTROLS.CollectionMixin
    */

   var MenuIcon = IconButton.extend( [PickerMixin, CollectionMixin, MenuButtonMixin], /** @lends SBIS3.CONTROLS.MenuIcon.prototype */ {
      _dotTplFn: dotTplFn,
      $protected: {
         _options: {
         }
      },

      init: function(){
         MenuIcon.superclass.init.call(this);
         this._container.addClass('controls-MenuIcon');
         this._initMenu();
      },

      _activatedHandler: function () {
         if (this.getItems().getItemsCount() > 1) {
            $('.controls-MenuIcon__header', this._container).toggleClass('controls-MenuIcon__header-hidden', this._container.hasClass('controls-Picker__show'));
            this.togglePicker();
         } else {
            if (this.getItems().getItemsCount() == 1) {
               if (this.getItems().getNextItem().handler instanceof Function)
                  this.getItems().getNextItem().handler();
            }
         }
      },

      _initMenu: function(){
         var self = this;
         this.subscribe('onActivated', this._activatedHandler);
         var header = $('<span class="controls-MenuIcon__header controls-MenuIcon__header-hidden">\
                            <i class="controls-MenuIcon__headerLeft"></i>\
                            <i class="controls-MenuIcon__headerRight"></i>\
                         </span>');
         this.getContainer().append(header);
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