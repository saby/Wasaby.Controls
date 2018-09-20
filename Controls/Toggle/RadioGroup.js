define('Controls/Toggle/RadioGroup', [
   'Core/Control',
   'Controls/Controllers/SourceController',
   'wml!Controls/Toggle/RadioGroup/RadioGroup',
   'wml!Controls/Toggle/RadioGroup/resources/ItemTemplate',
   'css!Controls/Toggle/RadioGroup/RadioGroup',
   'css!Controls/Toggle/resources/SwitchCircle/SwitchCircle'
], function(Control, SourceController, template, defaultItemTemplate) {

   /**
    * Controls are designed to give users a choice among two or more settings.
    *
    * <a href="/materials/demo-ws4-switchers">Demo-example</a>.
    *
    * @class Controls/Toggle/RadioGroup
    * @extends Core/Control
    * @mixes Controls/interface/ISource
    * @mixes Controls/interface/IItemTemplate
    * @mixes Controls/interface/ISingleSelectable
    * @control
    * @public
    * @author Михайловский Д.С.
    * @category Toggle
    * @demo Controls-demo/RadioGroup/RadioGroupDemo
    *
    * @mixes Controls/Toggle/resources/SwitchCircle/SwitchCircleStyles
    * @mixes Controls/Toggle/RadioGroup/RadioGroupStyles
    */

   /**
    * @name Controls/Toggle/RadioGroup#direction
    * @cfg {string} Arrangement of elements in the container.
    * @variant horizontal Elements are located one after another.
    * @variant vertical Elements are located one after another.
    * @default Horizontal
    * @remark It's only displaying option, it's only regulates the location of the control.
    * @example
    * Vertical orientation.
    * <pre>
    *    <Controls.Toggle.RadioGroup direction="horizontal"/>
    * </pre>
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
      _defaultItemTemplate: defaultItemTemplate,

      _beforeMount: function(options, context, receivedState) {
         if (receivedState) {
            this._items = receivedState;
         } else {
            return _private.initItems(options.source, this).addCallback(function(items) {
               this._items = items;
               return items;
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

      _selectKeyChanged: function(e, item, keyProperty) {
         if (!this._options.readOnly) {
            this._notify('selectedKeyChanged', [item.get(keyProperty)]);
         }
      }
   });

   Radio.getDefaultOptions = function getDefaultOptions() {
      return {
         direction: 'vertical'
      };
   };

   Radio._private = _private;

   return Radio;
});
