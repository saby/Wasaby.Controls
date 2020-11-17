import { TemplateFunction } from 'UI/Base';
import {mixin} from 'Types/util';
import GridCollectionItem from './GridCollectionItem';
import ExpandableMixin, {IOptions as IExpandableMixinOptions} from './ExpandableMixin';
import {IOptions as ICollectionItemOptions} from './CollectionItem';
import GridColumn from './GridColumn';
import GridCollection from './GridCollection';
import GridGroupCell from './GridGroupCell';
import * as GridLadderUtil from './utils/GridLadderUtil';

const DEFAULT_GROUP_CONTENT_TEMPLATE = 'Controls/gridNew:GroupContent';

interface IOptions<T> extends ICollectionItemOptions<T>, IExpandableMixinOptions {
    owner: GridCollection<T>;
}

export default class GridGroupItem<T> extends mixin<
    GridCollectionItem<any>,
    ExpandableMixin
    >(
    GridCollectionItem,
    ExpandableMixin
) {
    readonly '[Controls/_display/IEditableCollectionItem]': boolean = false;
    readonly '[Controls/_display/GroupItem]': true;

    readonly MarkableItem: boolean = false;
    readonly SelectableItem: boolean = false;
    readonly '[Controls/_display/GridGroupItem]': true;

    protected _$columnItems: Array<GridColumn<T>>;
    protected _groupTemplate: TemplateFunction|string;

    constructor(options?: IOptions<T>) {
        super({...options, columns: options.owner.getColumns()});
        ExpandableMixin.call(this);
    }

    isHiddenGroup(): boolean {
        return this._$contents === 'CONTROLS_HIDDEN_GROUP';
    }

    getItemTemplate(
        itemTemplateProperty: string,
        userItemTemplate: TemplateFunction|string,
        userGroupTemplate?: TemplateFunction|string
    ): TemplateFunction|string {
        if (userGroupTemplate) {
            this._groupTemplate = userGroupTemplate;
        } else {
            this._groupTemplate = null;
        }
        return 'Controls/gridNew:ItemTemplate';
    }

    isSticked(): boolean {
        return this._$owner.isStickyHeader();
    }

    getStickyColumn(): GridLadderUtil.IStickyColumn {
        return this._$owner.getStickyColumn();
    }

    getCaption(): T {
        return this.contents;
    }

    getItemClasses(): string {
        return 'controls-ListView__itemV controls-Grid__row controls-ListView__group' +
                (this.isHiddenGroup() ? 'controls-ListView__groupHidden' : 'controls-Grid__row controls-ListView__group');
    }

    _initializeColumns(): void {
        if (this._$columns) {
            const columns = [];

            columns.push(new GridGroupCell({
                owner: this,
                columns: this._$columns,
                column: { template: this._groupTemplate || DEFAULT_GROUP_CONTENT_TEMPLATE }
            }));

            this._$columnItems = columns;
        }
    }

    setExpanded(expanded: boolean, silent?: boolean): void {
        super.setExpanded(expanded, silent);
        this._nextVersion();
    }

}

Object.assign(GridGroupItem.prototype, {
    '[Controls/_display/GroupItem]': true,
    '[Controls/_display/GridGroupItem]': true,
    _moduleName: 'Controls/display:GridGroupItem',
    _instancePrefix: 'grid-group-item-',
    _$columns: null
});
