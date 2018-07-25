define('SBIS3.CONTROLS/LongOperations/History',
   [
      'Lib/Control/CompoundControl/CompoundControl',
      'SBIS3.CONTROLS/LongOperations/Manager',
      'SBIS3.CONTROLS/LongOperations/HistoryItem',
      'WS.Data/Source/DataSet',
      'WS.Data/Collection/RecordSet',
      'WS.Data/Entity/Record',
      'Core/Sanitize',
      'tmpl!SBIS3.CONTROLS/LongOperations/History/LongOperationHistory',
      'css!SBIS3.CONTROLS/LongOperations/History/LongOperationHistory',
      'SBIS3.CONTROLS/Browser'/*###'SBIS3.ENGINE/Controls/Browser'*/,
      'tmpl!SBIS3.CONTROLS/LongOperations/History/resources/LongOperationHistoryDateTemplate',
      'tmpl!SBIS3.CONTROLS/LongOperations/History/resources/LongOperationHistoryTimeTemplate',
      'tmpl!SBIS3.CONTROLS/LongOperations/History/resources/LongOperationHistoryStatusTemplate',
      'SBIS3.CONTROLS/Filter/FastData',/*###*/
      'SBIS3.CONTROLS/DataGridView'
   ],

   function (CompoundControl, longOperationsManager, LongOperationHistoryItem, DataSet, RecordSet, Record, coreSanitize, dotTplFn) {

      /**
       * SBIS3.CONTROLS/LongOperations/History
       * @class SBIS3.CONTROLS/LongOperations/History
       * @extends Lib/Control/CompoundControl/CompoundControl
       *
       * @author Спирин В.А.
       */
      var moduleClass = CompoundControl.extend(/** @lends SBIS3.CONTROLS/LongOperations/History.prototype */{
         _dotTplFn: dotTplFn,

         $protected: {
            _options: {
               tabKey: null,
               producer: null,
               operationId: null,
               isFailed: null,
               resultHandler: null,
               resultWayOfUse: null,
               failedOperation: null
            },

            _data: [{
               idProperty : 'key',
               displayProperty: 'title',
               multiselect : false,
               values:[
                  {
                     key : false,
                     title : rk('Все')
                  },
                  {
                     key : true,
                     title : rk('С ошибками', 'ДлительныеОперации')
                  }
               ]
            }],

            _view: null
         },

         _modifyOptions: function () {
            var options = moduleClass.superclass._modifyOptions.apply(this, arguments);
            if (options.resultHandler && !options.resultWayOfUse && options.failedOperation) {
               options.resultWayOfUse = options.failedOperation.get('resultWayOfUse');
            }
            return options;
         },

         $constructor: function () {
            this.getLinkedContext().setValue('filter', {onlyErrors:!!this._options.isFailed});
         },

         init: function () {
            moduleClass.superclass.init.call(this);
            this._view = this.getChildControlByName('browserView');
            this.getChildControlByName('browserFastDataFilter').setItems(this._data);
            this._bindEvents();
            this._reload();
         },

         _bindEvents: function () {
            var self = this;
            this.subscribeTo(this._view, /*'onPropertiesChanged'*/'onPropertyChanged', function (evtName, property) {
               if (property === 'filter') {
                  self._reload();
               }
            });

            //У невыполненых операций нужно менять цвет текста на красный, поэтому навешиваем класс
            this.subscribeTo(this._view, 'onDrawItems', function () {
               var container = self._view.getContainer();
               self._view.getItems().each(function (item, id) {
                  if (item.get('isFailed')) {
                     container.find('.js-controls-ListView__item[data-id="' + item.getId() + '"]').addClass('controls-LongOperationHistory__view_errorOperation');
                  }
               });
            });

            var resultHandler = this._options.resultHandler;
            if (resultHandler && this.hasChildControlByName('resultButton')) {
               this.subscribeTo(this.getChildControlByName('resultButton'), 'onActivated', function () {
                  resultHandler.call();
               });
            }
         },

         _reload: function () {
            var failedOperation = this._options.failedOperation;
            if (!failedOperation) {
               longOperationsManager.history(this._options.tabKey, this._options.producer, this._options.operationId, this._view._getOption('pageSize'), this._view.getFilter()).addCallbacks(
                  function (data) {
                     this._view.setItems(data && data instanceof DataSet ? data.getAll() : data);
                  }.bind(this),
                  function (err) {
                  }
               );
            }
            else {
               // Если не использовать RecordSet, то в DataGridView будет создан оборачивающий источник данных класса Memory и события
               // onPropertyChange:filter начнут удваиваться (в реализации 3.7.5.150)
               // (ItemsControlMixin:1634 и затем ItemsControlMixin:1686 вместо одного ItemsControlMixin:1803)
               var data = new RecordSet({
                  idProperty: 'id'
               });
               var item = new LongOperationHistoryItem({
                  title: failedOperation.get('title'),
                  id: failedOperation.get('id'),
                  //producer: failedOperation.get('producer'),
                  endedAt: new Date(failedOperation.get('startedAt').getTime() + (failedOperation.get('timeSpent') || 0) + (failedOperation.get('timeIdle') || 0)),
                  errorMessage: coreSanitize(failedOperation.get('resultMessage'), null/*Использовать опции по умолчанию*/) || 'Ошибка',
                  isFailed: true
               });
               data.assign([new Record({
                  rawData: item,
                  idProperty: 'id'
               })]);
               this._view.setItems(data);


            }
         }
      });

      moduleClass.dimensions = {
         width: '680px',
         height: '100px',
         resizeable: false
      };

      return moduleClass;
   }
);