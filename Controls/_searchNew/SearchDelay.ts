import {ISearchDelay, ISearchDelayOptions} from './interface';

export default class SearchDelay implements ISearchDelay {

   protected _delayTimer: NodeJS.Timeout = null;

   protected _options: ISearchDelayOptions = null;

   constructor(options: ISearchDelayOptions) {
      this._options = options;
   }

   private _resolveCallback(callback: Function, value: string): void {
      if (this._options.delayTime) {
         this._callAfterDelay(callback, value);
      } else {
         callback(value);
      }
   }

   private _clearTimer(): void {
      if (this._delayTimer) {
         clearTimeout(this._delayTimer);
         this._delayTimer = null;
      }
   }

   private _callAfterDelay(callback: Function, value: string): void {
      this._clearTimer();

      this._delayTimer = setTimeout(() => {
         this._delayTimer = null;
         callback(value);
      }, this._options.delayTime);
   }

   resolve(value: string | null): void {
      const valueLength = value ? value.length : 0;
      const minSearchLength = this._options.minSearchLength !== null;

      if (minSearchLength && valueLength >= this._options.minSearchLength) {
         this._resolveCallback(this._options.searchCallback, value);
      } else if (minSearchLength || !valueLength) {
         if (valueLength) {
            this._resolveCallback(this._options.searchResetCallback, value);
         } else {
            this._options.searchResetCallback();
         }
      }
   }
}
