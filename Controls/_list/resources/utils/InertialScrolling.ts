const INERTIA_SCROLLING_DURATION = 100;

class InertialScrolling {
    protected _isScrolling: boolean = false;
    protected _scrollingTimer: number = null;
    protected _scrollStopWaitingCallbacks: Function[] = null;

    constructor() {
        this._scrollStopWaitingCallbacks = [];
    }

    scrollStarted(): void {
        this._isScrolling = true;

        if (this._scrollingTimer) {
            clearTimeout(this._scrollingTimer);
        }
        this._scrollingTimer = setTimeout(() => {
            this._scrollingTimer = null;
            this._isScrolling = false;

            if (this._scrollStopWaitingCallbacks) {
                this._scrollStopWaitingCallbacks.forEach((func) => {
                    func();
                });
                this._scrollStopWaitingCallbacks = [];
            }
        }, INERTIA_SCROLLING_DURATION);
    }

    callAfterScrollStopped(callback: Function): void {
        if (this._isScrolling) {
            this._scrollStopWaitingCallbacks.push(callback);
        } else {
            callback();
        }
    }
}

export default InertialScrolling;
