
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

   var getRecordForRedraw = function(projection, cfg) {
      var
         selId, firstElem, lastElem,
         dot1 = false,
         dot2 = false,
         count = projection.getCount(),
         records = [];
      if (projection) {     //У таблицы могут позвать перерисовку, когда данных еще нет
         selId = parseInt(cfg.selectedKey, 10) || 1;  //TODO || 1 - не очень хорошо, это должно уже из Selectable приходить
         firstElem = selId - 1;
         lastElem = selId + 1;

         if (firstElem < 1) {
            firstElem = selId;
            lastElem = selId + 2 > count ? count : selId + 2;
         }
         if (lastElem > count) {
            firstElem = count - 2 < 0 ? 0 : count - 2;
            lastElem = count;
         }

         if (cfg.mode == 'full') {
            if (firstElem - 1 > 1) {
               dot1 = true;
            }
            if (lastElem + 1 < count) {
               dot2 = true;
            }
         }

         var counter = 1;
         projection.each(function (item) {
            var curId = parseInt(item.getContents().getId(), 10);
            if (cfg.mode == 'part') {
               if (curId >= firstElem && curId <= lastElem) {
                  records.push(item);
               }
            }
            else if (cfg.mode == 'full') {
               if (counter == 1 || counter == count) {
                  records.push(item);
               }
               else {
                  if (dot1 && counter == 2) {
                     records.push('...');
                  }
                  if (dot2 && counter == count - 1) {
                     records.push('...');
                  }
                  if (curId >= firstElem && curId <= lastElem) {
                     records.push(item);
                  }
               }
            }
            counter++;
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
            _getRecordsForRedraw : getRecordForRedraw,
            allowEmptySelection: false,
            mode: 'part',
            pagesCount: null
         }
      },
      $constructor: function(){
         this._publish('onPageChange');
      },
      _modifyOptions: function(cfg) {
         if (cfg.pagesCount && !cfg.items) {
            cfg.items = [];
            cfg.keyField = 'id';
            cfg.displayField = 'text';
            for (var i = 1; i <= cfg.pagesCount; i++) {
               cfg.items.push({
                  id : i,
                  text : i.toString()
               })
            }
         }
         var newCfg = Pager.superclass._modifyOptions.apply(this, arguments);
         newCfg._itemsTemplate = ItemsTemplate;

         return newCfg
      },
      init: function(){

         Pager.superclass.init.call(this);
      },

      _onClickHandler: function(e) {
         var $target = $(e.target),
            target = $target.closest('.js-controls-ListView__item'),
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
      },

      setSelectedKey: function() {
         Pager.superclass.setSelectedKey.apply(this, arguments);
         this.redraw();
      },

      _getItemsContainer: function() {
         return $('.controls-Paging__itemsContainer', this._container.get(0));
      }

   });

   return Pager;

});
