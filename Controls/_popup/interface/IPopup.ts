import {IBaseOpener} from './IBaseOpener';

/**
 * Приватный интерфейс окон. Используется в работе менеджера окон и контроллеров.
 *
 * @interface Controls/_popup/interface/IPopup
 * @private
 * @author Красильников А.С.
 */

export interface IPopupItem {
   id: string;
   parentId: string;
   position: IPopupPosition;
   popupOptions: IPopupOptions;
   popupState: string;
   sizes: IPopupSizes;
   _destroyDeferred: Promise<undefined>;
}

export interface IPopupSizes {
   width: number;
   height: number;
}

export interface IPopupPosition {
   top?: number;
   left?: number;
   bottom?: number;
   right?: number;
   minWidth?: number;
   maxWidth?: number;
   minHeight?: number;
   maxHeight?: number;
}

export interface IEventHandlers {
   onOpen?: Function;
   onClose?: Function;
   onResult?: Function;
}

export interface IPopupOptions extends IBaseOpener {
   width?: number;
   height?: number;
   minWidth?: number;
   maxWidth?: number;
   minHeight?: number;
   maxHeight?: number;
   content?: Function;
}

export default interface IPopup {
   readonly '[Controls/_popup/interface/IPopup]': boolean;
}
