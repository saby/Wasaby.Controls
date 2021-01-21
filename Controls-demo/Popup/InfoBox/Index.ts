import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import * as controlTemplate from 'wml!Controls-demo/Popup/InfoBox/InfoBox';
import {IStickyPosition} from 'Controls/interface';

export default class extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    static _theme: string[] = ['Controls/Classes'];
    protected _stickyPosition: IStickyPosition = {
        direction: {
            vertical: 'bottom',
            horizontal: 'right'
        },
        targetPoint: {
            vertical: 'bottom',
            horizontal: 'left'
        }
    };

    protected _openInfoBox(): void {
        this._children.sticky.open({
            target: this._children.dialogButton
        });
    }

    static _styles: string[] = ['Controls-demo/InfoBox/resources/InfoboxButtonHelp', 'Controls-demo/Controls-demo'];
}
