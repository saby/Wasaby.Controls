import {Control} from 'UI/Base';
import {ReactiveObject} from 'Types/entity';
import template = require('wml!Controls-demo/ReactiveObject/Demo');

const images = {
    main: 'https://images-na.ssl-images-amazon.com/images/I/81xQBb5jRzL._SY355_.jpg',
    alternate: 'https://pbs.twimg.com/profile_images/1110319067280269312/iEqpsbUA_400x400.png'
};

interface IViewModel {
    title: string;
    url: string;
    visible: boolean;
}

function getDefaultViewModel(): IViewModel {
    return new ReactiveObject({
        title: 'Apple',
        url: images.main,
        visible: true
    });
}

class Demo extends Control {
    private _template: Function = template;
    private _data: IViewModel = getDefaultViewModel();

    private _toggleVisibilityHandler() {
        this._data.visible = !this._data.visible;
    }

    private _toggleImageHandler() {
        this._data.url = this._data.url === images.main ? images.alternate : images.main;
    }
}

export = Demo;
