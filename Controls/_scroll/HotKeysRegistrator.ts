import Control = require('Core/Control');
import template = require('wml!Controls/_scroll/HotKeysRegistrator');

/**
 * @class Controls/_scroll/HotKeysRegistrator
 * @extends Core/Control
 * @author Шипин А.А.
 * @private
 */

var HotKeysRegistrator = Control.extend(/** @lends Controls/_scroll/HotKeysRegistrator.prototype */{
    _template: template
});

export = HotKeysRegistrator;
