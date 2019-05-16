import {factory} from 'Types/chain';
import collection = require('Types/collection');
import Utils = require('Types/util');

var differentFields = ['name', 'id', 'viewMode', 'visibility'];

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
        filterSourceItem.name = item.id;
        if (item.visibility !== undefined) {
            filterSourceItem.viewMode = 'extended';
            filterSourceItem.visibility = item.visibility;
        } else if (item.editorOptions) {  // по наличию editorOptions определяем быстрый фильтр
            filterSourceItem.viewMode = 'frequent';
        } else {
            filterSourceItem.viewMode = 'basic';
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