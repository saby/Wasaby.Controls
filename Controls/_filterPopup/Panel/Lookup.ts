import Control = require('Core/Control');
import template = require('wml!Controls/_filterPopup/Panel/Lookup/Lookup');
import tmplNotify = require('Controls/Utils/tmplNotify');
import Env = require('Env/Env');
import 'css!theme?Controls/filterPopup';
   /**
    * Control link with lookup
    * Here you can see <a href="/materials/demo-ws4-engine-selector-lookup">demo-example</a>.
    * @class Controls/_filterPopup/Panel/Lookup
    * @mixes Controls/interface/ISelectedCollection
    * @mixes Controls/interface/ISelectorDialog
    * @mixes Controls/interface/ISearch
    * @mixes Controls/interface/ISource
    * @mixes Controls/interface/IItemTemplate
    * @mixes Controls/interface/IFilter
    * @mixes Controls/interface/ISuggest
    * @mixes Controls/interface/ILookup
    * @mixes Controls/interface/INavigation
    * @mixes Controls/interface/IMultiSelectable
    * @mixes Controls/interface/IInputPlaceholder
    * @mixes Controls/interface/IInputText
    * @mixes Controls/Selector/Lookup/LookupStyles
    * @control
    * @public
    * @author Герасимов А.М.
    */

   /**
    * @name Controls/_filterPopup/Panel/Lookup#caption
    * @cfg {String} Caption
    */

   /**
    * @name Controls/_filterPopup/Panel/Lookup#lookupTemplateName
    * @cfg {String} Name of the control with same interface as Lookup.
    * @default Controls/Selector/Lookup
    * @example
    * <pre>
    *   <Controls._filterPopup.Panel.Lookup lookupTempalteName="namePace/Lookup"/>
    * </pre>
    */



   var _private = {
      getLookup: function(self) {
         if (typeof self._options.lookupTemplateName === 'string') {
            return self._children.lookup;
         } else {
            Env.IoC.resolve('ILogger').error('Option "Controls/_filterPopup/Panel/Lookup:lookupTemplateName" only supports string type');
         }
      }
   };

   var Lookup = Control.extend({
      _template: template,
      _notifyHandler: tmplNotify,
      _passed: false,

      _afterUpdate: function(oldOptions) {
         var lookup = _private.getLookup(this);

         // if the first items were selected, call resize for Lookup
         if (!oldOptions.selectedKeys.length && this._options.selectedKeys.length) {
            this._children.controlResize.start();
            lookup && lookup.activate();
         }
      },

      showSelector: function() {
         var lookup = _private.getLookup(this);

         lookup && lookup.showSelector();
      },

      _selectedKeysChanged: function(event, keys) {
         this._passed = true;
         this._notify('selectedKeysChanged', [keys]);
      }
   });

   Lookup._private = _private;
   Lookup.getDefaultOptions = function() {
      return {
         lookupTemplateName: 'Controls/Selector/Lookup'
      };
   };

   export = Lookup;

