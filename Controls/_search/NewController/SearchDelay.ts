export interface ISearchDelayOptions {
   delayTime?: number | null;
   minSearchLength?: number;
   searchCallback: (value: string) => void;
   searchResetCallback: () => void;
}

export default class SearchDelay {

   protected _delayTimer: NodeJS.Timeout = null;

   protected _options: ISearchDelayOptions = null;

   constructor(options: ISearchDelayOptions) {
      this._options = options;
   }

   private _resolveCallback(callback: Function, value: string): void {
      if (this._options.delayTime) {
         this.callAfterDelay(callback, value);
      } else {
         callback(value);
      }
   }

   clearTimer(): void {
      if (this._delayTimer) {
         clearTimeout(this._delayTimer);
         this._delayTimer = null;
      }
   }

   callAfterDelay(callback: Function, value: string): void {
      this.clearTimer();

      this._delayTimer = setTimeout(() => {
         this._delayTimer = null;
         callback(value);
      }, this._options.delayTime);
   }

   resolve(value: string | null): void {
      const valueLength = value ? value.length : 0;
      const searchByValueChanged = this._options.minSearchLength !== null;

      if ((searchByValueChanged && valueLength >= this._options.minSearchLength)) {
         this._resolveCallback(this._options.searchCallback, value);
      } else if (searchByValueChanged || !valueLength) {
         if (valueLength) {
            this._resolveCallback(this._options.searchResetCallback, value);
         } else {
            this._options.searchResetCallback();
         }
      }
   }
}
