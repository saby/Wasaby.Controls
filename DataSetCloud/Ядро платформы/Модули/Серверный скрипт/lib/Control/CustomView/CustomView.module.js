/**
 * Created with JetBrains PhpStorm.
 * User: tm.baeva
 * Date: 22.04.13
 * Time: 1:02
 * To change this template use File | Settings | File Templates.
 */
define("js!SBIS3.CORE.CustomView", ["js!SBIS3.CORE.DataViewAbstract", 'html!SBIS3.CORE.CustomView', 'is!browser?Core/jquery-dblclick'], function( DataViewAbstract, dotTplFn ) {

   "use strict";

   $ws.single.DependencyResolver.register('SBIS3.CORE.CustomView', null, 'SBIS3.CORE.DataViewAbstract');

   /**
    * @class $ws.proto.CustomView
    * @extends $ws.proto.DataViewAbstract
    *
    * @control
    * @initial
    * <component data-component='SBIS3.CORE.CustomView'>
    * </component>
    * @category Table
    */
   $ws.proto.CustomView = DataViewAbstract.extend(/** @lends $ws.proto.CustomView.prototype */{
      /**
       * @event onBeforeRender Перед началом рендеринга
       * Происходит до отображения в представлении данных пришедших записей.
       * @param {Object} eventObject описание в классе $ws.proto.Abstract
       * @return {Boolean|Array|*} Если передать:
       * <ol>
       * <li>false – отмена отображения данных,</li>
       * <li>любой иной тип данных – представление данных отобразится в соответствии с текущей конфигурацией.</li>
       * </ol>
       * @example
       * <pre>
       *    dataView.subscribe('onBeforeRender', function(event){
       *       // если данных не достаточно, не будем их показывать
       *       if(this.getRecordsCount() <= 10){
       *          event.setResult(false);
       *       }
       *    });
       * </pre>
       */
      $protected: {
         _options: {
            display: {
               /**
                * @cfg {Function} Функция отображения данных
                * <wiTag group="Отображение">
                * На входе {$ws.proto.Record} соответствующий текущей выбранной строке.
                * Используется, если нужно получить предстваление строки данных.
                * <pre>
                *    displayValue: function(record){
                *       var color = '#E1FFFF',
                *           fl = 'left',
                *           borderColor = '#E0E0E0';
                *       // сформируем объект jQuery div с определенными нами параметрами и вернем его,
                *       //чтобы он вставился в тело нашего listView
                *       window.cnt = window.cnt || 0;
                *       if(window.cnt%2 === 1)
                *          fl = 'right';
                *       if(window.cnt == this.getRecordSet().getRecordCount())
                *          window.cnt = 0;
                *       else
                *          window.cnt++;
                *       return $("<div style=\'border:1px solid " + borderColor +
                *          ";width:49.7%;background-color:" + color + ";float:" + fl +
                *          ";font-weight:bold;color:black;font-size:12px;vertical-align:center;\'>" +
                *          record.get('Сотрудник') +
                *          "<div style=\'color:gray;display:inline;\'> (" +
                *             record.get('Должность') +
                *          ")</div>" +
                *       "</div>");
                *    }
                * </pre>
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
            }
         },
         _dotItemTemplate: undefined,                 //шаблон для строки
         _rowOptionsSelector: '.ws-customView__element',//селектор для опций строки
         _rowOptionsContainer: 'ws-browser-row-options-container ws-customView-rowOptions' //классы для опций строки
      },
      _dotTplFn: dotTplFn,
      /**
       * Задаёт функцию отображения данных
       * @param {function} func функция, которая будет возвращать предстваление строки данных.
       */
      setDisplayValue: function(func){
         if(typeof(func) === 'function')
            this._options.display.displayValue = func;
      },
      /**
       * Создает основную структуру html
       */
      _createContainer:function(){
         $ws.proto.CustomView.superclass._createContainer.apply(this, arguments);
         this._body = this._rootElement.find('.ws-browser').height(this._isHeightGrowable() ? 'Auto' : '100%');
      },
      /**
       * Дейтсвия перед отрисовкой. Если вернём false, то отрисовка остановится
       * @returns {Boolean}
       */
      _onBeforeRenderActions: function(){
         var notifyResult = this._notify('onBeforeRender');
         return notifyResult === undefined ? true : notifyResult;
      },
      _getBodyContainer: function(){
         return $('<div class="ws-browser"/>');
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
      _findSelectedElement: function(){
         return this._container.find('.ws-customView__element.ws-browser-row-selected');
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
       * Рисует элемент представления, соответствующий одной записи выборки
       * @return {jQuery|Boolean}
       */
      _renderElement: function(record){
         var element = this._dotItemTemplate ? $(this._dotItemTemplate.apply(this._options, [record]))
            : this._options.display.displayValue.apply(this, [record]);

         if(element instanceof Object && 'jquery' in element){
            if(this._options.mode === "oneClickMode")
               element.addClass("ws-browser-edit-link");
            return element;
         }
         else
            $ws.single.ioc.resolve('ILogger').log("ListView", "element rendering function returned not a jQuery element");
         return false;
      },
      _setWidth: function(){
         var width = this._options.display.width;
         this._container.width(width);
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
            return self._options.editMode === 'thisWindow';
         }
         var rows = $('[rowkey]', self._body.parent()[0]).live('mousedown', function(){
                        if(self.isEnabled())
                           self.setActiveElement($(this), false, true);
                     });
         rows.wsFixedLiveClick2(clickHandler, clickHandler);
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
      _mapColumns: function(){
      },
      _refreshHead: function(){
      }
   });

   return $ws.proto.CustomView;

});
