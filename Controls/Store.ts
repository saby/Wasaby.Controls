import {getStore} from 'Application/Env';

const ID = 'pageState';
const STORE_KEY: string = 'value';

interface IStore {
    getState: () => Record<string, unknown>;
    get: (propertyName: string) => unknown;
    onPropertyChanged: (propertyName: string, callback: (data: unknown) => void) => string;
    unsubscribe: (id: string) => void;
    dispatch: (propertyName: string, data: unknown) => void;
}

interface IStateCallback {
    id: string;
    callbackFn: Function;
}

interface ICtxState {
    [propetyName: string]: {
        value: unknown,
        callbacks: IStateCallback[]
    };
}

interface IState {
    [ctxName: string]: string | ICtxState;
    activeContext?: string;
}

const ID_SEPARATOR = '--';

/**
 *
 */
class Store implements IStore {
    get(propertyName: string): unknown {
        const state = Store._getState();
        const activeState = state[state.activeContext];
        return activeState ? activeState[propertyName] : undefined;
    }

    /**
     * Получение текущего стейта
     */
    getState(): ICtxState {
        const state = Store._getState();
        const activeState = state[state.activeContext] || {};
        return activeState as ICtxState;
    }

    /**
     * Обновление значения в стейте
     * @param propertyName название поля в стейте
     * @param data данные
     */
    dispatch(propertyName: string, data: unknown): void {
        this._setValue(propertyName, data);
        this._notifySubscribers(propertyName);
    }

    /**
     * Подписка на изменение поля в стейте, при изменении поля вызовется колбэк с новым значением
     * @param propertyName
     * @param callback
     * @return {string} id колбэка, чтоб отписаться при уничтожении контрола
     */
    onPropertyChanged(propertyName: string, callback: (data: unknown) => void): string {
        return this._addCallback(propertyName, callback);
    }

    /**
     * Отписка колбэка по id
     * @param id
     */
    unsubscribe(id: string): void {
        this._removeCallback(id);
    }

    // обновляем название актуального контекста в зависимости от урла (сейчас это делает OnlineSbisRu/_router/Router)
    updateStoreContext(contextName: string): void {
        const state = Store._getState();
        state.activeContext = contextName;
        if (!state[state.activeContext]) {
            state[state.activeContext] = {};
        }
    }

    private _hasValue(propertyName: string): boolean {
        const state = Store._getState();
        return state[state.activeContext].hasOwnProperty(propertyName);
    }

    private _setValue(propertyName: string, value: unknown): void {
        const state = Store._getState();

        if (!this._hasValue(propertyName)) {
            this._defineProperty(propertyName);
        }
        state[state.activeContext]['_' + propertyName].value = value;
    }

    // объявление поля в стейте
    private _defineProperty(propertyName: string): void {
        const state = Store._getState();

        // приватное поле с _ в котором лежит значение и колбэки
        Object.defineProperty(state[state.activeContext], '_' + propertyName, {
            value: {value: undefined, callbacks: []},
            enumerable: false
        });
        // сеттер и геттер для публичного поля
        Object.defineProperty(state[state.activeContext], propertyName, {
            set: function () {
                // do nothing
            },
            get: function () {
                return this['_' + propertyName].value;
            },
            enumerable: true
        });
    }

    private _addCallback(propertyName: string, callbackFn: Function): string {
        const state = Store._getState();

        // создадим болванку с undefined если нужно
        if (!this._hasValue(propertyName)) {
            this._defineProperty(propertyName);
        }
        const currentCallbacks = state[state.activeContext]['_' + propertyName].callbacks;
        const newCallbackId = currentCallbacks.length > 0 ?
            currentCallbacks[currentCallbacks.length - 1].id.split(ID_SEPARATOR)[2] : 0;
        const id = [state.activeContext, '_' + propertyName, +newCallbackId + 1].join(ID_SEPARATOR);
        currentCallbacks.push({id, callbackFn});
        return id;
    }

    private _removeCallback(id: string): void {
        const state = Store._getState();

        const [ctxName, propertyName]: string[] = id.split(ID_SEPARATOR);
        state[ctxName][propertyName].callbacks = state[ctxName][propertyName].callbacks.reduce(
            (acc, callbackObj) => {
                if (callbackObj.id !== id) {
                    acc.push(callbackObj);
                }
                return acc;
            },
            []
        );

    }

    private _notifySubscribers(propertyName: string): void {
        const state = Store._getState();
        state[state.activeContext]['_' + propertyName].callbacks.forEach((
           callbackObject: IStateCallback
        ) => {
            return callbackObject.callbackFn(state[state.activeContext][propertyName]);
        });
    }

    static _getState(): IState {
        return getStore<Record<string, IState>>(ID).get(STORE_KEY) || {} as IState;
    }
}

export default new Store();
