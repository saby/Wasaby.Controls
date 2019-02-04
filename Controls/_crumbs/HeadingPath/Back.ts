import Control = require('Core/Control');
import template = require('wml!Controls/_crumbs/HeadingPath/Back');

class Back extends Control {
   private _template = template;

   _onBackButtonClick() {
      this._notify('backButtonClick', [], {
         bubbling: true
      });
   }

   _onArrowClick() {
      this._notify('arrowClick', [], {
         bubbling: true
      });
   }
}

export default Back;