define('Controls/Filter/Button/Panel/Lookup', [
   'Core/Control',
   'wml!Controls/Filter/Button/Panel/Lookup/Lookup',
   'Controls/Utils/tmplNotify',
   'css!theme?Controls/Filter/Button/Panel/Lookup/Lookup'
], function(Control, template, tmplNotify) {
   /**
    * Control link with lookup
    * Here you can see <a href="/materials/demo-ws4-engine-selector-lookup">demo-example</a>.
    * @class Controls/Filter/Button/Panel/Lookup
    * @mixes Controls/interface/ISelectedCollection
    * @mixes Controls/Input/interface/ISearch
    * @mixes Controls/interface/ISource
    * @mixes Controls/interface/IItemTemplate
    * @mixes Controls/interface/IFilter
    * @mixes Controls/Input/interface/ISuggest
    * @mixes Controls/interface/ILookup
    * @mixes Controls/interface/INavigation
    * @mixes Controls/interface/IMultiSelectable
    * @mixes Controls/Input/interface/IInputPlaceholder
    * @mixes Controls/Input/interface/IInputText
    * @mixes Controls/Selector/Lookup/LookupStyles
    * @control
    * @public
    * @author Герасимов А.М.
    */

   /**
    * @name Controls/Filter/Button/Panel/Lookup#caption
    * @cfg {Object} Caption
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
         this._children.lookup.showSelector();
      },

      selectedKeysChanged: function(event, keys) {
         this._passed = true;
         this._notify('selectedKeysChanged', [keys]);
      }
   });

   return Lookup;
});
