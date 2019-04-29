import Deferred = require('Core/Deferred');
import ManagerController = require('Controls/_popup/Manager/ManagerController');
import StickyController = require('Controls/_popup/Opener/Sticky/StickyController');
import 'css!theme?Controls/popup';


      var PreviewerController = StickyController.constructor.extend({
         _openedPopupId: null,

         _destroyDeferred: {},

         elementCreated: function(element, container, id) {
            /**
             * Only one window can be opened.
             */
            if (this._openedPopupId) {
               ManagerController.remove(this._openedPopupId);
            }
            this._openedPopupId = id;

            return PreviewerController.superclass.elementCreated.apply(this, arguments);
         },

         elementDestroyed: function(item) {
            if (item.id === this._openedPopupId) {
               this._openedPopupId = null;
            }

            this._destroyDeferred[item.id] = new Deferred();

            item.popupOptions.className = (item.popupOptions.className || '') + ' controls-PreviewerController_close';

            return this._destroyDeferred[item.id];
         },

         elementAnimated: function(item) {
            if (this._destroyDeferred[item.id]) {
               this._destroyDeferred[item.id].callback();
               delete this._destroyDeferred[item.id];
            }
         },
         needRestoreFocus: function() {
            return false;
         }
      });

      export = new PreviewerController();

