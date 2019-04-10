define('Controls/Search/Misspell/Container',
   [
      'Core/Control',
      'wml!Controls/Search/Misspell/Container',
   ],
   
   function(Control, template) {
      
      'use strict';
      
      return Control.extend({
         _template: template,
   
         _misspellClick: function() {
            this._notify('misspellCaptionClick', [], {bubbling: true});
         }
      });
   });
