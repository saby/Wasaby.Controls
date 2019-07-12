import {factory} from 'Types/chain';

var differentFields = ['name', 'id', 'visibility'];

function convertToFilterSource(detailPanelItems) {
    var filterSource = [];
    factory(detailPanelItems).each(function(item) {
        var filterSourceItem = {};
        for (var property in item) {
            if (item.hasOwnProperty(property)) {
                if (differentFields.indexOf(property) === -1) {
                    filterSourceItem[property] = item[property];
                }
            }
        }
        filterSourceItem.name = item.id ? item.id : item.name; // items from history have a field 'name' instead of 'id'
        if (item.visibility !== undefined) {
            filterSourceItem.visibility = item.visibility;
        }
        filterSource.push(filterSourceItem);
    });
    return filterSource;
}

function convertToDetailPanelItems(filterSource) {
    var detailPanelItems = [];
    factory(filterSource).each(function(item) {
        var detailPanelItem = {};
        for (var property in item) {
            if (item.hasOwnProperty(property)) {
                if (differentFields.indexOf(property) === -1) {
                    detailPanelItem[property] = item[property];
                }
            }
        }
        detailPanelItem.id = item.name;
        detailPanelItem.visibility = item.viewMode === 'extended' ? item.visibility : undefined;
        detailPanelItems.push(detailPanelItem);
    });
    return detailPanelItems;
}

export = {
    convertToFilterSource: convertToFilterSource,
    convertToDetailPanelItems: convertToDetailPanelItems
};