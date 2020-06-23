import Base from 'Controls/_popup/PopupHelper/Base';
import StackOpener from 'Controls/_popup/Opener/Stack';
import {IStackPopupOptions} from 'Controls/_popup/interface/IStack';

export default class Stack extends Base {
    _opener = StackOpener;
    openPopup(popupOptions: IStackPopupOptions): void {
        return super.openPopup(popupOptions);
    }
}
