define('Controls/Selector/Lookup', ['Core/Control', 'wml!Controls/Selector/Lookup/Lookup', 'Core/IoC'], function(Control, template, IoC) {
   'use strict';

   /**
    * Input for selection from source.
    *
    * @class Controls/Selector/Lookup
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
    * @author Капустин И.А.
    * @category Input
    * @demo Controls-demo/Input/Lookup/LookupPropertyGrid
    */

   return Control.extend({
      _template: template,

      _beforeMount: function(options) {
         if (options.lookupTemplate) {
            IoC.resolve('ILogger').warn('Option "Controls/Selector/Lookup:lookupTemplate" renamed and will be deleted in 3.19.100, use "Controls/Selector/Lookup:selectorTemplate"');
         }
      },

      showSelector: function(templateOptions) {
         this._children.controller.showSelector(templateOptions);
      }
   });
});
