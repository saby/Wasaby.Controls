import {IDropdownControllerOptions} from 'Controls/_dropdown/interface/IDropdownController';
import {TemplateFunction} from "UI/Base";

function getDropdownControllerOptions(options: IDropdownControllerOptions): IDropdownControllerOptions {
    const dropdownOptions: IDropdownControllerOptions = {
        source: options.source,
        filter: options.filter,
        selectedKeys: options.selectedKeys,
        navigation: options.navigation,
        keyProperty: options.keyProperty,
        notifyEvent: options.notifyEvent,
        lazyItemsLoading: options.lazyItemsLoading,
        emptyText: options.emptyText,
        selectedItemsChangedCallback: options.selectedItemsChangedCallback,
        dataLoadErrback: options.dataLoadErrback,
        historyId: options.historyId,
        historyNew: options.historyNew,
        allowPin: options.allowPin,
        width: options.width,
        popupClassName: options.popupClassName,
        marker: options.marker,
        typeShadow: options.typeShadow,
        headerContentTemplate: options.headerContentTemplate,
        footerContentTemplate: options.footerContentTemplate,
        footerTemplate: options.footerTemplate,
        closeButtonVisibility: options.closeButtonVisibility,
        openerControl: options.openerControl,
        readOnly: options.readOnly,
        theme: options.theme,
        headTemplate: options.headTemplate,
        headerTemplate: options.headerTemplate,
        targetPoint: options.targetPoint,
        menuPopupOptions: options.menuPopupOptions
    };
    return dropdownOptions;
}

export {
    getDropdownControllerOptions
};
