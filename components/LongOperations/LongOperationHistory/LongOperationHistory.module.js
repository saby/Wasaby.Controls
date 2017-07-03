define('js!SBIS3.CONTROLS.LongOperationHistory',
   [
      'js!SBIS3.CORE.CompoundControl',
      'js!SBIS3.CONTROLS.LongOperationsManager',
      'js!SBIS3.CONTROLS.LongOperationHistoryItem',
      'js!WS.Data/Source/DataSet',
      'js!WS.Data/Collection/RecordSet',
      'js!WS.Data/Entity/Record',
      'html!SBIS3.CONTROLS.LongOperationHistory',
      'css!SBIS3.CONTROLS.LongOperationHistory',
      'js!SBIS3.Engine.Browser',
      'html!SBIS3.CONTROLS.LongOperationHistory/resources/LongOperationHistoryDateTemplate',
      'html!SBIS3.CONTROLS.LongOperationHistory/resources/LongOperationHistoryTimeTemplate',
      'html!SBIS3.CONTROLS.LongOperationHistory/resources/LongOperationHistoryStatusTemplate'
   ],

   function (CompoundControl, longOperationsManager, LongOperationHistoryItem, DataSet, RecordSet, Record, dotTplFn) {

      /**
       * SBIS3.CONTROLS.LongOperationHistory
       * @class SBIS3.CONTROLS.LongOperationHistory
       * @extends SBIS3.CORE.CompoundControl
       */
      var moduleClass = CompoundControl.extend(/** @lends SBIS3.CONTROLS.LongOperationHistory.prototype */{
         _dotTplFn: dotTplFn,

         $protected: {
            _options: {
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
            this.getLinkedContext().setValue('filter', {});
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
            this.subscribeTo(this._view, 'onPropertyChanged', function (evt, property) {
               if (property === 'filter') {
                  self._reload();
               }
            });

            //У невыполненых операций нужно менять цвет текста на красный, поэтому навешиваем класс
            this.subscribeTo(this._view, 'onDrawItems', function () {
               var container = self._view.getContainer();
               self._view.getItems().each(function (item, id) {
                  if (item.get('isFailed')) {
                     container.find('.js-controls-ListView__item[data-id="' + item.getId() + '"]').addClass('engine-LongOperationHistory__view_errorOperation engine-OperationRegistry__view_errorOperation');//TODO: ### Убрать одни класс!
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
               var data = new RecordSet({
                  idProperty: 'id'
               });
               data.assign([new Record({
                  rawData: new LongOperationHistoryItem({
                     title: failedOperation.get('title'),
                     id: failedOperation.get('id'),
                     //producer: failedOperation.get('producer'),
                     endedAt: new Date(failedOperation.get('startedAt').getTime() + (failedOperation.get('timeSpent') || 0)),
                     errorMessage: failedOperation.get('resultMessage') || 'Ошибка',
                     isFailed: true
                  }),
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