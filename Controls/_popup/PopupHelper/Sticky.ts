import Base from 'Controls/_popup/PopupHelper/Base';
import StickyOpener from 'Controls/_popup/Opener/Sticky';
import {IStickyPopupOptions} from 'Controls/_popup/interface/ISticky';

export default class Sticky extends Base {
    _opener = StickyOpener;
    openPopup(popupOptions: IStickyPopupOptions): void {
        return super.openPopup(popupOptions);
    }
}
