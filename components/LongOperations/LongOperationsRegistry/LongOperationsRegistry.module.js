define('js!SBIS3.CONTROLS.LongOperationsRegistry',
   [
      'js!SBIS3.CORE.CompoundControl',
      'js!SBIS3.CONTROLS.LongOperationEntry',
      'Core/RightsManager',
      'html!SBIS3.CONTROLS.LongOperationsRegistry/resources/groupTpl',
      'html!SBIS3.CONTROLS.LongOperationsRegistry/resources/emptyHTMLTpl',
      'html!SBIS3.CONTROLS.LongOperationsRegistry',
      'css!SBIS3.CONTROLS.LongOperationsRegistry',
      'js!SBIS3.CONTROLS.Action.OpenEditDialog'/*###'js!SBIS3.Engine.SBISOpenDialogAction'*/,
      'js!SBIS3.CONTROLS.Browser'/*###'js!SBIS3.Engine.Browser'*/,
      'js!SBIS3.CONTROLS.LongOperationsList',
      'js!SBIS3.CONTROLS.LongOperationsFilter'
   ],

   function (CompoundControl, LongOperationEntry, RightsManager, groupTpl, emptyHTMLTpl, dotTplFn) {
      'use strict';

      var stateFilterHashMap = {
         'null': rk('В любом состоянии'),
         0: rk('В процессе'),
         1: rk('Прерванные'),
         2: rk('Завершенные'),
         4: rk('Успешно'),
         5: rk('С ошибками')
      };

      /**
       * Класс для отображения реестра длительных операций
       * @class SBIS3.CONTROLS.LongOperationsRegistry
       * @extends SBIS3.CORE.CompoundControl
       */
      var LongOperationsRegistry = CompoundControl.extend({
         _dotTplFn: dotTplFn,

         $protected: {
            _options: {
               className: '',
               userId: null
            },

            _longOpList: null,

            _data: [{
               idProperty : 'key',
               displayProperty: 'title',
               multiselect : false,
               parentProperty: 'parent',
               values:[
                  {
                     key : null,
                     title : stateFilterHashMap[null]
                  },
                  {
                     key : 0,
                     title : stateFilterHashMap[0]
                  },
                  {
                     key : 2,
                     title : stateFilterHashMap[2]
                  },
                  {
                     key : 4,
                     title : stateFilterHashMap[4],
                     parent: 2
                  },
                  {
                     key : 5,
                     title : stateFilterHashMap[5],
                     parent: 2
                  },
                  {
                     key : 1,
                     title : stateFilterHashMap[1]
                  }
               ]
            }],

            _previousGroupBy: null
         },

         $constructor: function () {
            this.getLinkedContext().setValue('filter', {});
         },

         init: function () {
            LongOperationsRegistry.superclass.init.call(this);

            var self = this;
            var view = this.getChildControlByName('browserView');

            this.getChildControlByName('browserFastDataFilter').setItems(this._data);

            view.setGroupBy(
               {
                  field: 'status',
                  method: function (record, at, isLast) {
                     var STATUSES = LongOperationEntry.STATUSES;
                     var status = record.get('status');
                     var prev = self._previousGroupBy;
                     if (prev === null
                           || (status === STATUSES.suspended && prev === STATUSES.running)
                           || ((status === STATUSES.success || status === STATUSES.error) && (prev === STATUSES.running || prev === STATUSES.suspended))) {
                        self._previousGroupBy = status;
                        return true;
                     }
                  },
                  template: groupTpl
               }
            );

            this._bindEvents();

            this._longOpList = self.getChildControlByName('operationList');
            this._longOpList.reload();
         },

         _modifyOptions: function () {
            var options = LongOperationsRegistry.superclass._modifyOptions.apply(this, arguments);
            options.hideStaffFilter = !!options.userId || !(RightsManager.getRights(['Long_requests_config'])['Long_requests_config'] & RightsManager.ADMIN_MASK);
            return options;
         },

         _bindEvents: function () {
            var self = this;
            var longOperationsBrowser = this.getChildControlByName('longOperationsBrowser');
            var action = this.getChildControlByName('action');

            //Открываем ссылку, если она есть, иначе открываем журнал выполнения операции
            this.subscribeTo(longOperationsBrowser, 'onEdit', function (e, meta) {
               if (!self._longOpList.applyResultAction(meta.item)) {
                  // Если действие ещё не обработано
                  var STATUSES = LongOperationEntry.STATUSES;
                  var status = meta.item.get('status');
                  var canHasHistory = self._longOpList.canHasHistory(meta.item);
                  //Открыть журнал операций только для завершенных составных операций или ошибок
                  if ((status === STATUSES.success && canHasHistory && 1 < meta.item.get('progressTotal')) || status === STATUSES.error) {
                     meta.dialogOptions = {
                        title: rk('Журнал выполнения операции')
                     };
                     meta.componentOptions = canHasHistory ? {
                        tabKey: meta.item.get('tabKey'),
                        producer: meta.item.get('producer'),
                        operationId: meta.item.get('id')
                     } : {
                        failedOperation: meta.item
                     };
                     action.execute(meta);
                  }
               }
            });

            var view = longOperationsBrowser.getChildControlByName('browserView');
            this.subscribeTo(view, 'onItemsReady', function () {
               self._previousGroupBy = null;
               var state = self._longOpList.getLinkedContext().getValue('filter/State');
               view.setEmptyHTML(emptyHTMLTpl({title: stateFilterHashMap[state === undefined ? null : state]}));
            });
         }
      });

      return LongOperationsRegistry;
   }
);
