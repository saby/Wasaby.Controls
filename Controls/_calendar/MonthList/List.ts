import {View as List} from 'Controls/list';
import ListControl from 'Controls/_calendar/MonthList/ListControl';

/**
 * Plain list with custom item template. Can load data from data source.
 *
 * @class Controls/_calendar/MonthList/List
 * @extends Controls/List
 * @control
 * @author Миронов А.Ю.
 */

const ModuleControl = List.extend(/** @lends Controls/_calendar/MonthList/List.prototype */{
    _viewTemplate: ListControl
});

export default ModuleControl;
