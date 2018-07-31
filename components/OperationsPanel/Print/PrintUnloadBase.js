/**
 * Created by ad.chistyakova on 08.04.2015.
 */
//TODO: Сейчас печать и выгрузка очень напоминают старые контролы, где нет общих точек и вообще не понятно что происходит.
//Невероятное ветвление кода, и вроде бы таки одинаковые вещи как выгрузка всех записей и выгрузка выбранных совершенно в разных ветках.
//Нужно сделать общую точку входа, и ветвление только непосредственно перед вызовом тех или иннных функций бл.
define('SBIS3.CONTROLS/OperationsPanel/Print/PrintUnloadBase', [
   "Core/Deferred",
   'Core/deprecated',
   "Core/core-instance",
   "SBIS3.CONTROLS/Menu/MenuLink",
   "SBIS3.CONTROLS/Action/OpenDialog",
   "WS.Data/Chain",
   "WS.Data/Collection/Factory/RecordSet",
   "WS.Data/Collection/RecordSet",
   "Core/Indicator"
], function(Deferred, Deprecated, cInstance, MenuLink, Dialog, Chain, RecordSetFactory, RecordSet, Indicator) {
   //TODO: ограничение на максимальное количество записей, получаемое на клиент для печати/выгрузки.
   //Необходимо т.к. на сервере сейчас невозможно произвести xsl преобразование. Выписана задача:
   //(https://inside.tensor.ru/opendoc.html?guid=f852d5cc-b75e-4957-9635-3401e1832e80&description=)
   //Когда задача будет сделана, нужно перейти полностью на серверные механизмы выгрузки и печати.
   var MAX_RECORDS_COUNT = 20000;
   /**
    * Базовый контрол для работы с ListView. Подготовливает данные для печати и выгрузки
    * @class SBIS3.CONTROLS/OperationsPanel/Print/PrintUnloadBase
    * @extends SBIS3.CONTROLS/Menu/MenuLink
    * @author Сухоручкин А.С.
    * @control
    * @public
    */
   var PrintUnloadBase = MenuLink.extend(/** @lends SBIS3.CONTROLS/OperationsPanel/Print/PrintUnloadBase.prototype */{
      /**
       * @event onPrepareData Происходит при подготовке данных.
       * @param {Core/EventObject} eventObject Дескриптор события.
       * @param {Array.<Object>} originData Исходные данные.
       */
      /**
       * @event onApplyOperation Перед обработкой операции.
       * @remark
       * Событие происходит при непосредственном выборе выгрузки или печати. Данные уже выбраны, но можно поменять колонки для выборки
       * @param {Core/EventObject} eventObject Дескриптор события.
       * @param {String} type Имя операции. print или unload (Печать или выгрузка)
       * @return Результат обработчика события. Если вернуть новый набор колонок, то напечатаны будут они
       * @example
       * Структура массива с описанием строк:
       * <pre>
       *    //Мы получим кнопку только после того, как она будет нарисована, раньше нам не надо
       * massOperation.subscribe('onDrawItems', function(){
       *     this.getItemInstance('print').subscribe('onApplyOperation', function(event, type, columns){
       *        var resultColumns = [];
       *        //Есть колонки, которые не должны попасть в печать и выгрузку;
       *        for (var i = 0 , len = columns.length; i < len; i++){
       *           if (columns[i].field !== 'Опубликовано') {
       *              resultColumns.push(columns[i]);
       *           }
       *        }
       *        event.setResult(resultColumns);
       *     });
       *  });
       * </pre>
       */
      /**
       * @event onBeforeShowColumnsEditor Перед показом редактора колонок
       * @remark
       * Событие происходит перед показом редактора колонок и даёт возможность использования произвольой конфигурации колонок, а не только той, что
       * есть в браузере.
       * @param {Core/EventObject} eventObject Дескриптор события.
       * @param {object} data Исходные данные
       * @return {object} Альтернативные опции конфигурации колонок
       *
       * @example
       * <pre>
       *    this.subscribeTo(printUnloadButton, 'onBeforeShowColumnsEditor', function (evtDescriptor, data) {
       *       ...
       *       evtDescriptor.setResult({columnsConfig:{...}, editorOptions:{...}});
       *       ...
       *    });
       * </pre>
       *
       * @see _gatherColumnsInfo
       * @see useColumnsEditor
       * @see SBIS3.CONTROLS/Browser#showColumnsEditor
       * @see SBIS3.CONTROLS/Browser#_showColumnsEditor
       * @see SBIS3.CONTROLS/Browser#columnsConfig
       * @see SBIS3.CONTROLS/Browser#setColumnsConfig
       * @see SBIS3.CONTROLS/Browser#getColumnsConfig
       * @see SBIS3.CONTROLS/Browser#ColumnsConfigObject
       * @see SBIS3.CONTROLS/Browser/ColumnsEditor/Editor#open
       *
       * @demo Examples/ColumnsEditor/BrowserAndEditorButton/BrowserAndEditorButton Пример браузера с кнопкой редактора колонок
       * @demo Examples/ColumnsEditor/BrowserAndEditorButtonWithPresets/BrowserAndEditorButtonWithPresets Пример браузера с кнопкой редактора колонок, с пресетами и группами колонок
       * @demo Examples/ColumnsEditor/BrowserAndCustomButton/BrowserAndCustomButton Пример браузера с собственной кнопкой, открывающией редактор колонок
       * @demo Examples/ColumnsEditor/AllCustom/AllCustom Пример с одиночной кнопкой, открывающией редактор колонок (без браузера)
       */

      $protected: {
         _options: {
            /**
             * @cfg {String} Имя файла
             */
            fileName : '',
            allowChangeEnable: false,

            /**
             * @cfg {boolean} Использовать редактор колонок при определении списка колонок
             *
             * Для того, чтобы эта опция имела эффект, необходимо, чтобы в вышележащем (по дереву компонентов) экземпляре
             * {@link SBIS3.CONTROLS/Browser браузера} была корректно установлена {@link SBIS3.CONTROLS/Browser#columnsConfig конфигурация колонок},
             * чтобы браузер мог обработать команду {@link SBIS3.CONTROLS/Browser#showColumnsEditor}.
             *
             * Также возможно использование произвольой конфигурации колонок, а не только той, что есть в браузере. Для
             * этого следует подписаться на событие "onBeforeShowColumnsEditor" и передать необходимую конфигурацию колонок как результат обработки события.
             *
             * @see onBeforeShowColumnsEditor
             * @see _gatherColumnsInfo
             * @see SBIS3.CONTROLS/Browser#showColumnsEditor
             * @see SBIS3.CONTROLS/Browser#_showColumnsEditor
             * @see SBIS3.CONTROLS/Browser#columnsConfig
             * @see SBIS3.CONTROLS/Browser#setColumnsConfig
             * @see SBIS3.CONTROLS/Browser#getColumnsConfig
             * @see SBIS3.CONTROLS/Browser#ColumnsConfigObject
             * @see SBIS3.CONTROLS/Browser/ColumnsEditor/Editor#open
             *
             * @demo Examples/ColumnsEditor/BrowserAndEditorButton/BrowserAndEditorButton Пример браузера с кнопкой редактора колонок
             * @demo Examples/ColumnsEditor/BrowserAndEditorButtonWithPresets/BrowserAndEditorButtonWithPresets Пример браузера с кнопкой редактора колонок, с пресетами и группами колонок
             * @demo Examples/ColumnsEditor/BrowserAndCustomButton/BrowserAndCustomButton Пример браузера с собственной кнопкой, открывающией редактор колонок
             * @demo Examples/ColumnsEditor/AllCustom/AllCustom Пример с одиночной кнопкой, открывающией редактор колонок (без браузера)
             */
            useColumnsEditor: true
         },
         _view: undefined
      },

      $constructor: function() {
         this._publish('onApplyOperation', 'onPrepareData');
      },
      /**
       * Can be implemented
       */
      _clickHandler: function() {
         this._onOperationActivated();
         PrintUnloadBase.superclass._clickHandler.apply(this, arguments);
      },

      _onOperationActivated: function() {
      },

      _prepareOperation: function(title){
         var
             selectedItems,
             selectedRecordSet,
             view = this._getView(),
             items = view.getItems();
         //Обновим набор выделенных записей перед выгрузкой, т.к. после того как записи попали в selectedItems они могли измениться.
         view._setSelectedItems();
         selectedItems = view.getSelectedItems();
         if (!selectedItems || selectedItems.getCount() === 0) {
            this._processMassOperations(title);
         } else {
            selectedRecordSet = new RecordSet({
               adapter: items ? items.getAdapter() : 'adapter.json',
               model: items ? items.getModel() : 'entity.model'
            });
            selectedRecordSet.assign(selectedItems);
            this._applyOperation(selectedRecordSet);
         }
      },
      _getView: function(){
         return this._options.linkedView;
      },
      _processMassOperations:function(title){
         var numOfRecords = this._getView().getItems().getCount(),
            self = this,
            dialog = new Dialog();

         //Показать диалог выбора записей
         dialog.execute({
            opener : this,
            template: 'SBIS3.CONTROLS/OperationsPanel/Print/MassAmountSelector',
            caption : title,
            cssClassName: 'controls-MassAmountSelector',
            handlers: {
               onBeforeShow: function(){
                  //this.getLinkedContext().setValue('NumOfRecords', self._getView()._dataSet.getCount()); Хочется, чтобы было так
                  //TODO Но пришлось сделать так:
                  this.getChildControlByName('controls-MassAmountSelector').getContext().setValue('NumOfRecords', numOfRecords);
               }
            },
            componentOptions: {
                handlers: {
                    onApply: function(event, pageSize){
                        self.processSelectedPageSize(pageSize);
                    }
                }
            }
         });
      },

      /**
       * Must be implemented
       * @param columns
       * @private
       */
      _notifyOnApply : function(columns){
      },

      _applyMassOperation : function(ds){
         this._applyOperation(ds);
      },

      _applyOperation : function(dataSet){
         var self = this;
         this._prepareData(dataSet).addCallback(function (data) {
            self._gatherColumnsInfo(data, false).addCallback(function (columns) {
               // Если колонки получены
               if (columns) {
                  self.applyOperation({
                     dataSet: data,
                     columns: columns
                  });
               }
            });
         });
      },

      _prepareData: function(dataSet) {
         var
             originData = dataSet || this._getView().getItems(),
             newData = this._notify('onPrepareData', originData);
         if (newData instanceof Deferred) {
            return newData;
         } else {
            return Deferred.success(newData || originData);
         }
      },

      /*
       * @deprecated Используйте метод "_gatherColumnsInfo"
       */
      _prepareOperationColumns: function (data) {
         Deprecated.showInfoLog('Метод "_prepareOperationColumns" помечен как deprecated и будет удален. Используйте метод "_gatherColumnsInfo"');
         if (this._options.useColumnsEditor) {
            throw new Error('При включённой опции "useColumnsEditor" используйте асинхронный метод "_gatherColumnsInfo"');
         }
         var result;
         this._gatherColumnsInfo.apply(this, arguments).addCallback(function (arg) { result = arg; });
         return result;
      },

      /*
       * Собрать данные о колонках (асинхронно).
       * Возвращает обещание, разрешаемое списком объектов с параметрами колонок (в форме, используемой SBIS3.CONTROLS/DataGridView).
       *
       * Для того, чтобы при этом был использован редактор колонок, необходимо включить опцию useColumnsEditor для этой кнопки, а также в вышележащем
       * (по дереву компонентов) экземпляре {@link SBIS3.CONTROLS/Browser браузера} должна быть корректно установлена
       * {@link SBIS3.CONTROLS/Browser#columnsConfig конфигурация колонок}. Если эти условия соблюдены, то браузером будет открыт редактор колонок (по
       * полученной им команде {@link SBIS3.CONTROLS/Browser#showColumnsEditor}). Если ползователь, настроив колонки, нажмет кнопку
       * "Применить", то обещание будет разрешено отредактированным списком колонок. Если же ползователь закроет редактор кнопкой "Закрыть", то
       * обещание будет разрешено значением null. Если требуется и в этом случае получить список колонок - используйте аргумент forced. Следует
       * иметь ввиду, что в возвращённом списке выбранных пользователем колонок присутствуют все колонки, в том числе и те, что были помечены как
       * фиксированные(обязательные) в исходных данных.
       *
       * При использовании редактора колонок также возможно использование произвольой конфигурации колонок, а не только той, что есть в браузере. Для
       * этого следует подписаться на событие "onBeforeShowColumnsEditor" и передать необходимую конфигурацию колонок как результат обработки события.
       *
       * @example
       * <pre>
       *    this.subscribeTo(printUnloadButton, 'onBeforeShowColumnsEditor', function (evtDescriptor, data) {
       *       ...
       *       evtDescriptor.setResult({columnsConfig:{...}, editorOptions:{...}});
       *       ...
       *    });
       * </pre>
       *
       * @private
       * @param {object} data Дополнительные данные для вычисления колонок
       * @param {boolean} forced Вернуть колонки, даже если пользователь закрыл редактор колонок крестом (при включённой опции useColumnsEditor)
       * @return {Core/Deferred<object[]|WS.Data/Collection/RecordSet>}
       *
       * @see useColumnsEditor
       * @see SBIS3.CONTROLS/Browser#showColumnsEditor
       * @see SBIS3.CONTROLS/Browser#_showColumnsEditor
       * @see SBIS3.CONTROLS/Browser#columnsConfig
       * @see SBIS3.CONTROLS/Browser#setColumnsConfig
       * @see SBIS3.CONTROLS/Browser#getColumnsConfig
       * @see SBIS3.CONTROLS/Browser#ColumnsConfigObject
       * @see SBIS3.CONTROLS/Browser/ColumnsEditor/Editor#open
       * @see onBeforeShowColumnsEditor
       *
       * @demo Examples/ColumnsEditor/BrowserAndEditorButton/BrowserAndEditorButton Пример браузера с кнопкой редактора колонок
       * @demo Examples/ColumnsEditor/BrowserAndEditorButtonWithPresets/BrowserAndEditorButtonWithPresets Пример браузера с кнопкой редактора колонок, с пресетами и группами колонок
       * @demo Examples/ColumnsEditor/BrowserAndCustomButton/BrowserAndCustomButton Пример браузера с собственной кнопкой, открывающией редактор колонок
       * @demo Examples/ColumnsEditor/AllCustom/AllCustom Пример с одиночной кнопкой, открывающией редактор колонок (без браузера)
       */
      _gatherColumnsInfo: function (data, forced) {
         var _fromView = function () {
            var startColumns = this._getView().getColumns();
            var resultColumns = this._notifyOnApply(startColumns, data);
            return Array.isArray(resultColumns) && resultColumns.length ? resultColumns : startColumns;
         }.bind(this);
         if (this._options.useColumnsEditor) {
            // Перед показом редактора колонок сгенерируем событие на тот случай, если нужно использовать конфигурацию колонок, отличную от той, что
            // есть в вышележащем (по дереву компонентов) браузере
            var options = this._notify('onBeforeShowColumnsEditor', data);
            // Вызвать команду для показа редактора колонок. Используем либо опции, полученные как результат обработки события, либо те, что уже есть
            // в вышележащем (по дереву компонентов) браузере
            var value = this.sendCommand('showColumnsEditor', {
               columnsConfig: options ? options.columnsConfig : null,
               editorOptions: options ? options.editorOptions : null
            });
            // Если ролученное значение действительно является результатом работы обработчика команды (в браузере), то оно будет экземпляром Deferred,
            // а не просто true или false
            if (value instanceof Deferred && (!value.isReady() || value.isSuccessful())) {
               return value.addCallback(function (columnsConfig) {
                  // Если есть результат редактирования (то есть пользователь отредактировал колонки и нажал кнопку применить, а не закрыл редактор крестом)
                  if (columnsConfig) {
                     // Возвратить список объектов со свойствами колонок (в форме, используемой SBIS3.CONTROLS/DataGridView)
                     var recordSet = columnsConfig.columns;
                     var selected = columnsConfig.selectedColumns;
                     return selected && selected.length
                           ? selected.map(function (columnId) { return recordSet.getRecordById(columnId).get('columnConfig'); })
                           : Chain(recordSet).map(function (model) { return model.get('columnConfig'); }).value();
                  }
                  else {
                     return forced ? _fromView() : null;
                  }
               }.bind(this));
            }
         }
         // Если не доступен редактор колонок
         return Deferred.success(_fromView());
      },

      /**
       * Обрабатываем выбранные пользователем записи. Здесь подготавливаем dataSet либо подготавливаем
       * фильтр для выгрузки данных полностью на сервере
       * @param pageSize - количество записей, есди передать undefined, то значит, что нужны вообще все записи
       */
      processSelectedPageSize: function(pageSize){
         var
            recordSet = this._getView().getItems(),
            numOfRecords = recordSet.getCount(),
            self = this;
         if(pageSize > numOfRecords || !pageSize){
            this._loadFullData(pageSize || undefined).addCallback(function(dataSet){
               self._applyOperation(dataSet);
            }).addErrback(function(err){
              return err;
            });
         } else {
            self._applyOperation(this._getSortedViewItems(pageSize < numOfRecords ? pageSize : numOfRecords));
         }
      },

      _getSortedViewItems: function(count) {
         var
            view = this._getView(),
            items = view.getItems(),
            proj = view._getItemsProjection();

         return Chain(proj).filter(function (item) {
            return !cInstance.instanceOfModule(item, 'WS.Data/Display/GroupItem');
         }).map(function(item) {
            return item.getContents();
         }).first(count).value(RecordSetFactory, {
            adapter: items.getAdapter(),
            model: items.getModel()
         });
      },

      _loadFullData: function(pageSize){
         var deferred = new Deferred(),
            self = this;

         require(['SBIS3.CONTROLS/Utils/InformationPopupManager'], function(manager){
            manager.showConfirmDialog({message: 'Операция займет продолжительное время. Провести операцию?'},
               function (){
                  Indicator.setMessage(rk('Пожалуйста, подождите…'));
                  self._getView()._callQuery(self._getView().getFilter(), self._getView().getSorting(),0,  pageSize || MAX_RECORDS_COUNT).addCallback(function (dataSet) {
                     deferred.callback(dataSet)
                  }).addBoth(function() {
                     Indicator.hide();
                  });
               },
               function(){
                  deferred.errback();
               }
            )
         });

         return deferred;
      },
      /**
       * @deprecated Переименован в {@link processSelectedPageSize}.
       * @param pageSize
       */
      processSelectedOperation: function(pageSize){
         this.processSelectedPageSize(pageSize)
      },
      /**
       * Must be implemented
       * @param dataSet
       */
      applyOperation : function(){

      }
   });

   return PrintUnloadBase;

});