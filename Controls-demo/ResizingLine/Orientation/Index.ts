import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/ResizingLine/Orientation/Template');
import {SyntheticEvent} from 'Vdom/Vdom';

export default class ResizingLine extends Control<IControlOptions> {
    private _heightOfCenterContainer: number = 50;
    private _top: number = 50;

    private _widthOfCenterContainer: number = 50;
    private _left: number = 50;

    protected _template: TemplateFunction = controlTemplate;

    protected _offsetHandler(event: SyntheticEvent<Event>, containerName: string, offset: number): void {
        let value: number;
        let offsetSize: number;
        let prevSize: number;

        switch (containerName) {
            case 'centerContainer':
                value = this._heightOfCenterContainer + offset;
                this._heightOfCenterContainer = ResizingLine._limit(value);
                break;
            case 'centerContainerTop':
                prevSize = this._heightOfCenterContainer;
                value = this._heightOfCenterContainer + offset;
                this._heightOfCenterContainer = ResizingLine._limit(value);
                offsetSize = this._heightOfCenterContainer - prevSize;
                this._top -= offsetSize;
                break;
            case 'centerHorizontalContainer':
                value = this._widthOfCenterContainer + offset;
                this._widthOfCenterContainer = ResizingLine._limit(value);
                break;
            case 'centerHorizontalContainerLeft':
                prevSize = this._widthOfCenterContainer;
                value = this._widthOfCenterContainer + offset;
                this._widthOfCenterContainer = ResizingLine._limit(value);
                offsetSize = this._widthOfCenterContainer - prevSize;
                this._left -= offsetSize;
                break;
        }
    }

    private static MIN_SIZE: number = 50;
    private static MAX_SIZE: number = 80;

    static _theme: string[] = ['Controls/Classes'];

    private static _limit(value: number): number {
        return  Math.max(ResizingLine.MIN_SIZE, Math.min(value, ResizingLine.MAX_SIZE));
    }

    static _styles: string[] = ['Controls-demo/Controls-demo', 'Controls-demo/ResizingLine/Orientation/Style'];
}
