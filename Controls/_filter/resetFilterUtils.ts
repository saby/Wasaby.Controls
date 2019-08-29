import {factory} from 'Types/chain';
import {object as objectUtils} from 'Types/util';

const getPropValue = objectUtils.getPropertyValue;
const setPropValue = objectUtils.setPropertyValue;

export function resetFilter(items) {
   factory(items).each((item) => {
      const resetValue = getPropValue(item, 'resetValue');
      const textValue = getPropValue(item, 'textValue');

      if (getPropValue(item, 'visibility') !== undefined) {
         setPropValue(item, 'visibility', false);
      }
      if (resetValue !== undefined) {
         setPropValue(item, 'value', resetValue);
      }
      if (textValue !== undefined) {
         setPropValue(item, 'textValue', textValue === null ? textValue : '');
      }
   });
}
