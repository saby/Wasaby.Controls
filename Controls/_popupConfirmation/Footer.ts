import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import template = require('wml!Controls/_popupConfirmation/footer');
import * as tmplNotify from 'Controls/Utils/tmplNotify';
import {IConfirmationFooterOptions, IConfirmationFooter} from 'Controls/popupConfirmation';

export interface IFooterOptions extends IControlOptions, IConfirmationFooterOptions {
}
class Footer extends Control<IFooterOptions> implements IConfirmationFooter {
    protected _template: TemplateFunction = template;
    protected _tmplNotify: Function = tmplNotify;
}
//TODO https://online.sbis.ru/doc/15f3d383-8953-4f38-a0f2-f5f8942cf148
export default Footer;