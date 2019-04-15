import Control = require('Core/Control');
import template = require('wml!Controls/_search/Misspell/Container');


export = Control.extend({
   _template: template,

   _misspellClick: function () {
      this._notify('misspellCaptionClick', [], {bubbling: true});
   }
});

