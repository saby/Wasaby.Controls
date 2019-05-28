import Control = require('Core/Control');
import template = require('wml!Controls/_list/KeyHook');

/**
 * @class Controls/_list/KeyHook
 * @extends Core/Control
 * @author Шипин А.А.
 * @private
 */

var KeyHook = Control.extend(/** @lends Controls/_list/KeyHook.prototype */{
    _template: template
});

export = KeyHook;
