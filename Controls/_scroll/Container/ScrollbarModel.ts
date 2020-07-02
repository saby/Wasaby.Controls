import {detection} from 'Env/Env';
import {mixin} from 'Types/util';
import {IVersionable, VersionableMixin} from 'Types/entity';
import {canScrollByState, getContentSizeByState, getScrollPositionByState, SCROLL_DIRECTION} from '../Utils/Scroll';
import ScrollWidthUtil = require('Controls/_scroll/Scroll/ScrollWidthUtil');
import {IScrollState} from '../Utils/ScrollState';
import {IScrollbarsOptions} from './Interface/IScrollbars';

export default class ScrollbarModel extends mixin<VersionableMixin>(VersionableMixin) implements IVersionable {
    readonly '[Types/_entity/VersionableMixin]': true;

    private readonly _useNativeScrollbar: boolean;
    private readonly _styleHideScrollbar: string;
    private readonly _direction: SCROLL_DIRECTION;
    private _options: IScrollbarsOptions;
    private _canScroll: boolean = false;
    private _position: number = 0;
    private _contentSize: number;

    constructor(direction: SCROLL_DIRECTION, options: IScrollbarsOptions) {
        super(options);

        this._options = options;
        // На мобильных устройствах используется нативный скролл, на других платформенный.
        this._useNativeScrollbar = detection.isMobileIOS || detection.isMobileAndroid;
        this._styleHideScrollbar = ScrollWidthUtil.calcStyleHideScrollbar(direction);
        this._direction = direction;
    }

    get isVisible(): boolean {
        return Boolean(!this._useNativeScrollbar && this._options.scrollbarVisible && this._canScroll)
    }

    get position(): number {
        return this._position;
    }

    get contentSize(): number {
        return this._contentSize;
    }

    updateScrollState(scrollState: IScrollState): boolean {
        let changed = false;
        const canScroll = canScrollByState(scrollState, this._direction);
        const position = getScrollPositionByState(scrollState, this._direction);
        const contentSize = getContentSizeByState(scrollState, this._direction);
        if (canScroll !== this._canScroll || position !== this._position || contentSize !== this._contentSize) {
            this._canScroll = canScroll;
            this._position = position;
            this._contentSize = contentSize;
            this._nextVersion();
            changed = true;
        }
        return changed;
    }
}
