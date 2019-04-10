define('Controls/Selector/Opener',
   [
      'Core/Control',
      'tmpl!Controls/Selector/Opener'
   ],

   function(Control, template) {
      /**
       * Component that opens the popup with list, to the right of content area at the full height of the screen, from which you can select a value. {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/layout-selector-stack/ See more}.
       *
       * Here you can see <a href="/materials/demo-ws4-engine-selector-browser">demo-example</a>.
       *
       * @class Controls/Selector/Opener
       * @control
       * @extends Controls/Popup/Opener/Stack
       * @public
       * @author Герасимов А.М.
       */

      'use strict';

      var _private = {

      };

      var SelectorOpener = Control.extend({

         _template: template,

         open: function(cfg) {
            return this._children.stackOpener.open(cfg || {});
         },

         close: function() {
            return this._children.stackOpener.close();
         }

      });

      SelectorOpener._private = _private;

      return SelectorOpener;

   });
