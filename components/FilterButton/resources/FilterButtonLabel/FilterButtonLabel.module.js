/**
 * Created by as.suhoruchkin on 21.04.2015.
 */
define('js!SBIS3.CONTROLS.FilterButtonLabel', [
   'js!SBIS3.CORE.CompoundControl',
   'html!SBIS3.CONTROLS.FilterButtonLabel',
   'js!SBIS3.CONTROLS.IconButton'
], function(CompoundControl, dotTplFn) {

   var FilterButtonLabel = CompoundControl.extend({
      _dotTplFn: dotTplFn,

      $protected: {
         _options: {
            caption: undefined,
            icon: 'sprite: icon-24 action-hover icon-Erase icon-error'
         }
      },
      init: function() {
         FilterButtonLabel.superclass.init.apply(this, arguments);
         var self = this;
         this.getChildControlByName('removeButton').subscribe('onActivated', function() {
            self.hide();
         });
      }
   });

   return FilterButtonLabel;

});