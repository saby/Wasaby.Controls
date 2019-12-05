import Control = require('Core/Control');
import template = require('wml!Controls/_suggestPopup/_ListWrapper');
import _SuggestOptionsField = require('Controls/_suggestPopup/_OptionsField');
import 'Controls/Container/Async';



      /**
       * Proxy container for suggest options.
       *
       * @class Controls/_suggestPopup/_ListWrapper
       * @extends Core/Control
       * @control
       * @private
       */

      export = Control.extend({

         _template: template,

         _getChildContext: function() {
            return {
               suggestOptionsField: new _SuggestOptionsField(this._options)
            };
         },

         _tabsSelectedKeyChanged: function(event, key) {
            this._notify('tabsSelectedKeyChanged', [key]);
         }
      });



