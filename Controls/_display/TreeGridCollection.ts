import Tree from './Tree';
import { mixin } from 'Types/util';
import GridMixin from './GridMixin';
import TreeGridRow, {IOptions as ITreeGridRowOptions} from './TreeGridRow';
import * as GridLadderUtil from './utils/GridLadderUtil';
import { ItemsFactory } from './Collection';
import GridGroupItem from './GridGroupItem';
import TreeItem from './TreeItem';
import { Composer } from './itemsStrategy';
import NodeFooter from 'Controls/_display/itemsStrategy/NodeFooter';

/**
 * Рекурсивно проверяет скрыт ли элемент сворачиванием родительских узлов
 * @param {TreeItem<T>} item
 */
function itemIsVisible<T>(item: TreeItem<T>): boolean  {
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
    S,
    T extends TreeGridRow<S> = TreeGridRow<S>
> extends mixin<Tree<any>, GridMixin<any, any>>(Tree, GridMixin) {
    readonly '[Controls/_display/TreeGridCollection]': boolean;

    constructor(options: any) {
        super(options);
        GridMixin.call(this, options);

        // TODO должно быть в Tree. Перенести туда, когда полностью перейдем на новую стратегии TreeGrid.
        //  Если сразу в Tree положим, то все разломаем
        this.addFilter(
            (contents, sourceIndex, item, collectionIndex) => itemIsVisible(item)
        );
    }

    // TODO duplicate code with GridCollection. Нужно придумать как от него избавиться.
    //  Проблема в том, что mixin не умеет объединять одинаковые методы, а логику Grid мы добавляем через mixin
    // region override

    setMultiSelectVisibility(visibility: string): void {
        super.setMultiSelectVisibility(visibility);
        this._$colgroup?.reBuild();
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

    protected _handleAfterCollectionChange(): void {
        super._handleAfterCollectionChange();
        if (GridLadderUtil.isSupportLadder(this._$ladderProperties)) {
            this._prepareLadder(this._$ladderProperties, this._$columns);
            this._updateItemsLadder();
        }
    }

    protected _getItemsFactory(): ItemsFactory<T> {
        const superFactory = super._getItemsFactory();
        return function CollectionItemsFactory(options?: ITreeGridRowOptions<T>): T {
            options.columns = this._$columns;
            return superFactory.call(this, options);
        };
    }

    protected _getGroupItemConstructor(): new() => GridGroupItem<T> {
        return GridGroupItem;
    }

    // TODO по идее нужно это добавлять в Tree,
    //  но т.к. Tree используется в старой модели, чтобы ничего не сломать, добавляю здесь
    protected _createComposer(): Composer<any, TreeItem<any>> {
        const composer = super._createComposer();
        composer.append(NodeFooter, {
            display: this,
            footerVisibilityCallback: this._$footerVisibilityCallback
        });
        return composer;
    }

    // endregion
}

Object.assign(TreeGridCollection.prototype, {
    '[Controls/_display/TreeGridCollection]': true,
    _moduleName: 'Controls/display:TreeGridCollection',
    _itemModule: 'Controls/display:TreeGridRow'
});
