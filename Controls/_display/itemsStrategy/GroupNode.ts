import CollectionItem from '../CollectionItem';
import Collection from '../Collection';
import Direct from './Direct';
import { IOptions as IItemsStrategyOptions } from '../IItemsStrategy';

export interface IOptions<S, T extends CollectionItem<S>> extends IItemsStrategyOptions<S, T> {
    display: Collection<S, T>;
    localize?: boolean;
    nodeTypeProperty?: string;
    groupNodeItemModule?: string;
}

/**
 * Стратегия получения элементов проекции напрямую по коллекции
 * @class Controls/_display/ItemsStrategy/Direct
 * @extends Controls/_display/ItemsStrategy/Abstract
 * @author Мальцев А.А.
 * @private
 */
export default class GroupNode<S, T extends CollectionItem<S> = CollectionItem<S>> extends Direct<S, T> {

    private readonly _$nodeTypeProperty: string;

    private readonly _$groupNodeItemModule: string;

    constructor(options: IOptions<S, T>) {
        super(options);
        this._$nodeTypeProperty = options.nodeTypeProperty;
        this._$groupNodeItemModule = options.groupNodeItemModule;
    }

    /**
     * Создает элемент проекции
     * @protected
     */
    protected _createItem(contents: S): T {
        const itemOptions: {contents?: S, itemModule?: string} = {
            contents
        };
        if (contents && typeof contents !== 'string' && !Array.isArray(contents) &&
            contents.get(this._$nodeTypeProperty) === 'group') {
            itemOptions.itemModule = this._$groupNodeItemModule;
        }
        return this.options.display.createItem(itemOptions) as any as T;
    }

    // region Protected
}

Object.assign(GroupNode.prototype, {
    '[Controls/_display/itemsStrategy/GroupNode]': true,
    _moduleName: 'Controls/display:itemsStrategy.GroupNode',
    _itemsOrder: null
});
