import Base from 'Controls/_popup/PopupHelper/Base';
import DialogOpener from 'Controls/_popup/Opener/Dialog';
import {IDialogPopupOptions} from 'Controls/_popup/interface/IDialog';

export default class Dialog extends Base {
    _opener = DialogOpener;
    openPopup(popupOptions: IDialogPopupOptions): void {
        return super.openPopup(popupOptions);
    }
}
