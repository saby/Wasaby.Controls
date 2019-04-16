import Control = require('Core/Control');
import template = require('wml!Controls/Filter/Button/Panel/Wrapper/_FilterPanelWrapper');
import _FilterPanelWrapper = require('Controls/Filter/Button/Panel/Wrapper/_FilterPanelOptions');

      

      /**
       * Proxy container for filter panel options.
       *
       * @class Controls/Filter/Button/Panel/Wrapper/_FilterPanelWrapper
       * @extends Core/Control
       * @control
       */

      export = Control.extend({

         _template: template,

         _getChildContext: function() {
            return {
               filterPanelOptionsField: new _FilterPanelWrapper(this._options)
            };
         }
      });

   

