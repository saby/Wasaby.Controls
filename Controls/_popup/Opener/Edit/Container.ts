/**
 * Created by as.krasilnikov on 10.09.2018.
 */
import Control = require('Core/Control');
import template = require('wml!Controls/_popup/Opener/Edit/Container');
import ContextOptions = require('Controls/Container/Data/ContextOptions');
      /**
       * edit container
       * @class Controls/_popup/Opener/Edit/Container
       * @control
       * @category Popup
       * @extends Core/Control
       */
      var Container = Control.extend({
         _template: template,

         _beforeMount: function(options, context) {
            if (context.dataOptions.items) {
               this._items = context.dataOptions.items;
            }
         },
         _beforeUpdate: function(options, context) {
            if (context.dataOptions.items) {
               this._items = context.dataOptions.items;
            }
         }
      });

      Container.contextTypes = function() {
         return {
            dataOptions: ContextOptions
         };
      };

      export = Container;
   
