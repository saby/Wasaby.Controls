define('WaitIndicatorManager.module'/*###js!SBIS3.CONTROLS.WaitIndicatorManager*/,
   [
      //###
   ],
   function (/*###*/) {
      'use strict';

      /*
       * TODO: (+) Разобраться с target
       * TODO: (+) Добавить события или промисы на начало/конец показа индикатора
       * TODO: (-) Понять, нужно ли Proxy-рование
       * TODO: (+) Применить опции
       * TODO: (+) Локальные индикаторы
       * TODO: ### Будем ли использовать Component-ы в качестве объектов привязки ?
       * TODO: (-) Нужен ли cancel как псевдоним remove ?
       * TODO: (+-) Нужен ли массив экземпляров индикаторов (не в DOM-е)? Если нужен, то как его чистить ?
       * TODO:     Если не нужен, то как контролировать единственность неглобальных?
       * TODO: (+) Добавить приостановку индикатора, без удаления из DOM-а
       * TODO: (+) Объединить схожий код в start, suspend и remove, clearDelays
       * TODO: (+) Добавить очистку DOM-а по тайауту ?
       * TODO: (+) Может, перенести работу с target-ами полностью в manager ?
       * TODO: ### Добавить опцию для настройки времени удаления приостановленных индикаторов
       * TODO:     и ограничивающую максимальную константу
       * TODO: ### Сделать реальный шаблон индикатора
       * TODO: ### Актуальны ли много-элементные объекты привязки (наборы элементов)
       * TODO: ### Привести к новым реалиям isVisible
       * TODO: (+-) Модуляризировать в requirejs
       * TODO: (+) Перенести методы _start, _suspend, _remove в менеджер с контолем единственности
       * TODO: (+-) Предусмотреть очередь в менеджере
       * TODO: (+) Перенести страховочную очистку DOM-а в менеджер
       * TODO: (+) Добавить сообщения
       * TODO: (+) Добавить идентификаторы
       * TODO: ###
       * TODO: ### Перейти от тестов к демо ?
       * TODO: (+) Убрать lastUse
       * TODO: ### Привести к ES5
       */



      /**
       * ###
       */
      class WaitIndicatorManager {
         /**
          * Константа - максимальное время по умолчанию до удаления приостановленных индикаторов из DOM-а
          * @public
          * @static
          * @type {number}
          */
         static get SUSPEND_TIME () {
            return 10000;
         }

         /**
          * ###Создаёт### индикатор ожидания завершения процесса, поведение и состояние определяется указанными опциями
          * @public
          * @param {object} options Опции конфигурации
          * @param {###Component|jQuery|HTMLElement} options.target Объект привязки индикатора
          * @param {boolean} options.delay Задержка перед началом показа/скрытия индикатора
          * @param {boolean} options.hidden Состояние - скрыть / показать
          * @return {WaitIndicator}
          */
         static getWaitIndicator (options) {
            // Разобрать опции
            let target = options ? options.target : null,
               message = options ? options.message : null,
               delay = options ? options.delay : 0,
               hidden = options ? options.hidden : false;

            /*if (!WaitIndicatorManager._instances) {
               WaitIndicatorManager._instances = [];
            }
            let list = WaitIndicatorManager._instances;*/

            let list = WaitIndicatorManager._instances;
            if (!list) {
               WaitIndicatorManager._instances = list = [];
            }

            // Запрошен ли глобальный индикатор?
            let container = WaitIndicatorManager._getContainer(target);
            let isGlobal = !container;
            //////////////////////////////////////////////////
            console.log('DBG: getWaitIndicator: isGlobal=', isGlobal, ';');
            //////////////////////////////////////////////////

            let indicator;
            if (isGlobal) {
               // Запрошен глобальный индикатор, он может быть только один - попробовать найти существующий
               indicator = list.length ? list.find(item => item.isGlobal) : null;
            }
            else {
               // Запрошен локальный индикатор, их может быть много, но только один на каждый объект привязки
               indicator = list.length ? list.find(item => item.container === container) : null;
            }
            if (indicator) {
               // Найден существующий индикатор - использовать применимые опции
               if (hidden) {
                  indicator.remove(delay);
               }
               else {
                  indicator.start(delay);
               }
            }
            else {
               // индикатор не найден - создать новый
               let id = ++WaitIndicatorCounter;
               //////////////////////////////////////////////////
               console.log('DBG: getWaitIndicator: id=', id, ';');
               //////////////////////////////////////////////////
               indicator = new WaitIndicator(id, container, message);
               if (!hidden) {
                  indicator.start(delay);
               }
               list.push(indicator);
            }
            // и вернуть
            return indicator;
         }

         /**
          * Определить элемент DOM, соответствующий указанному объекту привязки
          * @protected
          * @static
          * @param {###Component|jQuery|HTMLElement} target Объект привязки индикатора
          * @return {HTMLElement}
          */
         static _getContainer (target) {
            //////////////////////////////////////////////////
            console.log('DBG: _getContainer: (target && typeof target === object)=', (target && typeof target === 'object'), ';');
            //////////////////////////////////////////////////
            if (!target || typeof target !== 'object') {
               return null;
            }
            //////////////////////////////////////////////////
            console.log('DBG: _getContainer: (target.jquery && typeof target.jquery === string)=', (target.jquery && typeof target.jquery === 'string'), ';');
            //////////////////////////////////////////////////
            let container = target;
            if (target.jquery && typeof target.jquery === 'string') {
               if (!target.length) {
                  return null;
               }
               container = target[0];
            }
            return container !== window && container !== document && container !== document.body ? container : null;
         }
      }

      /**
       * Счётчик экземпляров
       * @type {number}
       */
      let WaitIndicatorCounter = 0;



      /**
       * ###
       */
      class WaitIndicator {
         /**
          * ###
          * @public
          * @constructor
          * @param {number} id Идентификатор индикатора
          * @param {HTMLElement} container Контейнер индикатора
          * @param {string} message Текст сообщения индикатора
          */
         constructor (id, container, message) {
            //////////////////////////////////////////////////
            console.log('DBG: WaitIndicator: arguments.length=', arguments.length, '; arguments=', arguments, ';');
            //////////////////////////////////////////////////
            this._id = id;
            this._container = container;
            this._message = message;
            this._starting = null;
            this._suspending = null;
            this._removing = null;
         }

         /**
          * Геттер свойства, возвращает DOM элемент контейнера
          * @public
          * @type {HTMLElement}
          */
         get container () {
            return this._container;
         }

         /**
          * Геттер свойства, указывает, что индикатор является глобальным
          * @public
          * @type {boolean}
          */
         get isGlobal () {
            return !this._container;
         }

         /**
          * Геттер свойства, указывает, что индикатор показывается в данный момент
          * @public
          * @type {boolean}
          */
         /*### Это уже не так !!!*/
         /*###get isVisible () {
            return !!this._spinner && !!this._spinner.parentNode;
         }*/

         /**
          * Геттер свойства, возвращает текст сообщения
          * @public
          * @type {HTMLElement}
          */
         get message () {
            return this._message;
         }

         /**
          * Начать показ индикатора через (опциональное) время задержки
          * (Все предыдущие вызовы с задержками методов start, suspend и remove отменяются последним вызовом)
          * @public
          * @param {number} delay Время задержки в миллисекундах
          * @return {Promise}
          */
         start (delay) {
            return this._callDelayed('_start','_starting', delay);
         }

         /**
          * Начать показ индикатора немедленно
          * @protected
          */
         _start () {
            WaitIndicatorInner.start(this._id, this._container, this._message);
         }

         /**
          * ВРЕМЕННО скрыть индикатор (без удаления из DOM) через (опциональное) время задержки
          * Будьте осторожны при использовании, не забывайте очищать DOM вызовом метода remove
          * (Все предыдущие вызовы с задержками методов start, suspend и remove отменяются последним вызовом)
          * @public
          * @param {number} delay Время задержки в миллисекундах
          * @return {Promise}
          */
         suspend (delay) {
            return this._callDelayed('_suspend','_suspending', delay);
         }

         /**
          * Завершить показ индикатора немедленно
          * @protected
          */
         _suspend () {
            WaitIndicatorInner.suspend(this._id, this._container, this._message);
         }

         /**
          * Завершить показ индикатора через (опциональное) время задержки
          * (Все предыдущие вызовы с задержками методов start, suspend и remove отменяются последним вызовом)
          * @public
          * @param {number} delay Время задержки в миллисекундах
          * @return {Promise}
          */
         remove (delay) {
            return this._callDelayed('_remove','_removing', delay);
         }

         /**
          * Завершить показ индикатора немедленно
          * @protected
          */
         _remove () {
            WaitIndicatorInner.remove(this._id, this._container, this._message);
         }

         /**
          * Общая реализация для методов start, suspend и remove
          * @protected
          * @param {string} method Имя подлежащего (protected) метода
          * @param {string} storing Имя (protected) свойства для хранения данных об отложенном вызове
          * @param {number} delay Время задержки в миллисекундах
          * @return {Promise}
          */
         _callDelayed (method, storing, delay) {
            this._clearDelays();
            if (typeof delay === 'number' && 0 < delay) {
               let success, fail, promise = new Promise((resolve, reject) => {
                  success = resolve;
                  fail = reject;
               });
               this[storing] = {
                  id: setTimeout(() => {
                     //////////////////////////////////////////////////
                     console.log('DBG: ' + method + ': TIMEOUT this.' + storing + '=', this[storing], ';');
                     //////////////////////////////////////////////////
                     this[method]();
                     this[storing].success.call(null);
                     this[storing] = null;
                  }, delay),
                  success: success,
                  fail: fail,
                  promise: promise
               };
               return promise.catch((err) => {});
            }
            else {
               this[method]();
               return Promise.resolve();
            }
         }

         /**
          * Сбросить все таймауты
          * @protected
          */
         _clearDelays () {
            //////////////////////////////////////////////////
            console.log('DBG: _clearDelays: this._starting=', this._starting, '; this._suspending=', this._suspending, '; this._removing=', this._removing, ';');
            //////////////////////////////////////////////////
            for (let storing of ['_starting', '_suspending', '_removing']) {
               let o = this[storing];
               if (o) {
                  clearTimeout(o.id);
                  if (o.fail) {
                     o.fail.call();
                  }
                  this[storing] = null;
               }
            }
            //////////////////////////////////////////////////
            console.log('DBG: _clearDelays: this._starting=', this._starting, '; this._suspending=', this._suspending, '; this._removing=', this._removing, ';');
            //////////////////////////////////////////////////
         }

         /**
          * Возвращает обещание, соответствующее последнему актуальному вызову метода start. Если актуального вызова нет - вернётся null
          * @public
          * @type {Promise}
          */
         get nextStart () {
            return this._starting ? this._starting.promise : null;
         }

         /**
          * Возвращает обещание, соответствующее последнему актуальному вызову метода suspend. Если актуального вызова нет - вернётся null
          * @public
          * @type {Promise}
          */
         get nextSuspend () {
            return this._suspending ? this._suspending.promise : null;
         }

         /**
          * Возвращает обещание, соответствующее последнему актуальному вызову метода remove. Если актуального вызова нет - вернётся null
          * @public
          * @type {Promise}
          */
         get nextRemove () {
            return this._removing ? this._removing.promise : null;
         }
      }



      /**
       * Отдельные функции модуля
       */

      /**
       * ###
       */
      class WaitIndicatorInner {
         /**
          * ###
          * @public
          * @param {number} id Идентификатор индикатора
          * @param {HTMLElement} container Контейнер индикатора
          * @param {string} message Текст сообщения индикатора
          */
         static start (id, container, message) {
            //###let container = WaitIndicatorManager._getContainer(target);

            let queueIndex = WaitIndicatorInner._searchQuequeItem(container);
            if (queueIndex != -1) {
               let queueItem =  WaitIndicatorQueue[queueIndex];
               // Индикатор уже есть и добавлен в DOM
               queueItem.spinner.style.display = '';
               // Сбросить отсчёт времени до принудительного удаления из DOM-а
               WaitIndicatorInner._unclear(queueItem);
            }
            else {
               // Индикатора ещё нет или он не добавлен в DOM
               // ### Здесь единственное место использования jQuery
               let $container = $(container || document.body);
               //////////////////////////////////////////////////
               console.log('DBG: start: $container=', $container, ';');
               //////////////////////////////////////////////////
               let $spinner = $('<div class="WaitIndicator">' + (message || '') + '</div>');
               $container.append($spinner);
               let spinner = $spinner[0];
               //////////////////////////////////////////////////
               console.log('DBG: start: spinner=', spinner, ';');
               //////////////////////////////////////////////////
               WaitIndicatorQueue.push({id, container, message, spinner});
               //////////////////////////////////////////////////
               console.log('DBG: start: WaitIndicatorQueue=', WaitIndicatorQueue, ';');
               //////////////////////////////////////////////////
            }
         }

         /**
          * ###
          * @public
          * @param {number} id Идентификатор индикатора
          * @param {HTMLElement} container Контейнер индикатора
          * @param {string} message Текст сообщения индикатора
          */
         static suspend (id, container, message) {
            //###let container = WaitIndicatorManager._getContainer(target);

            let queueIndex = WaitIndicatorInner._searchQuequeItem(container);
            if (queueIndex != -1) {
               let queueItem =  WaitIndicatorQueue[queueIndex];
               queueItem.spinner.style.display = 'none';
               // Начать отсчёт времени до принудительного удаления из DOM-а
               queueItem.clearing = setTimeout(() => {
                  WaitIndicatorInner.remove(id, container, message);
               }, WaitIndicatorManager.SUSPEND_TIME);
            }
         }

         /**
          * ###
          * @public
          * @param {number} id Идентификатор индикатора
          * @param {HTMLElement} container Контейнер индикатора
          * @param {string} message Текст сообщения индикатора
          */
         static remove (id, container, message) {
            //###let container = WaitIndicatorManager._getContainer(target);

            let queueIndex = WaitIndicatorInner._searchQuequeItem(container);
            if (queueIndex != -1) {
               let queueItem =  WaitIndicatorQueue[queueIndex];
               // Сбросить отсчёт времени до принудительного удаления из DOM-а
               WaitIndicatorInner._unclear(queueItem);
               // Удалить из DOM-а и из очереди
               queueItem.spinner.parentNode.removeChild(queueItem.spinner);
               WaitIndicatorQueue.splice(queueIndex, 1);
            }
         }

         /**
          * Сбросить отсчёт времени до принудительного удаления из DOM-а
          * @protected
          * @param {object} queueItem Элемент очереди
          */
         static _unclear (queueItem) {
            if ('clearing' in queueItem) {
               clearTimeout(queueItem.clearing);
               delete queueItem.clearing;
               //////////////////////////////////////////////////
               console.log('DBG: _unclear: (clearing in queueItem)=', ('clearing' in queueItem), ';');
               //////////////////////////////////////////////////
            }
         }

         /**
          * ###
          * @protected
          * @param {HTMLElement} container Контейнер индикатора
          * @return {###}
          */
         static _searchQuequeItem (container) {
            return WaitIndicatorQueue.length ? WaitIndicatorQueue.findIndex(item => item.container === container) : -1;
         }
      }

      /**
       * ### Очередь ...
       * @type {object[]}
       */
      let WaitIndicatorQueue = [];



      return WaitIndicatorManager;
   }
);
