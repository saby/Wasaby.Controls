define('js!SBIS3.CONTROLS.LongOperationsList',
   [
      'Core/Deferred',
      'Core/TimeInterval',
      'js!SBIS3.CORE.CompoundControl',
      'js!SBIS3.CONTROLS.LongOperationEntry',
      'js!SBIS3.CONTROLS.LongOperationsList/resources/model',
      'js!SBIS3.CONTROLS.LongOperationsManager',
      'js!SBIS3.CONTROLS.Utils.InformationPopupManager',
      'html!SBIS3.CONTROLS.LongOperationsList',
      'css!SBIS3.CONTROLS.LongOperationsList',
      'html!SBIS3.CONTROLS.LongOperationsList/resources/LongOperationsListStateTemplate',
      'html!SBIS3.CONTROLS.LongOperationsList/resources/LongOperationsListStartTimeTemplate',
      'html!SBIS3.CONTROLS.LongOperationsList/resources/LongOperationsListExecuteTimeTemplate',
      'html!SBIS3.CONTROLS.LongOperationsList/resources/LongOperationsListUserPhotoTemplate',
      'html!SBIS3.CONTROLS.LongOperationsList/resources/LongOperationsListNameTemplate',
      'js!SBIS3.CONTROLS.DataGridView'
   ],

   function (Deferred, TimeInterval, CompoundControl, LongOperationEntry, Model, longOperationsManager, InformationPopupManager, dotTplFn) {
      'use strict';

      /**
       * Интервал обновления времени выполнения операции
       * @type {number}
       */
      var TIMESPENT_DURATION = 5000;

      /**
       * Продолжительность одного мигания анимации завершённых операций
       * @type {number}
       */
      var ANIM_BLINK_DURATION = 400;//700

      /**
       * Количество миганий анимации завершённых операций
       * @type {number}
       */
      var ANIM_BLINK_COUNT = 3;

      /**
       * При открытии анимировать все операции, завершённые не ранее такого времени
       * @type {number}
       */
      var ANIM_NOTEARLY = 1000;



      /**
       * Класс для отображения списка длительных операций
       * @class SBIS3.CONTROLS.LongOperationsList
       * @extends SBIS3.CORE.CompoundControl
       */
      var LongOperationsList = CompoundControl.extend({
         _dotTplFn: dotTplFn,
         $protected: {
            _options: {
               columns: {
                  status: true,
                  startedAt: true,
                  title: true,
                  timeSpent: true,
                  userPic: true
               },
               pageSize: 50,
               infiniteScroll: 'down',
               hasSeparator: false,

               listName: 'browserView',
               userId: null,

               noLoad: false
            },

            _view: null,
            _spentTiming: null,
            _animQueue: [],
            _animating: null,
            _notFirst: null
         },

         $constructor: function () {
            var context = this.getLinkedContext();
            context.setValue('filter', {});
            if (this._options.userId) {
               context.setValue('filter/UserId', this._options.userId);
            }
            if (this._options.columns.userPic) {
               context.setValue('filter/needUserInfo', true);
            }
            this._publish('onlongoperationstarted', 'onlongoperationchanged', 'onlongoperationended', 'onlongoperationdeleted', 'onproducerregistered', 'onproducerunregistered', 'ontimespentchanged');
         },

         init: function () {
            LongOperationsList.superclass.init.call(this);

            var self = this;
            this._view = this.getChildControlByName(this._options.listName);

            var titles = {
               resume: rk('Возобновить'),
               suspend: rk('Приостановить', 'ДлительныеОперации'),
               'delete': rk('Удалить')
            };
            this._view.setItemsActions([
               {
                  name: 'resume',
                  icon: 'sprite:icon-16 icon-DayForward icon-primary action-hover',
                  caption: titles.resume,
                  tooltip: titles.resume,
                  isMainAction: true,
                  onActivated: function ($item, id, model) {
                     self.applyUserAction('resume',  model, true);
                  }
               },
               {
                  name: 'suspend',
                  icon: 'sprite:icon-16 icon-Pause icon-primary action-hover',
                  caption: titles.suspend,
                  tooltip: titles.suspend,
                  isMainAction: true,
                  onActivated: function ($item, id, model) {
                     self.applyUserAction('suspend', model, true);
                  }
               },
               {
                  name: 'delete',
                  icon: 'sprite:icon-16 icon-Erase icon-error',
                  caption: titles['delete'],
                  tooltip: titles['delete'],
                  isMainAction: true,
                  onActivated: function ($item, id, model) {
                     self.applyUserAction('delete',  model, true);
                  }
               }
            ]);

            this._view._loadNextPage = this._reload.bind(this, false);

            this._bindEvents();
         },

         _bindEvents: function () {
            var self = this;
            var STATUSES = LongOperationEntry.STATUSES;

            ['onlongoperationstarted', 'onlongoperationchanged', 'onlongoperationended', 'onlongoperationdeleted', 'onproducerregistered', 'onproducerunregistered'].forEach(function (evtType) {
               self.subscribeTo(longOperationsManager, evtType, function (evtName, evt) {
                  var dontReload;
                  switch (evtName.name) {
                     case 'onlongoperationchanged':
                        var items = self.getItems();
                        if (items && items.getCount()) {
                           var model = items.getRecordById(Model.getFullId(evt.tabKey, evt.producer, evt.operationId));
                           if (model) {
                              if (evt.changed === 'progress') {
                                 model.set('progressCurrent', evt.progress.value);
                                 model.set('progressTotal', evt.progress.total);
                              }
                              else {
                                 model.set(evt.changed, evt[evt.changed]);
                              }
                              self._setItems(items);
                              dontReload = true;
                           }
                        }
                        break;
                     case 'onlongoperationended':
                        self._animationAdd(Model.getFullId(evt.tabKey, evt.producer, evt.operationId), !evt.error);
                        self._animationRun();
                        break;
                  }
                  self._notify(evtName.name, evt);
                  if (!dontReload) {
                     self.reload();
                  }
               });
            });

            this.subscribeTo(this._view, /*'onPropertiesChanged'*/'onPropertyChanged', function (evtName, property) {
               if (property === 'filter') {
                  self.reload();
               }
            });

            //У приостановленных операций нужно менять цвет текста, поэтому навешиваем класс
            this.subscribeTo(this._view, 'onDrawItems', function () {
               var items = self.getItems();
               if (items) {
                  var $cont = self._view.getContainer();
                  items.each(function (item, id) {
                     if (item.get('status') === STATUSES.suspended) {
                        $cont.find('.js-controls-ListView__item[data-id="' + item.getId() + '"]').addClass('LongOperationsList__view_stoppedOperation');
                     }
                  });
               }
            });

            //Нужно показывать разные действия в зависимости от состояния операции
            this.subscribeTo(this._view, 'onChangeHoveredItem', function (event, item) {
               if (item.record) {
                  var instances = this.getItemsActions().getItemsInstances();
                  for (var itemAction in instances) {
                     if (instances.hasOwnProperty(itemAction)) {
                        var status = item.record.get('status');

                        var hide = (itemAction === 'resume' || itemAction === 'suspend')
                                    && (status === STATUSES.ended || status === STATUSES.running && itemAction === 'resume' || status === STATUSES.suspended && itemAction === 'suspend');

                        /*Прикладной разработчик может запретить показывать операции удаления и остановки*/
                        if (!hide) {
                           hide = itemAction === 'suspend' && !item.record.get('canSuspend') || itemAction === 'delete' && !item.record.get('canDelete');
                        }

                        instances[itemAction][hide ? 'hide' : 'show']();
                     }
                  }
               }
            });
         },

         /**
          * Получить датагрид
          * @public
          * @return {SBIS3.CONTROLS.DataGridView}
          */
         getView: function () {
            return this._view;
         },

         /**
          * Получить текущие отображаемые элементы списка
          * @public
          * @return {DataSet}
          */
         getItems: function () {
            return this._view.getItems();
         },

         /**
          * Установить новые отображаемые элементы списка
          * @public
          * @param {WS.Data/Collection/RecordSet}
          */
         _setItems: function (items) {
            this._view.setItems(items);
            var hasRun;
            if (items && items.getCount()) {
               var STATUSES = LongOperationEntry.STATUSES;
               var from = !this._notFirst ? (new Date()).getTime() - ANIM_NOTEARLY : null;
               items.each(function (model) {
                  var status = model.get('status');
                  if (!this._notFirst
                        && status === STATUSES.ended
                        && from < model.get('startedAt').getTime() + model.get('timeSpent')) {
                     this._animationAdd(model.getId(), !model.get('isFailed'));
                  }
                  if (!hasRun && status === STATUSES.running) {
                     hasRun = true;
                  }
               }.bind(this));
            }
            this._notFirst = true;
            if (hasRun) {
               if (!this._spentTiming) {
                  this._spentTiming = setInterval(this._changeSpentTime.bind(this), TIMESPENT_DURATION);
               }
            }
            else
            if (this._spentTiming) {
               clearInterval(this._spentTiming);
               this._spentTiming = null;
            }
            this._animationRun();
         },

         /**
          * Изенить отображаемое время выполнения операций
          * @protected
          */
         _changeSpentTime: function () {
            var items = this._view.getItems();
            if (items && items.each) {
               var STATUSES = LongOperationEntry.STATUSES;
               var $cont = this._view.getContainer();
               var itemProjection = this._view._getItemsProjection();
               itemProjection.setEventRaising(false);
               var time = (new Date()).getTime();
               items.each(function (model) {
                  if (model.get('status') === STATUSES.running) {
                     model.set('timeSpent', time - model.get('startedAt'));
                     $cont.find('.js-controls-ListView__item[data-id="' + model.getId() + '"]')
                        .find('.controls-LongOperationsList__executeTimeContainer').html(model.get('strTimeSpent'));
                  }
               });
               itemProjection.setEventRaising(true);
            }
            this._notify('ontimespentchanged');
         },

         /**
          * Запросить и отобразить (по получению) все элементы списка заново
          * @public
          * @return {Core/Deferred}
          */
         reload: function () {
            return this._reload(true);
         },

         /**
          * Запросить и отобразить (по получению) все элементы списка заново
          * @protected
          * @param {boolean} force Начать заново, а не загружать следующую страницу
          * @return {Core/Deferred}
          */
         _reload: function (force) {
            var view = this._view;
            if (force) {
               var side = view._infiniteScrollState.mode == 'down' || view._infiniteScrollState.mode == 'demand' ? 'bottom' : 'top';
               if (0 < view._scrollOffset[side]) {
                  view._scrollOffset[side] = 0;
               }
            }
            return longOperationsManager.fetch(this._gatherFetchOptions(force))
               .addCallback(function (results) {
                  if (!this._isDestroyed) {
                     //###view._notify('onDataLoad', results);
                     var has = !!results.getCount();
                     var items = results;
                     if (!force) {
                        var prev = view.getItems();
                        if (prev && prev.getCount() && has) {
                           view._toggleEmptyData(false);
                           prev.append(results);
                           items = prev;
                           items.setMetaData(results.getMetaData());
                        }
                     }
                     if (force || has) {
                        this._setItems(items);
                     }
                     if (!force && has) {
                        view._updateScrollOffset();
                        if (!view._hasNextPage(items.getMetaData().more/*, view._scrollOffset.bottom*/)) {
                           view._toggleEmptyData(!items.getCount());
                        }
                     }
                  }
               }.bind(this));
         },

         /**
          * Собрать параметры запроса данных
          * @protected
          * @param {boolean} force Начать заново, а не загружать следующую страницу
          * @returns {object}
          */
         _gatherFetchOptions: function (force) {
            var options = {};
            var view = this._view;
            var filter = view.getFilter();
            if (filter) {
               var where = {};
               if (filter.status) {
                  var STATUSES = LongOperationEntry.STATUSES;
                  switch (filter.status) {
                     case 'running':
                     case 'suspended':
                     case 'ended':
                        where.status = STATUSES[filter.status];
                        break;
                     case 'not-suspended':
                        where.status = [STATUSES.running, STATUSES.ended];
                        break;
                     case 'success-ended':
                        where.status = STATUSES.ended;
                        where.isFailed = null;
                        break;
                     case 'error-ended':
                        where.status = STATUSES.ended;
                        where.isFailed = true;
                        break;
                  }
               }
               if (filter.period) {
                  where.startedAt = {condition:'>=', value:(new TimeInterval(filter.period)).subFromDate(new Date())};
               }
               if (filter.duration) {
                  where.timeSpent = {condition:'>=', value:(new TimeInterval(filter.duration)).getTotalMilliseconds()};
               }
               if (filter['СтрокаПоиска']) {
                  where.title = {condition:'contains', value:filter['СтрокаПоиска'], sensitive:false};
                  /*if (filter.usePages) {
                  }*/
               }
               if (Object.keys(where).length) {
                  options.where = where;
               }
            }
            var sorting = view.getSorting();
            if (sorting && sorting.length) {
               options.orderBy = sorting;
            }
            var offset = force ? view.getOffset()/*0*/ : view._getNextOffset()/*view.getOffset() + view.getPageSize()*/;
            if (0 <= offset) {
               options.offset = offset;
            }
            var limit = view.getPageSize();
            if (0 < limit) {
               options.limit = limit;
            }
            if (filter.needUserInfo) {
               options.extra = {needUserInfo:true};
            }
            return Object.keys(options).length ? options : null;
         },

         /**
          * Проверить, может ли длительная операция иметь историю
          * @public
          * @param {SBIS3.CONTROLS.LongOperationsList/resources/model} model Модель длительной операции
          * @returns {boolean}
          */
         canHasHistory: function (model) {
            return !!model && longOperationsManager.canHasHistory(model.get('tabKey'), model.get('producer'));
         },

         /**
          * Выполнить действие над длительной операцией, инициированное пользователем
          * @public
          * @param {string} action Имя действия (resume, suspend, delete)
          * @param {SBIS3.CONTROLS.LongOperationsList/resources/model} model Модель длительной операции
          * @param {boolean} reload Вызвать метод reload после выполнения действия
          * @returns {Core/Deferred}
          */
         applyUserAction: function (action, model, reload) {
            if (!(action === 'suspend' || action === 'resume' ? model.get('canSuspend') : (action === 'delete' ? model.get('canDelete') : null))) {
               return Deferred.fail('Action not allowed');
            }
            var promise = longOperationsManager.callAction(action, model.get('tabKey'), model.get('producer'), model.get('id'));
            if (reload) {
               promise.addCallback(this.reload.bind(this));
            }
            return promise;
         },

         /**
          * Выполнить результирующее действие длительной операции. Возвращает true если дальнейшая обработка не нужна
          * @public
          * @param {SBIS3.CONTROLS.LongOperationsList/resources/model} model Модель длительной операции
          * @return {boolean}
          */
         applyResultAction: function (model) {
            if (model.get('status') !== LongOperationEntry.STATUSES.ended && !model.get('isFailed')) {
               return false;
            }
            var handler = model.get('resultHandler');
            var url = model.get('resultUrl');
            if (handler || url) {
               // Если есть хоть какой-то результат для показа - проверить не истёк ли его срок годности
               var until = model.get('resultValidUntil');
               if (until && until < new Date()) {
                  InformationPopupManager.showMessageDialog({
                     message:rk('Операция устарела.'),
                     details:rk('Выполните повторно.')
                  });
                  return true;
               }
            }
            if (handler) {
               var path = handler.split(':');
               require([path.shift()], function (module) {
                  var args = model.get('resultHandlerArgs');
                  if (args) {
                     if (typeof args === 'string') {
                        try {
                           args = JSON.parse(args);
                        }
                        catch (ex) {}
                     }
                     if (!Array.isArray(args)) {
                        args = [args];
                     }
                  }
                  else {
                     args = [];
                  }
                  if (1 < path.length && !(args.length === 0 || args.length === path.length)) {
                     throw new Error('Handler and its arguments are not compatible');
                  }
                  if (path.length) {
                     for (var subject = module; path.length; ) {
                        if (!subject || typeof subject !== 'object') {
                           throw new Error('Subhandler is or not valid');
                        }
                        var method = path.shift();
                        if (typeof subject[method] !== 'function') {
                           throw new Error('Handler method is or not valid');
                        }
                        var arg = args.length ? args.shift() : [];
                        subject = subject[method].apply(subject, Array.isArray(arg) ? arg : [arg]);
                     }
                  }
                  else {
                     if (!module || typeof module !== 'function') {
                        throw new Error('Handler is or not valid');
                     }
                     module.apply(null, args);
                  }
               });
               return true;
            }
            if (url) {
               /*Если файл нужно скачать, воспользуемся стандартным способом, созданием ссылку с аттрибутом и дернем триггер клик */
               if (model.get('resultUrlAsDownload')) {
                  var a = document.createElement('a');
                  a.setAttribute('href', url);
                  a.setAttribute('download', '');
                  /*Для совместимости с IE ссылку нужно вставить в DOM, иначе работать не будет*/
                  a.style.display = 'none';
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
               }
               else {
                  window.open(url, '_blank');
               }
               return true;
            }
            return false;
         },

         /**
          * Начать анимацию согласно имеющейся очереди анимации завершённых операций
          * @public
          */
         animationStart: function () {
            this._animationRun();
         },

         /**
          * Прекратить анимацию и очистить очередь анимации завершённых операций
          * @public
          */
         animationClear: function () {
            if (this._animating) {
               clearTimeout(this._animating);
               this._animating = null;
            }
            if (this._animQueue.length) {
               for (var i = 0; i < this._animQueue.length; i++) {
                  this._animQueue[i].remain = 1;
               }
               this._animationStep();
            }
         },

         /**
          * Добавить в очередь анимации завершённых операций
          * @protected
          * @param {string} itemId Идентификатор
          * @param {boolean} isSuccess Указывает на успешность завершения операции
          */
         _animationAdd: function (itemId, isSuccess) {
            if (!this._animQueue.length || !this._animQueue.some(function (v) { return v.id === itemId; })) {
               this._animQueue.push({id:itemId, isSuccess:isSuccess, remain:2*ANIM_BLINK_COUNT});
            }
         },

         /**
          * Запустить выполнение очереди анимации завершённых операций
          * @protected
          * @param {boolean} dontUp Не повторять предыдущий шаг
          */
         _animationRun: function (dontUp) {
            var needUp = !dontUp && !!this._animating;
            if (this._animating) {
               clearTimeout(this._animating);
               this._animating = null;
            }
            if (this._view.getContainer().is(':visible')) {
               this._animationStep(needUp);
               if (this._animQueue.length) {
                  this._animating = setTimeout(this._animationRun.bind(this, true), ANIM_BLINK_DURATION);
               }
            }
         },

         /**
          * Выполнить очередной шаг по очереди анимации завершённых операций
          * @protected
          * @param {boolean} needUp Повторить предыдущий шаг
          */
         _animationStep: function (needUp) {
            if (this._animQueue.length) {
               var $cont = this.getContainer();
               for (var i = this._animQueue.length - 1; 0 <= i; i--) {
                  var item = this._animQueue[i];
                  var $line = $cont.find('.js-controls-ListView__item[data-id="' + item.id + '"]');
                  if (!$line.length) {
                     this._animQueue.splice(i, 1);
                  }
                  if (needUp) {
                     item.remain++;
                  }
                  $line.toggleClass(item.isSuccess ? 'controls-LongOperationsPopup__successCompletedOperation' : 'controls-LongOperationsPopup__errorCompletedOperation', item.remain%2 === 0);
                  item.remain--;
                  if (item.remain <= 0) {
                     this._animQueue.splice(i, 1);
                  }
               }
            }
         },

         /**
          * Разрушить объект
          * @public
          */
         destroy: function () {
            if (this._spentTiming) {
               clearInterval(this._spentTiming);
               this._spentTiming = null;
            }
            if (this._animating) {
               clearTimeout(this._animating);
               this._animating = null;
            }
            LongOperationsList.superclass.destroy.call(this);
         }
      });

      return LongOperationsList;
   }
);
