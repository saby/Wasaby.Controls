define('js!SBIS3.CONTROLS.HierarchyDataGrid', [
   'js!SBIS3.CONTROLS.DataGrid',
   'js!SBIS3.CONTROLS.hierarchyMixin',
   'html!SBIS3.CONTROLS.HierarchyDataGrid/resources/rowTpl',
   'js!SBIS3.CONTROLS.PathSelector'
], function (DataGrid, hierarchyMixin, rowTpl, PathSelector) {
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
         _searchGrouping : {},
         _pathSelectors : []
      },

      $constructor: function () {
        this._publish('onSetRoot');
         //чтобы не добавлять новый шаблон модуля просто добавим класс тут
         this.getContainer().addClass('controls-HierarchyDataGrid');
         this._searchGrouping = {
            'field' : this._options.hierField + '@',
            'method' : this._groupByDefaultMethod,
            'render' : function(item, container){
               //here all records Before  this flag
               container.find('.controls-DataGrid__td').text('Сгруппировано по flag! в рендере');
               return container;
            }
         }
      },

      _dataLoadedCallback: function () {
         HierarchyDataGrid.superclass._dataLoadedCallback.call(this, arguments);
      },

      _elemClickHandlerInternal: function (id, data, target) {
         if (data.get(this._options.hierField+'@')) {
            var nodeID = $(target).closest('.controls-ListView__item').data('id');
            this.setCurrentRoot(nodeID);
         }
      },
      _groupByDefaultSearchMethod: function(records, noClear){
         //TODO lastParent - curRoot - правильно?. 2. Данные всегда приходят в правильном порядке?
         var lastParent = this._curRoot,
               lastDrawn,//Последний нарисанованный
               key,
               record,
               curRecRoot,
               kInd = -1,
               lastPath = [];
         if (!noClear) {
            this._clearItems();//delete
         }
         for (var i = 0; i < records.length; i++) {
            record = records[i];
            key = record.getKey();
            curRecRoot = record.get(this._options.hierField);
            if (curRecRoot[0] === lastParent){
               //Лист
               if (record.get(this._options.hierField + '@') !== true){
                  //Нарисуем путь до листа, если пришли из папки
                  if (lastDrawn !== 'leaf') {
                     this._drawPS(lastPath, record);
                  }
                  lastDrawn = 'leaf';
                  this._drawItem(record);//delete
               } else { //папка
                  lastDrawn = undefined;
                  lastPath.push(record);
                  lastParent = key;
               }
            } else {//другой кусок иерархии
               //Если текущий раздел у записи есть в lastPath, то возьмем все элементы до этого ключа
               kInd = -1;
               for (var k = 0; k < lastPath.length; k++) {
                  if (lastPath[k].getKey() === curRecRoot[0]){
                     kInd = k;
                     break;
                  }
               }
               //Если текущий раздел есть в lastpath его надо нарисовать
               if (  lastDrawn !== 'leaf') {
                  this._drawPS(lastPath, record);
               }
               lastDrawn = undefined;
               lastPath = kInd >= 0 ? lastPath.slice(0, kInd + 1) : [];
               //Лист
               if (record.get(this._options.hierField + '@') !== true){
                  this._drawPS(lastPath, record);
                  this._drawItem(record);//delete
                  lastDrawn = 'leaf';
                  lastParent = curRecRoot[0];
               } else {//папка
                  lastDrawn = undefined;
                  lastPath.push(record);
                  lastParent = key;
               }
            }
         }
      },
      _drawPS:function(path, record){
         if (path.length) {
            var targetContainer = this._getTargetContainer(record),
                  elem;
            //TODO Сделать номральным шаблоном группировки!
            var itemTr = $('<tr class="controls-DataGrid__tr controls-ListView__item controls-HierarchyDataGrid__path"><td class="controls-DataGrid__td" colspan="' + (this._options.columns.length + this._options.multiselect) +'"></td></tr>');
            targetContainer.append(itemTr);
            itemTr.find('td').append(elem = $('<div/>'));

            var ps = new PathSelector({
               //items : this._createPathItemsDS(lastPath),
               element : elem,
               linkedView : this,
               items: this._createPathItemsDS(path)
            });
            ps.setItems(this._createPathItemsDS(path));
            this._pathSelectors.push(ps);
         }

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
      },
      _groupByDefaultSearchRender : function(){
         //TODO отрисовать крошки и сделать hightlight
      },

      setCurrentRoot: function(key) {
        var self = this,
          record = this._dataSet.getRecordByKey(key),
          parentKey = record ? this._dataSet.getParentKey(record, this._options.hierField) : null,
          hierarchy =[];
          hierarchy.push(key);
        this._destroySearchPathSelectors();
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
      }
   });

   return HierarchyDataGrid;
});