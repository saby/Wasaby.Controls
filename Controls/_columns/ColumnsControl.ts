import {TemplateFunction} from 'UI/Base';
import {SyntheticEvent} from 'Vdom/Vdom';
import {IList, ListControl} from 'Controls/list';
import Collection from 'Controls/_columns/display/Collection';
import ListControlTpl = require('wml!Controls/_columns/ColumnsControl');
import ColumnsController from "Controls/_columns/controllers/ColumnsController";
import {MarkerController} from "Controls/marker";
import {Model} from "Types/entity";
import CollectionItem from "Controls/_columns/display/CollectionItem";
import {scrollToElement} from "Controls/_scroll/Utils/scrollToElement";
import {CrudEntityKey} from "Types/source";
import {constants} from "Env/Env";

const SPACING = 12;
const DEFAULT_MIN_WIDTH = 270;
const DEFAULT_MAX_WIDTH = 400;
const DEFAULT_COLUMNS_COUNT = 2;

export interface IColumnsControlOptions extends IList {
    columnMinWidth: number;
    columnMaxWidth: number;
    columnsMode: 'auto' | 'fixed';
    columnsCount: number;
    initialWidth: number;
}

export default class ColumnsControl extends ListControl {
    protected _template: TemplateFunction = ListControlTpl;
    private _keyDownHandler: Function;
    private _columnsCount: number;
    private _columnsController: ColumnsController;
    private _markerController: MarkerController;
    private _columnsIndexes: number[][];
    private _spacing: number = SPACING;
    protected _options: IColumnsControlOptions;
    protected _model: Collection<Model>;
    protected _addingColumnsCounter: number = 0;

    protected _beforeMount(options: IColumnsControlOptions): void {
        this._columnsController = new ColumnsController({columnsMode: options.columnsMode});
        this._onCollectionChange = this._onCollectionChange.bind(this);
        this._keyDownHandler = this._keyDownHandler.bind(this);
        this._beforeMountCallback = ({viewModel, markerController}) => {
            this._model = viewModel;
            this._markerController = markerController;
            if (options.columnsMode === 'auto' && options.initialWidth) {
                this._recalculateColumnsCountByWidth(options.initialWidth, options.columnMinWidth);
            } else {
                if (options.columnsCount) {
                    this._columnsCount = options.columnsCount;
                } else {
                    this._columnsCount = DEFAULT_COLUMNS_COUNT;
                }
                this.updateColumns();
            }
        };
    }

    protected _afterMount(): void {
        this._resizeHandler();
        this._subscribeToModelChanges(this._model);
    }

    protected _beforeUpdate(options: IColumnsControlOptions): void {
        if (options.columnsMode === 'fixed' && options.columnsCount !== this._options.columnsCount) {
            this._columnsCount = options.columnsCount;
        }
    }

    protected _beforeUnmount(): void {
        this._unsubscribeFromModelChanges(this._model);
    }

    private updateColumnIndexesByModel(): void {
        this._columnsIndexes = new Array<number[]>(this._columnsCount);
        for (let i = 0; i < this._columnsCount; i++) {
            this._columnsIndexes[i] = [];
        }
        this._model.each( (item, index) => {
            this._columnsIndexes[item.getColumn()].push(index as number);
        });
    }

    private setColumnOnItem(item: CollectionItem<Model>, index: number): void {
        const model = this._model;
        const column = this._columnsController.calcColumn(model, index + this._addingColumnsCounter, this._columnsCount);
        item.setColumn(column);
    }

    private updateColumns(): void {
        this._addingColumnsCounter = 0;
        this._columnsIndexes = null;
        this._model.each(this.setColumnOnItem.bind(this));
        this.updateColumnIndexesByModel();
    }

