define('js!SBIS3.CONTROLS.WaitIndicatorManager'/*###WaitIndicatorManager.module*/,
   [
      'css!SBIS3.CONTROLS.WaitIndicatorManager'
   ],
   function () {
      'use strict';

      /*
       * TODO: (+) Разобраться с target
       * TODO: (+) Добавить события или промисы на начало/конец показа индикатора
       * TODO: (-) Понять, нужно ли Proxy-рование
       * TODO: (+) Применить опции
       * TODO: (+) Локальные индикаторы
       * TODO: ### Будем ли использовать Component-ы в качестве объектов привязки ?
       * TODO: (-) Нужен ли cancel как псевдоним remove ?
       * TODO: (+) Нужен ли массив экземпляров индикаторов (не в DOM-е)? Если нужен, то как его чистить ?
       * TODO:     Если не нужен, то как контролировать единственность неглобальных?
       * TODO: (+) Добавить приостановку индикатора, без удаления из DOM-а
       * TODO: (+) Объединить схожий код в start, suspend и remove, clearDelays
       * TODO: (+) Добавить очистку DOM-а по тайауту ?
       * TODO: (+) Может, перенести работу с target-ами полностью в manager ?
       * TODO: ### Добавить опцию для настройки времени удаления приостановленных индикаторов
       * TODO:     и ограничивающую максимальную константу
       * TODO: (+-) Сделать реальный шаблон индикатора
       * TODO: ### Актуальны ли много-элементные объекты привязки (наборы элементов)
       * TODO: ### Привести к новым реалиям isVisible
       * TODO: (+) Модуляризировать в requirejs
       * TODO: (+) Перенести методы _start, _suspend, _remove в менеджер с контолем единственности
       * TODO: (+) Предусмотреть очередь в менеджере
       * TODO: (+) Перенести страховочную очистку DOM-а в менеджер
       * TODO: (+) Добавить сообщения
       * TODO: (+) Добавить идентификаторы
       * TODO: (+) Поправить страховочное очистку DOM-а (в связи с очередью)
       * TODO: (+) Переименовать очередь в Pool (это ведь не очередь)
       * TODO: (+) Объединить suspend и remove (в inner) во избежание дублирования кода
       * TODO: (+) Обособить методы, связанные с DOM-ом
       * TODO: ### Добавить локально-глобальную блокировку
       * TODO: (+-) Перейти от тестов к демо
       * TODO: (+) Убрать lastUse
       * TODO: ### Стилевые классы на все случаи
       * TODO: ### Сообщение меняется с ошибкой
       * TODO: ### Избавиться от jQuery
       * TODO: ### Возможно стоит механизировать разбор опций ?
       * TODO: ### Разобраться с урлами картинок
       * TODO: ### Пересмотреть аргументы методов класса Inner
       * TODO: ###
       * TODO: ### Привести к ES5
       */



      /**
       * ###
       */
      class WaitIndicatorManager {
         /**
          * Константа - время задержки по умолчанию перед показом индикатора
          * @public
          * @static
          * @type {number}
          */
         static get DEFAULT_DELAY () {
            return 2000;
         }

         /**
          * Константа - время по умолчанию до удаления приостановленных индикаторов из DOM-а
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
               delay = options ? options.delay : -1,
               hidden = options ? options.hidden : false,
               small = options ? options.small : false;

            let id = ++WaitIndicatorCounter;
            //////////////////////////////////////////////////
            console.log('DBG: getWaitIndicator: id=', id, ';');
            //////////////////////////////////////////////////
            let container = WaitIndicatorManager._getContainer(target);
            let indicator = new WaitIndicator(id, container, message, {small:small});
            if (!hidden) {
               indicator.start(0 <= delay ? delay : WaitIndicatorManager.DEFAULT_DELAY);
            }
            else {
               indicator.remove(0 <= delay ? delay : 0);
            }

            /*###let list = WaitIndicatorManager._instances;
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
            }*/

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
          * @param {object} look Параметры внешнего вида индикатора
          */
         constructor (id, container, message, look) {
            //////////////////////////////////////////////////
            console.log('DBG: WaitIndicator: arguments.length=', arguments.length, '; arguments=', arguments, ';');
            //////////////////////////////////////////////////
            this._id = id;
            this._container = container;
            this.message = message;
            this._look = look && typeof look == 'object' ? look : null;
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
          * Сеттер свойства, устанавливает текст сообщения
          * @public
          * @type {string}
          */
         set message (msg) {
            this._message = msg && typeof msg == 'string' ? msg : null;
         }

         /**
          * Геттер свойства, возвращает текст сообщения
          * @public
          * @type {string}
          */
         get message () {
            return this._message;
         }

         /**
          * Геттер свойства, возвращает параметры внешнего вида
          * @public
          * @type {object}
          */
         get look () {
            return this._look;
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
            WaitIndicatorInner.start(this._id, this._container, this._message, this._look);
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
       * Класс с внутренними методами модуля
       */
      class WaitIndicatorInner {
         /**
          * Запросить помещение DOM-элемент индикатора в DOM. Будет выполнено, если элемента ещё нет в DOM-е
          * @public
          * @param {number} id Идентификатор индикатора
          * @param {HTMLElement} container Контейнер индикатора
          * @param {string} message Текст сообщения индикатора
          * @param {object} look Параметры внешнего вида индикатора
          */
         static start (id, container, message, look) {
            let poolIndex = WaitIndicatorInner._searchQuequeIndex(container);
            if (poolIndex !== -1) {
               // Индикатор уже есть в DOM-е
               let poolItem =  WaitIndicatorPool[poolIndex];
               if (!poolItem.list.length) {
                  poolItem.spinner.style.display = '';
               }
               poolItem.list.push({id, message});
               // Сбросить отсчёт времени до принудительного удаления из DOM-а
               WaitIndicatorInner._unclear(poolItem);
            }
            else {
               // Индикатора в DOM-е не содержиться
               let spinner = WaitIndicatorSpinner.create(container, message, look);
               //////////////////////////////////////////////////
               console.log('DBG: start: spinner=', spinner, ';');
               //////////////////////////////////////////////////
               WaitIndicatorPool.push({container, spinner, list:[{id, message}]});
               //////////////////////////////////////////////////
               console.log('DBG: start: WaitIndicatorPool=', WaitIndicatorPool, ';');
               //////////////////////////////////////////////////
            }
         }

         /**
          * Запросить скрытие DOM-элемент индикатора без удаления из DOM-а. Будет выполнено, если нет других запросов на показ
          * @public
          * @param {number} id Идентификатор индикатора
          * @param {HTMLElement} container Контейнер индикатора
          * @param {string} message Текст сообщения индикатора
          */
         static suspend (id, container, message) {
            WaitIndicatorInner._remove(id, container, message, false);
         }

         /**
          * Запросить удаление DOM-элемент индикатора из DOM-а. Будет выполнено, если нет других запросов на показ
          * @public
          * @param {number} id Идентификатор индикатора
          * @param {HTMLElement} container Контейнер индикатора
          * @param {string} message Текст сообщения индикатора
          */
         static remove (id, container, message) {
            WaitIndicatorInner._remove(id, container, message, true);
         }

         /**
          * Общая реализация для методов suspend и remove
          * @protected
          * @param {number} id Идентификатор индикатора
          * @param {HTMLElement} container Контейнер индикатора
          * @param {string} message Текст сообщения индикатора
          * @param {boolean} force Удалить из DOM-а совсем, не просто скрыть
          */
         static _remove (id, container, message, force) {
            let poolIndex = WaitIndicatorInner._searchQuequeIndex(container);
            if (poolIndex !== -1) {
               let poolItem =  WaitIndicatorPool[poolIndex];
               let i = poolItem.list.length ? poolItem.list.findIndex(item => item.id === id) : -1;
               if (i !== -1) {
                  if (1 < poolItem.list.length) {
                     poolItem.list.splice(i, 1);
                     let msg = poolItem.list[0].message;
                     if (message !== msg) {
                        WaitIndicatorSpinner.changeMessage(poolItem.spinner, msg);
                     }
                  }
                  else {
                     if (!force) {
                        poolItem.list.splice(i, 1);
                        poolItem.spinner.style.display = 'none';
                        // Начать отсчёт времени до принудительного удаления из DOM-а
                        poolItem.clearing = setTimeout(() => {
                           WaitIndicatorInner._delete(poolItem);
                        }, WaitIndicatorManager.SUSPEND_TIME);
                     }
                     else {
                        // Удалить из DOM-а и из очереди
                        WaitIndicatorInner._delete(poolItem);
                     }
                  }
               }
            }
         }

         /**
          * Удалить из DOM-а и из очереди
          * @protected
          * @param {object} poolItem Элемент очереди
          */
         static _delete (poolItem) {
            // Сбросить отсчёт времени до принудительного удаления из DOM-а
            WaitIndicatorInner._unclear(poolItem);
            // Удалить из DOM-а
            WaitIndicatorSpinner.remove(poolItem.spinner);
            // Удалить из очереди
            WaitIndicatorInner._removeQuequeItem(poolItem);
         }

         /**
          * Сбросить отсчёт времени до принудительного удаления из DOM-а
          * @protected
          * @param {object} poolItem Элемент очереди
          */
         static _unclear (poolItem) {
            if ('clearing' in poolItem) {
               clearTimeout(poolItem.clearing);
               delete poolItem.clearing;
               //////////////////////////////////////////////////
               console.log('DBG: _unclear: (clearing in poolItem)=', ('clearing' in poolItem), ';');
               //////////////////////////////////////////////////
            }
         }

         /**
          * Найти индекс элемента очереди по контейнеру
          * @protected
          * @param {HTMLElement} container Контейнер индикатора
          * @return {number}
          */
         static _searchQuequeIndex (container) {
            return WaitIndicatorPool.length ? WaitIndicatorPool.findIndex(item => item.container === container) : -1;
            /*###return WaitIndicatorPool.length ? WaitIndicatorPool.reduce((acc, item, i) => {
               if (item.container === container) {
                  acc.push(i);
               }
               return acc;
            }, []) : [];*/
         }

         /**
          * Удалить элемент очереди
          * @protected
          * @param {object} item Элемент очереди
          */
         static _removeQuequeItem (poolItem) {
            if (WaitIndicatorPool.length) {
               let i = WaitIndicatorPool.findIndex(item => item === poolItem);
               if (i !== -1) {
                  WaitIndicatorPool.splice(i, 1);
               }
            }
         }
      }

      /**
       * ### Очередь ...
       * @type {object[]}
       */
      let WaitIndicatorPool = [];



      /**
       * Класс в котором собраны методы, непосредственно оперирующими с DOM-ом
       */
      class WaitIndicatorSpinner {
         /**
          * Создать и добавить в DOM элемент индикатора
          * @public
          * @param {HTMLElement} container Контейнер индикатора
          * @param {string} message Текст сообщения индикатора
          * @return {HTMLElement}
          */
         static create (container, message, look) {
            //////////////////////////////////////////////////
            console.log('DBG: Spinner create: look=', look, ';');
            //////////////////////////////////////////////////
            // Здесь единственное место использования jQuery (###возможно временно?)
            /*^^^let _dotTplFn = $ws.doT.template('<div class="WaitIndicator">{{message}}</div>');*/
            //////////////////////////////////////////////////
            //console.log('DBG: Spinner create: _dotTplFn=', _dotTplFn, ';');
            //////////////////////////////////////////////////
            // ### Зависит от шаблона !
            let $container = $(container || document.body);
            //////////////////////////////////////////////////
            console.log('DBG: Spinner create: $container=', $container, ';');
            //////////////////////////////////////////////////
            //###let notSmall = !(look && look.small);
            let hasMsg = !(look && look.small) && !!message;
            let $spinner = $('<div class="ws-wait-indicator"><div class="ws-wait-indicator-in">' + (hasMsg ? message : '') + '</div></div>');
            if (look) {
               if (look.small) {
                  $spinner.addClass('ws-wait-indicator_small');
               }
            }
            if (hasMsg) {
               $spinner.addClass('ws-wait-indicator_text');
            }
            $container.append($spinner);
            return $spinner[0];
         }

         /**
          * Изменить сообщение в DOM-элементе индикатора
          * @public
          * @param {HTMLElement} spinner DOM-элемент индикатора
          * @param {string} message Текст сообщения индикатора
          */
         static changeMessage (spinner, message) {
            // ### Зависит от шаблона !
            spinner.firstElementChild.innerHTML = message || '';
         }

         /**
          * Удалить из DOM элемент индикатора
          * @public
          * @param {HTMLElement} spinner DOM-элемент индикатора
          */
         static remove (spinner) {
            spinner.parentNode.removeChild(spinner);
         }
      }



      return WaitIndicatorManager;
   }
);
