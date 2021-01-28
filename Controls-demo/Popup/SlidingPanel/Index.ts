import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Popup/SlidingPanel/Index/Index');
import {SlidingPanelOpener} from 'Controls/popup';

class Index extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    private _dialogOpener: SlidingPanelOpener;

    protected _afterMount(options?: IControlOptions, contexts?: any): void {
        this._dialogOpener = new SlidingPanelOpener();
    }
    protected _openCurtainHandler(event: Event, isInsideRestrictive: boolean): void {
        this._dialogOpener.open({
            template: 'Controls-demo/Popup/SlidingPanel/PopupTemplate',
            position: 'bottom',
            minHeight: 300,
            maxHeight: 700
        });
    }
    static _theme: string[] = ['Controls/Classes'];
    static _styles: string[] = ['Controls-demo/Controls-demo'];
}
export default Index;
