define('js!SBIS3.CONTROLS.MenuLink', ['js!SBIS3.CONTROLS.Link', 'html!SBIS3.CONTROLS.MenuLink', 'js!SBIS3.CONTROLS.CollectionMixin', 'js!SBIS3.CONTROLS.PickerMixin', 'js!SBIS3.CONTROLS.MenuButtonMixin', 'js!SBIS3.CONTROLS.ContextMenu'], function(Link, dotTplFn, CollectionMixin, PickerMixin, MenuButtonMixin, ContextMenu) {

   'use strict';

   /**
    * Контрол, отображающий кнопку в виде ссылки и выпадающее из нее меню
    * @class SBIS3.Engine.MenuLink
    * @extends SBIS3.CONTROLS.ButtonBase
    * @control
    * @mixes SBIS3.CONTROLS.CollectionMixin
    * @mixes SBIS3.CONTROLS.PickerMixin
    */

   var MenuLink = Link.extend( [PickerMixin, CollectionMixin, MenuButtonMixin], /** @lends SBIS3.Engine.Link.prototype */ {
      _dotTplFn: dotTplFn,
      $protected: {
         _zIndex: '',
         _options: {
         }
      },

      $constructor: function() {
         this._initMenu();
      },


      setCaption: function(caption){
         Link.superclass.setCaption.call(this, caption);
         $('.controls-Link__field', this._container).html(caption);
      },

      _initMenu: function(){
         this.unsubscribe('onActivated', this._activatedHandler);
         this.subscribe('onActivated', this._activatedHandler);
         if (this.getItems().getItemsCount() > 1) {
            $('.js-controls-MenuLink__arrowDown', this._container).show();
            this._container.removeClass('controls-MenuLink__withoutMenu');
         } else {
            $('.js-controls-MenuLink__arrowDown', this._container).hide();
            this._container.addClass('controls-MenuLink__withoutMenu');
         }
      },

      _activatedHandler: function(){
         if (this.getItems().getItemsCount() > 1) {
            this._container.addClass('controls-Checked__checked');
            this.togglePicker();
         } else {
            if (this.getItems().getItemsCount() == 1) {
               if (this.getItems().getNextItem().handler instanceof Function) {
                  this.getItems().getNextItem().handler();
               }
            }
         }
      },

      _setPickerContent: function(){
         var self = this;
         this._picker._container.addClass('controls-MenuLink__Menu');
         var header= $('<div class="controls-MenuLink__header"></div>');
         header.append(this._container.clone());
         this._picker.getContainer().prepend(header);
         $(".controls-Link__icon", header.get(0)).addClass('icon-hover');
         $('.controls-MenuLink__header', this._picker._container).bind('click', function(){
            self.hidePicker();
         });
      }
   });

   return MenuLink;

});