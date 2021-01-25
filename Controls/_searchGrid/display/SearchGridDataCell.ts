import { Model } from 'Types/entity';
import { TreeGridDataCell } from 'Controls/treeGridNew';

export default class SearchGridDataCell<S extends Model> extends TreeGridDataCell<S> {

}

Object.assign(SearchGridDataCell.prototype, {
   '[Controls/searchGrid:SearchGridDataCell]': true,
   _moduleName: 'Controls/searchGrid:SearchGridDataCell',
   _instancePrefix: 'search-grid-data-cell-'
});
