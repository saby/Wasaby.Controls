
const MIN_VALUE = 3;

export interface ISearchDelayOptions {
   delayTime?: number | null;
   minSearchValueLength?: number;
   searchCallback: (value: string) => void;
   searchResetCallback: () => void;
}

export default class SearchDelay {

   protected _delayTimer: NodeJS.Timeout = null;

   protected _options: ISearchDelayOptions = null;

   constructor(options: ISearchDelayOptions) {
      this._options = options;
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
      const l = this._options.minSearchValueLength;

      if (!l && l !== 0) { return; }

      if (this._options.delayTime) {
         this.callAfterDelay(
            value && value.length >= l ?
               this._options.searchCallback : this._options.searchResetCallback,
            value);
      } else {
         this._options.searchCallback(value);
      }
   }
}
