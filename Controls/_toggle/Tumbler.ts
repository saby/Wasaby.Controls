import template = require('wml!Controls/_toggle/Tumbler/Tumbler');
import {TemplateFunction} from 'UI/Base';
import {Model} from 'Types/entity';
import ButtonGroupBase, {IButtonGroupOptions} from 'Controls/_toggle/ButtonGroupBase';

interface IBackgroundPosition {
    width: number;
    left: number;
}

/**
 * Контрол представляет собой кнопочный переключатель. Используется, когда на странице необходимо разместить
 * неакцентный выбор из одного или нескольких параметров.
 * @class Controls/_toggle/Tumbler
 * @extends Controls/_toggle/ButtonGroupBase
 * @public
 * @author Красильников А.С.
 * @demo Controls-demo/toggle/Tumbler/Index
 */

/**
 * @name Controls/_toggle/Tumbler#readOnly
 * @cfg
 * @demo Controls-demo/toggle/Tumbler/ReadOnly/Index
 */

class Tumbler extends ButtonGroupBase {
    protected _template: TemplateFunction = template;
    protected _backgroundPosition: IBackgroundPosition[] = [];

    protected _beforeUpdate(newOptions: IButtonGroupOptions): void {
        if (this._options.items !== newOptions.items) {
            this._backgroundPosition = [];
        }
    }

    protected _mouseEnterHandler(): void {
        this._setBackgroundPosition();
    }

    protected _touchStartHandler(): void {
        this._setBackgroundPosition();
    }

    private _setBackgroundPosition(): void {
        if (this._backgroundPosition.length === 0) {
            this._options.items.forEach((item: Model, key: number) => {
                this._backgroundPosition.push({
                    width: (this._children['TumblerButton' + key] as HTMLDivElement).offsetWidth,
                    left: (this._children['TumblerButton' + key] as HTMLDivElement).offsetLeft
                });
            });
        }
    }
}

export default Tumbler;
