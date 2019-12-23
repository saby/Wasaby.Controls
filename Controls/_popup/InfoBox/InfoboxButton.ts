import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import InfoboxButtonTemplate = require('wml!Controls/_popup/InfoBox/resources/InfoboxButton');
import {IIconSize, IIconSizeOptions} from 'Controls/interface';

export interface IInfoboxButton extends IControlOptions, IIconSizeOptions {
}

/**
 * Контрол, который представляет собой типовую кнопку для вызова подсказки.
 *
 * @class Controls/_popup/InfoBox/InfoboxButton
 * @extends Core/Control
 * @mixes Controls/_interface/IIconSize
 * @control
 * @public
 * @author Бондарь А.В.
 * @category Button
 * @demo Controls-demo/InfoBox/InfoboxButtonHelp
 */

class InfoboxButton extends Control<IInfoboxButton> implements IIconSize {
    readonly '[Controls/_interface/IIconSize]': boolean;
    protected _template: TemplateFunction = InfoboxButtonTemplate;
    static _theme: string[] = ['Controls/popup'];

    static getDefaultOptions(): IInfoboxButton {
        return {
            iconSize: 'm'
        };
    }

}

export default InfoboxButton;
