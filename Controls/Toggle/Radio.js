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
         return self._sourceController.load().addCallback(function(items) {
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

      prepareItemClass: function(item, items, options) {
         if (item  === items.at(0)) {
            return 'controls-RadioGroup_first';
         }
         return 'controls-RadioGroup_default_' + (options.direction === 'horizontal' ? 'horizontal' : 'vertical');
      },

      prepareItemCaptionClass: function(options) {
         var captionClass = 'controls-RadioItem__caption' + (options.size === 'l' ? '_size-l': '_size-m') + ' controls-RadioItem__caption';
         if (options.selected) {
            captionClass+= '_selected';
            if (options.size === 'm') {
               captionClass+= '_size-m';
            } else {
               captionClass+= '_size-l';
            }
         } else {
            captionClass+= '_unselected';
            if (options.readOnly) {
               captionClass+= '_disabled';
            } else {
               captionClass+= '_enabled';
            }
         }
         return captionClass;
      },

      selectKeyChanged: function(e, item, keyProperty) {
         this._notify('selectKeyChange', item.get(keyProperty));
      }
   });

   Radio._private= _private;

   return Radio;
});