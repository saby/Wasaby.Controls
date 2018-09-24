/**
 * Created by as.krasilnikov on 10.09.2018.
 */
define('Controls/Popup/Opener/Edit/Container',
   [
      'Core/Control',
      'wml!Controls/Popup/Opener/Edit/Container',
      'Controls/Container/Data/ContextOptions'
   ],
   function(Control, template, ContextOptions) {
      /**
       * edit container
       * @class Controls/Popup/Opener/Edit/Container
       * @control
       * @author Красильников А.С.
       * @category Popup
       * @extends Core/Control
       */
      var Container = Control.extend({
         _template: template,

         _beforeMount: function(options, context) {
            this._items = context.dataOptions.items;
         }
      });

      Container.contextTypes = function() {
         return {
            dataOptions: ContextOptions
         };
      };

      return Container;
   });
