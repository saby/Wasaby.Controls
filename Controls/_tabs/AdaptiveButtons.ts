import {Control, TemplateFunction} from 'UI/Base';
import {ITabsAdaptiveButtons, ITabsAdaptiveButtonsOptions} from './interface/ITabsAdaptiveButtons';
// @ts-ignore
import * as template from 'wml!Controls/_tabs/AdaptiveButtons/AdaptiveButtons';
import {RecordSet} from 'Types/collection';
import {getFontWidth} from 'Controls/Utils/getFontWidth';
import {SbisService} from 'Types/source';
import {CrudWrapper} from 'Controls/dataSource';
import {SyntheticEvent} from 'Vdom/Vdom';
import * as templateItem from 'wml!Controls/_tabs/Buttons/ItemTemplate';

interface IReceivedState {
    items: RecordSet;
}

class AdaptiveButtons extends Control<ITabsAdaptiveButtonsOptions> implements ITabsAdaptiveButtons {
    readonly '[Controls/_tabs/interface/ITabsAdaptiveButtons]': boolean = true;
    readonly '[Controls/_tabs/interface/ITabsButtons]': boolean = true;
    protected _template: TemplateFunction = template;
    protected _lastIndex: number = 0;
    protected _displayProperty: string = 'title';
    protected _containerWidth: number;
    protected _originalSource: RecordSet;
    protected _align: string;
    protected _margin: number;
    protected _minWidth: number;
    protected _widthOfMore: number;
    protected _paddingOfMore: number;
    protected _items: RecordSet;
    protected _crudWrapper: CrudWrapper;
    protected _selectedKey: number | string;

    // tslint:disable-next-line:max-line-length
    protected _beforeMount(options?: ITabsAdaptiveButtonsOptions, contexts?: object, receivedState?: IReceivedState): void | Promise<RecordSet> {
        this._displayProperty = options.displayProperty || 'title';
        this._containerWidth = options.containerWidth;
        this._align = options.align ? options.align : 'right';
        this._margin = 13;
        this._minWidth = 26;
        this._paddingOfMore = 6;
        this._selectedKey = options.selectedKey;
        const result = this._setItems(options, receivedState);
        if (result) {
            result.then((res) => {
                this._prepareItems();
            });
        } else {
           this._prepareItems();
        }
    }
    private _prepareItems(): void {
        this._items.forEach((item) => {
            item.set('align', this._align);
        });
        this._originalSource = this._items.clone();
        this._deleteHiddenItems(this._items);
    }

    private _setItems(options: ITabsAdaptiveButtonsOptions, receivedState: IReceivedState): void | Promise<RecordSet> {
        if (receivedState) {
            this._items = receivedState.items;
        } else if (options.items) {
            this._items = options.items;
        } else if (options.source) {
            return this._getItems(options.source).then((res) => {
                this._items = res;
                return res;
            });
        }
    }

    protected _beforeUpdate(newOptions?: ITabsAdaptiveButtonsOptions): void {
        if (newOptions.source && newOptions.source !== this._options.source) {
            this._getItems(newOptions.source).then((res) => {
                this._items = res;
            });
        }
        if (newOptions.items && newOptions.items !== this._options.items) {
            this._items = newOptions.items;
        }

        if (newOptions.containerWidth !== this._containerWidth) {
            this._containerWidth = newOptions.containerWidth;
            const items = this._originalSource.clone();
            this._deleteHiddenItems(items);
        }
    }
    private _selectedHandler(event: SyntheticEvent<Event>, key: string): void {
        this._selectedKey = key;
    }

    private _getItems(source: SbisService): Promise<RecordSet> {
        this._crudWrapper = new CrudWrapper({
            source
        });
        return this._crudWrapper.query({}).then((items: RecordSet) => {
            return items;
        });
    }

    private _getIndexOfLastTab(items: RecordSet, displayProperty: string, containerWidth: number = 200): Promise<number> {
        // находим индекс последней уместившейся вкладки с учетом текста, отступов и разделителей.
        let width = 0;
        let indexLast = 0;
        return this._getWidthOfElements(items, displayProperty).then((res) => {
            const arrWidth = res;
            if (this._align === 'right') {
                arrWidth.reverse();
            }
            while (width < containerWidth && indexLast !== items.getRawData().length) {
                width += arrWidth[indexLast];
                indexLast++;
            }
            indexLast -= 2;

            if (indexLast === arrWidth.length - 1) {
                return indexLast;
            }

            const currentWidth = arrWidth.reduce((sum, current) => {
                return sum + current;
            }, 0);

            const minWidth = this._minWidth + this._margin;
            if (indexLast === arrWidth.length - 2) {
                const width = currentWidth - arrWidth[arrWidth.length - 1] + minWidth;
                if (width < containerWidth) {
                    indexLast++;
                    return indexLast;
                } else {
                    indexLast = this._getLastIndex(indexLast, arrWidth, currentWidth, containerWidth);
                }
            }

            if (indexLast < arrWidth.length - 2) {
                indexLast = this._getLastIndex(indexLast, arrWidth, currentWidth, containerWidth);
            }
            return indexLast;
        });
    }

    private _getLastIndex(lastIndex: number, arrWidth: number[], currentWidth: number, containerWidth: number): number {
        let i = arrWidth.length - 1;
        let indexLast = lastIndex;
        let width = currentWidth;
        while (i !== lastIndex) {
            width = width - arrWidth[i];
            i--;
        }
        width = width + this._widthOfMore + this._minWidth + this._margin + this._paddingOfMore;
        indexLast++;
        while (width > containerWidth) {
            indexLast--;
            width = width - arrWidth[lastIndex];
        }
        return indexLast;
    }

    private _getWidthOfElement(item: string): Promise<number> {
        // ширина элемента
        return getFontWidth(item, 'l').then((res) => {
            const width = res + 2 * this._margin;
            return width;
        });
    }

    private _getWidthOfMore(title: string = 'Еще```'): Promise<number> {
        return getFontWidth(title, 'm').then((res) => {
            this._widthOfMore = res;
            return res;
        });
    }

    private _getWidthOfElements(items: RecordSet, displayProperty: string): Promise<number[]> {
        const arrItems = items.getRawData();
        const promises = [];
        for (let i = 0; i < arrItems.length; i++) {
            promises.push(this._getWidthOfElement(arrItems[i][displayProperty]));
        }
        return Promise.all(promises).then((res) => {
            return res;
        });
    }

    private _deleteHiddenItems(items: RecordSet): void {
        this._getWidthOfMore();
        this._getIndexOfLastTab(items, this._displayProperty, this._containerWidth).then((res) => {
            this._lastIndex = res;
            const oldRawData = items.getRawData();
            if (this._align === 'right') {
                oldRawData.reverse();
            }
            const rawData = oldRawData.slice(0, this._lastIndex + 1);
            // чтобы ужималась
            rawData[this._lastIndex].isMainTab = true;
            if (this._align === 'right') {
                rawData.reverse();
            }
            this._items.setRawData(rawData);
        });
    }

    static getDefaultOptions(): Partial<ITabsAdaptiveButtonsOptions> {
        return {
            align: 'right',
            containerWidth: 0
        };
    }
}

export default AdaptiveButtons;
