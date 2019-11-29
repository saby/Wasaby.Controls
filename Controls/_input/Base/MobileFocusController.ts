import {Bus} from 'Env/Event';
import {detection} from 'Env/Env';
import {SyntheticEvent} from 'Vdom/Vdom';

export interface IMobileFocusController {
   blurHandler(event: SyntheticEvent<FocusEvent>): void;
   focusHandler(event: SyntheticEvent<FocusEvent>): void;
   touchStartHandler(event: SyntheticEvent<TouchEvent>): void;
}

type FocusEventName = 'MobileInputFocus' | 'MobileInputFocusOut';

/**
 * Controls the focus behavior of input fields on mobile devices.
 * @remark
 * Allows to react in case of when the field gets focus, the keyboard on the touch devices is shown.
 * This changes the size of the workspace and may require repositioning controls on the page, such as popup.
 * @remark
 * TODO: Kingo
 * Как происходит оповещения событиями:
 * 1. Пользователь tap, поле не фокусировалось -> инициация событий не происходит.
 * 2. Пользователь tap, поле фокусировалось -> инициируется событие MobileInputFocus.
 * 3. Поле фокусируется, пользовательского tap не было -> инициация событий не происходит.
 * 4. Поле фокусируется, был пользовательский tap -> инициируется событие MobileInputFocus.
 * 5. Поле теряет фокус -> инициируется событие MobileInputFocusOut.
 */
class MobileFocusController implements IMobileFocusController {
   private _wasTouch: boolean = false;
   private _wasFocus: boolean = false;
   private _userFocused: boolean = false;

   /**
    * Notify to global channel about receiving or losing focus in field.
    */
   private _notify(eventName: FocusEventName): void {
      switch (eventName) {
         case 'MobileInputFocus':
            if (!this._userFocused) {
               this._userFocused = true;
               Bus.globalChannel().notify('MobileInputFocus');
            }
            break;
         case 'MobileInputFocusOut':
            if (this._userFocused) {
               this._userFocused = false;
               Bus.globalChannel().notify('MobileInputFocusOut');
            }
            break;
      }
   }

   touchStartHandler(): void {
      if (!detection.isMobileIOS) {
         return;
      }

      this._wasTouch = true;
      if (this._wasFocus) {
         this._notify('MobileInputFocus');
      }
   }

   focusHandler(): void {
      if (!detection.isMobileIOS) {
         return;
      }

      this._wasFocus = true;
      if (this._wasTouch) {
         this._notify('MobileInputFocus');
      }
   }

   blurHandler(): void {
      if (!detection.isMobileIOS) {
         return;
      }

      this._wasTouch = false;
      this._wasFocus = false;
      this._notify('MobileInputFocusOut');
   }
}

export default new MobileFocusController();
