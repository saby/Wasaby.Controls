import { object } from 'Types/util';
import { Model } from 'Types/entity';
import { TemplateFunction } from 'UI/Base';
import SearchGridDataRow from './SearchGridDataRow';
import { TreeChildren } from 'Controls/display';
import SearchGridCollection from './SearchGridCollection';
import { GridDataRow, TColspanCallbackResult } from 'Controls/gridNew';
import { IColumn } from 'Controls/grid';

export interface IOptions<T extends Model> {
    owner?: SearchGridCollection<T>;
    last: SearchGridDataRow<T>;
}

/**
 * Хлебная крошка
 * @class Controls/_searchBreadcrumbsGrid/BreadcrumbsItem
 * @extends Controls/_display/CollectionItem
 * @private
 * @author Мальцев А.А.
 */
export default class BreadcrumbsItem<T extends Model = Model> extends GridDataRow<T> {
   readonly '[Controls/_display/IEditableCollectionItem]': boolean = false;
   readonly Markable: boolean = false;

   protected _$owner: SearchGridCollection<T>;

   /**
   * Последний элемент хлебной крошки
   */
   protected _$last: SearchGridDataRow<T>;

   protected _$cellTemplate: TemplateFunction;

   protected get _first(): SearchGridDataRow<T> {
      const root = this._$owner ? this._$owner.getRoot() : {};
      let current = this._$last;

      while (current) {
           const parent = current.getParent();
           if (!parent || parent === root) {
                 break;
           }
           current = parent;
      }

      return current;
   }

   // region Public methods

   getContents(): T[] {
     const root = this._$owner ? this._$owner.getRoot() : {};
     let current = this._$last;
     const contents = [];

     // Go up from last item until end
     while (current) {
         contents.unshift(current.getContents());
         current = current.getParent();
         if (current === root) {
             break;
         }
     }

     return contents as any;
   }

   setContents(): void {
     throw new ReferenceError('BreadcrumbsItem contents is read only.');
   }

   /**
   * Returns branch level in tree
   */
   getLevel(): number {
      const first = this._first;
      return first ? first.getLevel() : 0;
   }

   getLast(): SearchGridDataRow<T> {
      return this._$last;
   }

   getParent(): SearchGridDataRow<T> {
      // Родителем хлебной крошки всегда является корневой узел, т.к. хлебная крошка это путь до корневого узла
      return this._$owner.getRoot();
   }

   getChildren(withFilter: boolean = true): TreeChildren<T> {
      return this._$owner.getChildren(this, withFilter);
   }

   isHasChildren(): boolean {
      return this.getLast().isHasChildren();
   }

   getSearchValue(): string {
      return this.getOwner().getSearchValue();
   }

   getTemplate(): TemplateFunction | string {
      return this.getDefaultTemplate();
   }

   getCellTemplate(): TemplateFunction | string {
      return this._$cellTemplate;
   }

   protected _getColspan(column: IColumn, columnIndex: number): TColspanCallbackResult {
      return 'end';
   }

   protected _getMultiSelectAccessibility(): boolean|null {
      const value = object.getPropertyValue<boolean|null>(this.getLast().getContents(), this._$multiSelectAccessibilityProperty);
      return value === undefined ? true : value;
   }

   // endregion
}

Object.assign(BreadcrumbsItem.prototype, {
   '[Controls/_searchBreadcrumbsGrid/BreadcrumbsItem]': true,
   _moduleName: 'Controls/searchBreadcrumbsGrid:BreadcrumbsItem',
   _instancePrefix: 'search-breadcrumbs-grid-item-',
   _cellModule: 'Controls/searchBreadcrumbsGrid:BreadcrumbsCell',
   _$cellTemplate: 'Controls/searchBreadcrumbsGrid:SearchBreadcrumbsItemTemplate',
   _$last: null
});
