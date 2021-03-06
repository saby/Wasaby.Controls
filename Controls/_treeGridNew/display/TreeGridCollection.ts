import { mixin } from 'Types/util';
import {TemplateFunction} from 'UI/Base';
import TreeGridDataRow, {IOptions as ITreeGridRowOptions} from './TreeGridDataRow';
import {
    TreeItem,
    Tree,
    GridLadderUtil,
    ItemsFactory,
    itemsStrategy,
    ITreeCollectionOptions, IItemActionsTemplateConfig
} from 'Controls/display';
import {
    GridGroupRow,
    GridMixin,
    IGridCollectionOptions
} from 'Controls/gridNew';
import TreeGridFooterRow from './TreeGridFooterRow';
import {Model as EntityModel, Model} from 'Types/entity';

export interface IOptions<S extends Model, T extends TreeGridDataRow<S>>
   extends IGridCollectionOptions<S, T>, ITreeCollectionOptions<S, T> {
    nodeTypeProperty?: string;
}

/**
 * Рекурсивно проверяет скрыт ли элемент сворачиванием родительских узлов
 * @param {TreeItem<T>} item
 */
function itemIsVisible<T extends Model>(item: TreeItem<T>): boolean  {
    if (item['[Controls/_display/GroupItem]'] || item['[Controls/_display/BreadcrumbsItem]']) {
        return true;
    }

    const parent = item.getParent();
    // корневой узел не может быть свернут
    if (!parent || parent['[Controls/_display/BreadcrumbsItem]'] || parent.isRoot()) {
        return true;
    } else if (!parent.isExpanded()) {
        return false;
    }

    return itemIsVisible(parent);
}

export default class TreeGridCollection<
    S extends Model,
    T extends TreeGridDataRow<S> = TreeGridDataRow<S>
