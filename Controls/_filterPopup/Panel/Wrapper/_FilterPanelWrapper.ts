import Control = require('Core/Control');
import template = require('wml!Controls/_filterPopup/Panel/Wrapper/_FilterPanelWrapper');
import _FilterPanelWrapper = require('Controls/_filterPopup/Panel/Wrapper/_FilterPanelOptions');



      /**
       * Proxy container for filter panel options.
       *
       * @class Controls/_filterPopup/Panel/Wrapper/_FilterPanelWrapper
       * @extends Core/Control
       * @control
       * @private
       */

      export = Control.extend({

         _template: template,

         _getChildContext: function() {
            return {
               filterPanelOptionsField: new _FilterPanelWrapper(this._options)
            };
         }
      });



