import {default as BaseController, IDragOffset} from 'Controls/_popupTemplate/BaseController';
import {IPopupItem, ICurtainPopupOptions, Controller as PopupController} from 'Controls/popup';
import CurtainStrategy from './Strategy';

interface ICurtainItem extends IPopupItem {
    popupOptions: ICurtainPopupOptions;
    dragStartHeight: number;
}

/**
 * Curtain Popup Controller
 * @class Controls/_popupCurtain/Opener/Controller
 *
 * @private
 * @extends Controls/_popupTemplate/BaseController
 */
class Controller extends BaseController {
    TYPE: string = 'Curtain';
    private _destroyPromiseResolvers: Record<string, Function> = {};

    elementCreated(item: ICurtainItem, container: HTMLDivElement): boolean {

        // После создания запускаем анимацию изменив позицию
        const popupOptions = item.popupOptions;
        item.position[popupOptions.position] = 0;
        return true;
    }

    elementDestroyed({popupOptions, position, id}: ICurtainItem): Promise<null> {
        // Запускаем анимацию закрытия и откладываем удаление до её окончания
        position[popupOptions.position] = -position.height;
        return new Promise((resolve) => {
            this._destroyPromiseResolvers[id] = resolve;
        });
    }

    elementAnimated(item: IPopupItem): boolean {
        // Резолвим удаление, только после окончания анимации закрытия
        const destroyResolve = this._destroyPromiseResolvers[item.id];
        if (destroyResolve) {
            destroyResolve();
        }
        return true;
    }

    getDefaultConfig(item: ICurtainItem): void|Promise<void> {
        const popupOptions = item.popupOptions;
        const animationClass = ` controls-Curtain__animation-position-${popupOptions.position}`;
        let className = item.popupOptions.className || '';

        item.position = CurtainStrategy.getPosition(item);

        if (!className.includes(animationClass)) {
            className += animationClass;
        }
        item.popupOptions.className = className;
    }

    popupDragStart(item: ICurtainItem, container: HTMLDivElement, offset: IDragOffset): void {
        const position = item.position;
        const isFirstDrag = !item.dragStartHeight;

        if (isFirstDrag) {
            item.dragStartHeight = position.height;
        }

        const {minHeight, maxHeight: optsMaxHeight, position: positionOption} = item.popupOptions;
        const heightOffset = positionOption === 'top' ? offset.y : -offset.y;
        const workspaceHeight = document.body.clientHeight;
        const maxHeight = optsMaxHeight > workspaceHeight ? workspaceHeight : optsMaxHeight;
        const newHeight = item.dragStartHeight + heightOffset;
        if (newHeight < minHeight) {
            position.height = minHeight;

            if (isFirstDrag) {
                // При свайпе вниз на минимальной высоте закрываем попап
                PopupController.remove(item.id);
            }
        } else if (newHeight > maxHeight) {
            position.height = maxHeight;
        } else {
            position.height = newHeight;
        }
    }

    popupDragEnd(item: ICurtainItem): void {
        item.dragStartHeight = null;
    }
}

export default new Controller();
