/**
 * Created with JetBrains PhpStorm.
 * User: tm.baeva
 * Date: 22.04.13
 * Time: 0:53
 * To change this template use File | Settings | File Templates.
 */
define('js!SBIS3.CORE.HierarchyCustomView',
   [
      'js!SBIS3.CORE.HierarchyView',
      'is!browser?Core/jquery-dblclick'
   ],
   function( HierarchyView ) {

   "use strict";

   /**
    * @class $ws.proto.HierarchyCustomView
    * @extends $ws.proto.HierarchyViewAbstract
    *
    * @control
    * @initial
    * <component data-component='SBIS3.CORE.HierarchyCustomView'>
    * </component>
    * @category Table
    */
   $ws.proto.HierarchyCustomView = HierarchyView.extend(/** @lends $ws.proto.HierarchyCustomView.prototype */{
      $protected: {
         _options: {
            display: {
               /**
                * @cfg {Function} Функция отображения данных
                * На входе {$ws.proto.Record} соответствующий текущей выбранной строке.
                * Используется, если нужно получить строковое предстваление строки данных.
                */
               displayValue: '',
               /**
                * @cfg {String} Шаблон отображения данных
                * <wiTag group="Отображение">
                * На входе {$ws.proto.Record} соответствующий текущей выбранной строке.
                * Позволяет задать собственный шаблон для отображения данных
                * <pre>
                *    itemTemplate: 'html!SBIS3.EDO.EdoTemplate'
                *  </pre>
                */
               itemTemplate: ''
            },
            _dotItemTemplate: undefined,                 //шаблон для строки
            _rowOptionsSelector: '.ws-customView__element',//селектор для опций строки
            _rowOptionsContainer: 'ws-browser-row-options-container ws-customView-rowOptions' //классы для опций строки
         }
      },
      setDisplayValue: function(func){
         if(typeof(func) === 'function') {
            this._options.display.displayValue = func;
         }
      },
      /**
       * Создает основную структуру html
       */
      _createContainer:function(){
         $ws.proto.HierarchyCustomView.superclass._createContainer.apply(this, arguments);
         this._container.find('.ws-browser-data-container').addClass('ws-listview');
         this._body = this._rootElement.find('.ws-browser').height(this._isHeightGrowable() ? 'Auto':'100%');
         this._emptyDataBlock.addClass('listView');
      },
      _getBodyContainer: function(){
         return $('<div class="ws-browser"/>');
      },
      /**
       * Создаёт записи по заданному шаблону / функции отрисовки
       */
      _createElements: function(records) {
         var container = this._getBodyContainer(),
            element,
            key,
            visibleId = 0;

         for (var i = 0, len = records.length; i<len; i++) {
            element = this._renderElement(records[i]);
            key = records[i].getKey();
            if (element) {
               element.attr('rowkey', key);
               element.addClass('ws-visible ws-customView__element');
               if (this._selected && this._selected[key] !== undefined) {
                  element.addClass('ws-browser-selected');
               }
               ++visibleId;
               container.append(element);
            }
         }
         this._count = visibleId;
         return container;
      },
      /**
       * Рисует тело таблицы и заполняет его данными
       */
      _drawBodyCycle: function(){
         var container,
            self = this,
            owner = self._data.parent();

         this._currentRecordSet.rewind();
         this._createRecordsTemplate(this._currentRecordSet.getRecords()).addCallback(function(bodyContainer) {
            container = bodyContainer;

            self._emptyDataBlock.toggleClass('ws-hidden', self._count !== 0);
            self._body.remove();
            self._body = container.height(self._isHeightGrowable() ? 'Auto' : '100%');
            self._data = self._body;
            owner.append(container);

            self._notifyOnSizeChanged(this, this, true);
            return bodyContainer;
         });
      },
      /**
       * Рисует записи используя переданный рендер или шаблон
       * @param records
       */
      _createRecordsTemplate: function(records) {
         var dReady = new $ws.proto.Deferred(),
            self = this;


         if(self._options.display.itemTemplate && typeof self._options.display.itemTemplate === 'string' && !self._dotItemTemplate) {
            $ws.require([self._options.display.itemTemplate]).addCallbacks(function(arr) {
               self._dotItemTemplate = arr[0];
               dReady.callback(self._createElements(records));
            }, function(e) {
               $ws.single.ioc.resolve('ILogger').log('Ошибка при загрузке модуля ' + self._options.display._rowTemplate + ': ' + e.message);
            });
            return dReady;
         } else {
            return dReady.callback(self._createElements(records));
         }
      },
      /**
       * Рисует элемент представления, соответствующий одной записи выборки
       * @return {jQuery|Boolean}
       */
      _renderElement: function(record){
         var element = this._dotItemTemplate ? $(this._dotItemTemplate.apply(this._options, [record]))
            : this._options.display.displayValue.apply(this, [record]);

         if(record.get(this._hierColumnParentId) === this._currentRootId || this._turn in {"OnlyLeaves": true, "OnlyFolders": true}){
            if(element instanceof Object && 'jquery' in element) {
               if(record.get(this._hierColumnIsLeaf) === true) {
                  element.addClass("ws-browser-folder");
                  if(this._options.mode === "oneClickMode") {
                     element.addClass("ws-browser-folder-link");
                  }
               } else if(this._options.mode === "oneClickMode") {
                  element.addClass("ws-browser-edit-link");
               }
               return element;
            } else {
               $ws.single.ioc.resolve('ILogger').log("ListView", "element rendering function returned not a jQuery element");
            }
         }
         return false;
      },
      /**
       * Позволяет задать шаблон для строк CustomView
       * @param {String} template шаблон
       * @param {Boolean} doRefresh Перерисовать ли сразу браузер с новым шаблоном
       */
      setTemplate: function(template, doRefresh) {
         var self = this;

         if(template && typeof template === 'string') {
            $ws.require([template]).addCallbacks(function(arr) {
               self._dotItemTemplate = arr[0];
               if(doRefresh) {
                  self.refresh();
               }
            }, function(e) {
               $ws.single.ioc.resolve('ILogger').log('Ошибка при загрузке модуля ' + template + ': ' + e.message);
            });
         }
      },
      _initEvents: function(){
         var self = this,
               rowkey;

         function clickHandler(event){
            var cell = $(this),
                row = cell.closest('[rowkey]'),
                rowkey = row.attr("rowkey"),
                record = rowkey && self._currentRecordSet.contains(rowkey) ?
                   self._currentRecordSet.getRecordByPrimaryKey(rowkey) : undefined;

            self._onClickHandler(event);
            if(self.isEnabled()){
               rowkey = (rowkey === "null" || !rowkey) ? null : rowkey;
               if(event.type === 'dblclick'){
                  self._dblClickHandler.apply(self, [row, record]);
               }
               else{
                  self._oneClickHandler.apply(self, [row, record]);
               }
            }
            return self._options.editMode == 'thisWindow';
         }
         var rows = $('[rowkey]', self._body.parent()[0]).live('mousedown', function(){
            if(self.isEnabled()) {
               self.setActiveElement($(this), false, true);
            }
         });
         rows.wsFixedLiveClick2(clickHandler, clickHandler);
      }
   });

   return $ws.proto.HierarchyCustomView;

});
