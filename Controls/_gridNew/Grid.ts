import { ListControl as viewTemplate, View as List } from 'Controls/list';
import * as GridView from 'Controls/_gridNew/GridView';
import * as GridViewTable from 'Controls/_gridNew/GridViewTable';
import { isFullGridSupport } from 'Controls/display';

export default class Grid extends List {
    _viewName = null;
    _viewTemplate = viewTemplate;
    protected _supportNewModel: boolean = true;

    _beforeMount(options): Promise<void> {
        const superResult = super._beforeMount(options);
        this._viewName = isFullGridSupport() ? GridView : GridViewTable;
        return superResult;
    }

    _getModelConstructor() {
        return 'Controls/display:GridCollection';
    }
}

Grid.getDefaultOptions = function() {
   return {
       stickyHeader: true,
       stickyColumnsCount: 1,
       rowSeparatorSize: null,
       columnSeparatorSize: null,
       isFullGridSupport: isFullGridSupport()
   };
};
