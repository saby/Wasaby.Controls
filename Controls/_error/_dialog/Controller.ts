import { IPopupController, IPopupItem } from 'Controls/popup';

interface ISize {
    width: number;
    height: number;
}

interface IWindow extends Window {
    visualViewport?: ISize;
}

export default class Controller implements IPopupController {
    POPUP_STATE_CREATED: string;
    POPUP_STATE_DESTROYED: string;
    POPUP_STATE_DESTROYING: string;
    POPUP_STATE_INITIALIZING: string;
    POPUP_STATE_START_DESTROYING: string;
    POPUP_STATE_UPDATED: string;
    POPUP_STATE_UPDATING: string;
    TYPE: string;

    private _getWindowSize(): ISize {
        if (!window) {
            return { width: 0, height: 0 };
        }

        const visualViewport = (window as IWindow).visualViewport;
        const width = visualViewport ? visualViewport.width : window.innerWidth;
        const height = visualViewport ? visualViewport.height : window.innerHeight;

        return { width, height };
    }

    _beforeElementDestroyed(item: IPopupItem, container: HTMLElement): Promise<undefined> {
        return Promise.resolve(undefined);
    }

    _elementAfterUpdated(item: IPopupItem, container: HTMLElement): boolean {
        return false;
    }

    _elementAnimated(item: IPopupItem): boolean {
        return false;
    }

    _elementCreated(item: IPopupItem, container: HTMLElement): boolean {
        return false;
    }

    _elementDestroyed(item: IPopupItem, container: HTMLElement): Promise<undefined> {
        return Promise.resolve(undefined);
    }

    _elementMaximized(item: IPopupItem, container: HTMLElement, state: boolean): boolean {
        return false;
    }

    _elementUpdated(item: IPopupItem, container: HTMLElement): boolean {
        return false;
    }

    _popupDragEnd(item: IPopupItem): boolean {
        return false;
    }

    _popupResizingLine(item: IPopupItem, offset: unknown): boolean {
        return false;
    }

    getDefaultConfig(item: IPopupItem): Promise<void> | null {
        const windowSize = this._getWindowSize();
        item.position = {
            left: windowSize.width / 2,
            top: windowSize.height / 2
        };
        return null;
    }
}
