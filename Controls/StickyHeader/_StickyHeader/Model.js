define('Controls/StickyHeader/_StickyHeader/Model',
   [
      'Core/IoC',
      'Core/core-simpleExtend'
   ],
   function(IoC, simpleExtend) {

      'use strict';

      /**
       * @extends Core/core-simpleExtend
       * @class Controls/StickyHeader/Model
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

      return simpleExtend.extend({

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

         get shouldBeFixed() {
            return this._shouldBeFixed;
         },

         /**
          * @param {Object} config
          * @param {Object} config.topTarget DOM element
          * @param {Object} config.bottomTarget DOM element
          */
         constructor: function(config) {
            this._intersection = {};
            this._topTarget = config.topTarget;
            this._bottomTarget = config.bottomTarget;
            this._updateStateIntersection = this._updateStateIntersection.bind(this);
         },

         update: function(entries) {
            entries.forEach(this._updateStateIntersection);

            this._shouldBeFixed = this._isFixed();
         },

         destroy: function() {
            this._updateStateIntersection = undefined;
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
            switch (entry.target) {
               case this._topTarget:
                  return 'top';
               case this._bottomTarget:
                  return 'bottom';
               default:
                  IoC.resolve('ILogger').error('Controls/StickyHeader/Model', 'Unexpected target');
                  return 'bottom';
            }
         },

         /**
          * Checks the content is fixed.
          * @returns {Boolean} Determines whether the content is fixed.
          * @private
          */
         _isFixed: function() {
            return this._intersection.bottom && !this._intersection.top;
         }
      });
   }
);
