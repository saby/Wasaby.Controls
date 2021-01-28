import Base from 'Controls/_popup/PopupHelper/Base';
import BaseOpener, {ILoadDependencies} from 'Controls/_popup/Opener/BaseOpener';
import {ISlidingPanelPopupOptions} from 'Controls/_popup/interface/ISlidingPanel';
const POPUP_CONTROLLER = 'Controls/popupSliding:Controller';

class SlidingPanelOpener extends BaseOpener {
    static openPopup(config: ISlidingPanelPopupOptions, popupController: string = POPUP_CONTROLLER): Promise<string> {
        return new Promise((resolve) => {
            BaseOpener.requireModules(config, popupController).then((result: ILoadDependencies) => {
                BaseOpener.showDialog(result.template, config, result.controller).then((popupId: string) => {
                    resolve(popupId);
                });
            });
        });
    }

    static closePopup(popupId: string): void {
        BaseOpener.closeDialog(popupId);
    }
}

/**
 * Хелпер для открытия Шторки.
 * @class Controls/_popup/PopupHelper/Stack
 *
 * @author Красильников А.С.
 * @public
 */

export default class SlidingPanel extends Base {
    private _opener = SlidingPanelOpener;

    /**
     * Метод для открытия шторки.
     * @function Controls/_popup/PopupHelper/SlidingPanel#open
     * @param {PopupOptions} popupOptions Конфигурация шторки.
     * @example
     * <pre class="brush: js">
     * import {SlidingPanelOpener} from 'Controls/popup';
     *
     * this._curtain = new SlidingPanelOpener();
     *
     * openStack() {
     *     this._curtain.open({
     *         template: 'Example/MyStackTemplate',
     *         opener: this._children.myButton
     *     });
     * }
     * </pre>
     * @see close
     * @see destroy
     * @see isOpened
     */

    open(popupOptions: ISlidingPanelPopupOptions): void {
        return super.open(popupOptions, POPUP_CONTROLLER);
    }
}

/**
 * Метод для закрытия стекового окна.
 * @name Controls/_popup/PopupHelper/SlidingPanel#close
 * @function
 * @example
 * <pre class="brush: js">
 * import {SlidingPanelOpener} from 'Controls/popup';
 *
 * this._curtain = new SlidingPanelOpener();
 *
 * closeStack() {
 *     this._curtain.close();
 * }
 * </pre>
 * @see open
 * @see destroy
 * @see isOpened
 */

/**
 * Разрушает экземпляр класса
 * @name Controls/_popup/PopupHelper/SlidingPanel#destroy
 * @function
 * @example
 * <pre class="brush: js">
 * import {SlidingPanelOpener} from 'Controls/popup';
 *
 * this._curtain = new SlidingPanelOpener();
 *
 * _beforeUnmount() {
 *     this._curtain.destroy();
 *     this._curtain = null;
 * }
 * </pre>
 * @see open
 * @see close
 * @see isOpened
 */

/**
 * @name Controls/_popup/PopupHelper/SlidingPanel#isOpened
 * @description Возвращает информацию о том, открыта ли шторка.
 * @function
 * @see open
 * @see close
 * @see destroy
 */
