import {Control, TemplateFunction} from 'UI/Base';
import {ReactiveObject} from 'Types/entity';
import {constants} from 'Env/Env';
import template = require('wml!Controls-demo/ReactiveObject/Demo');

const images = {
    main: constants.resourceRoot + 'Controls-demo/resources/images/board.png',
    alternate: constants.resourceRoot + 'Controls-demo/resources/images/comics.png'
};

interface IViewModel {
    title: string;
    url: string;
    visible: boolean;
}

function getDefaultViewModel(): IViewModel {
    return new ReactiveObject({
        title: 'Double dribble',
        url: images.main,
        visible: true
    });
}

class Demo extends Control {
    private _template: TemplateFunction = template;
    private _data: IViewModel = getDefaultViewModel();

    private _toggleVisibilityHandler() {
        this._data.visible = !this._data.visible;
    }

    private _toggleImageHandler() {
        this._data.url = this._data.url === images.main ? images.alternate : images.main;
    }
}

export = Demo;
