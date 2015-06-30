define('js!SBIS3.CONTROLS.HierarchyDataGrid', [
   'js!SBIS3.CONTROLS.DataGrid',
   'js!SBIS3.CONTROLS.hierarchyMixin',
   'html!SBIS3.CONTROLS.HierarchyDataGrid/resources/rowTpl',
   'js!SBIS3.CONTROLS.PathSelector',
   'is!browser?html!SBIS3.CONTROLS.DataGrid/resources/DataGridGroupBy'
], function (DataGrid, hierarchyMixin, rowTpl, PathSelector, groupByTpl) {
   'use strict';
   /**
    * Контрол отображающий набор данных, имеющих иерархическую структуру, в виде в таблицы с несколькими колонками.
    * @class SBIS3.CONTROLS.TreeDataGrid
    * @extends SBIS3.CONTROLS.DataGrid
    * @mixes SBIS3.CONTROLS.TreeMixin
    * @public
    * @control
    * @initial
    * <component data-component='SBIS3.CONTROLS.TreeDataGrid'>
    *    <options name="columns" type="array">
    *       <options>
    *          <option name="title">Поле 1</option>
    *          <option name="width">100</option>
    *       </options>
    *       <options>
    *          <option name="title">Поле 2</option>
    *       </options>
    *    </options>
    * </component>
    */

   var HierarchyDataGrid = DataGrid.extend([hierarchyMixin], /** @lends SBIS3.CONTROLS.TreeDataGrid.prototype*/ {
      $protected: {
         _rowTpl: rowTpl,
         _pathSelectors : [],
         _lastParent : undefined,
         _lastDrawn : undefined,
         _lastPath : []
      },

      $constructor: function () {
        this._publish('onSetRoot');
         //чтобы не добавлять новый шаблон модуля просто добавим класс тут
         this.getContainer().addClass('controls-HierarchyDataGrid');
      },

      _dataLoadedCallback: function () {
         HierarchyDataGrid.superclass._dataLoadedCallback.call(this, arguments);
      },

      _elemClickHandlerInternal: function (data, id, target) {
         if (data.get(this._options.hierField+'@')) {
            var nodeID = $(target).closest('.controls-ListView__item').data('id');
            this.setCurrentRoot(nodeID);
         }
      },
      reload: function(){
         this._lastParent = undefined;
         this._lastDrawn = undefined;
         this._lastPath = [];
         HierarchyDataGrid.superclass.reload.apply(this, arguments);
      },
      _drawItems: function(){
         this._lastParent = this._curRoot;
         this._lastDrawn = undefined;
         this._lastPath = [];
         HierarchyDataGrid.superclass._drawItems.apply(this, arguments);
      },

      setCurrentRoot: function(key) {
        var self = this,
          record = this._dataSet.getRecordByKey(key),
          parentKey = record ? this._dataSet.getParentKey(record, this._options.hierField) : null,
          hierarchy =[];
          hierarchy.push(key);
        while (parentKey != null){
          hierarchy.push(parentKey);
          record = this._dataSet.getRecordByKey(parentKey);
          parentKey = record ? this._dataSet.getParentKey(record, this._options.hierField) : null;
        }
        for (var i = hierarchy.length - 1; i >= 0; i--){
          this._notify('onSetRoot', this._dataSet, hierarchy[i]);
        }
        this._loadNode(key).addCallback(function(dataSet) {
          if (!self._dataSet){
            self._dataSet = dataSet;
          } else {
            self._dataSet.setRawData(dataSet.getRawData());
          }
          self._dataLoadedCallback();
          self._notify('onDataLoad', dataSet);
          self._curRoot = key;
          self._redraw();
         })
      },
      getSearchGroupBy: function(field){
         return {
            field: field,
            template : groupByTpl,
            method : this._searchMethod.bind(this),
            render : this._searchRender.bind(this)
         }
      },
      //----------------- defaultSearch group
      /**
       * Метод поиска по умолчанию
       * @param record
       * @param at
       * @returns {{drawItem: boolean, drawGroup: boolean}}
       */
      _searchMethod: function(record, at){
         //TODO lastParent - curRoot - правильно?. 2. Данные всегда приходят в правильном порядке?
         var key,
               curRecRoot,
               drawItem = false,
               kInd = -1;
         if (this._lastParent === undefined) {
            this._lastParent = this._curRoot;
         }
         key = record.getKey();
         curRecRoot = record.get(this._options.hierField);
         if (curRecRoot[0] === this._lastParent){
            //Лист
            if (record.get(this._options.hierField + '@') !== true){
               //Нарисуем путь до листа, если пришли из папки
               if (this._lastDrawn !== 'leaf' && this._lastPath.length) {
                  this._drawGroup(record, at);
               }
               this._lastDrawn = 'leaf';
               drawItem = true;
               //this._drawItem(record);//delete
            } else { //папка
               this._lastDrawn = undefined;
               this._lastPath.push(record);
               this._lastParent = key;
            }
         } else {//другой кусок иерархии
            //Если текущий раздел у записи есть в lastPath, то возьмем все элементы до этого ключа
            kInd = -1;
            for (var k = 0; k < this._lastPath.length; k++) {
               if (this._lastPath[k].getKey() === curRecRoot[0]){
                  kInd = k;
                  break;
               }
            }
            //Если текущий раздел есть в this._lastPath его надо нарисовать
            if (  this._lastDrawn !== 'leaf' && this._lastPath.length) {
               this._drawGroup(record, at);
            }
            this._lastDrawn = undefined;
            this._lastPath = kInd >= 0 ? this._lastPath.slice(0, kInd + 1) : [];
            //Лист
            if (record.get(this._options.hierField + '@') !== true){
               if ( this._lastPath.length) {
                  this._drawGroup(record, at);
               }
               drawItem = true;
               //this._drawItem(record);//delete
               this._lastDrawn = 'leaf';
               this._lastParent = curRecRoot[0];
            } else {//папка
               this._lastDrawn = undefined;
               this._lastPath.push(record);
               this._lastParent = key;
            }
         }
         return {
            drawItem : drawItem,
            drawGroup: false
         };
      },
      _searchRender: function(item, container){
         this._drawPathSelector(this._lastPath, item, container);
         return container;
      },
      _drawPathSelector:function(path, record, container){
         if (path.length) {
            var self = this,
                  elem;
            container.find('td').append(elem = $('<div/>'));

            var ps = new PathSelector({
               //items : this._createPathItemsDS(lastPath),
               element : elem,
               linkedView : this,
               items: this._createPathItemsDS(path)
            });
            ps.once('onPointClick', function(){
               self._destroySearchPathSelectors();
               self.setGroupBy({});
            });
            this._pathSelectors.push(ps);
         } else{
            //если пути нет, то группировку надо бы убить...
            container.remove();
         }

      },
      _isViewElement: function(elem) {
         return HierarchyDataGrid.superclass._isViewElement.apply(this, arguments)
                && !elem.hasClass('controls-HierarchyDataGrid__path')
                && !(elem.wsControl() instanceof PathSelector);
      },
      _createPathItemsDS: function(pathRecords){
         var dsItems = [];
         for (var i = 0; i < pathRecords.length; i++){
            dsItems.push({
               id: pathRecords[i].getKey(),
               title: pathRecords[i].get(this._options.displayField),
               parentId: pathRecords[i].get(this._options.hierField)[0]
            });
         }
         return dsItems;
      },
      _destroySearchPathSelectors: function(){
         for (var i =0; i < this._pathSelectors.length; i++){
            this._pathSelectors[i].destroy();
         }
         this._pathSelectors = [];
      }
   });

   return HierarchyDataGrid;
});