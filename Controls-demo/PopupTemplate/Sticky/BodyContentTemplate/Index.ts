import {Control, TemplateFunction} from 'UI/Base';
import {IPopupTemplateBaseOptions} from 'Controls/_popupTemplate/interface/IPopupTemplateBase';
import * as MemorySourceData from 'Controls-demo/Utils/MemorySourceData';
import controlTemplate = require('wml!Controls-demo/PopupTemplate/Sticky/BodyContentTemplate/Index');
import popupTemplate = require('wml!Controls-demo/PopupTemplate/Sticky/BodyContentTemplate/resources/PopupTemplate');
import popupTemplateList = require('wml!Controls-demo/PopupTemplate/Sticky/BodyContentTemplate/resources/PopupTemplateList');
import {Memory} from 'Types/source';
import 'css!Controls-demo/Controls-demo';
import 'css!Controls-demo/PopupTemplate/Sticky/Sticky';

class BodyContentTemplate extends Control<IPopupTemplateBaseOptions> {
    protected _template: TemplateFunction = controlTemplate;
    private _popupTemplate: TemplateFunction = popupTemplate;
    private _popupTemplateList: TemplateFunction = popupTemplateList;
    protected _source: Memory;
    static _theme: string[] = ['Controls/Classes'];

    protected _beforeMount(): void {
        this._source = new Memory({
            keyProperty: 'id',
            data: MemorySourceData.departments
        });
    }

    openSticky() {
        this._children.sticky.open({
            target: this._children.stickyButton,
            opener: this._children.stickyButton
        });
    }
    openScrollSticky() {
        this._children.stickyScroll.open({
            target: this._children.stickyScrollButton,
            opener: this._children.stickyScrollButton,
            templateOptions: {
                source: this._source
            }
        });
    }
}
export default BodyContentTemplate;
