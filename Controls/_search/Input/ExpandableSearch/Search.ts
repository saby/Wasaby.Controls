import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import template = require('wml!Controls/_search/Input/ExpandableSearch/Search');
import * as tmplNotify from 'Controls/Utils/tmplNotify';
import * as SearchInput from 'Controls/_search/Input/Search';

interface IExpandableSearchChildren {
   searchInput: SearchInput;
}
/**
 * Контрол "Разворачиваемый поиск". Является однострочным полем ввода. Контрол используют в реестрах для ввода поискового запроса.
 *
 * @class Controls/_search/Input/ExpandableSearch/Search
 * @extends Core/Control
 * @author Мельникова Е.А.
 * @control
 * @public
 */
export default class ExpandableSearch extends Control<IControlOptions> {
   protected _expanded: boolean = false;
   protected _template: TemplateFunction = template;
   protected _tmplNotify: Function = tmplNotify;

   protected _afterUpdate(): void {
      if (this._expanded) {
         this._children.searchInput.activate();
      }
   }

   protected _handleOpenClick(): void {
      this._expanded = true;
   }

   protected _handleCloseClick(): void {
      this._expanded = false;
      this._notify('valueChanged', ['']);
   }

   static _theme: string[] = ['Controls/search'];
}
