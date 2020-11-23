import {ISearchResolver, ISearchResolverOptions} from './interface';

/**
 * Класс контроллер, используемый для принятия решения, совершать ли поиск или производить сброс по заданным параметрам
 * при его создании.
 * Используется в {@link Controls/suggest:_InputController} как звено в логической цепочке совершения поиска.
 * С помощью этого контроллера производится настройка: временная задержка между вводом символа и началом поиска; количество символов, с которых начинается поиск.
 * @remark
 * Если переданное значение поиска проходит по установленным в опциях параметрам,
 * то вызывается с установленной задержкой callback-функция, которая также задается опциями контроллера.
 * Если поиск был начат прежде, но пришло новое значенние для поиска, то будет вызван другой callback для сброса, который задается опциями контроллера.
 *
 *
 *
 *
 * @class Controls/_search/SearchResolver
 * @implements Controls/_search/interface/ISearchResolver
 * @author Крюков Н.Ю.
 *
 * @public
 */

export default class SearchResolver implements ISearchResolver {

   /**
    * Таймер для запуска поиска после паузы, заданной в опции delayTime
    * @protected
    */
   protected _delayTimer: NodeJS.Timeout = null;

   /**
    * Опции контроллера
    * @protected
    */
   protected _options: ISearchResolverOptions = null;

   /**
    * Начат ли поиск прежде
    * @protected
    */
   protected _searchStarted: boolean = false;

   constructor(options: ISearchResolverOptions) {
      this._options = options;
   }

   /**
    * Обновляет опции контроллера
    * @param options Новые опции контроллера
    */
   updateOptions(options: ISearchResolverOptions): void {
      this._options = options;
   }

   private _resolveCallback(callback: Function, value: string, searchStarted: boolean): void {
      if (this._options.delayTime) {
         this._callAfterDelay(callback, value).then(() => {
            this._searchStarted = searchStarted;
         });
      } else {
         callback(value);
         this._searchStarted = searchStarted;
      }
   }

   /**
    * Очищает таймер реализующий задержку перед поиском
    */
   clearTimer(): void {
      if (this._delayTimer) {
         clearTimeout(this._delayTimer);
         this._delayTimer = null;
      }
   }

   private _callAfterDelay(callback: Function, value: string): Promise<void> {
      this.clearTimer();

      return new Promise((resolve) => {
         this._delayTimer = setTimeout(() => {
            this._delayTimer = null;
            callback(value);
            resolve();
         }, this._options.delayTime);
      });
   }

   /**
    * Инициировать проверку, какое действие предпринять по полученному в аргументе значению
    * @param value Значение, по которому должен произзводиться поиск
    */
   resolve(value: string | null): void {
      const valueLength = value ? value.length : 0;
      const minSearchLength = this._options.minSearchLength !== null;

      if (minSearchLength && valueLength >= this._options.minSearchLength) {
         this._resolveCallback(this._options.searchCallback, value, true);
      } else if (minSearchLength || !valueLength) {
         if (this._options.delayTime) {
            this.clearTimer();
         }
         if (this._searchStarted) {
            if (valueLength) {
               this._resolveCallback(this._options.searchResetCallback, value, false);
            } else {
               this._options.searchResetCallback();
               this._searchStarted = false;
            }
         }
      }
   }

   /**
    * Устанавливает флаг начала поиска на переданное в аргументе значение
    * @param value Начат ли поиск
    */
   setSearchStarted(value: boolean): void {
      this._searchStarted = value;
   }
}
