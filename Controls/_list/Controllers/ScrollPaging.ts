/**
 * Created by kraynovdo on 13.11.2017.
 */
/**
 *
 * @author Авраменко А.С.
 * @private
 */

type IScrollpagingState = 'top' | 'bottom' | 'middle';

interface IScrollParams {
    clientHeight: number;
    scrollTop: number;
    scrollHeight: number;
}

interface IScrollPagingOptions {
    scrollParams: IScrollParams,
    pagingCfgTrigger({ backwardEnabled, forwardEnabled }):void;
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
    protected handleScrollMiddle() {
        if (!(this._curState === 'middle')) {
            this._options.pagingCfgTrigger({
                backwardEnabled: true,
                forwardEnabled: true
            });
            this._curState = 'middle';
        }
    };

    protected handleScrollTop() {
        if (!(this._curState === 'top')) {
            this._options.pagingCfgTrigger({
                backwardEnabled: false,
                forwardEnabled: true
            });
             this._curState = 'top';
        }
    };

    protected handleScrollBottom() {
        if (!(this._curState === 'bottom')) {
            this._options.pagingCfgTrigger({
                backwardEnabled: true,
                forwardEnabled: false
            });
            this._curState = 'bottom';
        }

    };

    public handleScroll(direction: 'up' | 'down' | 'middle') {
        switch (direction) {
            case 'up':
                this.handleScrollTop();
                break;
            case 'down':
                this.handleScrollBottom();
                break;
            case 'middle':
                this.handleScrollMiddle();
                break;
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


