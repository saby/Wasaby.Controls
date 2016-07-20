
define('js!SBIS3.CONTROLS.Paging', ['js!SBIS3.CORE.CompoundControl', 'html!SBIS3.CONTROLS.Paging', 'js!SBIS3.CONTROLS.ItemsControlMixin', 'js!SBIS3.CONTROLS.Selectable', 'html!SBIS3.CONTROLS.Paging/resources/ItemsTemplate'], function(CompoundControl, dotTplFn, ItemsControlMixin, Selectable, ItemsTemplate) {

   'use strict';

   /**
    * @class SBIS3.CONTROLS.Paging
    * @extends $ws.proto.CompoundControl
    * @control
    * @category Decorate
    * @public
    * @author Крайнов Дмитрий Олегович
    */

   var getRecordForRedraw = function(projection) {
      var
         records = [];
      if (projection) {     //У таблицы могут позвать перерисовку, когда данных еще нет
         projection.each(function (item) {
            records.push(item);
         });
      }
      return records;
   };

   var Pager = CompoundControl.extend([ItemsControlMixin, Selectable],/** @lends SBIS3.CONTROLS.Paging.prototype */{
      /**
       * @event onPageChange При изменении страницы
       * <wiTag group="Управление">
       * Происходит при смене текущей страницы: при клике по номеру страницы или стрелке перехода на другую страницу.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {Number} number номер новой страницы
       * Необходимо вызвать функцию на успех с аргументом типа Boolean: есть ли следующая страница.
       * @example
       */
      $protected: {
         _dotTplFn: dotTplFn,
         _options: {
            _canServerRender: true,
            _getRecordsForRedraw : getRecordForRedraw
         }
      },
      $constructor: function(){
         this._publish('onPageChange');
      },
      _modifyOptions: function(cfg) {
         var newCfg = Pager.superclass._modifyOptions.apply(this, arguments);
         newCfg._itemsTemplate = ItemsTemplate;

         return newCfg
      },
      init: function(){

         Pager.superclass.init.call(this);
      },

      _onClickHandler: function(e) {
         var $target = $(e.target),
            target = $target.closest('.controls-Paging__item'),
            hash, proj, item;

         if (target.length) {
            hash = target.data('hash');
            proj = this._getItemsProjection();
            if (proj) {
               item = proj.getByHash(hash);
               this.setSelectedKey(item.getContents().getId());
            }
         }
      },

      _drawSelectedItem: function(id) {
         var selId = id;
         $(".controls-Paging__item", this._container).removeClass('controls-ListView__item__selected');
         $('.controls-Paging__item[data-id="' + selId + '"]', this._container).addClass('controls-ListView__item__selected');
      }

   });

   return Pager;

});
