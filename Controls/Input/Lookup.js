define('Controls/Input/Lookup', ['Core/Control', 'wml!Controls/Input/Lookup/Lookup'], function(Control, template) {
   return Control.extend({
      _template: template,

      showSelector: function(templateOptions) {
         this._children._lookup._showSelector(templateOptions);
      }
   });
});
