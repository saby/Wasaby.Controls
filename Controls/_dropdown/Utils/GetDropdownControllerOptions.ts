import {IDropdownControllerOptions} from 'Controls/_dropdown/interface/IDropdownController';

export default function getDropdownControllerOptions(options: IDropdownControllerOptions): IDropdownControllerOptions {
    const dropdownOptions: IDropdownControllerOptions = {
        source: options.source,
        filter: options.filter,
        selectedKeys: options.selectedKeys,
        navigation: options.navigation,
        keyProperty: options.keyProperty,
        notifyEvent: options.notifyEvent,
        lazyItemsLoading: options.lazyItemsLoading,
        emptyText: options.emptyText,
        itemActions: options.itemActions,
        itemActionVisibilityCallback: options.itemActionVisibilityCallback,
        selectedItemsChangedCallback: options.selectedItemsChangedCallback,
        dataLoadErrback: options.dataLoadErrback,
        historyId: options.historyId,
        historyNew: options.historyNew,
        allowPin: options.allowPin,
        width: options.width,
        popupClassName: options.popupClassName,
        dropdownClassName: options.dropdownClassName,
        markerVisibility: options.markerVisibility,
        displayProperty: options.displayProperty,
        multiSelect: options.multiSelect,
        typeShadow: options.typeShadow,
        selectorTemplate: options.selectorTemplate,
        headerContentTemplate: options.headerContentTemplate,
        footerContentTemplate: options.footerContentTemplate || options.footerTemplate,
        itemTemplateProperty: options.itemTemplateProperty,
        itemTemplate: options.itemTemplate,
        nodeFooterTemplate: options.nodeFooterTemplate,
        closeButtonVisibility: options.closeButtonVisibility,
        openerControl: options.openerControl,
        readOnly: options.readOnly,
        theme: options.theme,
        headTemplate: options.headTemplate,
        headerTemplate: options.headerTemplate,
        targetPoint: options.targetPoint,
        menuPopupOptions: options.menuPopupOptions,
        additionalProperty: options.additionalProperty,
        groupingKeyCallback: options.groupingKeyCallback,
        parentProperty: options.parentProperty,
        nodeProperty: options.nodeProperty,
        headingCaption: options.headingCaption,
        headingIcon: options.headingIcon,
        headingIconSize: options.headingIconSize,
        iconSize: options.iconSize,
        hasIconPin: options.hasIconPin,
        showHeader: options.showHeader,
        headConfig: options.headConfig,
        groupTemplate: options.groupTemplate,
        groupProperty: options.groupProperty,
        searchParam: options.searchParam,
        minSearchLength: options.minSearchLength,
        searchDelay: options.searchDelay,
        searchValueTrim: options.searchValueTrim
    };
    return dropdownOptions;
}
