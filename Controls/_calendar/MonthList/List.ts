import {View as List} from 'Controls/list';
import viewTemplate from 'Controls/_calendar/MonthList/ListControl';

/**
 * Plain list with custom item template. Can load data from data source.
 *
 * @class Controls/_calendar/MonthList/List
 * @extends Controls/List
 * @control
 * @author Миронов А.Ю.
 */

var ModuleControl = List.extend(/** @lends Controls/_calendar/MonthList/List.prototype */{
    _viewTemplate: viewTemplate
});

export default ModuleControl;
