import { register } from 'Types/di';
import SearchGridCollection from 'Controls/_searchBreadcrumbsGrid/display/SearchGridCollection';
import Search from 'Controls/_searchBreadcrumbsGrid/display/Search';
import SearchStrategy from 'Controls/_searchBreadcrumbsGrid/display/strategies/Search';
import SearchGridDataRow from 'Controls/_searchBreadcrumbsGrid/display/SearchGridDataRow';
import SearchGridDataCell from 'Controls/_searchBreadcrumbsGrid/display/SearchGridDataCell';
import BreadcrumbsItem from 'Controls/_searchBreadcrumbsGrid/display/BreadcrumbsItem';
import BreadcrumbsCell from 'Controls/_searchBreadcrumbsGrid/display/BreadcrumbsCell';
import SearchSeparator from 'Controls/_searchBreadcrumbsGrid/display/SearchSeparator';
import SearchView from 'Controls/_searchBreadcrumbsGrid/SearchView';
import View from 'Controls/_searchBreadcrumbsGrid/Search';
import * as SearchBreadcrumbsItemTemplate from 'wml!Controls/_searchBreadcrumbsGrid/render/Item';
import * as SearchSeparatorTemplate from 'wml!Controls/_searchBreadcrumbsGrid/render/SearchSeparatorTemplate';

export {
   View,
   SearchView,
   SearchGridCollection,
   BreadcrumbsItem,
   SearchSeparator,
   SearchStrategy,
   Search,
   SearchBreadcrumbsItemTemplate,
   SearchSeparatorTemplate
};

register('Controls/searchBreadcrumbsGrid:SearchGridCollection', SearchGridCollection, {instantiate: false});
register('Controls/searchBreadcrumbsGrid:SearchGridDataRow', SearchGridDataRow, {instantiate: false});
register('Controls/searchBreadcrumbsGrid:SearchGridDataCell', SearchGridDataCell, {instantiate: false});
register('Controls/searchBreadcrumbsGrid:Search', Search, {instantiate: false});
register('Controls/searchBreadcrumbsGrid:BreadcrumbsItem', BreadcrumbsItem, {instantiate: false});
register('Controls/searchBreadcrumbsGrid:BreadcrumbsCell', BreadcrumbsCell, {instantiate: false});
