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
       * Ensures that content sticks to the top of the parent container when scrolling down.
       * Occurs at the moment of intersection of the upper part of the content and the parent container.
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
