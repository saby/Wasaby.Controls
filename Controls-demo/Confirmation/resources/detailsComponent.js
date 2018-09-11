/**
 * Created by as.krasilnikov on 22.06.2018.
 */
define('Controls-demo/Confirmation/resources/detailsComponent',
   [
      'Core/Control',
      'wml!Controls-demo/Confirmation/resources/detailsComponent'
   ],
   function(Control, template) {
      'use strict';

      var TestDialog = Control.extend({
         _template: template,
         _clickHandler: function() {
            this._notify('sendResult', ['click by TextBox'], {bubbling: true});
         }
      });

      return TestDialog;
   }
);
