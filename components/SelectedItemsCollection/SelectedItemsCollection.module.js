/**
 * Created by am.gerasimov on 06.10.2015.
 */
define('js!SBIS3.CONTROLS.SelectedItemsCollection', [
      'tmpl!SBIS3.CONTROLS.SelectedItemsCollection/itemTpl'
   ],
   function(itemTpl) {

      'use strict';

      /**
       * Контрол, отображающий набор выбранных элементов с крестиком удаления.
       * @class SBIS3.CONTROLS.SelectedItemsCollection
       * @extends SBIS3.CORE.CompoundControl
       */

      var SelectedItemsCollection =  {
         $protected: {
            _options: {
               /**
                * Шаблон отображения элемента
                */
               itemTemplate: '',
               /**
                * Флаг, обозначающий, что крестик удаления элемента коллекции будет отображаться у каждого элемента
                */
               crossPerItem: true,
               /**
                * Отображаемое поле для записи
                */
               displayField: 'title'
            },
            _dataSource: undefined,
            _itemTpl: undefined
         },

         $constructor: function() {
            if(!$ws.helpers.instanceOfMixin(this, 'SBIS3.CONTROLS.MultiSelectable')) {
               throw new Error('MultiSelectable mixin is required');
            }

            /* Поддерживаем шаблоны в следующем виде:
             1) Передали строку - имя шаблона, загружаем его через requirejs
             2) Шаблон передали строкой, сделаем из него функцию шаблона
             */
            this._itemTpl = this._options.itemTemplate ?
               requirejs.defined(this._options.itemTemplate) ?
                  requirejs(this._options.itemTemplate) :
                  tmpl.template(this._options.itemTemplate) :
               undefined;
         },

         _drawSelectedItems: function(keys) {
            if(!this._dataSource) {
               return;
            }

            var self = this,
                len = keys.length,
                result =  new $ws.proto.Deferred(),
                items, dMultiResult, content;

            /* Очистим отрисованные элементы */
            this.clearItems();

            /* Если выбранные ключи переданы, то надо запросить записи с бл */
            if(len) {
               content = [];

               /* Так как бл не умеет отдавать записи по набору ключей, то делаю так */
               if(len > 1) {
                  dMultiResult = new $ws.proto.ParallelDeferred({stopOnFirstError: false});
                  items = [];

                  for(var i = 0; i < len; i++) {
                     dMultiResult.push(self._dataSource.read(keys[i]).addCallback(function(item) {
                        items.push(item);
                     }));
                  }

                  dMultiResult.done().getResult().addCallback(function() {
                     result.callback(items);
                  });
               } else {
                  /* Если ключ передали один, то просто попросим запись */
                  self._dataSource.read(keys[0]).addCallback(function(item) {
                     result.callback([item]);
                  });
               }

               result.addCallback(function(items) {
                  $ws.helpers.forEach(items, function(item) {
                     self._getItemsContainer()[0].innerHTML += self._drawItem(item);
                  });
                  self._drawItemsCallback();
               });
            } else {
               self._drawItemsCallback();
            }
         },
         /**
          * Отрисовывает элемент коллекции
          * @param item
          * @private
          */
         _drawItem: function(item) {
            return itemTpl(this._getTplOptions(item));
         },

         redraw: function() {
            this._drawSelectedItems(this._options.selectedKeys);
         },

         clearItems: function() {
            this._getItemsContainer()[0].innerHTML = '';
         },

         _getTplOptions: function(item) {
            return {
               item: item,
               displayField: this._options.displayField,
               crossPerItem: this._options.crossPerItem,
               template: this._itemTpl
            }
         },

         _drawItemsCallback: function() {
            throw new Error('Method _drawItemsCallback() must be implemented');
         },

         _getItemsContainer: function() {
            throw new Error('Method _getItemsContainer() must be implemented');
         },

         setDataSource: function(ds) {
            this._dataSource = ds;
         },

         crossClickHandler: function(e) {
            var $target = $(e.target),
                itemContainer;

            if ($target.hasClass('controls-SimpleItemsCollection__cross')) {
               itemContainer = $(e.target).closest('.controls-SimpleItemsCollection__item');

               if (itemContainer.length) {
                  this.removeItemsSelection([itemContainer.data('id')])
               }
            }
         },

         after: {
            _initComplete: function() {
               this._getItemsContainer().mouseup(this.crossClickHandler.bind(this));
            }
         }
      };

      return SelectedItemsCollection;

   });
