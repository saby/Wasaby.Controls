import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import {ICaption} from 'Controls/interface';
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

class Misspell extends Control<IControlOptions> implements ICaption{
   private _template: TemplateFunction = template;
   static _theme: Array<string> = ['Controls/search'];

   readonly "[Controls/_interface/ICaption]": true;
}

export default Misspell;
