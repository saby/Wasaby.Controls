import {Data as RouterData} from 'Router/router';

interface IStore {
    getState: Record<string, any>;
    onPropertyChanged: (propertyName: string, callback: (propertyName: string, data: any) => void) => string;
    unsubscribe: (id: string) => void;
    dispatch: (propertyName: string, data: any) => void;
}

interface IStateCallback {
    id: string;
    callbackFn: Function;
}

interface IState {
    [ctxName: string]: string | {
        [propetyName: string]: {
            value: any,
            callbacks: IStateCallback[]
        }
    };

    activeContext?: string;
}

const ID_SEPARATOR = '--';

class Store implements IStore {
    private constructor() { }

    state: IState;

    getState(): IState {
        this._updateStoreContext();
        return this.state;
    }

    dispatch(propertyName: string, data: any): void {
        this._updateStoreContext();
        this._setValue(propertyName, data);
        this._notifySubscribers(propertyName);
    }

    onPropertyChanged(propertyName: string, callback: (propertyName: string, data: any) => void): string {
        this._updateStoreContext();
        return this._addCallback(propertyName, callback);
    }

    unsubscribe(id: string): void {
        this._removeCallback(id);
    }

    // обновляем контекст в зависимости от урла
    private _updateStoreContext(): void {
        // пока пишем дефолтный и работаем только с ним чтоб не усложнять
        this.state.activeContext = RouterData.getVisibleRelativeUrl();
        if (!this.state[this.state.activeContext]) {
            this.state[this.state.activeContext] = {};
        }
    }

    private _hasValue(propertyName: string): boolean {
        return this.state[this.state.activeContext].hasOwnProperty(propertyName);
    }

    private _setValue(propertyName: string, value: any): void {
        if (this._hasValue(propertyName)) {
            this.state[this.state.activeContext][propertyName].value = value;
        } else {
            this.state[this.state.activeContext][propertyName] = {
                value,
                callbacks: []
            };
        }
    }

    private _addCallback(propertyName: string, callbackFn: Function): string {
        // создадим болванку с undefined если нужно
        if (!this._hasValue(propertyName)) {
            this.state[this.state.activeContext][propertyName] = {
                value: undefined,
                callbacks: []
            };
        }
        const currentCallbacks = this.state[this.state.activeContext][propertyName].callbacks;
        const newCallbackId = currentCallbacks.length > 0 ?
            currentCallbacks[currentCallbacks.length - 1].id.split(ID_SEPARATOR)[2] :
            0;
        const id = [this.state.activeContext, propertyName, +newCallbackId + 1].join(ID_SEPARATOR);
        currentCallbacks.push({id, callbackFn});
        return id;
    }

    private _removeCallback(id: string): void {
        const [ctxName, propertyName, index]: string[] = id.split(ID_SEPARATOR);
        this.state[ctxName][propertyName].callbacks = this.state[ctxName][propertyName].callbacks.reduce(
            (acc, callbackObj) => {
                if (callbackObj.id !== index) {
                    acc.push(callbackObj);
                }
                return acc;
            },
            []
        );

    }

    private _notifySubscribers(propertyName: string): void {
        this.state[this.state.activeContext][propertyName].callbacks.forEach(
            (callbackObject: IStateCallback) => {
                return callbackObject.callbackFn(this.state[this.state.activeContext][propertyName].value);
            }
        );
    }

    private static instance: Store;

    static getInstance(): Store {
        if (!Store.instance) {
            Store.instance = new Store();
            Store.instance.state = {};
        }
        return Store.instance;
    }
}

const instance = Store.getInstance();

export default instance;
