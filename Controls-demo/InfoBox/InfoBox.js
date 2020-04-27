define('Controls-demo/InfoBox/InfoBox',
   [
      'Core/Control',
      'wml!Controls-demo/InfoBox/InfoBox',
      'css!Controls-demo/InfoBox/resources/Infobox',

      'Controls/popup'
   ],
   function(Control, template) {

      'use strict';

      return Control.extend({
         _template: template,
         _dblClickHandler: function() {
            var child = this._children.demandInfobox;
            child.open();
            setTimeout(child.close.bind(child), 5000);
         }
      });
   }
);
