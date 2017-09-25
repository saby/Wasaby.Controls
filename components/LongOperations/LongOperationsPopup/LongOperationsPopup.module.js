define('js!SBIS3.CONTROLS.LongOperationsPopup',
   [
      "Core/UserInfo",
      "Core/core-merge",
      'Core/Deferred',
      'Core/EventBus',
      /*###"Core/helpers/string-helpers",*/
      'js!SBIS3.CORE.TabMessage',
      /*###'js!SBIS3.CONTROLS.WaitIndicator',*/
      "js!SBIS3.CONTROLS.NotificationPopup",
      'js!SBIS3.CONTROLS.LongOperationEntry',
      'js!SBIS3.CONTROLS.LongOperationsList/resources/model',
      "html!SBIS3.CONTROLS.LongOperationsPopup/resources/headerTemplate",
      "html!SBIS3.CONTROLS.LongOperationsPopup/resources/contentTemplate",
      "html!SBIS3.CONTROLS.LongOperationsPopup/resources/footerTemplate",
      "js!SBIS3.CORE.FloatArea",
      "css!SBIS3.CONTROLS.LongOperationsPopup",
      "js!SBIS3.CONTROLS.LongOperationsList"
   ],

   function (UserInfo, cMerge, Deferred, EventBus, /*###strHelpers,*/ TabMessage, /*###WaitIndicator,*/ NotificationPopup, LongOperationEntry, Model, headerTemplate, contentTpl, footerTpl, FloatArea) {
      'use strict';

      var FILTER_NOT_SUSPENDED = 'not-suspended';

      var DEFAULT_WAITINDICATOR_TEXT = rk('Пожалуйста, подождите…');

      /**
       * Класс всплывающего информационное окна длительных операций
       * @class SBIS3.CONTROLS.LongOperationsPopup
       * @extends SBIS3.CONTROLS.NotificationPopup
       *
       * @author Спирин Виктор Алексеевич
       */
      var LongOperationsPopup = NotificationPopup.extend(/** @lends SBIS3.CONTROLS.LongOperationsPopup.prototype */{
         $protected: {
            _options: {
               userId: UserInfo.get('Пользователь'),
               isHint: false,
               headerTemplate: headerTemplate,
               bodyTemplate: contentTpl,
               footerTemplate: footerTpl,
               caption: '',
               className: 'controls-LongOperations controls-LongOperationsPopup controls-LongOperationsPopup__hidden controls-LongOperationsPopup__hiddenContentMode',
               withAnimation: null,
               waitIndicatorText: null
            },

            _activeOperation: null,
            _firstOperationMode: false,
            _floatAreaMode: false,

            _longOpList: null,

            _notificationContainer: null,
            _progressContainer: null,

            _tabChannel: null,

            _loadingIndicator: null,
            _isInStartAnimation: null
         },

         $constructor: function () {
            this._publish('onSizeChange');
         },

         init: function () {
            LongOperationsPopup.superclass.init.call(this);

            if (this._options.withAnimation) {
               this._animationAtStart();
            }

            this._longOpList = this.getChildControlByName('operationList');
            this._notificationContainer = this.getContainer().find('.controls-LongOperationsPopup__footer_notification');
            this._progressContainer = this.getContainer().find('.controls-LongOperationsPopup__footer_progress_container');

            this._tabChannel = new TabMessage();

            this._bindEvents();
            //this._longOpList.reload();
         },

         _bindEvents: function () {
            var self = this;

            /*Если пользователь закроет в одной вкладке, закрываем на всех вкладках*/
            this.subscribeTo(this, 'onClose', function () {
               if (self.isVisible()) {
                  self._tabChannel.notify('LongOperations:Popup:onClosed');
               }
            });
            this.subscribeTo(this._tabChannel, 'LongOperations:Popup:onClosed', function () {
               if (!self._isDestroyed) {
                  self.close();
               }
            });

            ['onlongoperationstarted', 'onlongoperationchanged', 'onlongoperationended', 'onlongoperationdeleted', 'onproducerregistered', 'onproducerunregistered'].forEach(function (evtType) {
               self.subscribeTo(self._longOpList, evtType, function (evtName, evt) {
                  self._onOperation(evtType, evt);
               });
            });

            var view = this._longOpList.getView();//this._longOpList.getChildControlByName('operationListDataGrid')

            this.subscribeTo(view, 'onDrawItems'/*'onItemsReady'*/, function () {
               var items = self._longOpList.getItems();
               var count = items ? items.getCount() : 0;
               if (count) {
                  self._activeOperation = null;
                  if (count === 1) {
                     self._setFirstOperationMode(true);
                     self._activeOperation = items.getRecordById(items.at(0).getId());
                  }
                  else {
                     self._setFirstOperationMode(false);
                     items.each(function (item, id) {
                        if (!self._activeOperation && item.get('status') === LongOperationEntry.STATUSES.running) {
                           self._activeOperation = item;
                           return false;
                        }
                     });
                     if (!self._activeOperation) {
                        self._activeOperation = items.getRecordById(items.at(0).getId());
                     }
                  }
                  self._updateState();

                  var cls = 'controls-LongOperationsPopup__hidden';
                  var $ctr = self.getContainer();
                  if ($ctr.hasClass(cls)) {
                     $ctr.css('opacity', 0);
                     $ctr.removeClass(cls);
                     $ctr.animate({opacity:1}, 800);//1500
                  }

                  //При перерисовке размеры могут меняться
                  self._notify('onSizeChange');
               }
               else {
                  //Если операций нет, просто закрываем попап
                  self.close();
               }
            });

            var clickHandler = function (item) {
               if (!self._longOpList.applyResultAction(item)) {
                  // Если действие ещё не обработано
                  var STATUSES = LongOperationEntry.STATUSES;
                  var status = item.get('status');
                  var canHasHistory = self._longOpList.canHasHistory(item);
                  //Открыть журнал операций только для завершенных составных операций или ошибок
                  if (status === STATUSES.ended && (item.get('isFailed') || (canHasHistory && 1 < item.get('progressTotal')))) {
                     var options = {};
                     self._showFloatArea({
                        title: rk('Журнал выполнения операции'),
                        template: 'js!SBIS3.CONTROLS.LongOperationHistory',
                        componentOptions: canHasHistory ? {
                           /*###key: item.getId(),*/
                           tabKey: item.get('tabKey'),
                           producer: item.get('producer'),
                           operationId: item.get('id'),
                           isFailed: item.get('isFailed')
                        } : {
                           failedOperation: item
                        },
                        maxWidth: 680
                     });
                  }
               }
            };

            //При клике по записи, открываем журнал операции или ссылку, если она есть
            this.subscribeTo(view, 'onItemActivate', function (e, meta) {
               clickHandler(meta.item);
            });

            this.subscribeTo(this.getChildControlByName('downloadButton'), 'onActivated', function () {
               if (self._activeOperation) {
                  clickHandler(self._activeOperation);
               }
            });

            //Открытие реестра операций
            this.subscribeTo(this.getChildControlByName('registryOperationButton'), 'onActivated', function () {
               self._showFloatArea({
                  title: rk('Все операции'),
                  template: 'js!SBIS3.CONTROLS.LongOperationsRegistry',
                  componentOptions: {
                     columns: {
                        userPic: false
                     },
                     userId: self._options.userId
                  }
               });
            });

            var container = this.getContainer();
            container.find('.controls-LongOperationsPopup__hideContentIcon').on('click', function () {
               //Показать / Скрыть контент
               self._toggleContent();
               //Возможно после раскрытия нужно известить о выполненых операциях
               self._longOpList[self._isContentHidden() ? 'animationClear' : 'animationStart']();
            });

            container.find('.controls-LongOperationsPopup__footer_pauseIcon').on('click', function () {
               //Остановить / Запустить операцию
               self._longOpList.applyUserAction($(this).hasClass('icon-Pause') ? 'suspend' : 'resume', self._activeOperation);
            });

            //Иконку запуска сделаем кликабельной, по ней будет запускать остановленная операция
            container.find('.controls-NotificationPopup__header').on('click', '.controls-LongOperationsPopup__runOperationIcon', function () {
               //Запустить операцию
               self._longOpList.applyUserAction('resume', self._activeOperation);
            });

            //Обработчик, который применяет фильтр "Скрыть приостановленные"
            var button = container.find('.controls-LongOperationsPopup__header_stoppedOperationsButton');
            button.on('click', function () {
               if (button.hasClass('controls-LongOperationsPopup__header_stoppedOperations-show')) {
                  self._longOpList.getLinkedContext().setValue('filter/status', FILTER_NOT_SUSPENDED);
               }
               else {
                  self._longOpList.getLinkedContext().setValue('filter', {});
               }
               button.toggleClass('controls-LongOperationsPopup__header_stoppedOperations-show');
            });

            this.subscribeTo(this._longOpList, 'ontimespentchanged', function () {
               if (self._activeOperation) {
                  self._setFooterTimeSpent(self._activeOperation.get('shortTimeSpent'));
               }
            });

            // Обновить попап после разблокировки девайса
            this.subscribeTo(EventBus.globalChannel(), 'onwakeup', function () {
               if(!self.isDestroyed() && self.isVisible()) {
                  self._longOpList.reload();
               }
            });
         },

         /**
          * Метод показывает floatArea.
          * @param params Уникальные параметры.
          */
         _showFloatArea: function (params) {
            var self = this;

            var floatArea = new FloatArea(cMerge({
               opener: self,
               direction: 'left',
               animation: 'slide',
               isStack: true,
               autoCloseOnHide: true,
               maxWidth: 1000
            }, params));

            //Скрываем нашу панель, во время работы с floatArea, она не нужна
            self._toggleFloatAreaMode(true);

            self._notify('onSizeChange');

            self.subscribeOnceTo(floatArea, 'onAfterClose', function () {
               self._toggleFloatAreaMode(false);
               self._notify('onSizeChange');
            });
         },

         /**
          * Переключить floatArea-моду
          */
         _toggleFloatAreaMode: function (toggle) {
            this._floatAreaMode = !!toggle;
            //Скрываем панель, во время работы с floatArea, она не нужна
            this.setVisible(!toggle);
         },

         /**
          * Проверить, активен ли режим с floatArea.
          * НЕ ИСПОЛЬЗУЕТСЯ
          */
         /*###isFloatAreaMode: function () {
            return !!this._floatAreaMode;
         },*/

         /**
          * Метод перезагружает список и обновляет состояние
          * @return {Core/Deferred}
          */
         /*###reload: function () {
            return this._longOpList.reload();
         },*/

         /**
          * Установливает заголовок нотификационного уведомления.
          * @param {String} caption Текст заголовка.
          */
         setCaption: function (caption) {
            LongOperationsPopup.superclass.setCaption.call(this, caption);
            if(typeof caption === 'string'){
               this.getContainer().find('.controls-NotificationPopup__header_caption').attr('title', caption);
            }
         },

         /**
          * Изменить заголовок, иконку и статус
          * @param {string} title Заголовок
          * @param {string} statusName Название статуса
          * @param {string} iconClass Классы иконки
          */
         _setHeader: function (title, statusName, iconClass) {
            this.setCaption(title);
            this.setStatus(statusName);
            this.setIcon(iconClass);

            var STATUSES = LongOperationEntry.STATUSES;
            var model = this._activeOperation;
            var butCaption;
            if (model.get('status') === STATUSES.ended) {
               var wayOfUse = model.get('resultWayOfUse');
               if (!model.get('isFailed')) {
                  if (model.get('resultUrl')) {
                     butCaption = wayOfUse || 'Скачать';
                  }
                  else
                  if (model.get('resultHandler')) {
                     butCaption = wayOfUse || 'Открыть';
                  }
                  else
                  if (1 < model.get('progressTotal') && this._longOpList.canHasHistory(model)) {
                     butCaption = wayOfUse || 'Журнал';
                  }
               }
               else {
                  butCaption = wayOfUse || 'Журнал';
               }
            }

            var hasButton = !!butCaption;
            var button = this.getChildControlByName('downloadButton');
            button.setVisible(hasButton);
            if (hasButton) {
               button.setCaption(rk(butCaption));
            }
         },

         /**
          * Обновить состояние панели.
          */
         _updateState: function () {
            var model = this._activeOperation;
            if (model) {
               var STATUSES = LongOperationEntry.STATUSES;
               var title = model.get('title');

               //Кнопка остановки / запуска операции
               var pauseIcon = this.getContainer().find('.controls-LongOperationsPopup__footer_pauseIcon');

               var status = model.get('status');
               switch (status) {
                  case STATUSES.running:
                     this._setHeader(title, 'default', 'icon-size icon-24 controls-LongOperationsPopup__header_icon-customIcon');
                     if (model.get('canSuspend')) {
                        pauseIcon.removeClass('ws-hidden').addClass('icon-Pause').removeClass('icon-DayForward');
                     }
                     else {
                        pauseIcon.addClass('ws-hidden');
                     }
                     break;

                  case STATUSES.suspended:
                     this._setHeader(title, 'default', 'icon-size icon-24 icon-DayForward icon-primary controls-LongOperationsPopup__runOperationIcon');
                     if (model.get('canSuspend')) {
                        pauseIcon.removeClass('ws-hidden').removeClass('icon-Pause').addClass('icon-DayForward');
                     }
                     else {
                        pauseIcon.addClass('ws-hidden');
                     }
                     break;

                  case STATUSES.ended:
                     var isSuccess = !model.get('isFailed');
                     this._setHeader(title, isSuccess ? 'success' : 'error', isSuccess ? 'icon-size icon-24 icon-Yes icon-done' : 'icon-size icon-24 icon-Alert icon-error');
                     pauseIcon.addClass('ws-hidden');
                     break;
               }

               var notification = model.get('notification');
               if (notification) {
                  this._setNotification(notification);
               }
               else {
                  this._setProgress(model.get('progressCurrent'), model.get('progressTotal'), status === STATUSES.ended);
               }

               this._setFooterTimeSpent(model.get('shortTimeSpent'));
            }
         },

         /**
          * Проверить скрыт ли контент.
          */
         _isContentHidden: function () {
            return this.getContainer().hasClass('controls-LongOperationsPopup__hiddenContentMode');
         },

         /**
          * Изменить видимость контента.
          */
         _toggleContent: function (f) {
            this.getContainer().toggleClass('controls-LongOperationsPopup__hiddenContentMode', f === undefined ? undefined : !f);
            this._notify('onSizeChange');
         },

         /**
          * Изменить режим панели.
          * @param f Флаг - включить или отключить.
          */
         _setFirstOperationMode: function (f) {
            if (f !== this._isFirstOperationMode()) {
               if (f) {
                  //Скрываем контент
                  this._toggleContent(false);
               }
               this._toggleFirstOperationMode();
            }
         },

         /**
          * Проверить включен ли режим одной операции.
          */
         _isFirstOperationMode: function () {
            return this.getContainer().find('.controls-LongOperationsPopup__footer').hasClass('controls-LongOperationsPopup__footer_firstOperationMode');
         },

         /**
          * Изменить режим одной операции.
          */
         _toggleFirstOperationMode: function () {
            this.getContainer().find('.controls-LongOperationsPopup__footer').toggleClass('controls-LongOperationsPopup__footer_firstOperationMode');
         },

         _setProgress: function (current, total, isEnded) {
            this._notificationContainer.addClass('ws-hidden');
            this._progressContainer.removeClass('ws-hidden');
            if (!(0 < total)) {
               total = 1;
               current = isEnded ? 1 : (0 < current ? 1 : 0);
            }

            /*###var message;
            if (100 <= total) {
               message = current + ' / ' + total + ' ' + rk('операций');
            }
            else {
               message =
                  strHelpers.wordCaseByNumber(current, rk('Выполнено', 'ДлительныеОперации'), rk('Выполнена', 'ДлительныеОперации'), rk('Выполнено', 'ДлительныеОперации'))
                  + ' ' + current + ' ' +
                  strHelpers.wordCaseByNumber(current, rk('операций'), rk('операция'), rk('операции')) + ' ' + rk('из') + ' ' + total;
            }*/
            var needMsg = total !== 1;
            var $tasks = this.getContainer().find('.controls-LongOperationsPopup__footer_execTasks');
            $tasks[needMsg ? 'removeClass' : 'addClass']('ws-hidden');
            if (needMsg) {
               $tasks.text(
                  Math.floor(current) + ' ' + (100 <= total ? '/' : rk('из')) + ' ' + total + ' ' + rk('операций')
               );
            }
            this.getContainer().find('.controls-LongOperationsPopup__footer_progress').text(Math.floor(100*current/total) + '%');
         },

         _setNotification: function (message) {
            this._progressContainer.addClass('ws-hidden');
            this._notificationContainer.text(message).removeClass('ws-hidden');
         },

         _setFooterTimeSpent: function (timeSpent) {
            this.getContainer().find('.controls-LongOperationsPopup__footer_executeTime').text(timeSpent);
         },

         /**
          * Обработать событие
          * @protected
          * @param {string} eventType Тип события
          * @param {object} data данные события
          */
         _onOperation: function (eventType, data) {
            switch (eventType) {
               case 'onlongoperationstarted':
                  if (data.isCurrentTab) {
                     this._animationAtStart();
                  }
                  this._setProgress(0, data.progress ? data.progress.total : 1, false);
                  break;

               case 'onlongoperationchanged':
                  var active = this._activeOperation;
                  switch (data.changed) {
                     case 'status':
                        switch (data.status) {
                           case LongOperationEntry.STATUSES.running:
                              this._setProgress(data.progress ? data.progress.value : 0, data.progress ? data.progress.total : 1, false);
                           case LongOperationEntry.STATUSES.suspended:
                              break;
                        }
                        break;
                     case 'progress':
                        if (active && active.get('tabKey') === data.tabKey && active.get('producer') === data.producer && active.get('id') === data.operationId) {
                           this._setProgress(data.progress.value, data.progress.total, false);
                        }
                        break;
                     case 'notification':
                        if (active && active.get('tabKey') === data.tabKey && active.get('producer') === data.producer && active.get('id') === data.operationId) {
                           this._setNotification(data.notification);
                        }
                        break;
                  }
                  break;

               case 'onlongoperationended':
                  this._setProgress(data.progress ? data.progress.value : 1, data.progress ? data.progress.total : 1, true);
                  var model = this._longOpList.lookupItem(data.tabKey, data.producer, data.operationId);
                  if (model) {
                     this._activeOperation = model;
                     this._updateState();
                  }
                  break;

               case 'onlongoperationdeleted':
               case 'onproducerregistered':
               case 'onproducerunregistered':
                  break;
            }
         },

         _animationAtStart: function () {
            /*Время экспозиции индикатора ожидания перед движением вниз*/
            var TIME_EXPOSITION = 600;//1000
            /*Время движения индикатора ожидания вниз*/
            var TIME_GLIDING = 800;//1500
            /*Время однократного мигания иконки в заголовке*/
            var TIME_BLINKING = 600;//600
            if (this._isInStartAnimation) {
               return;
            }
            this._isInStartAnimation = true;
            var self = this;
            var promise = new Deferred();
            if (!this._loadingIndicator) {
               require(['js!SBIS3.CORE.LoadingIndicator'], function (LoadingIndicator) {
                  self._loadingIndicator = new LoadingIndicator({message:self._options.waitIndicatorText || DEFAULT_WAITINDICATOR_TEXT});
                  self._loadingIndicator.show();
                  promise.callback();
               });
            }
            else {
               this._loadingIndicator.setMessage(this._options.waitIndicatorText || DEFAULT_WAITINDICATOR_TEXT);
               this._loadingIndicator.show();
               promise.callback();
            }
            promise.addCallback(function () {
               setTimeout(function () {
                  if (!self.isDestroyed() && self.isVisible()
                        //Если активен режим с floatArea (открыт журнал), то просто скрываем ромашку. Анимация не нужна.
                        && !self._floatAreaMode) {
                     var _moveTo = function ($target, zIndex, $element) {
                        var offset = $target.offset();
                        $element
                           .clone()
                           .appendTo('body')
                           .css({
                              'position' : 'absolute',
                              'z-index' : zIndex,
                              'top' : $element.offset().top,
                              'left': $element.offset().left
                           })
                           .animate({
                              top: offset.top - 4,
                              left: offset.left - 4
                           }, TIME_GLIDING, function () {
                              $(this).remove();
                              self._isInStartAnimation = null;
                              $target.animate({
                                 opacity: 0
                              }, TIME_BLINKING/2, function () {
                                 $target.animate({
                                    opacity: 1
                                 }, TIME_BLINKING/2);
                              });
                           });
                     };
                     var $cnt = self.getContainer();
                     _moveTo($cnt.find('.controls-NotificationPopup__header_icon'), +$cnt.css('z-index') + 1, self._loadingIndicator.getWindow().getContainer().find('.ws-loadingimg'));
                  }
                  var zIndex = +self._loadingIndicator.getWindow().getContainer().closest('.ws-LoadingIndicator__window').css('z-index');
                  self._loadingIndicator.close();
                  self._loadingIndicator = null;
                  require('Core/WindowManager').releaseZIndex(zIndex);
                  self.moveToTop();
               }, TIME_EXPOSITION);
            });
         },

         destroy: function () {
            this._tabChannel.destroy();
            this._tabChannel = null;

            var container = this.getContainer();
            [
               '.controls-NotificationPopup__header_caption',
               '.controls-LongOperationsPopup__hideContentIcon',
               '.controls-LongOperationsPopup__footer_pauseIcon',
               '.controls-NotificationPopup__header',
               '.controls-LongOperationsPopup__header_stoppedOperationsButton'
            ].forEach(function (selector) {
               container.find(selector).off('click');
            });

            LongOperationsPopup.superclass.destroy.call(this);
         }
      });

      LongOperationsPopup.resizable = false;
      return LongOperationsPopup;
   }
);