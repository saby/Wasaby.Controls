import Base from 'Controls/_popup/PopupHelper/Base';
import StackOpener from 'Controls/_popup/Opener/Stack';
import {IStackPopupOptions} from 'Controls/_popup/interface/IStack';

/**
 * Хелпер для открытия стековых окон
 * @class Controls/_popup/PopupHelper/Stack
 * @control
 * @author Красильников А.С.
 * @category Popup
 * @public
 */

export default class Stack extends Base {
    _opener = StackOpener;

    /**
     * Метод для открытия стековых окон
     * @function Controls/_popup/PopupHelper/Stack#open
     * @param {PopupOptions} config Конфигурация стекового окна
     * @example
     * <pre>
     *    import {StackOpener} from 'Controls/popup';
     *    ...
     *    this._stack = new StackOpener();
     *    openStack() {
     *        this._stack.open({
     *          template: 'Example/MyStackTemplate',
     *          opener: this._children.myButton
     *        });
     *    }
     * </pre>
     * @see close
     */

    /**
     * Метод для закрытия стекового окна
     * @function Controls/_popup/PopupHelper/Stack#close
     * @example
     * <pre>
     *    import {StackOpener} from 'Controls/popup';
     *    ...
     *    this._stack = new StackOpener();
     *
     *    closeStack() {
     *        this._stack.close();
     *    }
     * </pre>
     * @see open
     */

    open(popupOptions: IStackPopupOptions): void {
        return super.open(popupOptions);
    }
}
