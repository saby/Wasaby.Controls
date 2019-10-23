import {object} from 'Types/util';

const getPropValue = object.getPropertyValue;

export default function isEqualItems(item1: object, item2: object): boolean {
    const id = getPropValue(item1, 'id');
    const name = getPropValue(item1, 'name');
    let result = false;

    if (id) {
        result = getPropValue(item1, 'id') === getPropValue(item2, 'id');
    }
    if (!result && name) {
        result = getPropValue(item1, 'name') === getPropValue(item2, 'name');
    }
    return result;
}
