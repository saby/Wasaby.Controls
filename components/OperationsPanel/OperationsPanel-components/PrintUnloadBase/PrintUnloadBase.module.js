/**
 * Created by ad.chistyakova on 08.04.2015.
 */
//TODO: Сейчас печать и выгрузка очень напоминают старые контролы, где нет общих точек и вообще не понятно что происходит.
//Невероятное ветвление кода, и вроде бы таки одинаковые вещи как выгрузка всех записей и выгрузка выбранных совершенно в разных ветках.
//Нужно сделать общую точку входа, и ветвление только непосредственно перед вызовом тех или иннных функций бл.
define('js!SBIS3.CONTROLS.PrintUnloadBase', [
   "Core/Deferred",
   'Core/deprecated',
   "js!SBIS3.CONTROLS.MenuLink",
   "js!SBIS3.CORE.DialogSelector",
   "WS.Data/Chain",
   "WS.Data/Collection/Factory/RecordSet",
   "WS.Data/Adapter/Json",
   "WS.Data/Collection/RecordSet",
   "Core/helpers/fast-control-helpers"
], function(Deferred, Deprecated, MenuLink, Dialog, Chain, RecordSetFactory, SbisAdapter, RecordSet, fcHelpers) {
   //TODO: ограничение на максимальное количество записей, получаемое на клиент для печати/выгрузки.
   //Необходимо т.к. на сервере сейчас невозможно произвести xsl преобразование. Выписана задача:
   //(https://inside.tensor.ru/opendoc.html?guid=f852d5cc-b75e-4957-9635-3401e1832e80&description=)
   //Когда задача будет сделана, нужно перейти полностью на серверные механизмы выгрузки и печати.
   var MAX_RECORDS_COUNT = 20000;
   /**
    * Базовый контрол для работы с ListView. Подготовливает данные для печати и выгрузки
    * @class SBIS3.CONTROLS.PrintUnloadBase
    * @extends SBIS3.CONTROLS.MenuLink
    * @author Сухоручкин Андрей Сергеевич
    * @control
    * @public
    */
   var PrintUnloadBase = MenuLink.extend(/** @lends SBIS3.CONTROLS.PrintUnloadBase.prototype */{
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

      $protected: {
         _options: {
            /**
             * @cfg {String} Имя файла
             */
            fileName : '',
            allowChangeEnable: false,

            /**
             * @cfg {boolean} Открывать редактор колонок при определении списка колонок
             */
            useColumnsEditor: false,

            /**
             * @cfg {object} Опции редактора колонок (согласно описанию опций в SBIS3.CONTROLS.ColumnsEditor)
             */
            columnsEditorOptions: {
               showButton: false//,
               //title: rk('Отображение колонок'),
               //moveColumns: true,
               //targetRegistryName: 'default',
               //defaultPreset: null,
               //newPresetTitle: rk('Новый шаблон'),
               //autoSaveFirstPreset: true,
               //useNumberedTitle: true,
               //groupField: 'group',
               //groupTitleTpl: null,
               //groupTitles: null
            }
         },
         _view: undefined,
         /**
          * Компонент редактора колонок (только при наличии опции useColumnsEditor === true)
          * @type {SBIS3.CONTROLS.ColumnsEditor}
          */
         _columnsEditor: undefined
      },

      $constructor: function() {
         if (this._options.useColumnsEditor) {
            // Если будет использоваться редактор колонок - подгрузить его сразу
            require(['js!SBIS3.CONTROLS.ColumnsEditor'], function () {});
         }
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
             selectedRecordSet,
             view = this._getView(),
             items = view.getItems(),
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
            self = this;

         //Показать диалог выбора записей
         new Dialog ({
            opener : this,
            template: 'js!SBIS3.CONTROLS.MassAmountSelector',
            caption : title,
            cssClassName: 'controls-MassAmountSelector',
            handlers: {
               onBeforeShow: function(){
                  //this.getLinkedContext().setValue('NumOfRecords', self._getView()._dataSet.getCount()); Хочется, чтобы было так
                  //TODO Но пришлось сделать так:
                  this.getChildControlByName('controls-MassAmountSelector').getContext().setValue('NumOfRecords', numOfRecords);
               },
               onChange: function(event, pageSize){
                  self.processSelectedPageSize(pageSize);
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
            self._gatherColumnsInfo(data).addCallback(function (columns) {
               self.applyOperation({
                  dataSet: data,
                  columns: columns
               });
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
       * Собрать данные о колонках (асинхронно)
       * @protected
       * @param {object} data Дополнительные данные для вычисления колонок
       * return {Core/Deferred<object[]>}
       */
      _gatherColumnsInfo: function (data) {
         var startColumns = this._getView().getColumns();
         var columnsInfo = this._notifyOnApply(startColumns, data);
         if (!(Array.isArray(columnsInfo) && columnsInfo.length)) {
            columnsInfo = startColumns;
         }
         return this._options.useColumnsEditor ? this._openColumnsEditor(columnsInfo) : Deferred.success(columnsInfo);
      },

      /*
       * Открыть редактор колонок
       * @protected
       * @param {object[]} columnsInfo Начальный список колонок
       * return {Core/Deferred<object[]>}
       */
      _openColumnsEditor: function (columnsInfo) {
         var promise = new Deferred();
         require(['js!SBIS3.CONTROLS.ColumnsEditor'], function (ColumnsEditor) {
            if (!this._columnsEditor) {
               this._columnsEditor = new ColumnsEditor(this._options.columnsEditorOptions);
            }
            this.subscribeOnceTo(this._columnsEditor, 'onColumnsEditorShow', function (evt) {
               var colList = columnsInfo.map(function (v) {
                  return {
                     id: v.field,
                     title: v.title.replace(/^\s+|\s+$/gi, '') || v.field,
                     fixed: false,// TODO: Как понимать, что колонка обязательная ?
                     group: null// TODO: Как назначать группы ?
                  };
               });
               var selectedColumns = colList.map(function (v) { return v.id; });// TODO: Как назначать первично выделенные колонки ?
               evt.setResult({
                  columns: new RecordSet({
                     rawData: colList,
                     idProperty: 'id',
                     displayProperty: 'title'
                  }),
                  selectedColumns: selectedColumns,
                  expandedGroups: []// TODO: Как назначать первично распахнутые группы ?
                  // Далее можно переопределить для этого вызова, если нужно, общие опции
                  //groupTitleTpl: ...,
                  //groupTitles: ...,
               });
            }.bind(this));
            this.subscribeOnceTo(this._columnsEditor, 'onColumnsEditorComplete', function (evt, selectedColumns) {
               promise.callback(selectedColumns && selectedColumns.length ? columnsInfo.filter(function (v) { return selectedColumns.indexOf(v.field) !== -1; }) : columnsInfo);
            }.bind(this));
            this._columnsEditor.sendCommand('showColumnsEditor');
         }.bind(this));
         return promise;
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
            if (pageSize < numOfRecords) {
               //Выберем pageSize записей из dataSet
               recordSet = Chain(recordSet).first(pageSize).value(RecordSetFactory, {
                  adapter: recordSet.getAdapter(),
                  model: recordSet.getModel()
               });
            }
            self._applyOperation(recordSet);
         }
      },
      _loadFullData: function(pageSize){
         var deferred = new Deferred(),
            self = this;

         require(['js!SBIS3.CONTROLS.Utils.InformationPopupManager'], function(manager){
            manager.showConfirmDialog({message: 'Операция займет продолжительное время. Провести операцию?'},
               function (){
                  fcHelpers.toggleIndicator(true);
                  self._getView()._callQuery(self._getView().getFilter(), self._getView().getSorting(),0,  pageSize || MAX_RECORDS_COUNT).addCallback(function (dataSet) {
                     deferred.callback(dataSet)
                  }).addBoth(function() {
                     fcHelpers.toggleIndicator(false);
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