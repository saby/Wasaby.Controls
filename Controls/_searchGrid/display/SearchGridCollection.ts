import { TreeGridCollection } from 'Controls/treeGridNew';
import { Model } from 'Types/entity';
import SearchGridDataRow from 'Controls/_searchGrid/display/SearchGridDataRow';
import ItemsStrategyComposer from 'Controls/_display/itemsStrategy/Composer';
import SearchStrategy from 'Controls/_display/itemsStrategy/Search';
import { TemplateFunction } from 'UI/Base';

export default class SearchGridCollection<S extends Model, T extends SearchGridDataRow<S>> extends TreeGridCollection<S, T> {
   /**
    * @cfg Имя свойства элемента хлебных крошек, хранящее признак того, что этот элемент и путь до него должны быть
    * выделены в обособленную цепочку
    * @name Controls/_display/Search#dedicatedItemProperty
    */
   protected _$dedicatedItemProperty: string;

   protected _$searchBreadcrumbsItemTemplate: TemplateFunction;

   getSearchBreadcrumbsItemTemplate(): TemplateFunction {
      return this._$searchBreadcrumbsItemTemplate;
   }

   protected _createComposer(): ItemsStrategyComposer<S, T> {
      const composer = super._createComposer();

      composer.append(SearchStrategy, {
         dedicatedItemProperty: this._$dedicatedItemProperty,
         itemDecorator: 'Controls/searchGrid:SearchTreeItemDecorator'
      });

      return composer;
   }

   protected getExpanderIcon(): string {
      return 'none';
   }
}

Object.assign(SearchGridCollection.prototype, {
   '[Controls/searchGrid:SearchGridCollection]': true,
   _moduleName: 'Controls/searchGrid:SearchGridCollection',
   _$searchBreadcrumbsItemTemplate: 'Controls/searchGrid:SearchBreadcrumbsItemTemplate'
});
