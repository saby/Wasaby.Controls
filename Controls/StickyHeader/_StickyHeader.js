define('Controls/StickyHeader/_StickyHeader',
   [
      'Core/Control',
      'Core/detection',
      'Controls/StickyHeader/Context',
      'Controls/StickyHeader/Utils',
      'Controls/Utils/IntersectionObserver',
      'Controls/StickyHeader/_StickyHeader/Model',
      'wml!Controls/StickyHeader/_StickyHeader/StickyHeader',

      'css!theme?Controls/StickyHeader/_StickyHeader/StickyHeader'
   ],
   function(Control, detection, Context, stickyUtils, IntersectionObserver, Model, template) {

      'use strict';

      /**
       * Ensures that content sticks to the top of the parent container when scrolling down.
       * Occurs at the moment of intersection of the upper part of the content and the parent container.
       *
       * @private
       * @extends Core/Control
       * @class Controls/StickyHeader
       */

      /**
       * @name Controls/StickyHeader#content
       * @cfg {Function} Sticky header content.
       */

      /**
       * @event Controls/StickyHeader#fixed Change the fixation state.
       * @param {Core/vdom/Synchronizer/resources/SyntheticEvent} event Event descriptor.
       * @param {Controls/StickyHeader/Types/InformationFixationEvent.typedef} information Information about the fixation event.
       */

      var StickyHeader = Control.extend({

         /**
          * @type {Function} Component display template.
          * @private
          */
         _template: template,

         /**
          * @type {IntersectionObserver}
          * @private
          */
         _observer: null,

         /**
          * type {Boolean} Determines whether the component is built on the Android mobile platform.
          * @private
          */
         _isMobilePlatform: detection.isMobilePlatform,

         _shadowVisible: true,

         _index: null,

         constructor: function() {
            StickyHeader.superclass.constructor.call(this);
            this._observeHandler = this._observeHandler.bind(this);
            this._index = stickyUtils.getNextId();
         },

         _afterMount: function() {
            var children = this._children;

            this._observer = new IntersectionObserver(this._observeHandler);
            this._model = new Model({
               topTarget: children.observationTargetTop,
               bottomTarget: children.observationTargetBottom
            });

            this._observer.observe(children.observationTargetTop);
            this._observer.observe(children.observationTargetBottom);
         },

         _beforeUnmount: function() {
            this._model.destroy();
            this._observer.disconnect();

            this._observeHandler = undefined;
         },

         /**
          * Handles changes to the visibility of the target object of observation at the intersection of the root container.
          * @param {IntersectionObserverEntry[]} entries The intersections between the target element and its root container at a specific moment of transition.
          * @private
          */
         _observeHandler: function(entries) {
            var shouldBeFixed = this._model.shouldBeFixed;

            this._model.update(entries);

            if (this._model.shouldBeFixed !== shouldBeFixed) {
               this._fixationStateChangeHandler();
            }
         },

         /**
          * To inform descendants about the fixing status. To update the state of the instance.
          * @private
          */
         _fixationStateChangeHandler: function() {
            var information = {
               id: this._index,
               shouldBeFixed: this._model.shouldBeFixed,
               offsetHeight: this._container.offsetHeight
            };

            this._shadowVisible = this._model.shouldBeFixed;

            this._forceUpdate();
            this._notify('fixed', [information], {bubbling: true});
         },

         _getStyle: function() {
            var top = 0;

            if (this._context.stickyHeader) {
               top = this._context.stickyHeader.position;
            }

            /**
             * On android and ios there is a gap between child elements.
             * When the header is fixed, there is a space between the container, relative to which it is fixed,
             * and the header, through which you can see the scrolled content. Its size does not exceed one pixel.
             * https://jsfiddle.net/tz52xr3k/3/
             *
             * As a solution, move the header up and increase its size by an offset, using padding.
             * In this way, the content of the header does not change visually, and the free space disappears.
             * The offset must be at least as large as the free space. Take the nearest integer equal to one.
             */
            var offset = this._isMobilePlatform ? 1 : 0;

            var style = 'top: ' + (top - offset) + 'px;';

            if (offset) {
               style += ' padding-top: ' + offset + 'px;';
            }

            if (this._model && this._model.shouldBeFixed) {
               style += ' z-index: ' + this._options.fixedZIndex + ';';
            }

            return style;
         },

         _updateStickyShadow: function(e, ids) {
            this._shadowVisible = ids.indexOf(this._index) !== -1;
         },

         _isShadowVisible: function() {
            return (!this._context.stickyHeader || this._context.stickyHeader.shadowVisible) &&
               this._shadowVisible && this._model && this._model.shouldBeFixed;
         }
      });

      StickyHeader._index = 1;

      StickyHeader.contextTypes = function() {
         return {
            stickyHeader: Context
         };
      };

      StickyHeader.getDefaultOptions = function() {
         return {

            //TODO: https://online.sbis.ru/opendoc.html?guid=a5acb7b5-dce5-44e6-aa7a-246a48612516
            fixedZIndex: 2
         };
      };

      return StickyHeader;
   }
);
