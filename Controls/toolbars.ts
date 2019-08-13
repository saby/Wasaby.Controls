/**
 * Библиотека тулбара.
 * @library Controls/toolbars
 * @includes View Controls/_toolbars/View
 * @includes ItemTemplate wml!Controls/_toolbars/ItemTemplate
 * @public
 * @author Красильников А.С.
 */

/*
 * Toolbars library
 * @library Controls/toolbars
 * @includes View Controls/_toolbars/View
 * @includes ItemTemplate wml!Controls/_toolbars/ItemTemplate
 * @public
 * @author Красильников А.С.
 */ 
import ItemTemplate = require('wml!Controls/_toolbars/ItemTemplate');

export {default as View} from './_toolbars/View';
export {ItemTemplate};
