define('SBIS3.CONTROLS/LongOperations/Registry',
   [
      'Lib/Control/CompoundControl/CompoundControl',
      'Core/RightsManager',
      'tmpl!SBIS3.CONTROLS/LongOperations/Registry/resources/groupTpl',
      'tmpl!SBIS3.CONTROLS/LongOperations/Registry/resources/emptyHTMLTpl',
      'tmpl!SBIS3.CONTROLS/LongOperations/Registry/LongOperationsRegistry',
      'css!SBIS3.CONTROLS/LongOperations/Registry/LongOperationsRegistry',
      'SBIS3.CONTROLS/Action/List/OpenEditDialog',
      'SBIS3.CONTROLS/Browser',
      'SBIS3.CONTROLS/SearchForm',
      'SBIS3.CONTROLS/Filter/Button',
      'SBIS3.CONTROLS/Filter/FastData',
      'SBIS3.CONTROLS/LongOperations/List',
      'SBIS3.CONTROLS/LongOperations/Registry/resources/LongOperationsFilter'
   ],

   function (CompoundControl, RightsManager, groupTpl, emptyHTMLTpl, dotTplFn) {
      'use strict';

      var FILTER_STATUSES = {
         'null': rk('В любом состоянии'),
         'running': rk('В процессе'),
         'suspended': rk('Приостановленные'),
         'ended': rk('Завершенные'),
         'success-ended': rk('Успешно'),
         'error-ended': rk('С ошибками')
      };

      /**
       * Класс для отображения реестра длительных операций
       * @class SBIS3.CONTROLS/LongOperations/Registry
       * @extends Lib/Control/CompoundControl/CompoundControl
       *
       * @author Спирин В.А.
       *
       */
      var LongOperationsRegistry = CompoundControl.extend(/** @lends SBIS3.CONTROLS/LongOperations/Registry.prototype */{
         _dotTplFn: dotTplFn,

         $protected: {
            _options: {
               className: '',
               userId: null,
               useGroupByEasyGroup: true,
               /**
                * @cfg {string} Имя домена (для отбора данных)
                */
               domain: undefined,
               /**
                * @cfg {boolean} Использовать ли фильтр пользователей (когда права позволяют видеть не только свои операции)
                */
               useUsersFilter: null,
               /**
                * @cfg {string} Имя компонента фильтра пользователей
                */
               usersFilterComponent: null,
               /**
                * @cfg {object} Опции компонента фильтра пользователей
                */
               usersFilterParams: null
            },

            _longOpList: null,
            _previousGroupBy: null
         },

         $constructor: function () {
            var context = this.getLinkedContext();
            context.setValue('filter', {status:null, period:null, duration:null});
            var options = this._options;
            if ('userId' in options) {
               context.setValue('filter/UserId', this._options.userId);
            }
            if ('domain' in options && options.domain !== undefined) {
               context.setValue('filter/Domain', options.domain);
            }
         },

         init: function () {
            //###require('Core/ContextBinder').setDebugMode(true);
            LongOperationsRegistry.superclass.init.call(this);

            var self = this;
            this._longOpList = this.getChildControlByName('operationList');
            var view = this._longOpList.getView();

            view.setGroupBy({
               field: 'status',
               contentTemplate: groupTpl
            });

            this._bindEvents();
            this._longOpList.reload();
         },

         _modifyOptions: function () {
            var options = LongOperationsRegistry.superclass._modifyOptions.apply(this, arguments);
            options.useUsersFilter = !options.userId && !!(RightsManager.getRights(['Long_requests_config'])['Long_requests_config'] & RightsManager.ADMIN_MASK);
            return options;
         },

         _bindEvents: function () {
            var self = this;
            var longOperationsBrowser = this.getChildControlByName('longOperationsBrowser');
            var view = this._longOpList.getView();//###longOperationsBrowser.getChildControlByName('browserView')

            /*var search = self.getChildControlByName('browserSearch');
            this.subscribeTo(search, 'onSearch', function (evtName, text, force) {
               if (!force) {
                  search._hideLoadingIndicator();
               }
            });*/

            //Открываем ссылку, если она есть, иначе открываем журнал выполнения операции
            this.subscribeTo(longOperationsBrowser, 'onEdit', function (e, meta) {
               self._longOpList.applyMainAction(meta.item);
            });

            this.subscribeTo(view, 'onDataLoad'/*'onItemsReady'*/, function (evtName, recordset) {
               self._previousGroupBy = null;
               var status = self._longOpList.getLinkedContext().getValue('filter/status');
               view.setEmptyHTML(emptyHTMLTpl({title:FILTER_STATUSES[status === undefined ? null : status]}));
            });
         }
      });

      return LongOperationsRegistry;
   }
);
