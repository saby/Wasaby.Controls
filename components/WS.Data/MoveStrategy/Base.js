/* global define  */
define('js!WS.Data/MoveStrategy/Base', [
   'js!WS.Data/MoveStrategy/IMoveStrategy',
   'js!WS.Data/Collection/RecordSet',
   'js!WS.Data/Di',
   'js!WS.Data/Utils',
   'Core/helpers/collection-helpers',
   'Core/ParallelDeferred',
   'Core/Abstract'
], function (
   IMoveStrategy,
   RecordSet,
   Di,
   Utils,
   CollectionHelpers,
   ParallelDeferred,
   Abstract
) {
   'use strict';
   /**
    * Базовый класс стратегий перемещения для списочного контрола {@link SBIS3.CONTROLS.ListView} и его наследники.
    * @class WS.Data/MoveStrategy/Base
    * @implements WS.Data/MoveStrategy/IMoveStrategy
    * @see SBIS3.CONTROLS.ListView#moveStrategy
    * @deprecated
    * @example
    * <pre>
    *    define('js!SBIS3.DEMO.MyMoveStrategy', ['js!WS.Data/MoveStrategy/Base','js!WS.Data/Di', 'Transport/RPCJSON'], function (Base, Di, RpcJson) {
    *       var MyMoveStrategy = Base.extend({
    *          _callReoderMove: function (movedItems, target, after) {
    *             //Перемещение по порядку, стрелочки вверх/вниз или drag'n'drop
    *             //вместо ВставитьДо/ВставитьПосле  вызываем свой метод
    *             var provider = new RpcJson();
    *             return provider.callMethod('DEMO.move', {
    *                movedItems: movedItems,
    *                target: target,
    *                after: after
    *             })
    *          },
    *
    *          _callHierarchyMove: function(movedItems) {
    *             //Вместо update вызываем свой метод
    *             var provider = new RpcJson();
    *             return provider.callMethod('DEMO.move', {
    *                movedItems: movedItems
    *             })
    *          }
    *       })
    *       Di.register('demo.mymovestrategy', MyMoveStrategy);
    *       return MyMoveStrategy
    *    })
    * </pre>
    * В конфиг компонента передадим стратегию
    * <pre>
    *    <component data-component="SBIS3.CONTROLS.ListView" name="listView">
    *       <option name="moveStrategy">demo.mymovestrategy</option>
    *    </component>
    * </pre>
    * @public
    * @author Ганшин Ярослав
    */

   var Base = Abstract.extend([IMoveStrategy],/** @lends WS.Data/MoveStrategy/Base.prototype */{
      _moduleName: 'WS.Data/MoveStrategy/Base',
      $protected: {
         _options:{
            /**
             * @cfg {String} Имя поля, по которому строится иерархия.
             * @see hierarhyMove
             */
            hierField: undefined,

            /**
             * @cfg {WS.Data/Source/SbisService} Источник данных.
             */
            dataSource: null,
            /**
             * @cfg {SBIS3.CONTROLS.ListView} Списочный контрол listView либо его наследник.
             */
            listView: null,
            /**
             * @cfg {WS.Data/Collection/IList} Список в котором надо перемещать элементы.
             */
            items: null,
            /**
             * @cfg {WS.Data/Collection/IList} Инвертирует вызов методов перемещния по порядку.
             */
            invertOrder: false
         },

         _orderProvider: undefined
      },

      move: function (movedItems, target, after) {
         return this._callReoderMove(movedItems, target, after).addCallback(function(){
            this._moveInItems(movedItems, target, after);
         }.bind(this));
      },
      /**
       * Вызвает метод смены порядка на источнике данных
       * @param {Array} movedItems Массив перемещаемых записей.
       * @param {WS.Data/Entity/Model} target Запись к которой надо преместить.
       * @param {Boolean} after Если true - вставить после целевой записи, если false, то перед ней.
       * @return {Core/Deferred}
       */
      _callReoderMove: function(movedItems, target, after) {
         var def = new ParallelDeferred();
         CollectionHelpers.forEach(movedItems, function(record) {
            def.push(this._getDataSource().move(
               record.getId(),
               target.getId(), {
                  before: this._options.invertOrder ? after : !after,
                  hierField: this._options.hierField
               }
            ));
         }.bind(this));
         return def.done().getResult();
      },

      hierarhyMove: function(movedItems, target) {
         if (!this._options.hierField) {
            throw new Error('Hierrarhy Field is not defined.');
         }

         var newParent = target ? target.getId() : null,
            hierField = this._options.hierField,
            updateItems = [],
            oldValues = [];


         CollectionHelpers.forEach(movedItems, function(item){
            var clone = item.clone();
            oldValues.push(clone.get(hierField));
            clone.set(hierField, newParent);
            updateItems.push(clone);
         });
         if (movedItems.length > 1) {
            var rs = new RecordSet({
               adapter: movedItems[0].getAdapter()
            });
            rs.append(updateItems);
            updateItems = rs;
         } else {
            updateItems = updateItems[0];
         }
         var items = this._getItems();
         return this._callHierarchyMove(updateItems).addCallback(function(e){
            CollectionHelpers.forEach(movedItems, function(item) {
               item.set(hierField, newParent);
               if (items && items.getIndex(item) == -1){
                  items.add(item);
               }

            });
            return e;
         });
      },

      hierarchyMove: function (movedItems, target) {
         //todo все равно это надо убрать, так что зачем лишний раз людей напрягать с переименованием метода
         return this.hierarhyMove(movedItems, target);
      },
      /**
       * Вызвает метод перемещения в папку на источнике данных.
       * @param {Array} updateItems Массив клонов перемещаемых записей с измененным полем иерархии.
       * @return {Core/Deferred}
       */
      _callHierarchyMove: function(movedItems) {
         return this._getDataSource().update(movedItems);
      },
      /**
       *
       * @return {*}
       * @private
       */
      _getDataSource: function() {
         var ds;
         if (this._options.dataSource) {
            ds = this._options.dataSource;
         } else if (this._options.listView) {
            ds = this._options.listView.getDataSource();
         }
         if (ds) {//подстраиваем старые параметры по умолчанию на источнике данных
            if (!ds._$binding.moveBefore) {
               ds._$binding.moveBefore = 'ВставитьДо';
               ds._$binding.moveAfter = 'ВставитьПосле';
               if (ds._$endpoint.moveContract == 'IndexNumber') {
                  ds._$endpoint.moveContract = 'ПорядковыйНомер';
               }
            }
         }
         return ds;
      },
      /**
       *
       * @return {*}
       * @private
       */
      _getItems: function() {
         if (this._options.listView) {
            return this._options.listView.getItems();
         }
         return this._options.items;
      },
      /**
       * Перемещает записи в коллекции, связанного контрола, при перемещении по порядку.
       * @param movedItems
       * @param target
       * @param after
       */
      _moveInItems: function(movedItems, target, after) {
         var items = this._getItems();
         if (items) {
            CollectionHelpers.forEach(movedItems, function (movedItem) {
               var movedItemIndex = items.getIndex(target);
               if (this._options.hierField) {
                  //если перемещение было по порядку и иерархии одновременно, то надо обновить hierField
                  movedItem.set(this._options.hierField, target.get(this._options.hierField));
               }

               if (after) {
                  movedItemIndex = (movedItemIndex + 1) < items.getCount() ? ++movedItemIndex : items.getCount();
               } else {
                  movedItemIndex = (movedItemIndex - 1) > -1 ? movedItemIndex : 0;
               }
               var itemsIndex = items.getIndex(movedItem);
               if (itemsIndex !== -1 && itemsIndex < movedItemIndex && movedItemIndex > 0) {
                  movedItemIndex--; //если запись по списку сдвигается вниз то после ее удаления индексы сдвинутся
               }
               items.setEventRaising(false, true);
               items.remove(movedItem);
               items.add(
                  movedItem,
                  movedItemIndex < items.getCount() ? movedItemIndex : undefined
               );
               items.setEventRaising(true, true);
            }.bind(this));
         }
      }
   });

   Di.register('movestrategy.base', Base);

   return Base;
});
