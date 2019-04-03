define('Controls/StickyHeader/_StickyHeader',
   [
      'Core/Control',
      'Env/Env',
      'Types/entity',
      'Controls/StickyHeader/Context',
      'Controls/StickyHeader/Utils',
      'Controls/Utils/IntersectionObserver',
      'Controls/StickyHeader/_StickyHeader/Model',
      'wml!Controls/StickyHeader/_StickyHeader/StickyHeader',

      'css!theme?Controls/StickyHeader/_StickyHeader/StickyHeader'
   ],
   function(Control, Env, entity, Context, stickyUtils, IntersectionObserver, Model, template) {

      'use strict';

      /**
       * Ensures that content sticks to the top of the parent container when scrolling down.
       * Occurs at the moment of intersection of the upper part of the content and the parent container.
       *
       * @private
       * @extends Core/Control
       * @class Controls/StickyHeader
       * @css @background-color_StickyHeader Background color of StickyHeader.
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
         _isMobilePlatform: Env.detection.isMobilePlatform,

         _shadowVisible: true,
         _stickyHeadersHeight: null,

         _index: null,

         _height: 0,

         constructor: function() {
            StickyHeader.superclass.constructor.call(this);
            this._observeHandler = this._observeHandler.bind(this);
            this._index = stickyUtils.getNextId();
            this._stickyHeadersHeight = {
               top: 0,
               bottom: 0
            };
         },

         _afterMount: function() {
            var children = this._children;

            this._notify('stickyRegister', [{
               id: this._index,
               inst: this,
               position: this._options.position,
               mode: this._options.mode
            }, true], { bubbling: true });

            this._observer = new IntersectionObserver(this._observeHandler);
            this._model = new Model({
               topTarget: children.observationTargetTop,
               bottomTarget: children.observationTargetBottom,
               position: this._options.position
            });

            this._observer.observe(children.observationTargetTop);
            this._observer.observe(children.observationTargetBottom);
         },

         _beforeUnmount: function() {
            this._model.destroy();
            this._observer.disconnect();

            //Let the listeners know that the element is no longer fixed before the unmount.
            this._fixationStateChangeHandler('', this._model.fixedPosition);
            this._observeHandler = undefined;
            this._notify('stickyRegister', [{ id: this._index }, false], { bubbling: true });
         },

         getOffset: function(parentElement, position) {
            return stickyUtils.getOffset(parentElement, this._container, position);
         },

         get height() {
            // If the header is hidden we cannot calculate its current height.
            // Use the height that it had before it was hidden.
            if (this._container.offsetParent !== null) {
               this._height = this._container.offsetHeight;
            }
            return this._height;
         },

         get top() {
            return this._stickyHeadersHeight.top;
         },

         set top(value) {
            this._stickyHeadersHeight.top = value;
            this._forceUpdate();
         },

         get bottom() {
            return this._stickyHeadersHeight.bottom;
         },

         set bottom(value) {
            this._stickyHeadersHeight.bottom = value;
            this._forceUpdate();
         },

         _resizeHandler: function() {
            this._notify('stickyHeaderResize', [], {bubbling: true});
         },

         /**
          * Handles changes to the visibility of the target object of observation at the intersection of the root container.
          * @param {IntersectionObserverEntry[]} entries The intersections between the target element and its root container at a specific moment of transition.
          * @private
          */
         _observeHandler: function(entries) {
            var fixedPosition = this._model.fixedPosition;

            this._model.update(entries);

            if (this._model.fixedPosition !== fixedPosition) {
               this._fixationStateChangeHandler(this._model.fixedPosition, fixedPosition);
               this._forceUpdate();
            }
         },

         /**
          * To inform descendants about the fixing status. To update the state of the instance.
          * @private
          */
         _fixationStateChangeHandler: function(newPosition, prevPosition) {
            // If the header is hidden we cannot calculate its current height.
            // Use the height that it had before it was hidden.
            if (this._container.offsetParent !== null) {
               this._offsetHeight = this._container.offsetHeight;
            }
            var information = {
               id: this._index,
               fixedPosition: newPosition,
               offsetHeight: this._offsetHeight,
               prevPosition: prevPosition,
               mode: this._options.mode
            };

            this._shadowVisible = !!newPosition;
            this._notify('fixed', [information], {bubbling: true});
         },

         _getStyle: function() {
            var
               top,
               bottom,
               offset,
               position,
               style = '';

            if (this._model && !!this._model.fixedPosition) {
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
               offset = this._isMobilePlatform ? 1 : 0;
               position = this._stickyHeadersHeight[this._model.fixedPosition];

               if (this._context.stickyHeader) {
                  position += this._context.stickyHeader[this._model.fixedPosition];
               }

               style = this._model.fixedPosition + ': ' + (position - offset) + 'px;';

               if (offset) {
                  style += 'padding-' + this._model.fixedPosition + ': ' + offset + 'px;';
                  style += 'margin-' + this._model.fixedPosition + ': -' + offset + 'px;';
               }

               style += 'z-index: ' + this._options.fixedZIndex + ';';
            } else {
               if (this._options.position.indexOf('top') !== -1) {
                  top = this._stickyHeadersHeight.top;
                  if (this._context.stickyHeader) {
                     top += this._context.stickyHeader.top;
                  }
                  style += 'top: ' + top  + 'px;';
               }
               if (this._options.position.indexOf('bottom') !== -1) {
                  bottom = this._stickyHeadersHeight.bottom;
                  if (this._context.stickyHeader) {
                     bottom += this._context.stickyHeader.bottom;
                  }
                  style += 'bottom: ' + bottom + 'px;';
               }
            }

            return style;
         },

         _getObserverStyle: function(position) {
            // The top observer has a height of 1 pixel. In order to track when it is completely hidden
            // beyond the limits of the scrollable container, taking into account round-off errors,
            // it should be located with an offset of -3 pixels from the upper border of the container.
            return position + ': -' + (this._stickyHeadersHeight[position] + 3) + 'px;';
         },

         _updateStickyShadow: function(e, ids) {
            this._shadowVisible = ids.indexOf(this._index) !== -1;
         },

         _isShadowVisible: function(shadowPosition) {
            //The shadow from above is shown if the element is fixed from below, from below if the element is fixed from above.
            var fixedPosition = shadowPosition === 'top' ? 'bottom' : 'top';

            return (!this._context.stickyHeader || this._context.stickyHeader.shadowPosition.indexOf(fixedPosition) !== -1) &&
               this._model && this._model.fixedPosition === fixedPosition && this._options.shadowVisibility === 'visible' &&
               (this._options.mode === 'stackable' || this._shadowVisible);
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
            fixedZIndex: 2,
            shadowVisibility: 'visible',
            mode: 'replaceable',
            position: 'top'
         };
      };

      StickyHeader.getOptionTypes = function() {
         return {
            shadowVisibility: entity.descriptor(String).oneOf([
               'visible',
               'hidden'
            ]),
            mode: entity.descriptor(String).oneOf([
               'replaceable',
               'stackable'
            ]),
            position: entity.descriptor(String).oneOf([
               'top',
               'bottom',
               'topbottom'
            ])
         };
      };

      return StickyHeader;
   }
);
