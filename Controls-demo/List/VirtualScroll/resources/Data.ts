const LOREM_TEXT: string = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc posuere nulla ex, consectetur lacinia odio blandit sit amet.';

type Item = {
    id: number
    title: string
}

function createItems(count, showIdMessage: boolean = true, loremText: string = LOREM_TEXT): Array<Item> {
    let data: Array<Item> = [];
    for (let i = 0; i < count; i++) {
        data.push(createItem(i, Math.round(0.5 + Math.random() * 3), showIdMessage, loremText));
    }
    return data;
}


function createItem(id: number, textLength: number, showIdMessage: boolean, loremText: string): Item {
    textLength = textLength || 1;
    let item: Item = {
        id: id+1,
        title: showIdMessage ? `Какая то запись с id=${id+1}. ` : ``,
    };
    for (let i = 0; i < textLength; i++) {
        item.title += `${loremText} `;
    }
    item.title.trim();
    return item;
}

export {
    createItems,
}