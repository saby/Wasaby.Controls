import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import template = require('wml!Controls/_operations/Controller/Controller');
import tmplNotify = require('Controls/Utils/tmplNotify');
import selectionToRecord = require('Controls/_operations/MultiSelector/selectionToRecord');

import { SyntheticEvent } from 'Vdom/Vdom';

/**
 * Контроллер для работы с множественным выбором.
 * Передает состояние массового выделения дочерним контролам.
 * Подробное описание и инструкцию по настройке читайте <a href='https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/operations/'>здесь</a>.
 *
 * @class Controls/_operations/Controller
 * @extends Core/Control
 * @mixes Controls/interface/IPromisedSelectable
 * @control
 * @author Авраменко А.С.
 * @public
 */

/*
 * Container for content that can work with multiselection.
 * Puts selection in child context.
 * The detailed description and instructions on how to configure the control you can read <a href='https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/operations/'>here</a>.
 *
 * @class Controls/_operations/Controller
 * @extends Core/Control
 * @mixes Controls/interface/IPromisedSelectable
 * @control
 * @author Авраменко А.С.
 * @public
 */

export = class MultiSelector extends Control {
   protected _template: TemplateFunction = template;
   protected _selectedKeysCount: number|null;
   protected _filter: Object|null = null;
   protected _showSelectedEntries: boolean = false;
   protected _viewMode: string;
   private _notifyHandler: Function = tmplNotify;

   protected _beforeMount(options): void {
      this._filter = this._getFilter(options);
   }

   protected _beforeUpdate(newOptions): void {
      if (this._options.filter !== newOptions.filter) {
         this._filter = this._getFilter(newOptions);
      }
   }

   protected _selectedTypeChangedHandler(event: SyntheticEvent<null>, typeName: string, limit: number): void {
      this._children.registrator.start(typeName, limit);
   }

   protected _viewTypeChangedHandler(event: SyntheticEvent<null>, typeName: string): void {
      this._updateViewTypeChanged(typeName);
   }

   protected _selectedKeysCountChanged(e, count: number|null): void {
      e.stopPropagation();
      this._selectedKeysCount = count;

      // TODO: по этой задаче сделаю так, что опции selectedKeysCount вообще не будет: https://online.sbis.ru/opendoc.html?guid=d9b840ba-8c99-49a5-98d3-78715d10d540
   }

   protected _rootListChanged(e, newCurrentRoot: string|number|null): void {
      let root: string|number|null = 'root' in this._options ? this._options.root : null;

      if (this._showSelectedEntries && newCurrentRoot !== root) {
         this._updateViewTypeChanged('showAll');
         this._children.viewTypeChanged.start('showAll');
      }
   }

   private _updateViewTypeChanged(typeView: string): void {
      this._showSelectedEntries = typeView === 'showSelected';
      this._filter = this._getFilter(this._options);
   }

   private _getFilter(options: Object) {
      let filter = {...options.filter};
      let source = options.source.getOriginal ? options.source.getOriginal() : options.source;

      if (this._showSelectedEntries) {
         filter.selectionWithPaths = selectionToRecord({
            selected: options.selectedKeys || [],
            excluded: options.excludedKeys || []
         }, source.getAdapter(), 'all', false);
      } else {
         delete filter.selectionWithPaths;
      }

      return filter;
   }
}