    private processRemovingItem(item: any): boolean {
        let done = true;

        if (!this._model.find((it) => it.getColumn() === item.column) && this._addingColumnsCounter > 0) {
            this._addingColumnsCounter--;
        }

        if (item.columnIndex >= this._columnsIndexes[item.column].length) {
            done = false;
            while (!done && (item.column + 1) < this._columnsCount) {

                if (this._columnsIndexes[item.column + 1].length > 0) {

                    if (this._columnsIndexes[item.column + 1].length > 1) {
                        done = true;
                    }
                    const nextIndex = this._columnsIndexes[item.column + 1].pop();
                    this._columnsIndexes[item.column].push(nextIndex);
                    const nextItem = this._model.getItemBySourceIndex(nextIndex) as CollectionItem<Model>;
                    nextItem.setColumn(item.column);
                }
                item.column++;
            }
        }
        return !done;
    }
    private processRemoving(removedItemsIndex: number, removedItems: [CollectionItem<Model>]): void {
        const removedItemsIndexes = removedItems.map((item, index) => {
            const column = item.getColumn();
            const columnIndex = this._columnsIndexes[column].findIndex((elem) => elem === (index + removedItemsIndex));
            return {
                column,
                columnIndex
            };
        });
        this.updateColumnIndexesByModel();
        const needLoadMore = removedItemsIndexes.some(this.processRemovingItem.bind(this));

        if (needLoadMore) {
            this._notify('loadMore', ['down']);
        }
    }
    protected _onCollectionChange(_e: unknown,
                                  action: string,
                                  newItems: [CollectionItem<Model>],
                                  newItemsIndex: number,
                                  removedItems: [CollectionItem<Model>],
                                  removedItemsIndex: number): void {
        if (action === 'a') {
            newItems.forEach(this.setColumnOnItem.bind(this));
            if (this._options.columnsMode === 'auto' && newItems.length === 1) {
                this._addingColumnsCounter++;
            }
        }
        if (action === 'rm') {
            this.processRemoving(removedItemsIndex, removedItems);
        }
        if (action === 'rs') {
            this.updateColumns();
        }
    }
    protected _resizeHandler(): void {
        const itemsContainer = this._getItemsContainer();
        const currentWidth = itemsContainer.getBoundingClientRect().width;

        // если currentWidth === 0, значит контрол скрыт (на вкладке switchbleArea), и не нужно пересчитывать
        if (this._options.columnsMode === 'auto' && currentWidth > 0) {
            this._recalculateColumnsCountByWidth(currentWidth, this._options.columnMinWidth);
        }
    }

    private _recalculateColumnsCountByWidth(width: number, columnMinWidth: number): void {
        const newColumnsCount = Math.floor(width / ((columnMinWidth || DEFAULT_MIN_WIDTH) + this._spacing));
        if (newColumnsCount !== this._columnsCount) {
            this._columnsCount = newColumnsCount;
            this.updateColumns();
        }
    }

    protected _getItemsContainer() {
        return this._children.baseControl.getItemsContainer();
    }

    private getItemToLeft(model: Collection<Model>, item: CollectionItem<Model>): CollectionItem<Model> {
        const curIndex = model.getIndex(item);
        let newIndex: number = curIndex;
        if (this._options.columnsMode === 'auto') {
            if (curIndex > 0) {
                newIndex = curIndex - 1;
            }
        } else {
            const curColumn = item.getColumn();
            const curColumnIndex = this._columnsIndexes[curColumn].indexOf(curIndex);
            if (curColumn > 0) {
                const prevColumn = this._columnsIndexes.slice().reverse().find(
                    (col: number[], index: number) => index > this._columnsCount - curColumn - 1 && col.length > 0);

                if (prevColumn instanceof Array) {
                    newIndex = prevColumn[Math.min(prevColumn.length - 1, curColumnIndex)];
                }
            }
        }
        return model.at(newIndex);
    }

    private getItemToRight(model: Collection<Model>, item: CollectionItem<Model>): CollectionItem<Model> {
        const curIndex = model.getIndex(item);
        let newIndex: number = curIndex;
        if (this._options.columnsMode === 'auto') {
            if (curIndex < model.getCount() - 1) {
                newIndex = curIndex + 1;
            } else if (curIndex > this._columnsCount) {
                newIndex = curIndex + 1 - this._columnsCount;
            }
        } else {
            const curColumn = item.getColumn();
            const curColumnIndex = this._columnsIndexes[curColumn].indexOf(curIndex);
            if (curColumn < this._columnsCount - 1) {
                const nextColumn = this._columnsIndexes.find(
                    (col: number[], index: number) => index > curColumn && col.length > 0);

                if (nextColumn instanceof Array) {
                    newIndex = nextColumn[Math.min(nextColumn.length - 1, curColumnIndex)];
                }
            }
        }
        return model.at(newIndex);
    }

    private getItemToUp(model: Collection<Model>, item: CollectionItem<Model>): CollectionItem<Model> {
        const curIndex = model.getIndex(item);
        let newIndex: number = curIndex;
        if (this._options.columnsMode === 'auto') {
            if (Math.round(curIndex / this._columnsCount) > 0) {
                newIndex = curIndex - this._columnsCount;
            }
        } else {
            const curColumn = item.getColumn();
            const curColumnIndex = this._columnsIndexes[curColumn].indexOf(curIndex);
            if (curColumnIndex > 0) {
                newIndex = this._columnsIndexes[curColumn][curColumnIndex - 1];
            } else {
                newIndex = curIndex;
            }
        }
        return model.at(newIndex);
    }

