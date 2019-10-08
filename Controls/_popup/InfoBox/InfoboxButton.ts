import {Control, IControlOptions, TemplateFunction} from 'UI/Base';

import InfoboxButtonTemplate = require('wml!Controls/_popup/InfoBox/resources/InfoboxButton');


export interface IInfoboxButton extends IControlOptions  {
    size: string;
}

class InfoboxButton extends Control<IInfoboxButton>{

    protected _template: TemplateFunction=InfoboxButtonTemplate;

    static getDefaultOptions(): IInfoboxButton {
        return {
            size: 'm'
        };
    }

}


export default InfoboxButton;

