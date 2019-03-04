define('Controls-demo/Popup/Edit/OpenerPreviewer',
   [
      'Core/Control',
      'wml!Controls-demo/Popup/Edit/OpenerPreviewer'
   ],
   function(Control, template) {
      'use strict';

      var OpenerPreviewer = Control.extend({
         _template: template
      });

      return OpenerPreviewer;
   });
