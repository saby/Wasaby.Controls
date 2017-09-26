define('js!SBIS3.CONTROLS.LongOperationHistory',
   [
      'js!SBIS3.CORE.CompoundControl',
      'js!SBIS3.CONTROLS.LongOperations.Manager',
      'js!SBIS3.CONTROLS.LongOperations.HistoryItem',
      'js!WS.Data/Source/DataSet',
      'js!WS.Data/Collection/RecordSet',
      'js!WS.Data/Entity/Record',
      'html!SBIS3.CONTROLS.LongOperationHistory',
      'css!SBIS3.CONTROLS.LongOperationHistory',
      'js!SBIS3.CONTROLS.Browser'/*###'js!SBIS3.Engine.Browser'*/,
      'html!SBIS3.CONTROLS.LongOperationHistory/resources/LongOperationHistoryDateTemplate',
      'html!SBIS3.CONTROLS.LongOperationHistory/resources/LongOperationHistoryTimeTemplate',
      'html!SBIS3.CONTROLS.LongOperationHistory/resources/LongOperationHistoryStatusTemplate',
      'js!SBIS3.CONTROLS.FastDataFilter',/*###*/
      'js!SBIS3.CONTROLS.DataGridView'
   ],

   function (CompoundControl, longOperationsManager, LongOperationHistoryItem, DataSet, RecordSet, Record, dotTplFn) {

      /**
       * SBIS3.CONTROLS.LongOperationHistory
       * @class SBIS3.CONTROLS.LongOperationHistory
       * @extends SBIS3.CORE.CompoundControl
       *
       * @author Спирин Виктор Алексеевич
       */
      var moduleClass = CompoundControl.extend(/** @lends SBIS3.CONTROLS.LongOperationHistory.prototype */{
         _dotTplFn: dotTplFn,

         $protected: {
            _options: {
               tabKey: null,
               producer: null,
               operationId: null,
               isFailed: null,
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
                     title : rk('C ошибками')
                  }
               ]
            }],

            _view: null
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
                  errorMessage: failedOperation.get('resultMessage') || 'Ошибка',
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