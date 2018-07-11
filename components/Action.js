/*global $ws, define*/
define('SBIS3.CONTROLS/Action',
   [
   "Core/Deferred",
   "Lib/Control/Control"
],
   function ( Deferred,Control) {
      'use strict';

      /**
       * Класс базовый для всех стандартных действий, которые можно использовать в интерфейсе
       * @class SBIS3.CONTROLS/Action
       * @public
       * @extends Lib/Control/Control
       * @author Крайнов Д.О.
       *
       * @ignoreOptions validators independentContext contextRestriction extendedTooltip
       * @ignoreOptions visible tooltip tabindex enabled className alwaysShowExtendedTooltip allowChangeEnable
       *
       * @ignoreMethods activateFirstControl activateLastControl addPendingOperation applyEmptyState applyState clearMark
       * @ignoreMethods changeControlTabIndex destroyChild detectNextActiveChildControl disableActiveCtrl findParent
       * @ignoreMethods focusCatch getActiveChildControl getChildControlById getChildControlByName getChildControls
       * @ignoreMethods getClassName getContext getEventBusOf getEventHandlers getEvents getExtendedTooltip getOpener
       * @ignoreMethods getImmediateChildControls getLinkedContext getNearestChildControlByName getOwner getOwnerId
       * @ignoreMethods getReadyDeferred getStateKey getTabindex getUserData getValue hasActiveChildControl hasChildControlByName
       * @ignoreMethods hasEventHandlers isActive isAllReady isDestroyed isMarked isReady makeOwnerName setOwner setSize
       * @ignoreMethods markControl moveFocus moveToTop once registerChildControl registerDefaultButton saveToContext
       * @ignoreMethods sendCommand setActive setChildActive setClassName setExtendedTooltip setOpener setStateKey activate
       * @ignoreMethods setTabindex setTooltip setUserData setValidators setValue storeActiveChild subscribe unregisterChildControl
       * @ignoreMethods unregisterDefaultButton unsubscribe validate waitAllPendingOperations waitChildControlById waitChildControlByName
       * @ignoreMethods setVisible toggle show isVisible hide getTooltip isAllowChangeEnable isEnabled isVisibleWithParents
       * @ignoreMethods addOwnedContext canAcceptFocus describe getAlignment getContainer getEditRecordDeferred getId getMinHeight
       * @ignoreMethods getMinSize getMinWidth getName getParent getParentByClass getParentByName getParentWindow getProperty
       * @ignoreMethods getTopParent hasEvent init initializeProperty isCanExecute isInitialized isSubControl runInPropertiesUpdate
       * @ignoreMethods setAllowChangeEnable setEnabled setProperties setProperty subscribeOnceTo subscribeTo unbind unsubscribeFrom
       *
       * @ignoreEvents onActivate onAfterLoad onBeforeControlsLoad onBeforeLoad onChange onClick onPropertyChanged
       * @ignoreEvents onFocusIn onFocusOut onKeyPressed onReady onResize onStateChanged onTooltipContentRequest
       * @ignoreEvents onDragIn onDragMove onDragOut onDragStart onDragStop onCommandCatch onDestroy onPropertiesChanged
       */
      //TODO наследуемся от контрола, чтоб можно было размещать в xhtml
      var Action = Control.Control.extend(/** @lends SBIS3.CONTROLS/Action.prototype */{
         /**
          * @event onExecute Происходит перед выполнением действия.
          * @remark
          * В обработчике события вы можете изменить метаданные, с которыми впоследствии будет выполнено действие, а также запретить его выполнение.
          * Обрабатываемые результаты:
          * <ul>
          *     <li>Если из обработчика возвращается *false* или строка *custom*, то выполнение действия прерывается.</li>
          *     <li>Если возвращается deferred, то действие выполнится в обработчике callback. Примечание: когда в результаты callback переданы *false* или строка *custom*, выполнение действия также прерывается.</li>
          * </ul>
          * @param {Core/EventObject} eventObject Дескриптор события.
          * @param {Object} meta Метаданные, переданные при вызове метода (см. {@link execute}).
          * Они дополняют сведения о контексте выполнения действия, а также о свойствах сущностей, с которыми происходит взаимодействие.
          * Для каждого класса существует собственный набор метаданных.
          * @see execute
          */
         /**
          * @event onExecuted Происходит после выполнения действия.
          * @param {Core/EventObject} eventObject Дескриптор события.
          * @param {Object} meta Метаданные, с которыми было выполнено действие.
          * Они дополняют сведения о контексте выполнения действия, а также о свойствах сущностей, с которыми происходит взаимодействие.
          * Для каждого класса существует собственный набор метаданных.
          * @param {*} result Результат, переданный по окончании выполнения действия. Для каждого класса действия набор значений параметра может быть различным.
          * <ul>
          *     <li>Для класса {@link SBIS3.CONTROLS/Action/List/OpenEditDialog} в result приходит экземпляр редактируемой записи.</li>
          *     <li>Для класса {@link SBIS3.CONTROLS/Action/OpenDialog} result - это признак того, как был закрыт диалог: нажата кнопка "Да" (значение true) или кнопка "Нет" (значение false).</li>
          *     <li>Для класса {@link  SBIS3.CONTROLS/Action/SelectorAction} result - это массив, где каждый элемент - это выбранная на диалоге запись (см. {@Link WS.Data/Entity/Record}).</li>
          * </ul>
          * @see execute
          */
          /**
          * @event onError Происходит, когда выполнение действия было прервано в результате ошибки.
          * @param {Core/EventObject} eventObject Дескриптор события.
          * @param {Error} error Экземпляр класса Error.
          * @param {Object} meta Метаданные, с которыми выполнялось действие (см. {@link execute}).
          * Они дополняют сведения о контексте выполнения действия, а также о свойствах сущностей, с которыми происходит взаимодействие.
          * Для каждого класса существует собственный набор метаданных.
          * @see execute
          */
          /**
          * @event onChangeCanExecute Происходит, когда для действия был изменён признак "Можно выполнять" (см. {@link setCanExecute}).
          * @param {Core/EventObject} eventObject Дескриптор события.
          * @param {Boolean} canExecute true - действие можно выполнять, false - нельзя выполнять.
          * @see setCanExecute
          * @see isCanExecute
          */
         $protected: {
            /**
             * @var {Boolean} Устанавливает значение признака "Можно выполнять". В значении false действие не сможет быть выполнено.
             * @see setCanExecute
             * @see isCanExecute
             */
            _canExecute: true
         },

         $constructor: function () {
            this._publish('onChangeCanExecute', 'onExecuted', 'onExecute', 'onError');
         },
         /**
          * Запускает выполнение действия.
          * @remark
          * Действие может быть выполнено, когда это не запрещено в опции {@link _canExecute}.
          * Перед выполнением происходит событие {@link onExecute}, после выполнения - {@link onExecuted}, а в случае ошибки - {@link onError}.
          * @param {Object} meta Метаданные. Дополняют сведения о контексте выполнения действия, а также о свойствах сущностей, с которыми происходит взаимодействие. Для каждого класса существует собственный набор метаданных.
          * @returns {Deferred}
          * @example
          * <pre>
          * // myOpenEditDialog - это экземпляр класса SBIS3.CONTROLS/Action/List/OpenEditDialog,
          * // который описывает действие открытие диалога редактирования.
          * myOpenEditDialog.execute({
          *
          *    // Идентификатор редактируемой записи.
          *    id: myId,
          *
          *    // Record, который будет открыт на редактирование.
          *    item: myItem,
          *
          *    // Способ инициализации данных диалога редактирования.
          *    initializingWay: 'delayedRemote'
          *
          *    // Свойства контрола, на основе которого будет создано окно диалога редактирования.
          *    dialogOptions: {
          *
          *       // Заголовок диалога.
          *       title: 'Редактирования товара'
          *    }
          * });
          *
          * // Когда вы переопределяете метод execute, важно передать в качестве опции opener
          * action.execute({
          *   'componentOptions': cfg.componentOptions,
          *
          *   // opener применяется для того чтобы установить логическую связь между двумя окнами
          *   'opener': self
          * });
          * </pre>
          */
         execute: function (meta) {
            var self = this;
            if (this.isCanExecute()) {
               return this._callHandlerMethod([meta], 'onExecute', '_doExecute').addCallbacks(function (result) {
                  if (result !== false) {
                     return self._notifyOnExecuted(meta, result);
                  }
               }, function (error) {
                  self._notify('onError', error, meta);
                  self._handleError(error, meta);
                  return error;
               });
            }
         },
         /**
          * Устанавливает признак: может ли выполнится действие.
          * @remark
          * При вызове метода происходит событие {@link onChangeCanExecute}.
          * @param {Boolean} canExecute
          * @see isCanExecute
          */
         setCanExecute: function (canExecute) {
            canExecute = !!canExecute;
            if (this._canExecute !== canExecute) {
               this._canExecute = canExecute;
               this._notify('onChangeCanExecute', canExecute);
            }
         },
         /**
          * Предоставляет возможность переопределять стандартное поведение (вызов метода method) через вызов события event.
          * Метод callHandlerMethod "подымает" событие event и вызывает метод method.
          * Однако если из события возвращается false или custom, то method не вызывается.
          * Если из события возвращается deferred, то method вызовется в callback, так же
          * событие может вернуть название другого метода и он будет вызван вместо method.
          * @param {Array} args  Параметры которые будут переданы в event и method
          * @param {String} event  Название события которое надо поднято
          * @param {String} method  Название метода который надо вызвать
          * @returns {Deferred}
          * @private
          */
         _callHandlerMethod: function (args, event, method) {
            var evenResult = this._notify.apply(this, [event].concat(args)),
               call = typeof this[evenResult] === 'function' ? this[evenResult] : this[method];
            if (evenResult !== false && evenResult !== Action.ACTION_CUSTOM) {
               var def = evenResult instanceof Deferred ? evenResult : new Deferred().callback(true),
                  self = this;
               return def.addCallback(function (defResult) {
                  if(defResult !== false && defResult !== Action.ACTION_CUSTOM) {
                     call = typeof self[defResult] === 'function' ? self[defResult] : call;
                     if (typeof call === 'function') {
                        return call.apply(self, args);
                     }
                  }
               });
            }
            return new Deferred().callback(evenResult);
         },
         /**
          * Вовращает признак: может ли выполниться действие.
          * @returns {Boolean}
          * @see setCanExecute
          */
         isCanExecute: function () {
            return this._canExecute;
         },
         /**
          * метод выполняющий основное действие Action'а
          * @param {Object} meta Объект содержащий мета параметры Action'а
          * @private
          */
         _doExecute: function () {
         },
         /**
          * @param {Error} error Ошибка возникшая в результате выполнения deferred'a, который вернул  _doExecute
          * @param {Object} meta Объект содержащий мета параметры Action'а
          * @private
          */
         _handleError: function (error, meta) {
         },
         /**
          * Запрещаем принимать фокус экшенам
          */
         canAcceptFocus: function(){
            return false;
         },
         /**
          * 
          * @private
          */
         _notifyOnExecuted: function () {
            var args = Array.prototype.slice.call(arguments);
            args.unshift('onExecuted');
            this._notify.apply(this, args);
         }
      });
      Action.ACTION_CUSTOM = 'custom';
      return Action;
   });