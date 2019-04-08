define('Controls/Selector/Lookup', ['Core/Control', 'wml!Controls/Selector/Lookup/Lookup', 'Env/Env'], function(Control, template, Env) {
   'use strict';

   /**
    * The Lookup control allows you to select a value from a dialog or suggest containing a list of possible values.
    * Сan be displayed in single-line and multi-line mode.
    * Supports single and multiple selection.
    * Here you can see <a href="/materials/demo-ws4-engine-selector-lookup">demo-example</a>.
    *
    * @class Controls/Selector/Lookup
    * @mixes Controls/interface/ISelectedCollection
    * @mixes Controls/interface/ISelectorDialog
    * @mixes Controls/Input/interface/ISearch
    * @mixes Controls/interface/ISource
    * @mixes Controls/interface/IFilter
    * @mixes Controls/Input/interface/ISuggest
    * @mixes Controls/interface/ILookup
    * @mixes Controls/interface/INavigation
    * @mixes Controls/interface/IMultiSelectable
    * @mixes Controls/Input/interface/IInputPlaceholder
    * @mixes Controls/Input/interface/IInputField
    * @mixes Controls/Selector/Lookup/LookupStyles
    * @control
    * @public
    * @author Капустин И.А.
    * @category Input
    * @demo Controls-demo/Input/Lookup/LookupPropertyGrid
    */

   return Control.extend({
      _template: template,

      _beforeMount: function(options) {
         if (options.lookupTemplate) {
            Env.IoC.resolve('ILogger').warn('Option "Controls/Selector/Lookup:lookupTemplate" renamed and will be deleted in 3.19.100, use "Controls/Selector/Lookup:selectorTemplate"');
         }
      },

      showSelector: function(templateOptions) {
         this._children.controller.showSelector(templateOptions);
      }
   });
});
