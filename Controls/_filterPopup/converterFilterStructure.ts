import chain = require('Types/chain');
import collection = require('Types/collection');
import Utils = require('Types/util');

/* мапинг новой структуры в старую*/
var recordToSructureElemMap = {
    id: 'internalValueField',
    caption: 'internalCaptionField',
    value: 'value',
    resetValue: 'resetValue',
    textValue: 'caption',
    visibility: 'visibilityValue'
};

/* Мапинг старой стрктуры в новую */
var structureMap = {};
for (var i in recordToSructureElemMap) {
    if (recordToSructureElemMap.hasOwnProperty(i)) {
        structureMap[recordToSructureElemMap[i]] = i;
    }
}

function convertToFilterStructure(items) {
    return chain.factory(items).map(function (item) {
        var itemStructureItem = {};
        for (var i in structureMap) {
            if (Utils.object.getPropertyValue(item, structureMap[i]) !== undefined && structureMap.hasOwnProperty(i)) {
                itemStructureItem[i] = Utils.object.getPropertyValue(item, structureMap[i]);
            }
        }
        return itemStructureItem;
    }).value();
}

function convertToSourceDataArray(filterStructure, visibilitiesObject?) {
    var dataArray = [];
    chain.factory(filterStructure).each(function (item) {
        var rsItem = {};
        for (var i in recordToSructureElemMap) {
            if (Utils.object.getPropertyValue(item, recordToSructureElemMap[i]) !== undefined && recordToSructureElemMap.hasOwnProperty(i)) {
                if (i === 'visibility' && visibilitiesObject && !visibilitiesObject.hasOwnProperty(item.internalValueField)) {
                    continue;
                }
                rsItem[i] = Utils.object.getPropertyValue(item, recordToSructureElemMap[i]);
            }
        }
        dataArray.push(rsItem);
    });
    return dataArray;
}

function convertToSourceData(filterStructure) {
    let dataArray = convertToSourceDataArray(filterStructure);

    return new collection.RecordSet({
        rawData: dataArray
    });
}

export = {
    convertToFilterStructure: convertToFilterStructure,
    convertToSourceData: convertToSourceData,
    convertToSourceDataArray: convertToSourceDataArray
};