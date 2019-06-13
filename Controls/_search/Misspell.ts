import Control = require('Core/Control');
import template = require('wml!Controls/_search/Misspell');

/**
  * Контрол, отображающий подсказку, если в запросе при поиске найдена и исправлена опечатка.
  * @class Controls/_search/Misspell
  * @mixes Controls/_interface/ICaption
  * @extends Core/Control
  * @control
  * @public
  * @author Kraynov D.
  */
/*
 * //TODO KONGO A control that displays a tooltip if misspell was in search text was found.
 * @class Controls/_search/Misspell
 * @mixes Controls/_interface/ICaption
 * @extends Core/Control
 * @control
 * @public
 * @author Kraynov D.
 */

class Misspell extends Control {
   private _template: Function = template;
   static _theme: Array<string> = ['Controls/search'];
}

export default Misspell;
