import {constants} from 'Env/Env';
const baseURL = constants.resourceRoot + 'Controls-demo/Tile/ImageFit/resources/images/';
export const items = [{
    id: 1,
    parent: null,
    type: null,
    title: 'Речка',
    image: `${baseURL}river.jpg`,
    imageWidth: 1920,
    imageHeight: 1200,
    width: 200,
    isDocument: true,
    hiddenGroup: true,
    isShadow: true
}, {
    id: 2,
    parent: null,
    type: null,
    width: 200,
    title: 'Сравнение систем по учету рабочего времени.xlsx',
    image: `${baseURL}vodka.png`,
    isDocument: true,
    hiddenGroup: true,
    imageWidth: 1600,
    imageHeight: 3075,
    isShadow: false
}, {
    id: 3,
    parent: null,
    type: null,
    title: 'Конфеты копия',
    image: `${baseURL}mountains.jpg`,
    imageWidth: 2508,
    imageHeight: 542,
    isDocument: true,
    width: 200,
    isShadow: true
}];
