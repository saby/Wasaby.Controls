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
       * TODO: ### Перейти от тестов к демо ?
       * TODO: ### Убрать lastUse
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
               // Найден существующий - использовать применимые опции
               if (hidden) {
                  indicator.remove(delay);
               }
               else {
                  indicator.start(delay);
               }
            }
            else {
               // не найден - создать новый
               indicator = new WaitIndicator(container);
               if (!hidden) {
                  indicator.start(delay);
               }
               list.push(indicator);
            }
            // и вернуть (###прокси?)
            return indicator;
         }

         /**
          * ###
          * @public
          * @param {###Component|jQuery|HTMLElement} target Объект привязки индикатора
          */
         static start (target) {
            let container = WaitIndicatorManager._getContainer(target);

            let queueIndex = WaitIndicatorManager._searchQuequeItem(container);
            if (queueIndex != -1) {
               let queueItem =  WaitIndicatorQueue[queueIndex];
               // Индикатор уже есть и добавлен в DOM
               queueItem.spinner.style.display = '';
               // Сбросить отсчёт времени до принудительного удаления из DOM-а
               WaitIndicatorManager._unclear(queueItem);
            }
            else {
               // Индикатора ещё нет или он не добавлен в DOM
               // ### Здесь единственное место использования jQuery
               let $container = $(container || document.body);
               //////////////////////////////////////////////////
               console.log('DBG: _start: $container=', $container, ';');
               //////////////////////////////////////////////////
               let $spinner = $('<div class="WaitIndicator"></div>');
               $container.append($spinner);
               let spinner = $spinner[0];
               //////////////////////////////////////////////////
               console.log('DBG: _start: spinner=', spinner, ';');
               //////////////////////////////////////////////////
               WaitIndicatorQueue.push({container:container, spinner:spinner});
            }
         }

         /**
          * ###
          * @public
          * @param {###Component|jQuery|HTMLElement} target Объект привязки индикатора
          */
         static suspend (target) {
            let container = WaitIndicatorManager._getContainer(target);

            let queueIndex = WaitIndicatorManager._searchQuequeItem(container);
            if (queueIndex != -1) {
               let queueItem =  WaitIndicatorQueue[queueIndex];
               queueItem.spinner.style.display = 'none';
               // Начать отсчёт времени до принудительного удаления из DOM-а
               queueItem.clearing = setTimeout(() => {
                  WaitIndicatorManager.remove(target);
               }, WaitIndicatorManager.SUSPEND_TIME);
            }
         }

         /**
          * ###
          * @public
          * @param {###Component|jQuery|HTMLElement} target Объект привязки индикатора
          */
         static remove (target) {
            let container = WaitIndicatorManager._getContainer(target);

            let queueIndex = WaitIndicatorManager._searchQuequeItem(container);
            if (queueIndex != -1) {
               let queueItem =  WaitIndicatorQueue[queueIndex];
               // Сбросить отсчёт времени до принудительного удаления из DOM-а
               WaitIndicatorManager._unclear(queueItem);
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
          * Проверить, является ли указанный объект привязки глобальным
          * @public
          * @static
          * @param {###Component|jQuery|HTMLElement} target Объект привязки индикатора
          * @return {boolean}
          */
         /*###static isGlobalTarget (target) {
          return !WaitIndicatorManager._getContainer(target);
          }*/

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
       * ###
       * @protected
       */
      let WaitIndicatorQueue = [];



      /**
       * ###
       */
      class WaitIndicator {
         /**
          * ###
          * @public
          * @constructor
          * @param {HTMLElement} container Контейнер индикатора
          */
         constructor (container/*###, delay*/) {
            //////////////////////////////////////////////////
            console.log('DBG: WaitIndicator: arguments.length=', arguments.length, '; arguments=', arguments, ';');
            //////////////////////////////////////////////////
            this._container = container;
            this._spinner = null;
            //###this._visible = false;
            this._starting = null;
            this._suspending = null;
            this._removing = null;
            this._clearing = null;
            this._lastUse = null;
            this._regUse();
            /*###if (1 < arguments.length) {
               this.start(delay);
            }*/
         }

         /**
          * Геттер свойства, возвращает DOM элемент привязки
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
         get isVisible () {/*### Это уже не так !!!*/
            return !!this._spinner && !!this._spinner.parentNode;
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
            WaitIndicatorManager.start(this._container);
            /*###if (this._spinner && this._spinner.parentNode) {
               // Индикатор уже есть и добавлен в DOM
               this._spinner.style.display = '';
               // ### Сбросить отсчёт времени до принудительного удаления из DOM-а
            }
            else {
               // Индикатора ещё нет или он не добавлен в DOM
               // ### Здесь единственное место использования jQuery
               let $container = $(this._container || document.body);
               //////////////////////////////////////////////////
               console.log('DBG: _start: $container=', $container, ';');
               //////////////////////////////////////////////////
               let $spinner = $('<div class="WaitIndicator"></div>');
               $container.append($spinner);
               this._spinner = $spinner[0];
               //////////////////////////////////////////////////
               console.log('DBG: _start: this._spinner=', this._spinner, ';');
               //////////////////////////////////////////////////
            }
            this._regUse();*/
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
            WaitIndicatorManager.suspend(this._container);
            /*###if (this._spinner && this._spinner.parentNode) {
               this._spinner.style.display = 'none';
               // ### Начать отсчёт времени до принудительного удаления из DOM-а
               this._clearing = {
                  id: setTimeout(() => {
                     this._remove();
                     this._clearing = null;
                  }, WaitIndicator.^^^SUSPEND_TIME)
               };
               this._regUse();
            }*/
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
            WaitIndicatorManager.remove(this._container);
            /*###if (this._spinner && this._spinner.parentNode) {
               this._spinner.parentNode.removeChild(this._spinner);
            }
            this._spinner = null;
            this._regUse();*/
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
            console.log('DBG: _clearDelays: this._starting=', this._starting, '; this._suspending=', this._suspending, '; this._removing=', this._removing, '; this._clearing=', this._clearing, ';');
            //////////////////////////////////////////////////
            for (let storing of ['_starting', '_suspending', '_removing', '_clearing']) {
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
            console.log('DBG: _clearDelays: this._starting=', this._starting, '; this._suspending=', this._suspending, '; this._removing=', this._removing, '; this._clearing=', this._clearing, ';');
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

         /**
          * Возвращает время последнего использования
          * @public
          * @type {number}
          */
         get lastUse () {
            return this._lastUse;
         }

         /**
          * Зарегистрировать время использования
          * @protected
          */
         _regUse () {
            this._lastUse = (new Date()).getTime();
         }
      }



      return WaitIndicatorManager;
   }
);