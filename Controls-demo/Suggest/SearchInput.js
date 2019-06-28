define('Controls-demo/Suggest/SearchInput', [
   'Controls-demo/Suggest/Suggest',
   'wml!Controls-demo/Suggest/SearchInput'
], function(Suggest, template) {

   'use strict';

   var VDomSuggest = Suggest.extend({
      _template: template,
      _suggestValue: '',
      _suggestTabsValue: '',
      _suggestWithButtonValue: '',
      _suggestState: false,
      _suggestTabsState: false,
      _suggestWithButtonState: false,

      _clickSearchButton: function() {
         this._children.searhSuggestWithButton.activate();
      }
   });

   return VDomSuggest;
});