> extends mixin<Tree<any>, GridMixin<any, any>>(Tree, GridMixin) {
    readonly '[Controls/treeGrid:TreeGridCollection]': boolean;

    protected _$nodeTypeProperty: string;

    constructor(options: IOptions<S, T>) {
        super(options);
        GridMixin.call(this, options);

        // TODO должно быть в Tree. Перенести туда, когда полностью перейдем на новую коллекцию TreeGrid.
        //  Если сразу в Tree положим, то все разломаем
        this.addFilter(
           (contents, sourceIndex, item, collectionIndex) => itemIsVisible(item)
        );
    }

    setNodeTypeProperty(nodeTypeProperty: string): void {
        this._$nodeTypeProperty = nodeTypeProperty;
        this._nextVersion();
    }

    getNodeTypeProperty(): string {
        return this._$nodeTypeProperty;
    }

    // TODO duplicate code with GridCollection. Нужно придумать как от него избавиться.
    //  Проблема в том, что mixin не умеет объединять одинаковые методы, а логику Grid мы добавляем через mixin
    // region override

    setEmptyTemplate(emptyTemplate: TemplateFunction): boolean {
        const superResult = super.setEmptyTemplate(emptyTemplate);
        if (superResult) {
            if (this._$emptyTemplate) {
                if (this._$emptyGridRow) {
                    this._$emptyGridRow.setEmptyTemplate(this._$emptyTemplate);
                } else {
                    this._initializeEmptyRow();
                }
            } else {
                this._$emptyGridRow = undefined;
            }
        }
        return superResult;
    }

    setMultiSelectVisibility(visibility: string): void {
        super.setMultiSelectVisibility(visibility);

        if (this.getFooter()) {
            this.getFooter().setMultiSelectVisibility(visibility);
        }

        if (this.getResults()) {
            this.getResults().setMultiSelectVisibility(visibility);
        }

        if (this.getHeader()) {
            this.getHeader().setMultiSelectVisibility(visibility);
        }

        this._$colgroup?.reBuild();
    }

    setActionsTemplateConfig(config: IItemActionsTemplateConfig) {
        super.setActionsTemplateConfig(config);
        if (this.getFooter()) {
            this.getFooter().setActionsTemplateConfig(config);
        }
    }

    setHasMoreData(hasMoreData: boolean): void {
        super.setHasMoreData(hasMoreData);
        if (this.getFooter()) {
            this.getFooter().setHasMoreData(hasMoreData);
        }
    }

    protected _reBuild(reset?: boolean): void {
        if (GridLadderUtil.isSupportLadder(this._$ladderProperties) && !!this._$ladder) {
            this._prepareLadder(this._$ladderProperties, this._$columns);
        }
        super._reBuild(reset);
        this._$colgroup?.reBuild();
    }

    setIndexes(start: number, stop: number): void {
        super.setIndexes(start, stop);
        if (GridLadderUtil.isSupportLadder(this._$ladderProperties)) {
            this._prepareLadder(this._$ladderProperties, this._$columns);
            this._updateItemsLadder();
        }
        this._updateItemsColumns();
    }

    protected _handleAfterCollectionChange(changedItems: TreeGridDataRow[]): void {
        super._handleAfterCollectionChange(changedItems);
        if (GridLadderUtil.isSupportLadder(this._$ladderProperties)) {
            this._prepareLadder(this._$ladderProperties, this._$columns);
            this._updateItemsLadder();
        }
        this._$results = null;
    }

    protected _getItemsFactory(): ItemsFactory<T> {
        const superFactory = super._getItemsFactory();
        return this._itemsFactoryResolver.bind(this, superFactory);
    }

    protected _getGroupItemConstructor(): new() => GridGroupRow<T> {
        return GridGroupRow;
    }
    setEditing(editing: boolean): void {
        super.setEditing(editing);

        if (this._$headerModel && !this._headerIsVisible(this._$header)) {
            this._$headerModel = null;
        }
        this._nextVersion();
    }

    // endregion

    // region HasNodeWithChildren

    protected _setHasNodeWithChildren(hasNodeWithChildren: boolean): void {
        super._setHasNodeWithChildren(hasNodeWithChildren);
        if (this.getFooter()) {
            this.getFooter().setHasNodeWithChildren(hasNodeWithChildren);
        }
    }

    // endregion HasNodeWithChildren

    // region itemsFactoryResolver

    protected _itemsFactoryResolver(superFactory: ItemsFactory<T>, options?: ITreeGridRowOptions<S>): ItemsFactory<T> {
        options.columns = this._$columns;
        options.colspanCallback = this._$colspanCallback;
        options.columnSeparatorSize = this._$columnSeparatorSize;
        options.rowSeparatorSize = this._$rowSeparatorSize;

        // Строит обычную фабрику
        const CollectionItemsFactory = (factoryOptions?: ITreeGridRowOptions<S>): ItemsFactory<T> => {
            return superFactory.call(this, factoryOptions);
        };

        // Строит фабрику, которая работает с TreeGridGroupDataRow
        const GroupNodeFactory = (factoryOptions?: ITreeGridRowOptions<S>): ItemsFactory<T> => {
            factoryOptions.itemModule = 'Controls/treeGrid:TreeGridGroupDataRow';
            return superFactory.call(this, factoryOptions);
        };

        if (this._$nodeTypeProperty &&
            options.contents && typeof options.contents !== 'string' && !Array.isArray(options.contents) &&
            options.contents.get(this._$nodeTypeProperty) === 'group') {
            return GroupNodeFactory.call(this, options);
        }
        return CollectionItemsFactory.call(this, options);
    }

    // endregion itemsFactoryResolver

    protected _initializeFooter(options: IOptions<S, T>): TreeGridFooterRow<S> {
        return new TreeGridFooterRow({
            ...options,
            owner: this,
            footer: options.footer,
            footerTemplate: options.footerTemplate,
            hasNodeWithChildren: this._hasNodeWithChildren
        });
    }

    // TODO по идее нужно это добавлять в Tree,
    //  но т.к. Tree используется в старой модели, чтобы ничего не сломать, добавляю здесь
    protected _createComposer(): itemsStrategy.Composer<any, TreeItem<any>> {
        const composer = super._createComposer();

        // TODO нужно определить когда точно нужна эта стратегия и добавлять только в этом случае
        composer.append(itemsStrategy.NodeFooter, {
            display: this,
            footerVisibilityCallback: this._$footerVisibilityCallback
        });

        return composer;
    }

    protected setMetaResults(metaResults: EntityModel) {
        super.setMetaResults(metaResults);
        this._$results?.setMetaResults(metaResults);
    }
}

Object.assign(TreeGridCollection.prototype, {
    '[Controls/treeGrid:TreeGridCollection]': true,
    _moduleName: 'Controls/treeGrid:TreeGridCollection',
    _itemModule: 'Controls/treeGrid:TreeGridDataRow',
    _$nodeTypeProperty: null
});
