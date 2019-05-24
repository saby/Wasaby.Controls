import Control = require('Core/Control');
import template = require('wml!Controls/_list/HotKeysRegistrator');

/**
 * @class Controls/_list/HotKeysRegistrator
 * @extends Core/Control
 * @author Шипин А.А.
 * @private
 */

var HotKeysRegistrator = Control.extend(/** @lends Controls/_list/HotKeysRegistrator.prototype */{
    _template: template
});

export = HotKeysRegistrator;
