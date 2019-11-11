import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import template = require('wml!Controls/_popupTemplate/Stack/resources/Header');

class Header extends Control<IControlOptions> {
    //TODO: will be fixed by https://online.sbis.ru/opendoc.html?guid=33010df1-501e-4874-a02c-a5f45394a661
    protected _template: TemplateFunction = template;
    protected _beforeMount(opts): void {
        console.log(opts)
    }
    /**
     * Закрыть всплывающее окно
     * @function Controls/_popupTemplate/Stack#close
     */
    close() {
        this._notify('close', [], {bubbling: true});
    }
    static _theme: string[] = ['Controls/popupTemplate'];
}
export default Header;