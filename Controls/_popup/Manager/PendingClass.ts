interface IPendingOptions {
    notifyHandler: TNotifier;
}

export interface IPendingConfig {
    root?: string;
    showLoadingIndicator?: boolean;
    onPendingFail?: Function;
    validate?: Function;
    validateCompatible?: Function;
}

type TNotifier = (eventType: string, args: []) => void;

class PendingClass {
    private _pendingsCounter: number = 0;
    private _pendings: object = {};
    private _parallelPromises: object = {};

    private readonly _notify: TNotifier;

    constructor(options: IPendingOptions) {
        this._notify = options.notifyHandler;
    }

    registerPending(promise: Promise<unknown>, config: IPendingConfig = {}): void {
        const root = config.root || null;
        if (!this._pendings[root]) {
            this._pendings[root] = {};
        }
        this._pendings[root][this._pendingsCounter] = {

            // its Promise what signalling about pending finish
            promise,

            validate: config.validate,

            validateCompatible: config.validateCompatible,

            // its function what helps pending to finish when query goes from finishPendingOperations
            onPendingFail: config.onPendingFail,

            // show indicator when pending is registered
            showLoadingIndicator: config.showLoadingIndicator
        };
        if (config.showLoadingIndicator && !promise.isReady()) {
            // show indicator if Promise still not finished on moment of registration
            const indicatorConfig = {id: this._pendings[root][this._pendingsCounter].loadingIndicatorId};
            this._pendings[root][this._pendingsCounter].loadingIndicatorId = this._notify('showIndicator', [indicatorConfig]);
        }

        promise.finally(function(pendingsCounter: number, res) {
            this.unregisterPending(root, pendingsCounter);
            return res;
        }.bind(this, this._pendingsCounter));

        this._pendingsCounter++;
    }

    hideIndicators(root: string): void {
        const pending = this._pendings[root];
        Object.keys(pending).forEach((key) => {
            const indicatorId = pending[key].loadingIndicatorId;
            if (indicatorId) {
                this._notify('hideIndicator', [indicatorId]);
            }
        });
    }

    unregisterPending(root: string, id: number): void {
        // hide indicator if no more pendings with indicator showing
        this.hideIndicators(root);
        delete this._pendings[root][id];

        // notify if no more pendings
        if (!this.hasRegisteredPendings(root)) {
            this._notify('pendingsFinished', []);
        }
    }

    finishPendingOperations(forceFinishValue: boolean, isInside?: boolean, root: string = null): Promise<unknown> {
        let pendingResolver, pendingReject;
        const resultPromise = new Promise((resolve, reject) => {
            pendingResolver = resolve;
            pendingReject = reject;
        });
        const parallelPromises = [];
        const pendingResults = [];

        const pendingRoot = this._pendings[root] || {};
        Object.keys(pendingRoot).forEach((key) => {
            const pending = pendingRoot[key];
            let isValid = true;
            if (pending.validate) {
                isValid = pending.validate(isInside);
            } else if (pending.validateCompatible) { //todo compatible
                isValid = pending.validateCompatible();
            }
            if (isValid) {
                if (pending.onPendingFail) {
                    pending.onPendingFail(forceFinishValue, pending.promise);
                }

                // pending is waiting its promise finish
                parallelPromises.push(pending.promise);
            }
        });

        // cancel previous query of pending finish. create new query.
        this.cancelFinishingPending(root);
        this._parallelPromises[root] = Promise.all(parallelPromises);

        this._parallelPromises[root].then((results) => {
            if (typeof results === 'object') {
                for (const resultIndex in results) {
                    if (results.hasOwnProperty(resultIndex)) {
                        const result = results[resultIndex];
                        pendingResults.push(result);
                    }
                }
            }
            this._parallelPromises[root] = null;

            pendingResolver(pendingResults);
        }).catch((e) => {
            pendingReject(e);
            return e;
        });

        return resultPromise;
    }

    cancelFinishingPending(root: string = null): void {
        if (this._parallelPromises && this._parallelPromises[root]) {
            // its need to cancel result Promise of parallel promise. reset state of Promise to achieve it.
            this._parallelPromises[root]._fired = -1;
            this._parallelPromises[root].cancel();
        }
    }

    hasPendings(): boolean {
        let hasPending = false;
        Object.keys(this._pendings).forEach((root) => {
            if (this.hasRegisteredPendings(root)) {
                hasPending = true;
            }
        });
        return hasPending;
    }

    hasRegisteredPendings(root: string = null): boolean {
        let hasPending = false;
        const pendingRoot = this._pendings[root] || {};
        Object.keys(pendingRoot).forEach((key) => {
            const pending = pendingRoot[key];
            let isValid = true;
            if (pending.validate) {
                isValid = pending.validate();
            } else if (pending.validateCompatible) {
                // ignore compatible pendings
                isValid = false;
            }

            // We have at least 1 active pending
            if (isValid) {
                hasPending = true;
            }
        });
        return hasPending;
    }

    destroy(): void {
        this._pendings = null;
        this._parallelPromises = null;
    }
}

export default PendingClass;
