/**
 * switchableArea library
 * @library Controls/switchableArea
 * @includes View Controls/_switchableArea/View
 * @includes itemTemplate wml!Controls/_switchableArea/resource/itemTemplate
 * @public
 * @author Kraynov D.
 */

import itemTemplate = require('wml!Controls/_switchableArea/resource/itemTemplate');
import ItemTpl from 'Controls/_switchableArea/ItemTpl';

export {default as View} from './_switchableArea/View';

export {
   itemTemplate,
   ItemTpl
};
