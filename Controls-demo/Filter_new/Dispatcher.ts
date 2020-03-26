import Context = require('Core/DataContext');

export default class Dispatcher extends Context {
    private _callbacks: Record<string, Function> = {};
    private _currentId: number = 1;
    private readonly _prefix: string = '';

    constructor(options) {
        super(Context);
        this._prefix = options.prefix || '_ID';
    }

    register(callback: Function): string {
        const id = this._prefix + this._currentId;
        this._callbacks[id] = callback;
        return id;
    }

    unregister(id: string): void {
        delete this._callbacks[id];
    }

    dispatch(action): void {
        for (const i in this._callbacks) {
            if (this._callbacks.hasOwnProperty(i)) {
                this._callbacks[i](action);
            }
        }
    }
}
