/**
 * HoverController
 * @author Мочалов М.А.
 * @private
 */
export default class HoverController {
    private _callback: Function;
    private _timerId: number = null;

    mouseEnter(): void {
        if (this._timerId !== null) {
            clearTimeout(this._timerId);
        }
    }

    mouseLeave(): void {
        this._timerId = setTimeout(this._callback, 1000);
    }

    setCallback(callback: Function): void {
        this._callback = callback;
    }
}
