import Base from 'Controls/_popup/PopupHelper/Base';
import BaseOpener, {ILoadDependencies} from 'Controls/_popup/Opener/BaseOpener';
import {ICurtainPopupOptions} from 'Controls/_popup/interface/ICurtain';
import {IStickyPopupOptions} from 'Controls/_popup/interface/ISticky';
import {Logger} from 'UI/Utils';

const POPUP_CONTROLLER = 'Controls/popupCurtain:Controller';

class CurtainStaticMethods extends BaseOpener {
    static openPopup(config: IStickyPopupOptions, popupController: string = POPUP_CONTROLLER): Promise<string> {
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

export default class Curtain extends Base {
    _opener: typeof CurtainStaticMethods = CurtainStaticMethods;

    /**
     * Метод для открытия шторки.
     * @function Controls/_popup/PopupHelper/Curtain#open
     * @param {PopupOptions} popupOptions Конфигурация шторки.
     * @example
     * <pre class="brush: js">
     * import {CurtainOpener} from 'Controls/popup';
     *
     * this._curtain = new CurtainOpener();
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

    open(popupOptions: ICurtainPopupOptions): void {
        return super.open(popupOptions, POPUP_CONTROLLER);
    }
}

/**
 * Метод для закрытия стекового окна.
 * @name Controls/_popup/PopupHelper/Curtain#close
 * @function
 * @example
 * <pre class="brush: js">
 * import {CurtainOpener} from 'Controls/popup';
 *
 * this._curtain = new CurtainOpener();
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
 * @name Controls/_popup/PopupHelper/Curtain#destroy
 * @function
 * @example
 * <pre class="brush: js">
 * import {CurtainOpener} from 'Controls/popup';
 *
 * this._curtain = new CurtainOpener();
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
 * @name Controls/_popup/PopupHelper/Curtain#isOpened
 * @description Возвращает информацию о том, открыта ли шторка.
 * @function
 * @see open
 * @see close
 * @see destroy
 */
