import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import {ICaption} from 'Controls/interface';
import template = require('wml!Controls/_search/Misspell');

/**
  * Контрол, отображающий подсказку, если в запросе при поиске найдена и исправлена опечатка.
  * @remark
  * Подробнее о фильтрации и поиске читайте <a href="/doc/platform/developmentapl/interface-development/controls/list-environment/filter-search/">здесь</a>.
  * @class Controls/_search/Misspell
  * @mixes Controls/_interface/ICaption
  * @extends Core/Control
  * @control
  * @public
  * @author Крайнов Д.О.
  */
/*
 * //TODO KONGO A control that displays a tooltip if misspell was in search text was found.
 * @class Controls/_search/Misspell
 * @mixes Controls/_interface/ICaption
 * @extends Core/Control
 * @control
 * @public
 * @author Крайнов Д.О.
 */

class Misspell extends Control<IControlOptions & ICaption> implements ICaption{
   private _template: TemplateFunction = template;

   readonly '[Controls/_interface/ICaption]': true;
   static _theme: string[] = ['Controls/search'];
}

export default Misspell;
