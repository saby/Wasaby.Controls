import {Bus} from 'Env/Event';
import {detection} from 'Env/Env';
import {SyntheticEvent} from 'Vdom/Vdom';

export interface IMobileFocusController {
   blurHandler(event: SyntheticEvent<FocusEvent>): void;
   focusHandler(event: SyntheticEvent<FocusEvent>): void;
   touchStartHandler(event: SyntheticEvent<TouchEvent>): void;
}

/**
 * Method decorator calling the target function only on IOS mobile.
 */
function forMobileIOS(target: Object, method: string, descriptor: PropertyDescriptor): void {
   const originalMethod = descriptor.value;

   descriptor.value = function(event: SyntheticEvent<FocusEvent>): void {
      if (detection.isMobileIOS) {
         return originalMethod.call(this, event);
      }
   };
}

type FocusEventName = 'MobileInputFocus' | 'MobileInputFocusOut';

/**
 * Controls the focus behavior of input fields on mobile devices.
 * @remark
 * Allows to react in case of when the field gets focus, the keyboard on the touch devices is shown.
 * This changes the size of the workspace and may require repositioning controls on the page, such as popup.
 */
class MobileFocusController implements IMobileFocusController {
   private _fromTouch: boolean = false;
   private _fromFocus: boolean = false;

   @forMobileIOS
   touchStartHandler(): void {
      this._fromTouch = true;
      MobileFocusController._notify('MobileInputFocus');
   }

   @forMobileIOS
   focusHandler(): void {
      if (this._fromTouch) {
         return;
      }

      this._fromFocus = true;
      MobileFocusController._notify('MobileInputFocus');
   }

   @forMobileIOS
   blurHandler(): void {
      if (this._fromTouch || this._fromFocus) {
         this._fromTouch = false;
         this._fromFocus = false;
         MobileFocusController._notify('MobileInputFocusOut');
      }
   }

   /**
    * Notify to global channel about receiving or losing focus in field.
    * @private
    */
   private static _notify(eventName: FocusEventName): void {
      Bus.globalChannel().notify(eventName);
   }
}

export default new MobileFocusController();
