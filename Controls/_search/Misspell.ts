import Control = require('Core/Control');
import template = require('wml!Controls/_search/Misspell');
import 'css!theme?Controls/search';
/*
* search misspell
* @class Controls/_search/Misspell
* @extends Core/Control
* @control
* @public
* @author Kraynov D.
*/
export = Control.extend({
   _template: template
});

