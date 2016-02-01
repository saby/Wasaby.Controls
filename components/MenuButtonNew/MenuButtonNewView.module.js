/*global define, $, $ws*/
define('js!SBIS3.CONTROLS.MenuButtonNewView', [
      'js!SBIS3.CONTROLS.MenuLinkNewView'
   ],
   function(MenuLinkNewView) {

   'use strict';

   var View = MenuLinkNewView.extend( [], /** @lends SBIS3.CONTROLS.MenuButtonNewView.prototype */ {
      $protected: {
         _headerAlignment: {
            horizontal: 'left',
            vertical: 'top'
         }
      },

      init:function(){
         var rootNode = this._options.rootNode,
            self = this;
         $ws.helpers.trackElement(rootNode, true).subscribe('onMove', function () {
            if (self._header) {
               self._header.css({
                  left: (self._headerAlignment.horizontal === 'left') ? rootNode.offset().left : rootNode.offset().left - 16,
                  top: (self._headerAlignment.vertical === 'top') ? rootNode.offset().top + 2 : rootNode.offset().top - 7
               });
            }
         });
      },

      _createHeader: function(){
         var rootNode = this._options.rootNode;
         this._header = $('<span class="controls-MenuButton__header controls-MenuButton__header-hidden">\
                                  <i class="controls-MenuButton__headerLeft"></i>\
                                  <i class="controls-MenuButton__headerCenter"></i>\
                                  <i class="controls-MenuButton__headerRight"></i>\
                               </span>');
         $('.controls-MenuButton__headerCenter', this._header).width(rootNode.outerWidth() - 26);
         this._header.css({
            width: rootNode.outerWidth() + 18,  //ширина выступающей части обводки
            height: rootNode.outerHeight()
         });
         $('body').append(this._header);
      },
      /**
      * Выравнивает ширину у пикера и шапки, по основному контейнеру
      **/
      recalcWidth: function(){
         var self = this;
         var rootNode = this._options.rootNode;
         this._picker && this._picker.getContainer().css({
            'min-width': rootNode.outerWidth() - this._border + 20 //ширина выступающей части обводки
         });
         if (this._header) {
            $('.controls-MenuButton__headerCenter', this._header).width(rootNode.outerWidth() - 26);
         }
      },
      /**
      * Обработчик на закрытие меню
      */
      closeHandler: function(){
         this._options.rootNode.removeClass('controls-Checked__checked');
         if (this._header) {
            this._header.addClass('controls-MenuButton__header-hidden');
         }
      },
      /**
       * Обработчки на скрытие/показ пикера
       */
      tooglePickerHandler: function(){
         var rootNode = this._options.rootNode;
         if (!this._header) {
            this._createHeader();
         }
         rootNode.addClass('controls-Checked__checked');
         this._header.toggleClass('controls-MenuButton__header-hidden', !rootNode.hasClass('controls-Checked__checked'));
         this.setWidth();
         this._header.css({
            left: (this._headerAlignment.horizontal == 'left') ? rootNode.offset().left : rootNode.offset().left - 12,
            top: (this._headerAlignment.vertical == 'top') ? rootNode.offset().top + 2 : rootNode.offset().top - 7,
            'z-index': parseInt(this._picker._container.css('z-index'), 10) + 1
         });

      },
      /**
       * Изменяет внешний вид контрола, в зависимости от того есть элементы в меню или нет.
       * @param withData {Boolean} - есть ли данные в контроле
       */
      setViewWithData: function(withData){
         var rootNode = this._options.rootNode;
         if (withData) {
            $('.js-controls-MenuButton__arrowDown', rootNode).show();
            rootNode.removeClass('controls-MenuButton__withoutMenu');
         } else {
            $('.js-controls-MenuButton__arrowDown', rootNode).hide();
            rootNode.addClass('controls-MenuButton__withoutMenu');
            rootNode.removeClass('controls-Picker__show');
            $('.controls-MenuButton__header', rootNode).remove();
         }
      },
      /**
       * Меняет выравнивание контрола
       * @param alignment {Object}
       */
      changeAligment: function(alignment){
         var right = alignment.horizontalAlign.side === 'right',
            bottom = alignment.verticalAlign.side === 'bottom';
         this._header.toggleClass('controls-MenuButton__header-revert-horizontal', right).toggleClass('controls-MenuButton__header-revert-vertical', bottom);
         if (right) {
            this._header.css('left', this._container.offset().left - 12);
            this._headerAlignment.horizontal = 'right';
         } else {
            this._header.css('left', this._container.offset().left);
            this._headerAlignment.horizontal = 'left';
         }
         if (bottom) {
            this._header.css('top', this._container.offset().top - 7);
            this._headerAlignment.vertical = 'bottom';
         } else {
            this._header.css('top', this._container.offset().top + 2);
            this._headerAlignment.vertical = 'top';
         }
      },

      destroy: function(){
         View.superclass.destroy();
         if(this._header)
            this._header.remove();

      }

   });

   return View;

});