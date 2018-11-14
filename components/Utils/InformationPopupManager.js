define('SBIS3.CONTROLS/Utils/InformationPopupManager',
   [
      'Core/Deferred',
      'Core/core-merge',
      'Core/CompoundContainer',
      'Controls/Popup/Opener/Notification',
      'Controls/Popup/Manager/ManagerController',
      'Controls/Popup/Opener/Notification/NotificationController',
      'SBIS3.CONTROLS/SubmitPopup',
      'SBIS3.CONTROLS/NotificationPopup',
      'browser!SBIS3.CONTROLS/Utils/NotificationStackManager',
      'Core/constants',
      'Core/helpers/Function/runDelayed',
      'Transport/XHR/ErrorText'
   ],

   /**
    * Класс интерфейса для работы с нотификационными уведомлениями (см. {@link SBIS3.CONTROLS/NotificationPopup}) и окнами (см. {@link SBIS3.CONTROLS/SubmitPopup}).
    * С помощью класса возможно инициировать отображение уведомления и управление их расположением друг относительно друга в случае, если одновременно отображается больше одного уведомления.
    * Содержит функции для показа информационных окон и нотификационных уведомелений в области уведомлений.
    * Всплывающие уведомления отображаются в нижнем правом углу друг над другом и пропадают сами спустя 5 секунд.
    * <br/>
    * Для вызова уведомлений и окон используйте методы showConfirmDialog, showMessageDialog, showNotification и showCustomNotification.
    * <br/>
    * <b>Пример.</b> В компоненте подключен класс "SBIS3.CONTROLS/Utils/InformationPopupManager" и импортирован в переменную "InformationPopupManager".
    * Производится вызов диалога с кнопками "Да", "Нет" и "Отмена".
    * <pre>
    *    InformationPopupManager.showConfirmDialog({
    *       message: 'Сохранить изменения?',
    *       details: 'Чтобы продолжить редактирование нажмите, «Отмена».',
    *       opener: self
    *    });
    * </pre>
    * @class SBIS3.CONTROLS/Utils/InformationPopupManager
    * @author Красильников А.С.
    * @public
    */
   function(Deferred,
      cMerge,
      CompoundContainer,
      NotificationVDOM,
      ManagerController,
      NotificationController,
      SubmitPopup,
      NotificationPopup,
      NotificationManager,
      constants,
      runDelayed,
      ErrorText) {
      'use strict';

      var getConnectionErrorText = function() {
         return ErrorText.lossOfConnection + " " + window.location.hostname;
      };

      var isConnectionErrorPopupShow = false;
      var informationOpenerDeferred;

      var showSubmitDialog = function(config, positiveHandler, negativeHandler, cancelHandler) {
         if (config.message === getConnectionErrorText()) {
            isConnectionErrorPopupShow = true;
         }
         if (config.message && config.status === 'error') {
            config.message = config.message.toString().replace('Error: ', '');
         }
         var popup = new SubmitPopup(cMerge(config, {
            element: $('<div></div>'),
            isModal: true
         }));

         popup.subscribeOnceTo(popup, 'onChoose', function(e, res) {
            var handler;
            switch (res) {
               case true: handler = positiveHandler; break;
               case false: handler = negativeHandler; break;
               default: handler = cancelHandler; break;
            }

            isConnectionErrorPopupShow = false;

            if (handler && typeof handler === 'function') {
               handler.call(popup);
            }
         });

         if (constants.browser.isIE) {
            runDelayed(function() {
               popup.show();
               popup.setActive(true);
            });
         } else {
            popup.show();
            popup.setActive(true);
         }

         return popup;
      };

      return /** @lends SBIS3.CONTROLS/Utils/InformationPopupManager.prototype */{
         /**
          * Открывает диалог с кнопками "Да", "Нет" и "Отмена" (опционально), в котором при нажатии на кнопку выполняется пользовательский обработчик.
          * @remark
          * Открываемый диалог строится на основе экземпляра класса {@link SBIS3.CONTROLS/SubmitPopup}.
          * Изменению не подлежит значение опции {@link SBIS3.CONTROLS/SubmitPopup#status status}.
          * @param {Object} config Объект c конфигурацией открываемого диалога. В качестве свойств объекта передают опции, соответствующие классу {@link SBIS3.CONTROLS/SubmitPopup}.
          * @param {Function} [positiveHandler] Обработчик нажатия на кнопку "Да". Когда обработчик не установлен, клик по кнопке закрывает диалог.
          * @param {Function} [negativeHandler] Обработчик нажатия на кнопку "Нет". Когда обработчик не установлен, клик по кнопке закрывает диалог.
          * @param {Function} [cancelHandler] Обработчик нажатия на кнопку "Отмена".
          * @returns {SBIS3.CONTROLS/SubmitPopup} Экземпляр класса диалога.
          * @example
          * <pre>
          * InformationPopupManager.showConfirmDialog(
          *    {
          *       message: 'Сохранить изменения?',
          *       details: 'Чтобы продолжить редактирование нажмите, «Отмена».',
          *       opener: self
          *    },
          *    myPositiveHandler, myNegativeHandler, cancelHandler
          * );
          * </pre>
          * @see showMessageDialog
          * @see showNotification
          * @see showCustomNotification
          */
         showConfirmDialog: function(config, positiveHandler, negativeHandler, cancelHandler) {
            return showSubmitDialog(cMerge(config, {
               status: 'confirm'
            }), positiveHandler, negativeHandler, cancelHandler);
         },

         /**
          * Открывает диалог с сообщением и одной кнопкой "Ок". Диалог может находиться в одном из трёх состояний: "Ошибка" , "Успешно" или "Предупреждение".
          * @param {Object} config Объект c конфигурацией открываемого диалога - {@link SBIS3.CONTROLS/SubmitPopup}.
          * @param {Function} [handler] Обработчик нажатия на кнопку "Ок".
          * @returns {SBIS3.CONTROLS/SubmitPopup} Экземпляр класса диалога.
          * @example
          * <pre>
          * InformationPopupManager.showMessageDialog(
          *    {
          *       message: 'Изменения были сохранены',
          *       opener: self
          *    },
          *    myOkHandler
          * );
          * </pre>
          * @see showConfirmDialog
          * @see showNotification
          * @see showCustomNotification
          */
         showMessageDialog: function(config, handler) {
            // На уровне InformationPopupManager определяем, что уже показано сообщение о потере связи с сайтом,
            // для того, чтобы не появлялось кучи однотипных нотификационных попапов (их зовут все, кто выполняет запрос
            // на БЛ и получает ошибку)
            // Для vdom нужно реализовать контроллер для единой точки обработки исключений. В качестве аргумента должна
            // прилетать ошибка (а не текст как сейчас) https://online.sbis.ru/opendoc.html?guid=bfd69d88-0692-42bc-bb74-e4ffd96c0772
            if (config.message !== getConnectionErrorText() || !isConnectionErrorPopupShow) {
               return showSubmitDialog(config, null, null, handler);
            }
         },

         /**
          * Открывает нотификационное сообщение.
          * @param {Object} config Объект c конфигурацией открываемого диалога - {@link SBIS3.CONTROLS/NotificationPopup}.
          * @param {Boolean} notHide true - не скрывать окно по истечению времени жизни.
          * @returns {SBIS3.CONTROLS/NotificationPopup} Экземпляр класса окна нотификационного сообщения.
          * @example
          * <pre>
          * InformationPopupManager.showNotification(
          *    {
          *       icon: 'icon-24 icon-Chat icon-primary',
          *       caption: 'Новое уведомление',
          *       bodyTemplate: myTpl,
          *       opener: self
          *    },
          *    true
          * );
          * </pre>
          * @see showCustomNotification
          * @see showConfirmDialog
          * @see showMessageDialog
          */
         showNotification: function(config, notHide) {
            if (NotificationVDOM.isNewEnvironment()) {
               var self = this;

               /**
                * В старом окружении метод возвращает инстанс компонента. В vdom кружении мы не можем его вернуть, потому что он создается ассинхронно,
                * будем возвращать Deferred в callback которого придет инстанс компонента окна. Для этого в Controls/Popup/Compatible/Notification
                * отдадим Deferred в опцию _def и отдадим его из метода.
                * Прикладные разработчики у себя поправят код на работу с Deferred.
                */
               config._def = new Deferred();

               this._createNotificationOpener().addCallback(function() {
                  /**
                   * Эмулируем код в init SBIS3.CONTROLS/NotificationPopup
                   */
                  if (!('closeButton' in config)) {
                     config.closeButton = true;
                  }
                  if (!('icon' in config)) {
                     config.icon = self._icon[config.status];
                  }

                  /**
                   * Прикладники обращаесь через .getParent() получали popup, в нашем случае opener, сейчас
                   * получают Controls/Popup/Templates/Notification/Compatible в нем нужно
                   * пробросить вызовы в opener. Поэтому передаем его.
                   */
                  config._opener = self._notificationVDOM;

                  /**
                   * Используем базовый шаблон vdom нотификационных окон с контентом Core/CompoundContainer для
                   * оэивления старых компонентов. А ему в качестве контента отдадим эмуляцию SBIS3.CONTROLS/NotificationPopup,
                   * а именно Controls/Popup/Templates/Notification/Compatible
                   */
                  self._notificationVDOM.open({
                     template: 'Controls/Popup/Compatible/Notification/Base',
                     templateOptions: {
                        autoClose: !notHide,
                        contentTemplateOptions: {
                           component: 'Controls/Popup/Compatible/Notification',
                           componentOptions: config
                        },
                        style: self._styles[config.status],
                        contentTemplate: CompoundContainer,
                        iconClose: config.closeButton
                     }
                  });
                  self._notificationVDOM.isDestroyed = function() {
                     return false;
                  };
               });
               return config._def;
            } else {
               var popup = new NotificationPopup(cMerge({
                  element: $('<div></div>')
               }, config));

               NotificationManager.showNotification(popup, notHide);

               return popup;
            }
         },

         _createNotificationOpener: function() {
            if (!informationOpenerDeferred) {
               informationOpenerDeferred = new Deferred();
               var openerContainer = $('<div class="controls-InformationPopup-opener"></div>');
               var self = this;
               $('body').append(openerContainer);

               requirejs(['Core/Creator'], function(Creator) {
                  Creator(NotificationVDOM, {}, openerContainer).then(function(instance) {
                     self._notificationVDOM = instance;
                     /**
                      * Ассоциативный объект значений опций старого и нового шаблона.
                      * [значение в старом шаблоне]: значение в новом шаблоне
                      */
                     self._styles = {
                        success: 'done',
                        error: 'error',
                        warning: 'warning'
                     };

                     /**
                      * Аналогично this._styles.
                      */
                     self._icon = {
                        success: 'icon-size icon-24 icon-Yes icon-done',
                        error: 'icon-size icon-24 icon-Alert icon-error',
                        warning: 'icon-size icon-24 icon-Alert icon-attention'
                     };
                     informationOpenerDeferred.callback(instance);
                  });
               });
            }
            return informationOpenerDeferred;

         },

         /**
          * Открывает произвольное нотификационное сообщение.
          * @param {SBIS3.CONTROLS/Mixins/PopupMixin|*} inst Экземпляр класса окна. Это может быть любое окно, созданное на основе указанного миксина.
          * @param {Boolean} notHide true - не скрывать окно по истечению времени жизни.
          * @see showNotification
          * @see showConfirmDialog
          * @see showMessageDialog
          */
         showCustomNotification: function(inst, notHide) {
            /**
             * На VDOM старые окна должны открываться через VDOM открываторы. Например как в методе showNotification.
             * Из-за того что метод принимает инстанс комопнента мы не можем его открыть через VDOM открыватор.
             * Будем работать через VDOM контроллер. Когда будут открываться старые окна, то будем добавлять в контроллер фейковые
             * элементы. При любых изменениях старых или новых окон, будем пересчитывать их позиции.
             */
            if (NotificationVDOM.isNewEnvironment()) {
               var fakeItem = {
                  _isFake: true
               };

               if (!this._elementCreatedV) {
                  this._elementCreatedV = NotificationController.elementCreated.bind(NotificationController);
                  this._elementUpdatedV = NotificationController.elementUpdated.bind(NotificationController);
                  this._elementDestroyedV = NotificationController.elementDestroyed.bind(NotificationController);

                  /**
                   * Обновляем позицию окон при добавлении/обновлении/уничтожении окна через новый контроллер.
                   */
                  NotificationController.elementCreated = function(item, container) {
                     var result = this._elementCreatedV.call(NotificationController, item, container);
                     NotificationManager._updatePositions();

                     return result;
                  }.bind(this);
                  NotificationController.elementUpdated = function(item, container) {
                     var result = this._elementUpdatedV.call(NotificationController, item, container);
                     NotificationManager._updatePositions();

                     return result;
                  }.bind(this);
                  NotificationController.elementDestroyed = function(item) {
                     var result = this._elementDestroyedV.call(NotificationController, item);
                     NotificationManager._updatePositions();

                     return result;
                  }.bind(this);
               }

               /**
                * Обновляем позицию окон при обновлении/уничтожении окна через старый контроллер.
                */
               inst.subscribe('onSizeChange', function(wsEvent) {
                  var container = wsEvent.getTarget().getContainer()[0];

                  this._elementUpdatedV(fakeItem, {
                     offsetHeight: this._offset + container.offsetHeight
                  });
                  NotificationManager._updatePositions();
                  ManagerController.getContainer()._forceUpdate();
               }.bind(this));
               inst.subscribe('onDestroy', function() {
                  this._elementDestroyedV(fakeItem);
                  NotificationManager._updatePositions();
                  ManagerController.getContainer()._forceUpdate();
               }.bind(this));

               NotificationManager.showNotification(inst, notHide);

               if (!this._offset) {
                  /**
                   * Между окнами есть растояние, задается через margin-bottom на компоненте.
                   * В старом контроллере идем вычитка значения и его обнуление.
                   * В новом котроллере берётся высота предыдущего окна, слудеющее позиционируется над ним,
                   * в высоту входит margin-bottom.
                   * До показа окно не видно и взять его размеры с margin-bottom нельзя. После показа, как было сказано
                   * выше, значение обнуляется и в высоту не входит margin-bottom. Поэтому мы вычитываем margin-bottom
                   * так же как в старом контроллере components/Utils/NotificationStackManager.js:164
                   */
                  inst.getContainer().css('margin', '');
                  this._offset = parseFloat(inst.getContainer().css('margin-bottom'));
               }

               /**
                * Обновляем позицию окон при добавлении фейкового окна через новый контроллер.
                */
               this._elementCreatedV(fakeItem, {
                  offsetHeight: this._offset + inst._container[0].offsetHeight
               });
               NotificationManager._updatePositions();
               ManagerController.getContainer()._forceUpdate();

               return inst;
            } else {
               NotificationManager.showNotification(inst, notHide);
               return inst;
            }
         }
      };
   }
);
