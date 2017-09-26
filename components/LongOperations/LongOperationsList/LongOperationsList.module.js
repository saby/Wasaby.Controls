define('js!SBIS3.CONTROLS.LongOperationsList',
   [
      'Core/Deferred',
      'Core/IoC',
      'js!SBIS3.CORE.CompoundControl',
      'js!SBIS3.CONTROLS.LongOperationEntry',
      'js!SBIS3.CONTROLS.LongOperationsList/resources/model',
      'js!SBIS3.CONTROLS.LongOperationsManager',
      'js!SBIS3.CONTROLS.LongOperationsList/resources/DataSource',
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

   function (Deferred, IoC, CompoundControl, LongOperationEntry, Model, longOperationsManager, LongOperationsListDataSource, InformationPopupManager, dotTplFn) {
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
       *
       * @author Спирин Виктор Алексеевич
       *
       * @public
       *
       */
      var LongOperationsList = CompoundControl.extend( /** @lends SBIS3.CONTROLS.LongOperationsList.prototype */{
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

            this._view = this.getChildControlByName(this._options.listName);

            //this._view.setItemsActions(this._makeItemsActions(null));

            this._bindEvents();

            this._view.setDataSource(new LongOperationsListDataSource());
         },

         _bindEvents: function () {
            var self = this;
            var STATUSES = LongOperationEntry.STATUSES;

            ['onlongoperationstarted', 'onlongoperationchanged', 'onlongoperationended', 'onlongoperationdeleted', 'onproducerregistered', 'onproducerunregistered'/*, 'ondestroy'*/].forEach(function (evtType) {
               self.subscribeTo(longOperationsManager, evtType, function (evtName, evt) {
                  var dontReload;
                  switch (evtName.name) {
                     case 'onlongoperationchanged':
                        var model = self.lookupItem(evt.tabKey, evt.producer, evt.operationId);;
                        if (model) {
                           if (evt.changed === 'progress') {
                              model.set('progressCurrent', evt.progress.value);
                              model.set('progressTotal', evt.progress.total);
                              dontReload = true;
                           }
                           else {
                              if (evt.changed === 'status') {
                                 if (evt.status === STATUSES.running && model.get('status') === STATUSES.suspended) {
                                    model.set('timeIdle', (new Date()).getTime() - model.get('startedAt').getTime() - model.get('timeSpent'));
                                 }
                              }
                              else {
                                 dontReload = true;
                              }
                              model.set(evt.changed, evt[evt.changed]);
                           }
                           self._checkItems();
                        }
                        else {
                           dontReload = true;
                        }
                        break;
                     case 'onlongoperationended':
                        var model = self.lookupItem(evt.tabKey, evt.producer, evt.operationId);
                        if (model) {
                           self._animationAdd(model.getId(), !evt.error);
                           self._animationRun();
                        }
                        break;
                  }
                  if (evt) {
                     evt.isCurrentTab = evt.tabKey === longOperationsManager.getTabKey();
                  }
                  self._notify(evtName.name, evt);
                  if (!dontReload) {
                     self.reload();
                  }
               });
            });

            //У приостановленных операций нужно менять цвет текста, поэтому навешиваем класс
            this.subscribeTo(this._view, 'onDrawItems', function () {
               var items = self._view.getItems();
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
               var model = item.record;
               if (model) {
                  var actions = self._makeItemsActions(model);
                  var itemsActionsGroup = self._view.getItemsActions();
                  if (itemsActionsGroup) {
                     itemsActionsGroup.setItems(actions);
                  }
                  else
                  if(actions && actions.length) {
                     self._view.setItemsActions(actions);
                  }
               }
            });
         },

         /**
          * Приготовить список доступных действий для указаной модели
          * @protected
          * @return {object[]}
          */
         _makeItemsActions: function (model) {
            var actions = [];
            if (model) {
               var STATUSES = LongOperationEntry.STATUSES;
               var self = this;
               if (model.get('canSuspend') && model.get('status') === STATUSES.running) {
                  // Заголовок зависит от модели
                  var title = rk(model.get('resumeAsRepeat') ? 'Отменить' : 'Приостановить', 'ДлительныеОперации');
                  actions.push({
                     name: 'suspend',
                     icon: 'sprite:icon-16 icon-Pause icon-primary action-hover',
                     caption: title,
                     tooltip: title,
                     isMainAction: true,
                     onActivated: function ($item, id, itemModel) {
                        self.applyUserAction('suspend', itemModel);
                     }
                  });
               }
               if (model.get('canSuspend') && model.get('status') === STATUSES.suspended) {
                  var title = rk(model.get('resumeAsRepeat') ? 'Повторить' : 'Возобновить');
                  actions.push({
                     name: 'resume',
                     icon: 'sprite:icon-16 icon-DayForward icon-primary action-hover',
                     caption: title,
                     tooltip: title,
                     isMainAction: true,
                     onActivated: function ($item, id, itemModel) {
                        self.applyUserAction('resume', itemModel);
                     }
                  });
               }
               if (model.get('canDelete')) {
                  var title = rk('Удалить');
                  actions.push({
                     name: 'delete',
                     icon: 'sprite:icon-16 icon-Erase icon-error',
                     caption: title,
                     tooltip: title,
                     isMainAction: true,
                     onActivated: function ($item, id, itemModel) {
                        self.applyUserAction('delete', itemModel);
                     }
                  });
               }
            }
            return actions;
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
          * Инициировать анимацию и процесс обновления времён выполнения если нужно
          * @public
          */
         _checkItems: function () {
            var hasRun;
            var items = this._view.getItems();
            if (items && items.getCount()) {
               var STATUSES = LongOperationEntry.STATUSES;
               var from = !this._notFirst ? (new Date()).getTime() - ANIM_NOTEARLY : null;
               items.each(function (model) {
                  var status = model.get('status');
                  if (!this._notFirst
                        && status === STATUSES.ended
                        && from < model.get('startedAt').getTime() + model.get('timeSpent') + model.get('timeIdle')) {
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
                  this._spentTiming = setInterval(this._changeTimeSpent.bind(this), TIMESPENT_DURATION);
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
         _changeTimeSpent: function () {
            var items = this._view.getItems();
            if (items && items.each) {
               var STATUSES = LongOperationEntry.STATUSES;
               var $cont = this._view.getContainer();
               var itemProjection = this._view._getItemsProjection();
               itemProjection.setEventRaising(false);
               var time = (new Date()).getTime();
               items.each(function (model) {
                  if (model.get('status') === STATUSES.running) {
                     model.set('timeSpent', time - model.get('startedAt').getTime() - model.get('timeIdle'));
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
            var promise = this._view.reload().addCallback(function () {
               this._checkItems();
            }.bind(this));
            // Индикатор загрузки здесь только приводит к мельканию списка, убрать его
            // Лучше бы конечно, если бы у SBIS3.CONTROLS.ListView была опция "Не показывать индикатор загрузки. Совсем. Никогда."
            this._view.getContainer().find('.controls-AjaxLoader').addClass('ws-hidden').removeClass('controls-AjaxLoader__showIndication');
            return promise;
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
          * @returns {Core/Deferred}
          */
         applyUserAction: function (action, model) {
            if (!(action === 'suspend' || action === 'resume' ? model.get('canSuspend') : (action === 'delete' ? model.get('canDelete') : null))) {
               return Deferred.fail('Action not allowed');
            }
            return longOperationsManager.callAction(action, model.get('tabKey'), model.get('producer'), model.get('id'));
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
                        // Это могут быть как сложные данные в виде json, так и просто одиночная строка
                        try {
                           args = JSON.parse(args);
                        }
                        catch (ex) {
                           // Значит просто строка
                        }
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
          * Найти модель среди загруженных данных
          * @param {string} tabKey Ключ вкладки
          * @param {string} producer Имя продюсера
          * @param {number|string} operationId Идентификатор длительной операции
          * @public
          */
         lookupItem: function (tabKey, producer, operationId) {
            var items = this._view.getItems();
            if (items && items.getCount()) {
               return items.getRecordById(Model.getFullId(tabKey, producer, operationId)) || items.getRecordById(Model.getFullId(null, producer, operationId));
            }
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
