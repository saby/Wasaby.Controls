/**
 * Модуль 'Компонент кнопка'.
 *
 * @description
 */
define('js!SBIS3.CONTROLS.MenuButton', ['js!SBIS3.CONTROLS.Button', 'js!SBIS3.CONTROLS.ContextMenu', 'js!SBIS3.CONTROLS.PickerMixin', 'js!SBIS3.CONTROLS.CollectionMixin', 'html!SBIS3.CONTROLS.MenuButton'], function(Button, ContextMenu, PickerMixin, CollectionMixin, dotTplFn) {

   'use strict';

   /**
    * Кнопка с выпадающим меню
    * @class SBIS3.CONTROLS.MenuButton
    * @extends SBIS3.CONTROLS.ToggleButton
    * @mixes SBIS3.CONTROLS.PickerMixin
    * @mixes SBIS3.CONTROLS.CollectionMixin
    */

   var MenuButton = Button.extend( [PickerMixin, CollectionMixin], /** @lends SBIS3.CONTROLS.MenuButton.prototype */ {
      _dotTplFn: dotTplFn,
      $protected: {
         _zIndex: '',
         _options: {
            primary: true
         }
      },

      $constructor: function() {
         var self = this;
         if (this.getItems().getItemsCount() > 1) {
            this.subscribe('onActivated', function () {
               this._container.addClass('controls-Checked__checked');
               self.togglePicker();
            })
         } else {
            $('.js-controls-MenuButton__arrowDown', this._container).hide();
            if (this.getItems().getNextItem()['handler']) {
               this.subscribe('onActivated', function () {
                  this.getItems().getNextItem()['handler']();
               })
            }
         }
      },

      init: function(){
         MenuButton.superclass.init.call(this);
         $('.controls-MenuButton__header', this._container.get(0)).css({
            width: this._container.outerWidth(),
            height: this._container.outerHeight(),
            'z-index': (this._container.css('z-index') - 1) || -1
         });
         this._zIndex = this._container.css('z-index') || 'auto';
         $('.controls-MenuButton__headerCenter', this._container.get(0)).width(this._container.width());
      },

      _createPicker: function(){
         return new ContextMenu(this._setPickerConfig());
      },

      _setPickerConfig: function(){
         return {
            parent: this.getParent(),
            context: this.getParent() ? this.getParent().getLinkedContext() : {},
            element: $('<div></div>'),
            target : this.getContainer(),
            items: this._options.items,
            corner : 'bl',
            hierField: 'par',
            verticalAlign: {
               side: 'top'
            },
            horizontalAlign: {
               side: 'left'
            },
            closeByExternalClick: true,
            targetPart: true
         };
      },

      showPicker: function(){
         MenuButton.superclass.showPicker.call(this);
         this._container.css('z-index', this._picker._container.css('z-index') + 1);
      },

      hidePicker: function(){
         MenuButton.superclass.hidePicker.call(this);
         this._container.css('z-index', this._zIndex);
      },

      _setWidth: function(){
         var self = this;
         this._picker.getContainer().css({
            'min-width': self._container.outerWidth() - this._border + 15/*ширина бордеров*/
         });
      },

      _setPickerContent: function(){
         var self = this;
         this._picker.subscribe('onClose', function(){
            self._closeHandler();
         });
         this._picker._container.addClass('controls-MenuButton__Menu');
         var header = $('<span class="controls-MenuButton__header">\
                            <i class="controls-MenuButton__headerLeft"></i>\
                            <i class="controls-MenuButton__headerCenter"></i>\
                            <i class="controls-MenuButton__headerRight"></i>\
                         </span>');
         $('.controls-MenuButton__headerCenter', header).width(this._container.width());
         this._picker.getContainer().prepend(header);
      },

      _closeHandler: function(){
         this._container.removeClass('controls-Checked__checked');
      }

   });

   return MenuButton;

});