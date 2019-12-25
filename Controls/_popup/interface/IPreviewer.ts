import { IOpener, IBasePopupOptions } from 'Controls/_popup/interface/IBaseOpener';

/**
 * Интерфейс для опций окна предпросмотра.
 *
 * @interface Controls/_popup/interface/IPreviewer
 * @private
 * @author Красильников А.С.
 */

export interface IPreviewerPopupOptions extends IBasePopupOptions {
    id?: string;
    closingTimerId?: number;
    openingTimerId?: number;
    isCancelOpening?: boolean;
}

export interface IPreviewerOpener extends IOpener {
    readonly '[Controls/_popup/interface/IPreviewerOpener]': boolean;
}
