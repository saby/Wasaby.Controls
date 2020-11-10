import { ListControl as viewTemplate, View as List } from 'Controls/list';
import viewName = require('Controls/_gridNew/GridView');
import { TemplateFunction } from 'UI/Base';

export default class Grid extends List {
    protected _viewName: TemplateFunction = viewName;
    protected _viewTemplate: TemplateFunction = viewTemplate;
    protected _supportNewModel: boolean = true;

    _getModelConstructor() {
        return 'Controls/display:GridCollection';
    }
}

Grid.getDefaultOptions = function() {
   return {
       stickyHeader: true,
       stickyColumnsCount: 1,
       rowSeparatorSize: null,
       columnSeparatorSize: null
   };
};
