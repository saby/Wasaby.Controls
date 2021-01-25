import { register } from 'Types/di';
import SearchGridCollection from 'Controls/_searchGrid/display/SearchGridCollection';
import SearchGridDataRow from 'Controls/_searchGrid/display/SearchGridDataRow';
import SearchGridDataCell from 'Controls/_searchGrid/display/SearchGridDataCell';
import SearchTreeItemDecorator from 'Controls/_searchGrid/display/SearchTreeItemDecorator';
import SearchView from 'Controls/_searchGrid/SearchView';
import View from 'Controls/_searchGrid/Search';
import * as SearchBreadcrumbsItemTemplate from 'wml!Controls/_searchGrid/render/Item';
import * as SearchSeparatorTemplate from 'wml!Controls/_searchGrid/render/SearchSeparatorTemplate';

export {
   View,
   SearchView,
   SearchGridCollection,
   SearchBreadcrumbsItemTemplate,
   SearchSeparatorTemplate
}

register('Controls/searchGrid:SearchGridCollection', SearchGridCollection, {instantiate: false});
register('Controls/searchGrid:SearchGridDataRow', SearchGridDataRow, {instantiate: false});
register('Controls/searchGrid:SearchGridDataCell', SearchGridDataCell, {instantiate: false});
register('Controls/searchGrid:SearchTreeItemDecorator', SearchTreeItemDecorator, {instantiate: false});
