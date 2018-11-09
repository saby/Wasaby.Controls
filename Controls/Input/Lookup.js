define('Controls/Input/Lookup', ['Core/Control', 'wml!Controls/Input/Lookup/Lookup'], function(Control, template) {
   'use strict';

   /**
    * Input for selection from source.
    *
    * @class Controls/Input/Lookup
    * @mixes Controls/Input/interface/ISearch
    * @mixes Controls/interface/ISource
    * @mixes Controls/interface/IItemTemplate
    * @mixes Controls/interface/IFilter
    * @mixes Controls/Input/interface/ISuggest
    * @mixes Controls/Input/interface/ILookup
    * @mixes Controls/interface/INavigation
    * @mixes Controls/interface/IMultiSelectable
    * @mixes Controls/Input/interface/IInputPlaceholder
    * @mixes Controls/Input/interface/IInputText
    * @mixes Controls/Input/interface/IValidation
    * @control
    * @public
    * @author Капустин И.А.
    * @category Input
    */

   return Control.extend({
      _template: template,

      showSelector: function(templateOptions) {
         this._children.controller._showSelector(templateOptions);
      }
   });
});