    private getItemToDown(model: Collection<Model>, item: CollectionItem<Model>): CollectionItem<Model> {
        const curIndex = model.getIndex(item);
        let newIndex: number = curIndex;
        if (this._options.columnsMode === 'auto') {
            if (curIndex + this._columnsCount < model.getCount()) {
                newIndex = curIndex + this._columnsCount;
            }
        } else {
            const curColumn = item.getColumn();
            const curColumnIndex = this._columnsIndexes[curColumn].indexOf(curIndex);
            if (curColumnIndex < this._columnsIndexes[curColumn].length - 1) {
                newIndex = this._columnsIndexes[curColumn][curColumnIndex + 1];
            } else {
                newIndex = curIndex;
            }
        }
        return model.at(newIndex);
    }

    private moveMarker(direction: string): void {
        const model = this._model;
        if (model && this._markerController) {
            const curMarkedItem = model.find((item) => item.isMarked());
            let newMarkedItem: CollectionItem<Model>;
            newMarkedItem = this[`getItemTo${direction}`](model, curMarkedItem);
            if (newMarkedItem && curMarkedItem !== newMarkedItem) {
                this._changeMarkedKey(newMarkedItem.getContents().getKey());
                const column = newMarkedItem.getColumn();
                const curIndex = model.getIndex(newMarkedItem);
                const columnIndex = this._columnsIndexes[column].indexOf(curIndex);
                const itemsContainer = this._getItemsContainer();
                const elem = itemsContainer.children[column].children[columnIndex + 1] as HTMLElement;
                scrollToElement(elem, direction === 'Down');
            }
        }
    }

    private _changeMarkedKey(newMarkedKey: CrudEntityKey): Promise<CrudEntityKey>|CrudEntityKey {
        // Пока выполнялся асинхронный запрос, контрол мог быть уничтожен. Например, всплывающие окна.
        if (this._destroyed) {
            return undefined;
        }

        const eventResult = this._notify('beforeMarkedKeyChanged', [newMarkedKey], { bubbling: true }) as Promise<CrudEntityKey>|CrudEntityKey;

        let result = eventResult;
        if (eventResult instanceof Promise) {
            eventResult.then((key) => {
                this._markerController.setMarkedKey(key);
                this._notify('markedKeyChanged', [key]);
                return key;
            });
        } else if (eventResult !== undefined) {
            this._markerController.setMarkedKey(eventResult);
            this._notify('markedKeyChanged', [eventResult]);
        } else {
            result = newMarkedKey;
            this._markerController.setMarkedKey(newMarkedKey);
            this._notify('markedKeyChanged', [newMarkedKey]);
        }

        return result;
    }

    protected _keyDownHandler(e: SyntheticEvent<KeyboardEvent>): boolean {
        let direction = '';
        switch (e.nativeEvent.keyCode) {
            case constants.key.left:
                direction = 'Left';
                break;
            case constants.key.up:
                direction = 'Up';
                break;
            case constants.key.right:
                direction = 'Right';
                break;
            case constants.key.down:
                direction = 'Down';
                break;
        }
        if (direction) {
            this.moveMarker(direction);
            e.stopPropagation();
            e.preventDefault();
            return false;
        }
    }

    protected _unsubscribeFromModelChanges(model: Collection<Model>): void {
        if (model && !model.destroyed) {
            model.unsubscribe('onCollectionChange', this._onCollectionChange);
        }
    }

    protected _subscribeToModelChanges(model: Collection<Model>): void {
        if (model && !model.destroyed) {
            model.subscribe('onCollectionChange', this._onCollectionChange);
        }
    }
    static getDefaultOptions(): Partial<IColumnsControlOptions> {
        return {
            columnMinWidth: DEFAULT_MIN_WIDTH,
            columnMaxWidth: DEFAULT_MAX_WIDTH,
            columnsMode: 'auto',
            columnsCount: DEFAULT_COLUMNS_COUNT
        };
    }
}

Object.defineProperty(ColumnsControl, 'defaultProps', {
    enumerable: true,
    configurable: true,

    get(): object {
        return ColumnsControl.getDefaultOptions();
    }
});
