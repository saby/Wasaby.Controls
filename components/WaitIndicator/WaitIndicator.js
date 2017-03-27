'use strict';

/*
 * TODO: (+) Разобраться с target
 * TODO: (+) Добавить события или промисы на начало/конец показа индикатора
 * TODO: ### Понять, нужно ли Proxy-рование
 * TODO: (+) Применить опции
 * TODO: (+) Локальные индикаторы
 * TODO: ### Будем ли использовать Component-ы в качестве объектов привязки ?
 * TODO: (-) Нужен ли cancel как псевдоним remove ?
 * TODO: (+-) Нужен ли массив экземпляров индикаторов (не в DOM-е)? Если нужен, то как его чистить ?
 * TODO:     Если не нужен, то как контролировать единственность неглобальных?
 * TODO: (+) Добавить приостановку индикатора, без удаления из DOM-а
 * TODO: (+) Объединить схожий код в start, suspend и remove, clearDelays
 * TODO: (+) Добавить очистку DOM-а по тайауту ?
 * TODO: ### Может, перенести работу с target-ами полностью в manager ?
 * TODO: ### Добавить опцию для настройки времени удаления приостановленных индикаторов
 * TODO:     и ограничивающую максимальную константу
 * TODO: ### Сделать реальный шаблон индикатора
 * TODO: ### Актуальны ли много-элементные объекты привязки (наборы элементов)
*/

/**
 * ###
 */
class WaitIndicatorManager {
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
      let targetNode = WaitIndicator.getTargetNode(target);
      let isGlobal = !target;
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
         indicator = list.length ? list.find(item => item.target === targetNode) : null;
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
         indicator = new WaitIndicator(target);
         if (!hidden) {
            indicator.start(delay);
         }
         list.push(indicator);
      }
      // и вернуть (###прокси?)
      return indicator;
   }
}



/**
 * ###
 */
class WaitIndicator {
   /**
    * ###
    * @public
    * @constructor
    * @param {###} target Объект привязки индикатора
    */
   constructor (target/*###, delay*/) {
      //////////////////////////////////////////////////
      console.log('DBG: WaitIndicator: arguments.length=', arguments.length, '; arguments=', arguments, ';');
      //////////////////////////////////////////////////
      this._target = WaitIndicator.getTargetNode(target);
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
    * Константа - максимальное время по умолчанию до удаления приостановленных индикаторов из DOM-а
    * @public
    * @static
    * @type {number}
    */
   static get SUSPEND_TIME () {
      return 10000;
   }

   /**
    * Проверить, является ли указанный объект привязки глобальным
    * @public
    * @static
    * @param {###Component|jQuery|HTMLElement} target Объект привязки индикатора
    * @return {boolean}
    */
   /*###static isGlobalTarget (target) {
      return !WaitIndicator.getTargetNode();
   }*/

   /**
    * Определить элемент DOM, соответствующий указанному объекту привязки
    * @public
    * @static
    * @param {###Component|jQuery|HTMLElement} target Объект привязки индикатора
    * @return {HTMLElement}
    */
   static getTargetNode (target) {
      //////////////////////////////////////////////////
      console.log('DBG: getTargetNode: (target && typeof target === object)=', (target && typeof target === 'object'), ';');
      //////////////////////////////////////////////////
      if (!target || typeof target !== 'object') {
         return null;
      }
      //////////////////////////////////////////////////
      console.log('DBG: getTargetNode: (target.jquery && typeof target.jquery === string)=', (target.jquery && typeof target.jquery === 'string'), ';');
      //////////////////////////////////////////////////
      let node = target;
      if (target.jquery && typeof target.jquery === 'string') {
         if (!target.length) {
            return null;
         }
         node = target[0];
      }
      return node !== window && node !== document && node !== document.body ? node : null;
   }

   /**
    * Геттер свойства, возвращает DOM элемент привязки
    * @public
    * @type {HTMLElement}
    */
   get target () {
      return this._target;
   }

   /**
    * Геттер свойства, указывает, что индикатор является глобальным
    * @public
    * @type {boolean}
    */
   get isGlobal () {
      return !this._target;
   }

   /**
    * Геттер свойства, указывает, что индикатор показывается в данный момент
    * @public
    * @type {boolean}
    */
   get isVisible () {
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
      /*###this._clearDelays();
      if (typeof delay === 'number' && 0 < delay) {
         let success, fail, promise = new Promise((resolve, reject) => {
            success = resolve;
            fail = reject;
         });
         this._starting = {
            id: setTimeout(() => {
               //////////////////////////////////////////////////
               console.log('DBG: start: TIMEOUT this._starting=', this._starting, ';');
               //////////////////////////////////////////////////
               this._start();
               this._starting.success.call(null);
               this._starting = null;
            }, delay),
            success: success,
            fail: fail,
            promise: promise
         };
         return promise.catch((err) => {});
      }
      else {
         this._start();
         return Promise.resolve();
      }*/
   }

   /**
    * Начать показ индикатора немедленно
    * @protected
    */
   _start () {
      if (this._spinner && this._spinner.parentNode) {
         // Индикатор уже есть и добавлен в DOM
         this._spinner.style.display = '';
         // ### Сбросить отсчёт времени до принудительного удаления из DOM-а
      }
      else {
         // Индикатора ещё нет или он не добавлен в DOM
         // ### Здесь единственное место использования jQuery
         let $container = $(this._target || document.body);
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
      this._regUse();
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
      /*###this._clearDelays();
      if (typeof delay === 'number' && 0 < delay) {
         let success, fail, promise = new Promise((resolve, reject) => {
            success = resolve;
            fail = reject;
         });
         this._suspending = {
            id: setTimeout(() => {
               //////////////////////////////////////////////////
               console.log('DBG: suspend: TIMEOUT this._suspending=', this._suspending, ';');
               //////////////////////////////////////////////////
               this._suspend();
               this._suspending.success.call(null);
               this._suspending = null;
            }, delay),
            success: success,
            fail: fail,
            promise: promise
         };
         return promise.catch((err) => {});
      }
      else {
         this._suspend();
         return Promise.resolve();
      }*/
   }

   /**
    * Завершить показ индикатора немедленно
    * @protected
    */
   _suspend () {
      if (this._spinner && this._spinner.parentNode) {
         this._spinner.style.display = 'none';
         // ### Начать отсчёт времени до принудительного удаления из DOM-а
         this._clearing = {
            id: setTimeout(() => {
               this._remove();
               this._clearing = null;
            }, WaitIndicator.SUSPEND_TIME)
         };
         this._regUse();
      }
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
      /*###this._clearDelays();
      if (typeof delay === 'number' && 0 < delay) {
         let success, fail, promise = new Promise((resolve, reject) => {
            success = resolve;
            fail = reject;
         });
         this._removing = {
            id: setTimeout(() => {
               //////////////////////////////////////////////////
               console.log('DBG: remove: TIMEOUT this._removing=', this._removing, ';');
               //////////////////////////////////////////////////
               this._remove();
               this._removing.success.call(null);
               this._removing = null;
            }, delay),
            success: success,
            fail: fail,
            promise: promise
         };
         return promise.catch((err) => {});
      }
      else {
         this._remove();
         return Promise.resolve();
      }*/
   }

   /**
    * Завершить показ индикатора немедленно
    * @protected
    */
   _remove () {
      if (this._spinner && this._spinner.parentNode) {
         this._spinner.parentNode.removeChild(this._spinner);
      }
      this._spinner = null;
      this._regUse();
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
