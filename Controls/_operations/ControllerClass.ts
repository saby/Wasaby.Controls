import {RegisterClass} from 'Controls/event';

type Key = string|number|null;

export default class OperationsController {
    private _listMarkedKey: Key = null;
    private _savedListMarkedKey: Key = null;
    private _isOperationsPanelVisible: boolean = false;
    private _selectedTypeRegister: RegisterClass = null;

    constructor(options) {
        this._options = options;
    }

    destroy(): void {
        if (this._selectedTypeRegister) {
            this._selectedTypeRegister.destroy();
            this._selectedTypeRegister = null;
        }
    }

    update(options): void {
        this._options = options;
    }

    setListMarkedKey(key: Key): Key {
        return this._setListMarkedKey(key);
    }

    setOperationsPanelVisible(visible: boolean): Key {
        this._isOperationsPanelVisible = visible;
        return this._setListMarkedKey(this._listMarkedKey);
    }

    registerHandler(event, registerType, component, callback, config): void {
        this._getRegister().register(event, registerType, component, callback, config);
    }

    unregisterHandler(event, registerType, component, config): void {
        this._getRegister().unregister(event, component, config);
    }

    selectionTypeChanged(type: string): void {
        if (type === 'all' || type === 'selected') {
            this._options.selectionViewModeChangedCallback(type);
        } else {
            this._getRegister().start(type);
        }
    }

    itemOpenHandler(newCurrentRoot: Key, items, dataRoot: Key = null): void {
        const root = 'root' in this._options ? this._options.root : null;

        if (newCurrentRoot !== root && this._options.selectionViewMode === 'selected') {
            this._options.selectionViewModeChangedCallback('all');
        }

        if (this._options.itemOpenHandler instanceof Function) {
            return this._options.itemOpenHandler(newCurrentRoot, items, dataRoot);
        }
    }

    private _getRegister(): RegisterClass {
        if (!this._selectedTypeRegister) {
            this._selectedTypeRegister = new RegisterClass({register: 'selectedTypeChanged'});
        }
        return this._selectedTypeRegister;
    }

    private _setListMarkedKey(key: Key): Key {
        if (this._isOperationsPanelVisible) {
            this._listMarkedKey = key;
            this._savedListMarkedKey = null;
        } else {
            this._savedListMarkedKey = key;
        }

        return this._listMarkedKey;
    }
}
