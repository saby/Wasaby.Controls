define('Controls/Toggle/Radio', [
   'Core/Control',
   'Controls/Controllers/SourceController',
   'tmpl!Controls/Toggle/Radio/Radio',
   'tmpl!Controls/Toggle/Radio/resources/ItemTemplate',
   'css!Controls/Toggle/Radio/Radio'
], function(Control, SourceController, template, defaultItemTemplate) {

   /**
    * Group of radioButton.
    * @class Controls/Toggle/Radio
    * @extends Controls/Control
    * @control
    * @public
    * @category Toggle
    */

   /**
    * @name Controls/Toggle/Radio#source
    * @cfg {MemorySource} Data of radioButton.
    */

   /**
    * @name Controls/Toggle/Radio#direction
    * @cfg {string} Direction of RadioGroup.
    * @variant horizontal RadioGroup is a row of RadioButton.
    * @variant vertical RadioGroup is a column of RadioButton.
    */

   /**
    * @name Controls/Toggle/Radio#selectedKey
    * @cfg {String} Selected key. RadioButton with this key has selected state.
   */

   /**
    * @name Controls/Toggle/Radio#keyProperty
    * @cfg {String} Name of the field that will be the key.
    */

   /**
    * @name Controls/Toggle/Radio#captionTemplate
    * @cfg {Template} Template for caption.
    */

   /**
    * @name Controls/Toggle/Radio#itemContent
    * @cfg {Template} Template for item.
    */

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
      _defaultItemTemplate:  defaultItemTemplate,

      _beforeMount: function(options, context, receivedState) {
         if (receivedState) {
            this._items = receivedState;
         } else {
            return _private.initItems(options.source, this).addCallback(function(items) {
               this._items = items;
            }.bind(this));
         }
      },

      _beforeUpdate: function(newOptions) {
         var self = this;
         if (newOptions.source && newOptions.source !== this._options.source) {
            return _private.initItems(newOptions.source, this).addCallback(function(items) {
               this._items = items;
               self._forceUpdate();
            }.bind(this));
         }
      },

      selectKeyChanged: function(e, item, keyProperty) {
         if(!this._options.readOnly) {
            this._notify('onSelectedItemChange', item.get(keyProperty));
         }
      }
   });

   Radio._private = _private;

   return Radio;
});
