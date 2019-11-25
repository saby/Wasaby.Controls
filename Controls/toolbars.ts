/**
 * Библиотека, которая реализует <a href='/doc/platform/developmentapl/interface-development/controls/toolbar/'>набор команд</a> в виде кнопок и выпадающего меню с дополнительными командами.
 * @library Controls/toolbars
 * @includes View Controls/_toolbars/View
 * @includes ItemTemplate wml!Controls/_toolbars/ItemTemplate
 * @include IToolbarSource Controls/_toolbars/IToolbarSource
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
