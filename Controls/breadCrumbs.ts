import ItemTemplate = require('wml!Controls/_breadCrumbs/View/resources/itemTemplate');
import BC_menuItemTemplate = require('wml!Controls/_breadCrumbs/resources/menuItemTemplate');
import BC_menuContentTemplate = require('wml!Controls/_breadCrumbs/resources/menuContentTemplate');

export {default as Path} from './_breadCrumbs/Path';
export {default as View} from './_breadCrumbs/View';
export {default as HeadingPath} from './_breadCrumbs/HeadingPath';
export {ItemTemplate};

// Для обратной совместимости
export {BC_menuItemTemplate}
export {BC_menuContentTemplate}