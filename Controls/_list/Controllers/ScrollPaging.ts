/**
 * Created by kraynovdo on 13.11.2017.
 */
/**
 *
 * @author Авраменко А.С.
 * @private
 */

type IScrollpagingState = 'top' | 'bottom' | 'middle';
type TPagingMode = 'basic' | 'compact' | 'numbers';
interface IScrollParams {
    clientHeight: number;
    scrollTop: number;
    scrollHeight: number;
}

type TArrowStateVisibility = 'visible' | 'hidden' | 'readonly';

interface IArrowState {
    begin: TArrowStateVisibility;
    prev: TArrowStateVisibility;
    next: TArrowStateVisibility;
    end: TArrowStateVisibility;
}

interface IPagingCfg {
    arrowState: IArrowState;
    showDigits?: boolean;
    showEndButton?: boolean;
}
interface IScrollPagingOptions {
    pagingMode: TPagingMode,
    scrollParams: IScrollParams,
    pagingCfgTrigger(IPagingCfg):void;
}

export default class ScrollPagingController {
    protected _curState: IScrollpagingState = null;
    protected _options: IScrollPagingOptions = null;

    constructor(cfg: IScrollPagingOptions) {
        this._options = cfg;
        this.updateStateByScrollParams(cfg.scrollParams);
    };

    protected updateStateByScrollParams(scrollParams): void {
        const canScrollForward = scrollParams.clientHeight + scrollParams.scrollTop < scrollParams.scrollHeight;
        const canScrollBackward = scrollParams.scrollTop > 0;
        if (canScrollForward && canScrollBackward) {
            this.handleScrollMiddle();
        } else if (canScrollForward && !canScrollBackward) {
            this.handleScrollTop();
        } else if (!canScrollForward && canScrollBackward) {
            this.handleScrollBottom();
        }
    };

    protected getPagingCfg(arrowState: IArrowState): IPagingCfg {
        const pagingCfg: IPagingCfg = {};
        switch (this._options.pagingMode) {
            case 'basic':
                break;
            case 'compact':
                arrowState.prev = 'hidden';
                arrowState.next = 'hidden';
                if (arrowState.end === 'visible') {
                    arrowState.begin = 'hidden';
                    arrowState.end = 'visible';
                    pagingCfg.showEndButton = true;
                } else if (arrowState.begin === 'visible') {
                    arrowState.begin = 'visible';
                    arrowState.end = 'hidden';
                }
                break;
            case 'numbers':
                pagingCfg.showDigits = true;
                break;
        }
        pagingCfg.arrowState = arrowState;
        return pagingCfg;
    };

    protected handleScrollMiddle() {
        if (!(this._curState === 'middle')) {
            this._options.pagingCfgTrigger(this.getPagingCfg({
                begin: 'visible',
                prev: 'visible',
                next: 'visible',
                end: 'visible'
            }));
            this._curState = 'middle';
        }
    };

    protected handleScrollTop() {
        if (!(this._curState === 'top')) {
            this._options.pagingCfgTrigger(this.getPagingCfg({
                begin: 'readonly',
                prev: 'readonly',
                next: 'visible',
                end: 'visible'
            }));
             this._curState = 'top';
        }
    };

    protected handleScrollBottom() {
        if (!(this._curState === 'bottom')) {
            this._options.pagingCfgTrigger(this.getPagingCfg({
                begin: 'visible',
                prev: 'visible',
                next: 'readonly',
                end: 'readonly'
            }));
            this._curState = 'bottom';
        }
    };

    public updateScrollParams(scrollParams): void {
        this._options.scrollParams = scrollParams;
        this.updateStateByScrollParams(scrollParams);
    };

    protected destroy(): void {
        this._options = null;
    };

}


