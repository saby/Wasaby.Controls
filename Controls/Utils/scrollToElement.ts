import cInstance = require('Core/core-instance');
import getDimensions = require('Controls/Utils/getDimensions');

function getScrollableParents(element: HTMLElement): HTMLElement[] {
   let
      scrollableParents: HTMLElement[] = [],
      currentElement = element.parentElement;

   while (currentElement) {
      let currentStyle = window.getComputedStyle(currentElement);

      if ((currentStyle.overflowY === 'auto'
          || currentStyle.overflowY === 'scroll'
          //TODO fix for Container/Scroll, which has "overflow: hidden" in content block while mounting
          || currentElement.className.indexOf('controls-Scroll__content_hidden') >= 0) && currentElement.scrollHeight > currentElement.clientHeight) {
         scrollableParents.push(currentElement);
      }

      currentElement = currentElement.parentElement;
   }

   return scrollableParents;
}

function getOffset(element: HTMLElement): { top: number; bottom: number } {
   if (element === document.body || element === document.documentElement) {
      return {
         top: document.body.scrollTop,
         bottom: element.clientHeight
      };
   } else {
      const { top, height } = getDimensions(element);

      return {
         top: top + window.pageYOffset,
         bottom: top + height + window.pageYOffset
      };
   }
}

function getStickyHeaderHeight(scrollableElement: HTMLElement): { top: number; bottom: number } {
   if (scrollableElement.controlNodes) {
      for (let component of scrollableElement.controlNodes) {
         if (cInstance.instanceOfModule(component.control, 'Controls/_scroll/StickyHeader/Controller')) {
            return {
               top: component.control.getHeadersHeight('top'),
               bottom: component.control.getHeadersHeight('bottom')
            }
         }
      }
   }
   return { top: 0, bottom: 0 };
}

/**
 * The module returns a function that allows scrolling content in parent scrollable containers
 * so that the passed dom element becomes visible.
 *
 * <h2>Function argument</h2>
 *
 * The dom element to be made visible.
 *
 * <h2>Usage example</h2>
 * <pre>
 * require([
 *     'Controls/Utils/scrollToElement'
 * ], function(
 *     scrollToElement
 * ) {
 *     class Component extends Control {
 *         _onClick() {
 *             scrollToElement(this._children.child);
 *         }
 *     }
 * });
 * </pre>
 * @class Controls/Utils/scrollToElement
 * @public
 * @author Mironov A.U.
 */
function scrollToElement(element: HTMLElement, toBottom?: Boolean) {
   getScrollableParents(element).forEach(parent => {
      const
         elemToScroll = parent === document.documentElement ? document.body : parent,
         parentOffset = getOffset(parent),
         elemOffset = getOffset(element), //Offset of the element changes after each scroll, so we can't just cache it
         stickyHeaderHeight = getStickyHeaderHeight(parent);

      if (parentOffset.bottom < elemOffset.bottom) {
         if (toBottom) {
            elemToScroll.scrollTop += elemOffset.bottom - parentOffset.bottom + stickyHeaderHeight.bottom;
         } else {
            elemToScroll.scrollTop += elemOffset.top - parentOffset.top - stickyHeaderHeight.top;
         }
      } else {
         if (parentOffset.top + parentOffset.top > elemOffset.top) {
            if (toBottom) {
               elemToScroll.scrollTop -= Math.max(parentOffset.bottom - elemOffset.bottom + stickyHeaderHeight.bottom, 0);
            } else {
               elemToScroll.scrollTop -= Math.max(parentOffset.top - elemOffset.top + stickyHeaderHeight.top, 0);
            }
         }
      }
   });
}

export = scrollToElement;
