import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import template = require('wml!Controls/_datePopup/fakeThemeLoader');

class Header extends Control<IControlOptions> {
    //TODO: will be fixed by https://online.sbis.ru/opendoc.html?guid=33010df1-501e-4874-a02c-a5f45394a661
    protected _template: TemplateFunction = template;
    static _theme: string[] = ['Controls/datePopup'];
}
export default Header;
