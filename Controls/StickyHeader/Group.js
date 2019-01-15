define('Controls/StickyHeader/Group',
   [
      'Core/Control',
      'Controls/StickyHeader/Utils',
      'wml!Controls/StickyHeader/Group',
   ],
   function(Control, stickyUtils, template) {

      'use strict';

      /**
       * Allows you to combine sticky headers with the same behavior. It is necessary if you need to make
       * several headers fixed at the same level, which should simultaneously stick and stick out.
       * Behaves like one fixed header.
       *
       * @extends Core/Control
       * @class Controls/StickyHeader/Group
       * @author Миронов А.Ю.
       */

      /**
       * @name Controls/StickyHeader/Group#content
       * @cfg {Function} Content in which several fixed headers are inserted.
       */

      /**
       * @event Controls/StickyHeader/Group#fixed Change the fixation state.
       * @param {Core/vdom/Synchronizer/resources/SyntheticEvent} event Event descriptor.
       * @param {Controls/StickyHeader/Types/InformationFixationEvent.typedef} information Information about the fixation event.
       */

      var _private = {
         _notifyFixed: function(self, fixedHeaderData) {
            self._notify(
               'fixed',
               [{
                  id: self._index,
                  offsetHeight: fixedHeaderData.offsetHeight,
                  shouldBeFixed: fixedHeaderData.shouldBeFixed,
                  mode: fixedHeaderData.mode
               }],
               { bubbling: true }
            );
         }
      };

      var Component = Control.extend({

         _template: template,
         _index: null,
         _isStickySupport: null,

         _fixed: null,

         _stickyHeaderIds: null,
         _shadowVisible: false,

         _beforeMount: function(options, context, receivedState) {
            this._isStickySupport = stickyUtils.isStickySupport();
            this._index = stickyUtils.getNextId();
            this._stickyHeaderIds = [];
         },

         _fixedHandler: function(event, fixedHeaderData) {
            event.stopImmediatePropagation();
            if (fixedHeaderData.shouldBeFixed) {
               this._stickyHeaderIds.push(fixedHeaderData.id);
               if (this._shadowVisible === true) {
                  this._children.stickyHeaderShadow.start(this._stickyHeaderIds);
               }
            } else if (this._stickyHeaderIds.indexOf(fixedHeaderData.id) > -1) {
               this._stickyHeaderIds.splice(this._stickyHeaderIds.indexOf(fixedHeaderData.id), 1);
            }

            if (fixedHeaderData.shouldBeFixed && !this._fixed) {
               this._fixed = true;
               _private._notifyFixed(this, fixedHeaderData);
            } else if (!fixedHeaderData.shouldBeFixed && this._fixed) {
               this._fixed = false;
               _private._notifyFixed(this, fixedHeaderData);
            }
         },

         _updateStickyShadow: function(e, ids) {
            if (ids.indexOf(this._index) !== -1) {
               this._shadowVisible = true;
               this._children.stickyHeaderShadow.start(this._stickyHeaderIds);
            }
         },

         _updateStickyHeight: function(e, height) {
            if (!this._fixed) {
               this._children.updateStickyHeight.start(height);
            }
         }
      });

      Component._private = _private;

      return Component;
   }
);
