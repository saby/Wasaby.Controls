define('js!SBIS3.CONTROLS.MenuLink', ['js!SBIS3.CONTROLS.ButtonBase', 'js!SBIS3.CONTROLS.CollectionMixin', 'js!SBIS3.CONTROLS.PickerMixin', 'js!SBIS3.CONTROLS.ContextMenu', 'html!SBIS3.CONTROLS.MenuLink'], function(ButtonBase, CollectionMixin, PickerMixin, ContextMenu, dotTplFn) {

   'use strict';

   /**
    * Контрол, отображающий кнопку в виде ссылки и выпадающее из нее меню
    * @class SBIS3.Engine.MenuLink
    * @extends SBIS3.CONTROLS.ButtonBase
    * @control
    * @mixes SBIS3.CONTROLS.CollectionMixin
    * @mixes SBIS3.CONTROLS.PickerMixin
    */

   var MenuLink = ButtonBase.extend( [PickerMixin, CollectionMixin], /** @lends SBIS3.Engine.Link.prototype */ {
      _dotTplFn: dotTplFn,
      $protected: {
         _zIndex: '',
         _options: {
         }
      },

      $constructor: function() {
         var self = this;
         if (this.getItems().getItemsCount() > 1) {
            this.subscribe('onActivated', function () {
               this._container.addClass('controls-Checked__checked');
               self.togglePicker();
            });
         } else {
            if (this.getItems().getNextItem()['handler']) {
               this.subscribe('onActivated', function () {
                  this.getItems().getNextItem()['handler']();
               });
            }
         }
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
         MenuLink.superclass.showPicker.call(this);
         this._container.css('z-index', this._picker._container.css('z-index') + 1);
      },

      hidePicker: function(){
         MenuLink.superclass.hidePicker.call(this);
         this._container.css('z-index', this._zIndex);
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
         this._picker._container.addClass('controls-MenuLink__Menu');
         var header= $('<div class="controls-MenuLink__header"></div>');
         header.append(this._container.clone());
         this._picker.getContainer().prepend(header);
         $('.controls-MenuLink__header', this._picker._container).bind('click', function(){
            self.hidePicker();
         });
      },

      _closeHandler: function(){
         this._container.removeClass('controls-Checked__checked');
      }

   });

   return MenuLink;

});