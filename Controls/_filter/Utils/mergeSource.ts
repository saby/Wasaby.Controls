import {factory} from 'Types/chain';
import {object} from 'Types/util';
import isEqualItems from 'Controls/_filter/Utils/isEqualItems';

const getPropValue = object.getPropertyValue;
const setPropValue = object.setPropertyValue;

export default function mergeSource<T, U>(target: T, source: T): T & U {
    factory(target).each((item) => {
        factory(source).each((historyItem) => {
            if (isEqualItems(item, historyItem)) {
                const value = getPropValue(historyItem, 'value');
                const textValue = getPropValue(historyItem, 'textValue');
                const visibility = getPropValue(historyItem, 'visibility');
                const viewMode = getPropValue(historyItem, 'viewMode');

                if (item.hasOwnProperty('value') && historyItem.hasOwnProperty('value')) {
                    setPropValue(item, 'value', value);
                }

                if (item.hasOwnProperty('textValue') && historyItem.hasOwnProperty('textValue')) {
                    setPropValue(item, 'textValue', textValue);
                }

                if (item.hasOwnProperty('visibility') && historyItem.hasOwnProperty('visibility')) {
                    setPropValue(item, 'visibility', visibility);
                }

                if (viewMode !== undefined && item.hasOwnProperty('viewMode')) {
                    setPropValue(item, 'viewMode', viewMode);
                }
            }
        });
    });

    return target;
}
