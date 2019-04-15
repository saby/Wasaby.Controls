define('Controls/StickyHeader',
   [
      'Core/Control',
      'Controls/StickyHeader/Utils',
      'wml!Controls/StickyHeader/StickyHeader',
      'Controls/StickyHeader/_StickyHeader'
   ],
   function(Control, stickyUtils, template) {

      'use strict';

      /**
       * Ensures that content sticks to the top or bottom of the parent container when scrolling.
       * Occurs at the moment of intersection of the upper or lower part of the content and the parent container.
       * @remark
       * Fixing in ie browser below version 16 is not supported.
       *
       * @public
       * @extends Core/Control
       * @class Controls/StickyHeader
       * @author Михайловский Д.С.
       */

      /**
       * @name Controls/StickyHeader#content
       * @cfg {Function} Sticky header content.
       */

      /**
       * @name Controls/StickyHeader#mode
       * @cfg {String} Sticky header mode.
       * @variant replaceable Replaceable header. The next header replaces the current one.
       * @variant stackable Stackable header.  The next header is stick to the bottom of the current one.
       */

      /**
       * @name Controls/StickyHeader#shadowVisibility
       * @cfg {String} Shadow visibility.
       * @variant visible Show.
       * @variant hidden Do not show.
       * @default visible
       */

      /**
       * @name Controls/StickyHeader#position
       * @cfg {String} Determines which side the control can sticky.
       * @variant top Top side.
       * @variant bottom Bottom side.
       * @variant topbottom Top and bottom side.
       * @default top
       */

      /**
       * @event Controls/StickyHeader#fixed Change the fixation state.
       * @param {Core/vdom/Synchronizer/resources/SyntheticEvent} event Event descriptor.
       * @param {Controls/StickyHeader/Types/InformationFixationEvent.typedef} information Information about the fixation event.
       */

      var StickyHeader = Control.extend({

         _template: template,

         /**
          * The position property with sticky value is not supported in ie and edge lower version 16.
          * https://developer.mozilla.org/ru/docs/Web/CSS/position
          */
         _isStickySupport: null,

         _beforeMount: function(options, context, receivedState) {
            this._isStickySupport = stickyUtils.isStickySupport();
         },
      });

      return StickyHeader;
   }
);
