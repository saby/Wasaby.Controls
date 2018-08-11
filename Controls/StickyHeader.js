define('Controls/StickyHeader',
   [
      'Core/Control',
      'Core/detection',
      'Controls/StickyHeader/Context',
      'Controls/Utils/IntersectionObserver',
      'tmpl!Controls/StickyHeader/StickyHeader',

      'css!Controls/StickyHeader/StickyHeader'
   ],
   function(Control, detection, StickyHeaderContext, IntersectionObserver, template) {

      'use strict';

      /**
       * Ensures that content sticks to the top of the parent container when scrolling down.
       * Occurs at the moment of intersection of the upper part of the content and the parent container.
       *
       *
       * @public
       * @extends Core/Control
       * @class Controls/StickyHeader
       */

      /**
       * @name Controls/StickyHeader#content
       * @cfg {Function} Sticky header content.
       */

      /**
       * @event Controls/StickyHeader#fixed Change the fixation state.
       * @param {SyntheticEvent} event Event descriptor.
       * @param {Controls/StickyHeader/Types/InformationFixationEvent.typedef} information Information about the fixation event.
       */

      /**
       * @typedef {Object} Intersection
       * @property {Boolean} top Determines whether the upper boundary of content is crossed.
       * @property {Boolean} bottom Determines whether the lower boundary of content is crossed.
       */

      /**
       * typedef {String} TrackedTarget
       * @variant top Top target.
       * @variant bottom Bottom target.
       */
      
      var StickyHeader = Control.extend({

         /**
          * @type {Function} Component display template.
          * @private
          */
         _template: template,

         /**
          * @type {Intersection|null} Determines whether the boundaries of content crossed.
          * @private
          */
         _intersection: null,

         /**
          * type {Boolean} Determines whether the content is fixed.
          * @private
          */
         _shouldBeFixed: false,

         /**
          * type {Boolean} Determines whether the component is built on the Android mobile platform.
          * @private
          */
         _shouldBeMobileAndroid: detection.isMobileAndroid,

         constructor: function() {
            StickyHeader.superclass.constructor.call(this);
            this._intersection = {};
            this._observeHandler = this._observeHandler.bind(this);
            this._updateStateIntersection = this._updateStateIntersection.bind(this);
         },

         _afterMount: function() {
            var children = this._children;
            var observer = new IntersectionObserver(this._observeHandler);

            observer.observe(children.observationTargetTop);
            observer.observe(children.observationTargetBottom);
         },

         /**
          * Handles changes to the visibility of the target object of observation at the intersection of the root container.
          * @param {IntersectionObserverEntry[]} entries The intersections between the target element and its root container at a specific moment of transition.
          * @private
          */
         _observeHandler: function(entries) {
            entries.forEach(this._updateStateIntersection);

            var shouldBeFixed = this._isFixed();

            if (this._shouldBeFixed !== shouldBeFixed) {
               this._updateOnFixation(shouldBeFixed);
            }
         },

         /**
          * @param {IntersectionObserverEntry} entry
          * @private
          */
         _updateStateIntersection: function(entry) {
            var target = this._getTarget(entry);

            this._intersection[target] = entry.isIntersecting;
         },

         /**
          * Get the name of the intersection target.
          * @param {IntersectionObserverEntry} entry The intersection between the target element and its root container at a specific moment of transition.
          * @returns {TrackedTarget} The name of the intersection target.
          * @private
          */
         _getTarget: function(entry) {
            return this._children.observationTargetTop === entry.target ? 'top' : 'bottom';
         },

         /**
          * To inform descendants about the fixing status. To update the state of the instance.
          * @param {Boolean} shouldBeFixed Determines whether the content is fixed.
          * @private
          */
         _updateOnFixation: function(shouldBeFixed) {
            var information = {
               id: this.getId(),
               shouldBeFixed: shouldBeFixed
            };

            this._forceUpdate();
            this._shouldBeFixed = shouldBeFixed;
            this._notify('fixed', [information], {bubbling: true});
         },

         /**
          * Determines the content is fixed.
          * @returns {Boolean} Determines whether the content is fixed.
          * @private
          */
         _isFixed: function() {
            return this._intersection.bottom && !this._intersection.top;
         }
      });

      StickyHeader.contextTypes = function() {
         return {
            stickyHeader: StickyHeaderContext
         };
      };

      return StickyHeader;
   }
);
