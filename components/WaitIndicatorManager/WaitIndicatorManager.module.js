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
       * TODO: (+) Сделать реальный шаблон индикатора
       * TODO: ### Актуальны ли много-элементные объекты привязки (наборы элементов)
       * TODO: (+) Привести к новым реалиям isVisible
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
       * TODO: (+) Добавить локально-глобальную блокировку
       * TODO: (+-) Перейти от тестов к демо
       * TODO: (+) Убрать lastUse
       * TODO: (+-) Стилевые классы на все случаи
       * TODO: (+) Сообщение меняется с ошибкой
       * TODO: (+) Избавиться от jQuery
       * TODO: ### Возможно стоит механизировать разбор опций ?
       * TODO: ### Разобраться с урлами картинок
       * TODO: (+) Пересмотреть аргументы методов класса Inner
       * TODO: (+) Добавить возможность менять сообщение на лету
       * TODO: (+) Сделать подробные описания к демам
       * TODO: (+) Сделать вывод поясняющих сообщений в демо (псевдо-консоль)
       * TODO: (+) Собрать всё про Pool в класс
       * TODO: (+) Стоит ли убрать совсем методы _start, _suspend, _remove ?
       * TODO: (+) Отправлять в промисы при разрешении инстанс индикатора
       * TODO: (+) Совсем не показывать индикаторы с параметром hidden
       * TODO: ### Возможно, нужна поддержка настраиваемых цветов для оверлея (не просто тёмный или прозрачный) ?
       * TODO: ### Оверлей для локальных индикаторов
       * TODO: ### Сделать конверторы promise <--> Deffered ?
       * TODO: (+) Переименовать константу SUSPEND_TIME в SUSPEND_LIFETIME
       * TODO: (+) Есть ошибка при установке сообщения
       * TODO: (+) Порефакторить аргументы _remove в Inner
       * TODO: (+) Порефакторить формат элементов пула
       * TODO: (+) Возможно, лучше не удалять при локально-глобальной блокировке ?
       * TODO: ### Похоже есть задержка при локально-глобальной блокировке - проверить/разобраться
       * TODO: ###
       * TODO: ### Почистить код, откоментировать неоткоментированное
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
         static get SUSPEND_LIFETIME () {
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
               small = options ? options.small : false,
               noOverlay = false,
               darkOverlay = false;
            if (options && options.overlay && typeof options.overlay == 'string') {
               let overlay = options.overlay.toLowerCase();
               noOverlay = overlay === 'no' || overlay === 'none';
               darkOverlay = overlay === 'dark';
            }

            let id = ++WaitIndicatorCounter;
            //////////////////////////////////////////////////
            console.log('DBG: getWaitIndicator: id=', id, ';');
            //////////////////////////////////////////////////
            let container = WaitIndicatorManager._getContainer(target);
            let indicator = new WaitIndicator(id, container, message, {small, noOverlay, darkOverlay});
            if (!hidden) {
               indicator.start(0 <= delay ? delay : WaitIndicatorManager.DEFAULT_DELAY);
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
      };

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
          * Геттер свойства, возвращает идентификатор
          * @public
          * @type {number}
          */
         get id () {
            return this._id;
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
         get isVisible () {
            let poolItem = WaitIndicatorPool.search(this._container);
            return poolItem ? WaitIndicatorSpinner.isVisible(poolItem.spinner) : false;
         }

         /**
          * Геттер свойства, указывает, что элемент индикатора находиться в DOM-е
          * @public
          * @type {boolean}
          */
         get isInTheDOM () {
            return WaitIndicatorPool.searchIndex(this._container) !== -1;
         }

         /**
          * Сеттер свойства, устанавливает текст сообщения
          * @public
          * @type {string}
          */
         set message (msg) {
            let prevMsg = this._message;
            this._message = msg && typeof msg == 'string' ? msg : null;
            if (this._message !== prevMsg) {
               let poolItem = WaitIndicatorPool.search(this._container);
               if (poolItem) {
                  WaitIndicatorInner.checkMessage(poolItem, prevMsg);
               }
            }
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
            return this._callDelayed('start','_starting', delay);
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
            return this._callDelayed('suspend','_suspending', delay);
         }

         /**
          * Завершить показ индикатора через (опциональное) время задержки
          * (Все предыдущие вызовы с задержками методов start, suspend и remove отменяются последним вызовом)
          * @public
          * @param {number} delay Время задержки в миллисекундах
          * @return {Promise}
          */
         remove (delay) {
            return this._callDelayed('remove','_removing', delay);
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
                     WaitIndicatorInner[method](this);
                     this[storing].success.call(null, this);
                     this[storing] = null;
                  }, delay),
                  success: success,
                  fail: fail,
                  promise: promise
               };
               return promise.catch((err) => {});
            }
            else {
               WaitIndicatorInner[method](this);
               return Promise.resolve(this);
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
      };



      /**
       * Класс с внутренними методами модуля
       */
      class WaitIndicatorInner {
         /**
          * Запросить помещение DOM-элемент индикатора в DOM. Будет выполнено, если элемента ещё нет в DOM-е
          * @public
          * @param {WaitIndicator} indicator Индикатор
          */
         static start (indicator) {
            let container = indicator.container;
            let isGlobal = !container;
            if (isGlobal) {
               WaitIndicatorPool.each(item => {
                  if (item.container) {
                     WaitIndicatorSpinner.hide(item.spinner);
                     item.isLocked = true;
                  }
               });
            }
            let poolItem = WaitIndicatorPool.search(container);
            if (poolItem) {
               // Индикатор уже есть в DOM-е
               if (!poolItem.indicators.length) {
                  WaitIndicatorSpinner.show(poolItem.spinner);
               }
               poolItem.indicators.push(indicator);
               // Сбросить отсчёт времени до принудительного удаления из DOM-а
               WaitIndicatorInner._unclear(poolItem);
            }
            else {
                // Индикатора в DOM-е не содержиться
               let spinner = WaitIndicatorSpinner.create(container, indicator.message, indicator.look);
               //////////////////////////////////////////////////
               console.log('DBG: start: spinner=', spinner, ';');
               //////////////////////////////////////////////////
               WaitIndicatorPool.add({container, spinner, indicators:[indicator]});
               //////////////////////////////////////////////////
               console.log('DBG: start: WaitIndicatorPool._list=', WaitIndicatorPool._list, ';');
               //////////////////////////////////////////////////
            }
         }

         /**
          * Запросить скрытие DOM-элемент индикатора без удаления из DOM-а. Будет выполнено, если нет других запросов на показ
          * @public
          * @param {WaitIndicator} indicator Индикатор
          */
         static suspend (indicator) {
            WaitIndicatorInner._remove(indicator, false);
         }

         /**
          * Запросить удаление DOM-элемент индикатора из DOM-а. Будет выполнено, если нет других запросов на показ
          * @public
          * @param {WaitIndicator} indicator Индикатор
          */
         static remove (indicator) {
            WaitIndicatorInner._remove(indicator, true);
         }

         /**
          * Общая реализация для методов suspend и remove
          * @protected
          * @param {WaitIndicator} indicator Индикатор
          * @param {boolean} force Удалить из DOM-а совсем, не просто скрыть
          */
         static _remove (indicator, force) {
            let container = indicator.container;
            let isGlobal = !container;
            let poolItem = WaitIndicatorPool.search(container);
            if (poolItem) {
               let id = indicator.id;
               let i = poolItem.indicators.length ? poolItem.indicators.findIndex(item => item.id === id) : -1;
               if (i !== -1) {
                  if (1 < poolItem.indicators.length) {
                     poolItem.indicators.splice(i, 1);
                     WaitIndicatorInner.checkMessage(poolItem, indicator.message);
                  }
                  else {
                     if (!force) {
                        poolItem.indicators.splice(i, 1);
                        WaitIndicatorSpinner.hide(poolItem.spinner);
                        // Начать отсчёт времени до принудительного удаления из DOM-а
                        poolItem.clearing = setTimeout(() => {
                           WaitIndicatorInner._delete(poolItem);
                        }, WaitIndicatorManager.SUSPEND_LIFETIME);
                     }
                     else {
                        // Удалить из DOM-а и из пула
                        WaitIndicatorInner._delete(poolItem);
                     }
                  }
               }
            }
            if (isGlobal) {
               WaitIndicatorPool.each(item => {
                  if (item.container) {
                     WaitIndicatorSpinner.show(item.spinner);//###.insert(item.container, item.spinner)
                     item.isLocked = false;
                  }
               });
            }
         }

         /**
          * Удалить из DOM-а и из пула
          * @protected
          * @param {object} poolItem Элемент пула
          */
         static _delete (poolItem) {
            // Сбросить отсчёт времени до принудительного удаления из DOM-а
            WaitIndicatorInner._unclear(poolItem);
            // Удалить из DOM-а
            WaitIndicatorSpinner.remove(poolItem.spinner);
            // Удалить из пула
            WaitIndicatorPool.remove(poolItem);
         }

         /**
          * Проверить, и обновить, если нужно, отображаемое сообщение
          * @protected
          * @param {object} poolItem Элемент пула
          * @param {string} prevMessage Текущее (отображаемое) сообщение
          */
         static checkMessage (poolItem, prevMessage) {
            let inds = poolItem.indicators;
            if (inds.length) {
               let msg = inds[0].message;
               if (prevMessage !== msg) {
                  WaitIndicatorSpinner.changeMessage(poolItem.spinner, msg);
               }
            }
         }

         /**
          * Сбросить отсчёт времени до принудительного удаления из DOM-а
          * @protected
          * @param {object} poolItem Элемент пула
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
      };



      /**
       * Пул содержащий информацию о находящихся в DOM-е элементах индикаторов
       * @type {object}
       */
      let WaitIndicatorPool = {
         /**
          * Список элементов пула
          * @protected
          * @type {object[]}
          */
         _list: [],

         /**
          * Добавить элемент пула
          * @protected
          * @param {object} item Элемент пула
          */
         add (item) {
            this._list.push(item);
         },

         /**
          * Найти индекс элемента пула по контейнеру
          * @public
          * @param {HTMLElement} container Контейнер индикатора
          * @return {number}
          */
         searchIndex (container) {
            return this._list.length ? this._list.findIndex(item => item.container === container) : -1;
         },

         /**
          * Найти элемента пула по контейнеру
          * @public
          * @param {HTMLElement} container Контейнер индикатора
          * @return {object}
          */
         search (container) {
            let i = this.searchIndex(container);
            return i !== -1 ? this._list[i] : null;
         },

         /**
          * Удалить элемент пула
          * @protected
          * @param {object} item Элемент пула
          */
         remove (item) {
            if (this._list.length) {
               let i = this._list.indexOf(item);//###.findIndex(v => v === item)
               if (i !== -1) {
                  this._list.splice(i, 1);
               }
            }
         },

         /**
          * Выполнить указанную функцию со всеми элементами
          * @public
          * @param {function} func Функция
          */
         each (func) {
            this._list.forEach(func);
         }
};



      /**
       * Класс в котором собраны методы, непосредственно оперирующими с DOM-ом
       */
      class WaitIndicatorSpinner {
         /**
          * Создать и добавить в DOM элемент индикатора
          * @public
          * @param {HTMLElement} container Контейнер индикатора
          * @param {string} message Текст сообщения индикатора
          * @param {object} look Параметры внешнего вида индикатора
          * @return {HTMLElement}
          */
         static create (container, message, look) {
            //###let _dotTplFn = $ws.doT.template('<div class="WaitIndicator">{{message}}</div>');
            //////////////////////////////////////////////////
            console.log('DBG: Spinner create: look=', look, ';');
            //////////////////////////////////////////////////
            let hasMsg = !(look && look.small) && !!message;
            let html = '<div class="ws-wait-indicator"><div class="ws-wait-indicator-in" data-node="message">' + (hasMsg ? message : '') + '</div></div>';

            let spinner = document.createElement('div');
            spinner.innerHTML = html;
            spinner = spinner.firstElementChild;
            /*###if (hasMsg) {
               WaitIndicatorSpinner.changeMessage(spinner, message);
            }*/
            let cls = spinner.classList;
            if (look) {
               if (look.small) {
                  cls.add('ws-wait-indicator_small');
               }
               if (look.noOverlay || look.small) {
                  cls.add('ws-wait-indicator_no-overlay');
               }
               if (look.darkOverlay) {
                  cls.add('ws-wait-indicator_dark-overlay');
               }
            }
            if (hasMsg) {
               cls.add('ws-wait-indicator_text');
            }
            WaitIndicatorSpinner.insert(container, spinner);
            return spinner;
         }

         /**
          * Добавить в DOM элемент индикатора
          * @public
          * @param {HTMLElement} container Контейнер индикатора
          * @param {HTMLElement} spinner DOM-элемент индикатора
          */
         static insert (container, spinner) {
            let p = container || document.body;
            if (p !== spinner.parentNode) {
               p.appendChild(spinner);
            }
         }

         /**
          * Удалить из DOM элемент индикатора
          * @public
          * @param {HTMLElement} spinner DOM-элемент индикатора
          */
         static remove (spinner) {
            let p = spinner.parentNode;
            if (p) {
               p.removeChild(spinner);
            }
         }

         /**
          * Изменить сообщение в DOM-элементе индикатора
          * @public
          * @param {HTMLElement} spinner DOM-элемент индикатора
          * @param {string} message Текст сообщения индикатора
          */
         static changeMessage (spinner, message) {
            if (!('ws' in spinner)) {
               spinner.ws = {};
            }
            if (!('message' in spinner.ws)) {
               spinner.ws.message = [].slice.call(spinner.querySelectorAll('[data-node="message"]'));
            }
            spinner.ws.message.forEach(node => {node.innerHTML = message || ''});
         }

         /**
          * Показать временно скрытый элемент индикатора
          * @public
          * @param {HTMLElement} spinner DOM-элемент индикатора
          */
         static show (spinner) {
            spinner.style.display = '';
         }

         /**
          * Временно скрыть элемент индикатора
          * @public
          * @param {HTMLElement} spinner DOM-элемент индикатора
          */
         static hide (spinner) {
            spinner.style.display = 'none';
         }

         /**
          * Определить, является ли элемент индикатора видимым
          * @public
          * @param {HTMLElement} spinner DOM-элемент индикатора
          * @return {boolean}
          */
         static isVisible (spinner) {
            return spinner.style.display !== 'none';
         }
      };



      return WaitIndicatorManager;
   }
);
