
interface IField {
    type: "string" | "number"
    randomData?: boolean
    value?: any
}
interface INumberField {
}
interface IStringField {
    wordsCount: number
}

interface IItemPrototype {
    [key: string]: string | number | (IField & (INumberField|IStringField))
}

function getListData(itemsCount: number, itemProto: IItemPrototype = null, idProperty: string = "id") {

    let data = [];

    for (let i = 0; i < itemsCount; i++) {
        data.push(itemProto === null ? {[idProperty]: i} : _createItemByProto(itemProto, i, idProperty));
    }

    return data;
}





function _createItemByProto(itemProto: IItemPrototype, id: number, idProperty: string = "id") {

    let
        outItem = {},
        isNeedId = itemProto && (typeof itemProto[idProperty] === "undefined");

    for (let fieldName in itemProto) {
        let item: IField = itemProto[fieldName];

        if (item.type === "string") {
            outItem[fieldName] = itemProto[fieldName].randomData?repeatText(Math.round(0.5 + Math.random() * 5)):'';
        } else if (item.type === "number") {
            outItem[fieldName] = 0;
        } else {
            outItem[fieldName] = item;
        }
    }

    if (isNeedId) {
        outItem[idProperty] = id;
    }

    return outItem;
}



function repeatText(count: number): string {

    let result = '';

    for (let i = 0; i < count; i++) {
        result += 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc posuere nulla ex, consectetur lacinia odio blandit sit amet. ';
    }
    return result.trim();
}


export {
    IField,
    IItemPrototype,
    INumberField,
    IStringField,
    getListData,
    getListData as getGridData

}