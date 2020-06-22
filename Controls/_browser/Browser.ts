import {Control, TemplateFunction} from 'UI/Base';
import * as template from 'wml!Controls/_browser/resources/BrowserTemplate';
import {SyntheticEvent} from 'Vdom/Vdom';
import {ControllerClass as OperationsController} from 'Controls/operations';
import {ControllerClass as SearchController} from 'Controls/search';
import tmplNotify = require('Controls/Utils/tmplNotify');
import {RecordSet} from 'Types/collection';
import {ContextOptions as DataOptions} from "../context";

type Key = string|number|null;

export default class Browser extends Control {
    protected _template: TemplateFunction = template;
    protected _notifyHandler: Function = tmplNotify;
    private _selectedKeysCount: number = null;
    private _isAllSelected: boolean = false;
    private _operationsController: OperationsController = null;
    private _searchController: SearchController = null;
    private _listMarkedKey: Key;
    private _dataOptions: object = null;
    private _previousViewMode: string = null;
    private _viewMode: string = null;
    private _searchValue: string = null;
    private _misspellValue: string = null;
    private _root: Key = null;
    private _deepReload: boolean = undefined;
    private _inputSearchValue: string = '';

    protected _beforeMount(options, context): void {
        this._itemOpenHandler = this._itemOpenHandler.bind(this);
        this._dataLoadCallback = this._dataLoadCallback.bind(this);
        this._afterSetItemsOnReloadCallback = this._afterSetItemsOnReloadCallback.bind(this);
        this._createSearchController(options, context);
        this._operationsController = this._createOperationsController(options);
        this._searchController = this._createSearchController(options, context);
    }

    protected _beforeUpdate(options, context): void {
        this._operationsController.update(options);
        this._searchController.update(this._getSearchControllerOptions(options), context);
    }

    protected _beforeUnmount(): void {
        if (this._operationsController) {
            this._operationsController.destroy();
            this._operationsController = null;
        }

        if (this._searchController) {
            this._searchController.destroy();
            this._searchController = null;
        }
    }

    protected _registerHandler(event, registerType, component, callback, config): void {
        this._getOperationsController().registerHandler(event, registerType, component, callback, config);
    }

    protected _unregisterHandler(event, registerType, component, config): void {
        this._getOperationsController().unregisterHandler(event, component, config);
    }

    protected _selectedTypeChangedHandler(event: SyntheticEvent<null>, typeName: string, limit?: number): void {
        this._getOperationsController().selectionTypeChanged(typeName, limit);
    }

    protected _selectedKeysCountChanged(e, count: number|null, isAllSelected: boolean): void {
        e.stopPropagation();
        this._selectedKeysCount = count;
        this._isAllSelected = isAllSelected;
    }

    protected _itemOpenHandler(newCurrentRoot: Key, items: RecordSet, dataRoot: Key = null): void {
        this._getOperationsController().itemOpenHandler(newCurrentRoot, items, dataRoot);
        this._getSearchController().handleItemOpen(newCurrentRoot, items, dataRoot);
    }

    protected _listMarkedKeyChangedHandler(event: SyntheticEvent<null>, markedKey: Key): void {
        this._listMarkedKey = this._getOperationsController().setListMarkedKey(markedKey);
        this._notify('markedKeyChanged', [markedKey]);
    }

    protected _markedKeyChangedHandler(event: SyntheticEvent<null>): void {
        event.stopPropagation();
    }

    protected _operationsPanelOpen(): void {
        this._listMarkedKey = this._getOperationsController().setOperationsPanelVisible(true);
    }

    protected _operationsPanelClose(): void {
        this._getOperationsController(this._options).setOperationsPanelVisible(false);
    }

    private _createOperationsController(options) {
        const controllerOptions = {
            ...options,
            ...{
                selectionViewModeChangedCallback: (type) => {
                    this._notify('selectionViewModeChanged', [type]);
                }
            }
        };
        return new OperationsController(controllerOptions);
    }

    private _getOperationsController(): OperationsController {
        if (!this._operationsController) {
            this._operationsController = this._createOperationsController(this._options);
        }

        return this._operationsController;
    }

    _createSearchController(options, context): SearchController {
        return new SearchController(this._getSearchControllerOptions(options), context);
    }

    _getSearchControllerOptions(options): object {
        const optionsChangedCallbacks = SearchController.getStateAndOptionsChangedCallbacks(this);
        return {...options, ...optionsChangedCallbacks};
    }

    _getSearchController(): SearchController {
        if (!this._searchController) {
            this._searchController = this._createSearchController(this._options, this._context);
        }
        return this._searchController;
    }

    _search(event: SyntheticEvent, value: string, force: boolean): void {
        this._searchController.search(value, force);
    }

    _dataLoadCallback(data: RecordSet): void {
        this._getSearchController().handleDataLoad(data);
    }

    _afterSetItemsOnReloadCallback(): void {
        this._getSearchController().handleAfterSetItemsOnReload();
    }

    _misspellCaptionClick(): void {
        this._getSearchController().handleMisspellClick();
    }

    static contextTypes(): object {
        return {
            dataOptions: DataOptions
        };
    }

    static getDefaultOptions(): object {
        return {
            minSearchLength: 3,
            searchDelay: 500,
            startingWith: 'root'
        };
    }
}
