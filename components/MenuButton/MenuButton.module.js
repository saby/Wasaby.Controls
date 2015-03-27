define('js!SBIS3.CONTROLS.MenuButton', ['js!SBIS3.CONTROLS.Button', 'js!SBIS3.CONTROLS.ContextMenu', 'js!SBIS3.CONTROLS.PickerMixin', 'js!SBIS3.CONTROLS.CollectionMixin', 'js!SBIS3.CONTROLS.MenuButtonMixin', 'html!SBIS3.CONTROLS.MenuButton'], function(Button, ContextMenu, PickerMixin, CollectionMixin, MenuButtonMixin, dotTplFn) {

   'use strict';

   /**
    * Кнопка с выпадающим меню
    * @class SBIS3.CONTROLS.MenuButton
    * @extends SBIS3.CONTROLS.Button
	* @demo SBIS3.Demo.Control.MyMenuButton
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
    * @ignoreOptions independentContext contextRestriction extendedTooltip validators
    * @ignoreOptions element linkedContext handlers parent autoHeight autoWidth horizontalAlignment
    * @ignoreOptions isContainerInsideParent owner stateKey subcontrol verticalAlignment
    */

   var MenuButton = Button.extend( [PickerMixin, CollectionMixin, MenuButtonMixin], /** @lends SBIS3.CONTROLS.MenuButton.prototype */ {
      _dotTplFn: dotTplFn,
      $protected: {
         _header: null,
         _options: {
         }
      },

      init: function(){
         MenuButton.superclass.init.call(this);
         this._initMenu();
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
             this._header = $('<span class="controls-MenuButton__header controls-MenuButton__header-hidden">\
                                  <i class="controls-MenuButton__headerLeft"></i>\
                                  <i class="controls-MenuButton__headerCenter"></i>\
                                  <i class="controls-MenuButton__headerRight"></i>\
                               </span>');
             $('.controls-MenuButton__headerCenter', this._header).width(this._container.width() + 12);
             this._header.css({
                width: this._container.outerWidth() + 18,  //ширина выступающей части обводки
                height: this._container.outerHeight()
             });
             $('body').append(this._header);
          }
         MenuButton.superclass.togglePicker.call(this);
         $('.controls-MenuButton__headerCenter', this._container).width(this._container.width() + 12);
         this._header.css({
            left: this._container.offset().left,
            top: this._container.offset().top + 1,
            'z-index': parseInt(this._picker._container.css('z-index'),10) + 1
         });
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
         this._header.addClass('controls-MenuButton__header-hidden');
      }
   });

   return MenuButton;

});