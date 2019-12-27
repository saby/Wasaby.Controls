import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/ResizingLine/ResizingLine');
import 'css!Controls-demo/Controls-demo';
import 'css!Controls-demo/ResizingLine/ResizingLine';
import {SyntheticEvent} from 'Vdom/Vdom';

class ResizingLine extends Control<IControlOptions> {
    private _widthOfRightContainer = 100;
    private _widthOfCenterContainer = 100;
    private _widthOfLeftContainer = 100;

    protected _template: TemplateFunction = controlTemplate;

    private _offsetHandler(event: SyntheticEvent<Event>, containerName: string, offset: number): void {
        switch (containerName) {
            case 'leftContainer':
                this._widthOfLeftContainer += offset;
                break;
            case 'centerContainer':
                this._widthOfCenterContainer += offset;
                break;
            case 'rightContainer':
                this._widthOfRightContainer += offset;
                break;
        }
    }

    static _theme: string[] = ['Controls/Classes'];
}

export default ResizingLine;
