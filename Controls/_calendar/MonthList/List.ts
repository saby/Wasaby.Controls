import {View as List} from 'Controls/list';
import 'wml!Controls/List/List';

import 'Core/Deferred';
import 'Controls/Utils/tmplNotify';


import 'Controls/_calendar/MonthList/ListControl'

/**
 * Plain list with custom item template. Can load data from data source.
 *
 * @class Controls/_calendar/MonthList/List
 * @extends Controls/List
 * @control
 * @author Миронов А.Ю.
 */

var ModuleControl = List.extend(/** @lends Controls/_calendar/MonthList/List.prototype */{
    _viewTemplate: 'Controls/_calendar/MonthList/ListControl'
});

export default ModuleControl;
