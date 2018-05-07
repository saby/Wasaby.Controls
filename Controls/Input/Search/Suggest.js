define('Controls/Input/Search/Suggest',
   [
      'Core/Control',
      'tmpl!Controls/Input/Search/Suggest',
      'Controls/Input/Search'
   ],
   function(Control, template) {
      
      'use strict';
      
      var Suggest = Control.extend({
         
         _template: template,
         _suggestState: false,
         
         _changeValueHandler: function(event, value) {
            this._notify('valueChanged', [value]);
         },
         
         _choose: function(event, item) {
            this.activate();
            this._notify('choose', [item]);
            this._notify('valueChanged', [item.get(this._options.displayProperty)]);
         },
   
         _resetClick: function() {
            this._suggestState = false;
         }
         
      });
      
      return Suggest;
   }
);
