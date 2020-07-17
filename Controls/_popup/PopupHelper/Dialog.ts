import Base from 'Controls/_popup/PopupHelper/Base';
import DialogOpener from 'Controls/_popup/Opener/Dialog';
import {IDialogPopupOptions} from 'Controls/_popup/interface/IDialog';

/**
 * Хелпер для открытия диалоговых окон
 * @class Controls/_popup/PopupHelper/Dialog
 * @control
 * @author Красильников А.С.
 * @category Popup
 * @public
 */

export default class Dialog extends Base {
    _opener = DialogOpener;

    /**
     * Метод для открытия диалоговых окон.
     * @name Controls/_popup/PopupHelper/Dialog#open
     * @function
     * @param {PopupOptions} config Конфигурация диалогового окна
     * @example
     * <pre class="brush: js">
     *    import {DialogOpener} from 'Controls/popup';
     *    ...
     *    this._dialog = new DialogOpener();
     *    openDialog() {
     *        this._dialog.open({
     *          template: 'Example/MyDialogTemplate',
     *          opener: this._children.myButton
     *        });
     *    }
     * </pre>
     * @see close
     */

    /**
     * Метод для закрытия диалогового окна.
     * @name Controls/_popup/PopupHelper/Dialog#close
     * @function
     * @example
     * <pre class="brush: js">
     *    import {DialogOpener} from 'Controls/popup';
     *    ...
     *    this._dialog = new DialogOpener();
     *
     *    closeDialog() {
     *        this._dialog.close();
     *    }
     * </pre>
     * @see open
     */

    open(popupOptions: IDialogPopupOptions): void {
        return super.open(popupOptions);
    }
}
