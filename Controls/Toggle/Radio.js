define('Controls/Toggle/Radio', [
   'Core/Control',
   'Controls/Controllers/SourceController',
   'tmpl!Controls/Toggle/Radio/Radio',
   'WS.Data/Type/descriptor',
   'css!Controls/Toggle/Radio/Radio'
], function(Control, SourceController, template, types) {

   var _private = {
      initItems: function(source, self) {
         self._sourceController = new SourceController({
            source: source
         });
         return self._sourceController.load().addCallback(function (items) {
            return items;
         });
      }
   };

   var Radio = Control.extend({
      _template: template,

      _beforeMount: function(options) {
         if (options.source) {
            return _private.initItems(options.source, this).addCallback(function(items) {
               this._items = items;
            }.bind(this));
         }
      },

      ItemClass: function(item, items) {
         if (item === items.at(items.getCount()-1)){
            if (item  === items.at(0)){
               return "controls-RadioGroup_first-and-last";
            } else {
               return "controls-RadioGroup_last";
            }
         }
         if (item  === items.at(0)){
            return "controls-RadioGroup_first";
         }
         return "controls-RadioGroup_default";
      }
   });

   Radio._private= _private;

   return Radio;
});