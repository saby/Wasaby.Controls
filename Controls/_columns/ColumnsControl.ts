import {TemplateFunction} from 'UI/Base';
import {SyntheticEvent} from 'Vdom/Vdom';
import {IList, ListControl} from 'Controls/list';
import Collection from 'Controls/_columns/display/Collection';
import ListControlTpl = require('wml!Controls/_columns/ColumnsControl');
import {MarkerController} from 'Controls/marker';
import {Model} from 'Types/entity';
import CollectionItem from 'Controls/_columns/display/CollectionItem';
import {scrollToElement} from 'Controls/scroll';
import {CrudEntityKey} from 'Types/source';
import {constants} from 'Env/Env';

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
    private _markerController: MarkerController;
    private _spacing: number = SPACING;
    protected _options: IColumnsControlOptions;
    protected _model: Collection<Model>;
    protected _addingColumnsCounter: number = 0;

    protected _beforeMount(options: IColumnsControlOptions): void {
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
                this._model.setColumnsCount(this._columnsCount);
            }
        };
    }

    protected _afterMount(): void {
        this._resizeHandler();
    }

    protected _beforeUpdate(options: IColumnsControlOptions): void {
        if (options.columnsMode === 'fixed' && options.columnsCount !== this._options.columnsCount) {
            this._columnsCount = options.columnsCount;
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
            this._model.setColumnsCount(this._columnsCount);
        }
    }

    protected _getItemsContainer() {
        return this._children.baseControl.getItemsContainer();
    }

    private moveMarker(direction: string): void {
        const model = this._model;
        if (model && this._markerController) {
            const curMarkedItem = model.find((item) => item.isMarked());
            let newMarkedItem: CollectionItem<Model>;
            newMarkedItem = model[`getItemTo${direction}`](curMarkedItem);
            if (newMarkedItem && curMarkedItem !== newMarkedItem) {
                this._changeMarkedKey(newMarkedItem.getContents().getKey());
                const column = newMarkedItem.getColumn();
                const curIndex = model.getIndex(newMarkedItem);
                const columnIndex = model.getIndexInColumnByIndex(curIndex);
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
