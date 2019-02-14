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
                  fixedPosition: fixedHeaderData.fixedPosition,
                  prevPosition: fixedHeaderData.prevPosition,
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

         _stickyHeadersIds: null,
         _shadowVisible: false,

         _beforeMount: function(options, context, receivedState) {
            this._isStickySupport = stickyUtils.isStickySupport();
            this._index = stickyUtils.getNextId();
            this._stickyHeadersIds = {
               top: [],
               bottom: []
            };
         },

         _afterMount: function() {
            this._notify('register', ['updateStickyShadow', this, this._updateStickyShadow], {bubbling: true});
            this._notify('register', ['updateStickyHeight', this, this._updateStickyHeight], {bubbling: true});
            this._notify('stickyRegister', [this._index, true], { bubbling: true });
         },

         _beforeUnmount: function() {
            this._notify('unregister', ['updateStickyShadow', this], {bubbling: true});
            this._notify('unregister', ['updateStickyHeight', this], {bubbling: true});
            this._notify('stickyRegister', [this._index, false], { bubbling: true });
         },

         _fixedHandler: function(event, fixedHeaderData) {
            event.stopImmediatePropagation();
            if (!!fixedHeaderData.fixedPosition) {
               this._stickyHeadersIds[fixedHeaderData.fixedPosition].push(fixedHeaderData.id);
               if (this._shadowVisible === true) {
                  this._children.stickyHeaderShadow.start(this._stickyHeadersIds[fixedHeaderData.fixedPosition]);
               }
            } else if (!!fixedHeaderData.prevPosition && this._stickyHeadersIds[fixedHeaderData.prevPosition].indexOf(fixedHeaderData.id) > -1) {
               this._stickyHeadersIds[fixedHeaderData.prevPosition].splice(this._stickyHeadersIds[fixedHeaderData.prevPosition].indexOf(fixedHeaderData.id), 1);
            }

            if (!!fixedHeaderData.fixedPosition && !this._fixed) {
               this._fixed = true;
               _private._notifyFixed(this, fixedHeaderData);
            } else if (!fixedHeaderData.fixedPosition && this._fixed &&
                        this._stickyHeadersIds.top.length === 0 && this._stickyHeadersIds.bottom.length === 0) {
               this._fixed = false;
               _private._notifyFixed(this, fixedHeaderData);
            }
         },

         _updateStickyShadow: function(ids) {
            if (ids.indexOf(this._index) !== -1) {
               this._shadowVisible = true;

               this._children.stickyHeaderShadow.start(this._stickyHeadersIds.top.concat(this._stickyHeadersIds.bottom));
            }
         },

         _updateStickyHeight: function(height) {
            if (!this._fixed) {
               this._children.stickyHeaderHeight.start(height);
            }
         },

         _stickyRegisterHandler: function(event) {
            event.blockUpdate = true;
            event.stopImmediatePropagation();
         }
      });

      Component._private = _private;

      return Component;
   }
);
