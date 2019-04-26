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
         _value: 'Text',
         _clickHandler: function() {
            this._notify('sendResult', [this._value], {bubbling: true});
         }
      });

      return TestDialog;
   }
);
