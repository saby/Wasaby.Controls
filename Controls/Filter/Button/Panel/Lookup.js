define('Controls/Filter/Button/Panel/Lookup', [
   'Core/Control',
   'wml!Controls/Filter/Button/Panel/Lookup/Lookup',
   'Controls/Utils/tmplNotify',
   'Env/Env',
   'css!theme?Controls/Filter/Button/Panel/Lookup/Lookup'
], function(Control, template, tmplNotify, Env) {
   /**
    * Control link with lookup
    * Here you can see <a href="/materials/demo-ws4-engine-selector-lookup">demo-example</a>.
    * @class Controls/Filter/Button/Panel/Lookup
    * @mixes Controls/interface/ISelectedCollection
    * @mixes Controls/interface/ISelectorDialog
    * @mixes Controls/Input/interface/ISearch
    * @mixes Controls/interface/ISource
    * @mixes Controls/interface/IItemTemplate
    * @mixes Controls/interface/IFilter
    * @mixes Controls/Input/interface/ISuggest
    * @mixes Controls/interface/ILookup
    * @mixes Controls/interface/INavigation
    * @mixes Controls/interface/IMultiSelectable
    * @mixes Controls/_input/interface/IInputPlaceholder
    * @mixes Controls/_input/interface/IInputText
    * @mixes Controls/Selector/Lookup/LookupStyles
    * @control
    * @public
    * @author Герасимов А.М.
    */

   /**
    * @name Controls/Filter/Button/Panel/Lookup#caption
    * @cfg {String} Caption
    */

   /**
    * @name Controls/Filter/Button/Panel/Lookup#lookupTemplateName
    * @cfg {String} Name of the control with same interface as Lookup.
    * @default Controls/Selector/Lookup
    * @example
    * <pre>
    *   <Controls.Filter.Button.Panel.Lookup lookupTempalteName="namePace/Lookup"/>
    * </pre>
    */

   'use strict';

   var Lookup = Control.extend({
      _template: template,
      _notifyHandler: tmplNotify,
      _passed: false,

      _afterUpdate: function(oldOptions) {
         // if the first items were selected, call resize for Lookup
         if (!oldOptions.selectedKeys.length && this._options.selectedKeys.length) {
            this._children.controlResize.start();
         }
      },

      showSelector: function() {
         if (typeof this._options.lookupTemplateName === 'string') {
            this._children.lookup.showSelector();
         } else {
            Env.IoC.resolve('ILogger').error('Option "Controls/Filter/Button/Panel/Lookup:lookupTemplateName" only supports string type');
         }
      },

      _selectedKeysChanged: function(event, keys) {
         this._passed = true;
         this._notify('selectedKeysChanged', [keys]);
      }
   });

   Lookup.getDefaultOptions = function() {
      return {
         lookupTemplateName: 'Controls/Selector/Lookup'
      };
   };

   return Lookup;
});
