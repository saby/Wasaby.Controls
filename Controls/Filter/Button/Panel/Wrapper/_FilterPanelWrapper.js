define('Controls/Filter/Button/Panel/Wrapper/_FilterPanelWrapper',
   [
      'Core/Control',
      'tmpl!Controls/Filter/Button/Panel/Wrapper/_FilterPanelWrapper',
      'Controls/Filter/Button/Panel/Wrapper/_FilterPanelOptions'
   ],

   function(Control, template, _FilterPanelWrapper) {

      'use strict';

      /**
       * Proxy container for filter panel options.
       *
       * @class Controls/Filter/Button/Panel/Wrapper/_FilterPanelWrapper
       * @extends Core/Control
       * @control
       */

      return Control.extend({

         _template: template,

         _getChildContext: function() {
            return {
               filterPanelOptionsField: new _FilterPanelWrapper(this._options)
            };
         }
      });

   });

