define('Controls/StickyHeader',
   [
      'Core/Control',
      'tmpl!Controls/StickyHeader/StickyHeader',

      'css!Controls/StickyHeader/StickyHeader'
   ],
   function(Control, template) {

      'use strict';

      var StickyHeader = Control.extend({
         _template: template,

         _shouldFixed: false,

         _isIntersecting: null,

         _beforeMount: function() {
            this._isIntersecting = {
               top: null,
               bottom: null
            };
            this._observeHandler = this._observeHandler.bind(this);
         },

         _afterMount: function() {
            var observer = new IntersectionObserver(this._observeHandler);

            observer.observe(this._children.observationTargetTop);
            observer.observe(this._children.observationTargetBottom);
         },

         _observeHandler: function(entries) {
            var self = this;
            var entryTop, entryBottom, isIntersectingTop, isIntersectingBottom, shouldFixed;

            entries.forEach(function(entry) {
               if (entry.target === self._children.observationTargetTop) {
                  entryTop = entry;
               }
               if (entry.target === self._children.observationTargetBottom) {
                  entryBottom = entry;
               }
            });

            if (entryTop) {
               isIntersectingTop = entryTop.isIntersecting;
               this._isIntersecting.top = entryTop.isIntersecting;
            } else {
               isIntersectingTop = this._isIntersecting.top;
            }

            if (entryBottom) {
               isIntersectingBottom = entryBottom.isIntersecting;
               this._isIntersecting.bottom = entryBottom.isIntersecting;
            } else {
               isIntersectingBottom = this._isIntersecting.bottom;
            }

            shouldFixed = isIntersectingBottom && !isIntersectingTop;

            if (shouldFixed !== this._shouldFixed) {
               this._notify('fixed', [shouldFixed, this._container.offsetHeight], {bubbling: true});
               this._shouldFixed = shouldFixed;
            }
         }
      });

      return StickyHeader;
   }
);
