import Control = require('Core/Control');
import template = require('wml!Controls/_scroll/KeyHook');

/**
 * @class Controls/_scroll/KeyHook
 * @extends Core/Control
 * @author Шипин А.А.
 * @private
 */

var KeyHook = Control.extend(/** @lends Controls/_scroll/KeyHook.prototype */{
    _template: template
});

export = KeyHook;
