import getDimensions = require('Controls/Utils/getDimensions');

function getScrollableParents(element: HTMLElement): HTMLElement[] {
   let
      scrollableParents: HTMLElement[] = [],
      currentElement = element.parentElement;

   while (currentElement) {
      let currentStyle = window.getComputedStyle(currentElement);

      if ((currentStyle.overflowY === 'auto' || currentStyle.overflowY === 'scroll') && currentElement.scrollHeight > currentElement.clientHeight) {
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

function scrollToElement(element: HTMLElement, toBottom?: Boolean) {
   getScrollableParents(element).forEach(parent => {
      const
         elemToScroll = parent === document.documentElement ? document.body : parent,
         parentOffset = getOffset(parent),
         elemOffset = getOffset(element); //Offset of the element changes after each scroll, so we can't just cache it

      if (parentOffset.bottom < elemOffset.bottom) {
         if (toBottom) {
            elemToScroll.scrollTop += elemOffset.bottom - parentOffset.bottom;
         } else {
            elemToScroll.scrollTop += elemOffset.top - parentOffset.top;
         }
      } else {
         if (parentOffset.top > elemOffset.top) {
            if (toBottom) {
               elemToScroll.scrollTop -= Math.max(parentOffset.bottom - elemOffset.bottom, 0);
            } else {
               elemToScroll.scrollTop -= Math.max(parentOffset.top - elemOffset.top, 0);
            }
         }
      }
   });
}

export = scrollToElement;
