import Control = require('Core/Control');
import stickyUtils = require('Controls/_scroll/StickyHeader/Utils');
import template = require('wml!Controls/_scroll/StickyHeader/StickyHeader');
import 'Controls/_scroll/StickyHeader/_StickyHeader';



      /**
       * Ensures that content sticks to the top or bottom of the parent container when scrolling.
       * Occurs at the moment of intersection of the upper or lower part of the content and the parent container.
       * @remark
       * Fixing in ie browser below version 16 is not supported.
       *
       * @public
       * @extends Core/Control
       * @class Controls/_scroll/StickyHeader
       * @author Михайловский Д.С.
       */

      /**
       * @name Controls/_scroll/StickyHeader#content
       * @cfg {Function} Sticky header content.
       */

      /**
       * @name Controls/_scroll/StickyHeader#mode
       * @cfg {String} Sticky header mode.
       * @variant replaceable Replaceable header. The next header replaces the current one.
       * @variant stackable Stackable header.  The next header is stick to the bottom of the current one.
       */

      /**
       * @name Controls/_scroll/StickyHeader#shadowVisibility
       * @cfg {String} Shadow visibility.
       * @variant visible Show.
       * @variant hidden Do not show.
       * @default visible
       */

      /**
       * @name Controls/_scroll/StickyHeader#position
       * @cfg {String} Determines which side the control can sticky.
       * @variant top Top side.
       * @variant bottom Bottom side.
       * @variant topbottom Top and bottom side.
       * @default top
       */

      /**
       * @event Controls/_scroll/StickyHeader#fixed Change the fixation state.
       * @param {Core/vdom/Synchronizer/resources/SyntheticEvent} event Event descriptor.
       * @param {Controls/_scroll/StickyHeader/Types/InformationFixationEvent.typedef} information Information about the fixation event.
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

      export = StickyHeader;

