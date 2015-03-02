define('js!SBIS3.CONTROLS.MenuButton', ['js!SBIS3.CONTROLS.Button', 'js!SBIS3.CONTROLS.ContextMenu', 'js!SBIS3.CONTROLS.PickerMixin', 'js!SBIS3.CONTROLS.CollectionMixin', 'js!SBIS3.CONTROLS.MenuButtonMixin', 'html!SBIS3.CONTROLS.MenuButton'], function(Button, ContextMenu, PickerMixin, CollectionMixin, MenuButtonMixin, dotTplFn) {

   'use strict';

   /**
    * Кнопка с выпадающим меню
    * @class SBIS3.CONTROLS.MenuButton
    * @extends SBIS3.CONTROLS.Button
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
    */

   var MenuButton = Button.extend( [PickerMixin, CollectionMixin, MenuButtonMixin], /** @lends SBIS3.CONTROLS.MenuButton.prototype */ {
      _dotTplFn: dotTplFn,
      $protected: {
         _hasHeader: false,
         _options: {
         }
      },

      init: function(){
         var self = this;
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
         this.unsubscribe('onActivated', this._activatedHandler);
         this.subscribe('onActivated', this._activatedHandler);

         if (this.getItems().getItemsCount() > 1) {
            var arrow = $('.js-controls-MenuButton__arrowDown', this._container);
            if (!arrow.length){
               this._container.append('<i class="controls-MenuButton__arrowDown js-controls-MenuButton__arrowDown"></i>');
            } else {
               arrow.show();
            }
            this._container.removeClass('controls-MenuButton__withoutMenu');
            if (!this._hasHeader) {
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
               this._hasHeader = true;
            }
         } else {
            $('.js-controls-MenuButton__arrowDown', this._container).remove();
            this._container.addClass('controls-MenuButton__withoutMenu');
            this._container.removeClass('controls-Picker__show');
            $('.controls-MenuButton__header', this._container).remove();
            this._hasHeader = false;
         }
      },
       /**
        * Скрывает/показывает меню у кнопки
        */
      togglePicker: function(){
         MenuButton.superclass.togglePicker.call(this);
         $('.controls-MenuButton__Menu-grayLine', this._picker._container).width(this._picker._container.outerWidth() - this._container.outerWidth() - 14); /*ширина части спрайта выезжающего за кнопку */
         $('.controls-MenuButton__headerCenter', this._container).width(this._container.width() + 11);
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
         var grayLine = $('<span class="controls-MenuButton__Menu-grayLine" style="height: 1px; background: #cccccc; position: absolute; top: -1px; right: -1px;"></span>');
         this._picker.getContainer().append(grayLine);
         this._picker.subscribe('onDrawItems', function(){
            $('.controls-MenuButton__Menu-grayLine', self._picker._container).width(self._picker._container.outerWidth() - self._container.outerWidth() - 14); /*ширина части спрайта выезжающего за кнопку */
         });
      },

      _closeHandler: function(){
         this._container.removeClass('controls-Checked__checked');
         $('.controls-MenuButton__header', this._container).addClass('controls-MenuButton__header-hidden');
      }
   });

   return MenuButton;

});