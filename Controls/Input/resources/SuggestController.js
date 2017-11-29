/**
 * Created by am.gerasimov on 27.11.2017.
 */
define('js!Controls/Input/resources/SuggestController',
   [
      'Core/Abstract',
      'js!Controls/Input/resources/_SuggestController'
   ], function (Abstract, _SuggestController) {
   
   var SuggestController = Abstract.extend({
      
      constructor: function(options) {
         SuggestController.superclass.constructor.call(this, options);
         this._options = options;
         this.subscribeTo(options.textComponent, 'onChangeValue', _SuggestController.onChangeValueHandler.bind(this));
      },
      
      destroy: function() {
         SuggestController.superclass.destroy.call(this, arguments);
         if (this._searchController) {
            this._searchController.destroy();
            this._searchController = null;
         }
         this._options = null;
      }
      
   });
   
   return SuggestController;
   
});