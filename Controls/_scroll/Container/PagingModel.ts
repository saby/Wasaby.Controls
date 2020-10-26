import {mixin} from 'Types/util';
import {IVersionable, VersionableMixin} from 'Types/entity';
import {SCROLL_POSITION} from '../Utils/Scroll';
import {IScrollState} from '../Utils/ScrollState';


export default class PagingModel extends mixin<VersionableMixin>(VersionableMixin) implements IVersionable {
    readonly '[Types/_entity/VersionableMixin]': true;

    private _stateUp: boolean = false;
    private _stateDown: boolean = true;
    private _arrowState = {};
    private _isVisible: boolean = false;
    private _position: SCROLL_POSITION;

    update(scrollState: IScrollState): void {
         if (this._position !== scrollState.verticalPosition) {
             this._position = scrollState.verticalPosition;
            if (scrollState.verticalPosition === SCROLL_POSITION.START) {
               this._arrowState = {
                    begin: 'readonly',
                    prev: 'readonly',
                    next: 'visible'
               };
               this._stateUp = false;
               this._stateDown = true;
            } else if (scrollState.verticalPosition === SCROLL_POSITION.END) {
               this._arrowState = {
                    begin: 'visible',
                    prev: 'visible',
                    next: 'readonly'
               };
               this._stateUp = true;
               this._stateDown = false;
            } else {
               this._arrowState = {
                    begin: 'visible',
                    prev: 'visible',
                    next: 'visible'
               };
               this._stateUp = true;
               this._stateDown = true;
            }
            if (this._isVisible) {
                this._nextVersion();
            }
         }
    }

    set isVisible(value: boolean) {
        if (value !== this._isVisible) {
            this._isVisible = value;
            this._nextVersion();
        }
    }

    get isVisible(): boolean {
        return this._isVisible;
    }

    get stateUp(): boolean {
        return this._stateUp;
    }

    get stateDown(): boolean {
        return this._stateDown;
    }

    get arrowState() {
        return this._arrowState;
    }
}
