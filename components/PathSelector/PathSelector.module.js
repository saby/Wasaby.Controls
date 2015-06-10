define('js!SBIS3.CONTROLS.PathSelector', [
   'js!SBIS3.CORE.CompoundControl',
   'js!SBIS3.CONTROLS.DSMixin',
   'html!SBIS3.CONTROLS.PathSelector',
   'html!SBIS3.CONTROLS.PathSelector/resources/pointTpl',
], function (CompoundControl, DSMixin, dotTpl, pointTpl) {
   'use strict';

   var PathSelector = CompoundControl.extend([DSMixin], {
      $protected: {
         _dotTplFn: dotTpl,
         _options: {
            linkedView: null,
            keyField: 'id'
         }
      },

      $constructor: function () {
         var self = this;
         if (this._options.linkedView){
            this._options.linkedView.subscribe('onSetRoot', function(event, dataSet, id){
               self._rootChangeHandler(dataSet, id);
            }, this);
         }

         this._container.bind('mousedown', function(e){
            var target = $(e.target),
            point = target.closest('.controls-PathSelector__point');
            if (point.length) {
               self._onPointClick(point.data('parentId'));
            }
         });

         //инициализируем dataSet
         this.setItems([]);
      },

      //придрот что бы фэйковый див не ломал :first-child стили
      _moveFocusToFakeDiv: function() {

      },

      setLinkedView: function(view){
         if (this._options.linkedView){
            this._options.linkedView.unsubscribe('onSetRoot', this._rootChangeHandler);
         }
         this._options.linkedView = view;
         this._options.linkedView.subscribe('onSetRoot', function(event, dataSet, id){
               self._rootChangeHandler(dataSet, id);
            }, this);
      },

      _rootChangeHandler: function(dataSet, key){
         if (key){
            var displayField = this._options.linkedView._options.displayField, //Как то не очень
               hierField = this._options.linkedView._options.hierField, //И это не очень
               record = dataSet.getRecordByKey(key),
               parentId = record ? dataSet.getParentKey(record, hierField) : null,
               title = record ? record.get(displayField) : '';

            //Пушим ноды только если таких еще нет TODO: возможно проверка не нужна, так как датасет мержит рекорды
            if (!this._dataSet.getRecordByKey(key)) {
               this._dataSet.push({'title': title, 'parentId': parentId, 'id': key});
            }
         }
         this._redraw();
      },

      _getItemTemplate: function(){
         return pointTpl;
      },

      _addItemAttributes: function(container, item){
         var self = this;
         container.data('parentId', item.get('parentId'))
         if (item.last){
            $('.controls-PathSelector__arrow', point).removeClass('icon-Back icon-16 icon-primary action-hover');
            point.addClass('controls-PathSelector__point-last');
         }
         PathSelector.superclass._addItemAttributes.apply(this, arguments);
      },

      _appendItemTemplate: function (item, targetContainer, itemBuildedTpl) {
         targetContainer.prepend(itemBuildedTpl);
      },

      /**
       * Обработчик клика на пункт пути
       * id - id по которому нужно перейти
       * удаляет пункт на который кликнули и все до него (глубже по иерархии)
       */
      _onPointClick: function(id){
         var last = this._dataSet.getCount() - 1,
            record = this._dataSet.at(last);
            while (true) {
               this._dataSet.removeRecord(record.getKey());
               record = this._dataSet.at(last);
               //TODO: следующие четыре строчки выпилить когда будет нормальный sync в StaticSource
               delete this._dataSet._byId[record.getKey()];
               delete this._dataSet._byId[record._cid];
               this._dataSet._rawData.splice(last, 1);
               this._dataSet._indexId.splice(last, 1);
               last--;
               if (record.get('parentId') == id) break;
               record = this._dataSet.at(last);
            }
         this._options.linkedView.setCurrentRoot(id);
      }
   });

   return PathSelector;
});