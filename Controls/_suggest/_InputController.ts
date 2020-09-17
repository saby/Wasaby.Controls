import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import * as template from 'wml!Controls/_suggest/_InputController/_InputController';
import {descriptor, Model} from 'Types/entity';
import {getSwitcherStrFromData} from 'Controls/search';
import {isEqual} from 'Types/object';
import {SyntheticEvent} from 'Vdom/Vdom';
import {IStackPopupOptions, Stack as StackOpener} from 'Controls/popup';
import {Controller as SearchController, SearchDelay as SearchDelayController} from 'Controls/searchNew';
import {NewSourceController as SourceController} from 'Controls/dataSource';
import {RecordSet} from 'Types/collection';
import {__ContentLayer, __PopupLayer} from 'Controls/suggestPopup';
import {
   IFilterOptions,
   INavigationOptions, INavigationSourceConfig,
   ISearchOptions,
   ISortingOptions,
   ISourceOptions,
   IValidationStatusOptions
} from 'Controls/interface';
import {QueryWhereExpression} from 'Types/source';
import ISuggest, {IEmptyTemplateProp, ISuggestFooterTemplate, ISuggestTemplateProp} from 'Controls/interface/ISuggest';
import {IValueOptions} from 'Controls/input';
import {factory} from 'Types/chain';
import ModuleLoader = require('Controls/Container/Async/ModuleLoader');

import Env = require('Env/Env');
import mStubs = require('Core/moduleStubs');
import clone = require('Core/core-clone');
import Deferred = require('Core/Deferred');

const CURRENT_TAB_META_FIELD = 'tabsSelectedKey';
const HISTORY_KEYS_FIELD = 'historyKeys';

const moduleLoader = new ModuleLoader();

/* if suggest is opened and marked key from suggestions list was changed,
   we should select this item on enter keydown, otherwise keydown event should be propagated as default. */
const ENTER_KEY = Env.constants.key.enter;

const PROCESSED_KEYDOWN_KEYS = {

   /* hot keys that should processed on input */
   INPUT: [Env.constants.key.esc],

   /* hot keys, that list (suggestList) will process,
   do not respond to the press of these keys when suggest is opened */
   SUGGESTIONS_LIST: [Env.constants.key.down, Env.constants.key.up, ENTER_KEY]
};

const DEPS = ['Controls/suggestPopup:_ListWrapper', 'Controls/scroll:Container', 'Controls/search:Misspell', 'Controls/LoadingIndicator'];

type Key = string | number | null;
type TState = boolean | null;
type HistoryKeys = string[] | null;
type CancelableError = Error & { canceled?: boolean };

interface IInputControllerOptions extends IControlOptions, IFilterOptions, ISearchOptions,
   IValidationStatusOptions, ISuggest, ISourceOptions, INavigationOptions<INavigationSourceConfig>,
   IFilterOptions, ISortingOptions, IValueOptions<string> {
   suggestState: boolean;
   autoDropDown?: boolean;
   searchErrorCallback?: Function;
   searchEndCallback?: Function;
   searchStartCallback?: Function;
   emptyTemplate?: IEmptyTemplateProp;
   historyId?: string|null;
   layerName: string;
   suggestTemplate: ISuggestTemplateProp | null;
   footerTemplate: ISuggestFooterTemplate;
   trim: boolean;
}

/**
 * Контейнер для поля ввода с автодополнением.
 *
 * @class Controls/_suggest/_InputController
 * @extends Core/Control
 * @mixes Controls/_interface/ISearch
 * @mixes Controls/_interface/ISource
 * @mixes Controls/_interface/IFilterChanged
 * @mixes Controls/_suggest/ISuggest
 * @mixes Controls/_interface/INavigation
 * @control
 * @private
 */

/*
 * Container for Input's that using suggest.
 *
 * @class Controls/_suggest/_InputController
 * @extends Core/Control
 * @mixes Controls/_interface/ISearch
 * @mixes Controls/_interface/ISource
 * @mixes Controls/_interface/IFilterChanged
 * @mixes Controls/_suggest/ISuggest
 * @mixes Controls/_interface/INavigation
 * @control
 * @private
 */
export default class InputContainer extends Control<IInputControllerOptions> {
   protected _template: TemplateFunction = template;

   private _searchValue: string = '';
   private _filter: QueryWhereExpression<unknown> = null;
   private _tabsSelectedKey: Key = null;
   private _historyKeys: HistoryKeys = null;
   private _searchResult: RecordSet = null;
   private _searchDelay: number = null;
   private _dependenciesDeferred: Deferred = null;
   private _historyLoad: Deferred = null;
   private _historyServiceLoad: Deferred = null;
   private _showContent: boolean = false;
   private _inputActive: boolean = false;
   private _suggestMarkedKey: Key = null;
   private _misspellingCaption: string = null;

   private _searchDelayController: SearchDelayController = null;
   private _sourceController: SourceController = null;
   private _searchController: SearchController = null;

   /**
    * three state flag
    * null - loading is not initiated
    * true - loading data now
    * false - data loading ended
    */
   private _loading: TState = null;

   private _moreCount: number;
   private _input: Control;
   private _emptyTemplate: IEmptyTemplateProp | string;

   protected _children: {
      layerOpener: typeof __ContentLayer | typeof __PopupLayer;
      indicator: any;
      inputKeydown: any;
   };

   private _suggestStateNotify(state: boolean, options: IInputControllerOptions = this._options): void {
      if (options.suggestState !== state) {
         this._notify('suggestStateChanged', [state]);
      } else {
         this._forceUpdate();
      }
   }

   private _setCloseState(): void {
      this._showContent = false;
      this._loading = null;

      // when closing popup we reset the cache with recent keys
      this._historyLoad = null;
      this._historyKeys = null;
   }

   private _setSuggestMarkedKey(key: Key): void {
      const currentMarkedKey = this._suggestMarkedKey;
      this._suggestMarkedKey = key;

      if (currentMarkedKey !== this._suggestMarkedKey) {
         this._notify('suggestMarkedKeyChanged', [key]);
      }
   }

   private _close(options?: IInputControllerOptions): void {
      this._setCloseState();
      this._suggestStateNotify(false, options);

      if (this._dependenciesDeferred && !this._dependenciesDeferred.isReady()) {
         this._dependenciesDeferred.cancel();
         this._dependenciesDeferred = null;
      }
   }

   private _open(): void {
      this._loadDependencies(this._options).addCallback(() => {
         // focus can be moved out while dependencies loading
         if (this._inputActive) {
            this._suggestStateNotify(true);
         }
      });
   }

   private _closePopup(): void {
      const layerOpener = this._children.layerOpener;
      if (layerOpener) { layerOpener.close(); }
   }

   private _openWithHistory(): void {
      let filter: QueryWhereExpression<unknown>;

      function openSuggestIfNeeded(): void {
         if (this._historyKeys.length || this._options.autoDropDown) {
            this.open();
         }
      }

      if (!this._historyKeys) {
         this._getRecentKeys().addCallback((keys: string[]) => {
            this._historyKeys = keys || [];
            filter = clone(this._options.filter || {});

            if (this._historyKeys.length) {
               filter[HISTORY_KEYS_FIELD] = this._historyKeys;
            }

            this._setFilter(filter, this._options);

            openSuggestIfNeeded();
            return this._historyKeys;
         });
      } else {
         this._setFilter(this._options.filter, this._options);
         openSuggestIfNeeded();
      }
   }

   private _setSearchValue(value: string): void {
      this._searchValue = value;
   }

   private _inputActivated(): void {

      // toDO Временный костыль, в .320 убрать, должно исправиться с этой ошибкой
      // https://online.sbis.ru/opendoc.html?guid=d0f7513f-7fc8-47f8-8147-8535d69b99d6
      if ((this._options.autoDropDown || this._options.historyId) && !this._options.readOnly
         && !this._getActiveElement().classList.contains('controls-Lookup__icon')) {
         // The delay is needed when searching, when receiving the focus of the input field, open without delay
         this._searchDelay = 0;

         if (!this._options.suggestState) {
            this._updateSuggestState();
         }
      }
   }

   private _getActiveElement(): Element {
      return document.activeElement;
   }

   private _hideIndicator(): void {
      if (this._children.indicator) {
         this._children.indicator.hide();
      }
   }
   private _searchErrback(error: CancelableError): Promise<void> {
      // aborting of the search may be caused before the search start, because of the delay before searching
      if (this._loading !== null) {
         this._loading = false;
         this._forceUpdate();
      }
      if (!error?.canceled) {
         this._hideIndicator();
      }
   }
   // private _shouldSearch(value: string): boolean {
   //    return this._inputActive && this._isValueLengthLongerThenMinSearchLength(value, this._options);
   // }

   // private _isValueLengthLongerThenMinSearchLength(value: string, options): boolean {
   //   return value && value.length >= options.minSearchLength;
   // }

   private _shouldShowSuggest(searchResult: RecordSet): boolean {
      const hasItems = searchResult && searchResult.getCount();
      const isSuggestHasTabs = this._tabsSelectedKey !== null;

      /* do not suggest if:
       * 1) loaded list is empty and empty template option is doesn't set
       * 2) loaded list is empty and list loaded from history, expect that the list is loaded from history, because input field is empty and historyId options is set  */
      return !!(hasItems ||
         (!this._options.historyId || this._searchValue || isSuggestHasTabs) &&
         this._options.emptyTemplate && searchResult !== null);
   }

   private _processResultData(data: RecordSet): void {
      this._searchResult = data;

      if (data) {
         const metaData = data && data.getMetaData();
         const result = metaData.results;

         this._setMissSpellingCaption(getSwitcherStrFromData(data));

         if (!data.getCount()) {
            this._setSuggestMarkedKey(null);
         }

         if (result && result.get(CURRENT_TAB_META_FIELD)) {
            this._tabsSelectedKey = result.get(CURRENT_TAB_META_FIELD);
         }

         if (this._searchValue && this._sourceController?.hasMore() && typeof metaData.more === 'number') {
            this._moreCount = metaData.more - data.getCount();
         } else {
            this._moreCount = undefined;
         }
      }
      if (!this._shouldShowSuggest(data)) {
         this._close();
      }
   }

   private _prepareFilter(filter: QueryWhereExpression<unknown>,
                          searchParam: string,
                          searchValue: string,
                          minSearchLength: number,
                          tabId: Key,
                          historyKeys: string[]): QueryWhereExpression<unknown> {
      const preparedFilter = clone(filter) || {};
      if (tabId) {
         preparedFilter.currentTab = tabId;
      }
      if (searchValue.length < minSearchLength && historyKeys && historyKeys.length) {
         preparedFilter[HISTORY_KEYS_FIELD] = historyKeys;
      }
      return preparedFilter;
   }

   private _setFilter(filter: QueryWhereExpression<unknown>, options: IInputControllerOptions): void {
      this._filter = this._prepareFilter(filter, options.searchParam, this._searchValue,
         options.minSearchLength, this._tabsSelectedKey, this._historyKeys);
   }

   private _getEmptyTemplate(emptyTemplate: IEmptyTemplateProp): IEmptyTemplateProp | string {
      return emptyTemplate && emptyTemplate.templateName ? emptyTemplate.templateName : emptyTemplate;
   }

   private _updateSuggestState(): void {
      // todo
      const shouldSearch = null; // this._shouldSearch(this._searchValue);

      if (this._options.historyId && !shouldSearch && !this._options.suggestState) {
         this._openWithHistory();
      } else if (shouldSearch || this._options.autoDropDown && !this._options.suggestState) {
         this._setFilter(this._options.filter, this._options);
         this._open();
      } else if (!this._options.autoDropDown) {
         // autoDropDown - close only on Esc key or deactivate
         this._close();
      }
   }

   private _getTemplatesToLoad(options: IInputControllerOptions): string[] {
      const templatesToCheck = ['footerTemplate', 'suggestTemplate', 'emptyTemplate'];
      const templatesToLoad = [];
      templatesToCheck.forEach((tpl) => {
         if (options[tpl] && options[tpl].templateName && !moduleLoader.isLoaded(options[tpl].templateName)) {
            templatesToLoad.push(options[tpl].templateName);
         }
      });
      return templatesToLoad;
   }

   private _loadDependencies(options: IInputControllerOptions): Deferred {
      const templatesToLoad = this._getTemplatesToLoad(options);
      if (!this._dependenciesDeferred || templatesToLoad.length) {
         this._dependenciesDeferred = mStubs.require(DEPS.concat(templatesToLoad.concat([options.layerName])));
      }
      return this._dependenciesDeferred;
   }

   private _setMissSpellingCaption(value: string): void {
      this._misspellingCaption = value;
   }

   private _getHistoryService(): Deferred {
      if (!this._historyServiceLoad) {
         this._historyServiceLoad = new Deferred();
         import('Controls/suggestPopup').then(({LoadService}) => {
            LoadService({
               historyId: this._options.historyId
            }).addCallback((result) => {
               this._historyServiceLoad.callback(result);
               return result;
            });
         });
      }
      return this._historyServiceLoad;
   }

   private _getRecentKeys(): Deffered {
      if (this._historyLoad) {
         return this._historyLoad;
      }

      this._historyLoad = new Deferred();

      // toDO Пока что делаем лишний вызов на бл, ждем доработки хелпера от Шубина
      this._getHistoryService().addCallback((historyService) => {
         historyService.query().addCallback((dataSet) => {
            if (this._historyLoad) {
               const keys = [];
               dataSet.getRow().get('recent').each((item) => {
                  keys.push(item.get('ObjectId'));
               });
               this._historyLoad.callback(keys);
            }
         }).addErrback(() => {
            if (this._historyLoad) {
               this._historyLoad.callback([]);
            }
         });

         return historyService;
      });

      return this._historyLoad;
   }

   private _openSelector(templateOptions: object): void {
      if (!this._notify('showSelector', [templateOptions])) {
         // loading showAll templates_historyLoad
         import('Controls/suggestPopup').then(() => {
            StackOpener.openPopup(this._getSelectorOptions(templateOptions));
         });
      }
   }

   private _isInvalidValidationStatus(options: IInputControllerOptions): boolean {
      return options.validationStatus === 'invalid' ||
         options.validationStatus === 'invalidAccent';
   }

   private _reverseData(data: RecordSet): RecordSet {
      const recordSetToReverse = data.clone();
      const reversedData = factory(recordSetToReverse).sort((a, b) => {
         return recordSetToReverse.getIndex(b) - recordSetToReverse.getIndex(a);
      }).value();

      // need to use initial recordSet to save metaData in origin format
      data.clear();
      reversedData.forEach((item) => {
         data.add(item);
      });

      return data;
   }

   private _getSelectorOptions(templateOptions: object): IStackPopupOptions {
      return { ...{
            opener: this,
            template: 'Controls/suggestPopup:Dialog',
            closeOnOutsideClick: true,
            eventHandlers: {
               onResult: this._select.bind(this)
            }
         }, ...templateOptions};
   }

   private _getTemplateOptions(filter: QueryWhereExpression<unknown>): IStackPopupOptions {
      delete filter[HISTORY_KEYS_FIELD];
      return {
         templateOptions: {
            filter,
            searchValue: this._searchValue,
            template: 'Controls/suggestPopup:_ListWrapper',
            templateOptions: {
               templateName: this._options.suggestTemplate.templateName,
               templateOptions: this._options.suggestTemplate.templateOptions,
               searchEndCallback: this._searchEnd,
               searchStartCallback: this._searchStart,
               searchErrback: this._searchErrback,
               emptyTemplate: this._options.emptyTemplate,
               source: this._options.source,
               minSearchLength: this._options.autoDropDown ? 0 : this._options.minSearchLength,
               navigation: this._options.navigation,
               sorting: this._options.sorting,
               searchParam: this._options.searchParam,
               tabsSelectedKey: this._tabsSelectedKey,
               layerName: this._options.layerName,
               searchDelay: this._searchDelay,
               tabsSelectedKeyChangedCallback: this._tabsSelectedKeyChanged,
               searchValue: this._searchValue,
               eventHandlers: {
                  onResult: this._select.bind(this)
               }
            }
         }
      };
   }

   protected _beforeMount(options: IInputControllerOptions): void {
      this._searchStart = this._searchStart.bind(this);
      this._searchEnd = this._searchEnd.bind(this);
      this._searchErrback = this._searchErrback.bind(this);
      this._searchDelay = options.searchDelay;
      this._tabsSelectedKeyChanged = this._tabsSelectedKeyChanged.bind(this);
      this._setFilter(options.filter, options);
   }

   protected _beforeUnmount(): void {
      this._searchResult = null;
      this._searchStart = null;
      this._searchEnd = null;
      this._searchErrback = null;
   }

   protected _beforeUpdate(newOptions: IInputControllerOptions): void {
      const valueChanged = this._options.value !== newOptions.value;
      const valueCleared = valueChanged && !newOptions.value && typeof newOptions.value === 'string';
      const needSearchOnValueChanged = valueChanged && this._isValueLengthLongerThenMinSearchLength(newOptions.value, this._options);
      const emptyTemplateChanged = !isEqual(this._options.emptyTemplate, newOptions.emptyTemplate);
      const footerTemplateChanged = !isEqual(this._options.footerTemplate, newOptions.footerTemplate);

      if (newOptions.suggestState !== this._options.suggestState) {
         if (newOptions.suggestState) {
            this._open();
         } else {
            this._setCloseState();
            this._setSuggestMarkedKey(null);
         }
      }

      if ((needSearchOnValueChanged || valueCleared) && this._searchValue !== newOptions.value) {
         this._searchValue = newOptions.value;

         if (this._options.suggestState && newOptions.suggestState) {
            this._updateSuggestState();
         }
      }

      if (needSearchOnValueChanged || valueCleared || !isEqual(this._options.filter, newOptions.filter)) {
         this._setFilter(newOptions.filter, newOptions);
      }

      if (emptyTemplateChanged) {
         this._emptyTemplate = this._getEmptyTemplate(newOptions.emptyTemplate);
         // TODO
      }

      if ((emptyTemplateChanged || footerTemplateChanged) && newOptions.suggestState ) {
         this._loadDependencies(newOptions);
      }

      if (this._options.searchDelay !== newOptions.searchDelay) {
         this._searchDelay = newOptions.searchDelay;
      }

      if (this._options.validationStatus !== newOptions.validationStatus &&
         this._isInvalidValidationStatus(newOptions) && !this._isInvalidValidationStatus(this._options)) {
         this._close(newOptions);
      }
   }

   protected _afterUpdate(): void {
      if (this._options.suggestState && this._loading === false && !this._showContent) {
         this._showContent = true;
         this._forceUpdate();
      }
   }

   // TODO Нужно удалить после https://online.sbis.ru/opendoc.html?guid=403837db-4075-4080-8317-5a37fa71b64a
   inputReadyHandler(_: Event, input: Control): void {
      this._input = input;
   }

   protected _closeHandler(event: SyntheticEvent): void {
      event.stopPropagation();
      this._close();
   }

   protected _changeValueHandler(event: SyntheticEvent, value: string): void {
      /* preload suggest dependencies on value changed */
      this._loadDependencies(this._options);

      if (!this._searchDelayController) {
         const searchController = this._getSearchController();

         this._searchDelayController = new SearchDelayController({
            delayTime: this._options.searchDelay as number,
            minSearchLength: this._options.minSearchLength,
            searchCallback: (validatedValue: string) => {
               this._searchStart();
               searchController.search(validatedValue).then((data) => {
                  this._updateSuggestState();

                  this._searchEnd(data);
               });
            },
            searchResetCallback: () => {
               searchController.reset().then();
            }
         });
      }
   }

   protected _getSearchController(): SearchController {
      if (!this._searchController) {
         this._searchController = new SearchController({
            sourceController: this._getSourceController(),
            minSearchLength: this._options.minSearchLength,
            searchDelay: this._options.searchDelay as number,
            searchParam: this._options.searchParam,
            searchValueTrim: this._options.trim
         });
      }
      return this._searchController;
   }

   protected _getSourceController(): SourceController {
      if (!this._sourceController) {
         this._sourceController = new SourceController({
            dataLoadErrback: (error) => this._searchErrback(error),
            filter: this._filter,
            keyProperty: this._options.keyProperty,
            navigation: this._options.navigation,
            sorting: this._options.sorting,
            source: this._options.source,
            parentProperty: undefined,
            root: undefined
         });
      }
      return this._sourceController;
   }

   protected _inputActivatedHandler(event: SyntheticEvent): void {
      this._inputActive = true;
      if (!this._isInvalidValidationStatus(this._options)) {
         this._inputActivated();
      }
   }

   protected _inputDeactivated(): void {
      this._inputActive = false;
   }

   protected _inputClicked(): void {
      this._inputActive = true;
      if (!this._options.suggestState) {
         this._inputActivated();
      }
   }

   protected _tabsSelectedKeyChanged(key: Key): void {
      this._searchDelay = 0;
      this._setSuggestMarkedKey(null);

      // change only filter for query, tabSelectedKey will be changed after processing query result,
      // otherwise interface will blink
      if (this._tabsSelectedKey !== key) {
         this._filter = this._prepareFilter(this._options.filter, this._options.searchParam,
            this._searchValue, this._options.minSearchLength, key, this._historyKeys);
      }

      // move focus from tabs to input, after change tab
      this.activate();

      /* because activate() does not call _forceUpdate and _tabsSelectedKeyChanged is callback function,
         we should call _forceUpdate, otherwise child controls (like suggestionsList) does not get new filter */
      this._forceUpdate();
   }

   protected _select(event: SyntheticEvent, item: Model): void {
      const newItem = item || event;

      this._close();
      this._closePopup();
      this._notify('choose', [newItem]);

      if (this._options.historyId) {
         this._getHistoryService().addCallback((historyService) => {
            historyService.update(newItem, {$_history: true});
            return historyService;
         });
      }
   }

   protected _markedKeyChangedHandler(event: SyntheticEvent, key: string): void {
      this._setSuggestMarkedKey(key);
   }

   protected _searchStart(): void {
      this._loading = true;
      // Обновим таймер, т.к. могут прерывать поиск новыми запросами
      if (this._children.indicator) {
         this._children.indicator.hide();
         this._children.indicator.show();
      }
      if (this._options.searchStartCallback) {
         this._options.searchStartCallback();
      }
   }

   protected _searchEnd(result: RecordSet): void {
      if (this._options.suggestState && this._loading) {
         this._loading = false;

         // _searchEnd may be called synchronously, for example, if local source is used,
         // then we must check, that indicator was created
         if (this._children.indicator) {
            this._children.indicator.hide();
         }
      }
      this._searchDelay = this._options.searchDelay;
      this._processResultData(result);
      if (this._options.searchEndCallback) {
         this._options.searchEndCallback();
      }
   }

   _searchErrbackHandler(error: CancelableError): void {
      this._searchErrback(error);
      if (this._options.searchErrorCallback) {
         this._options.searchErrorCallback();
      }
   }

   protected _showAllClick(): void {
      const filter = clone(this._filter) || {};

      filter[this._options.searchParam] = '';
      this._openSelector(this._getTemplateOptions(filter));
      this._close();
   }

   protected _moreClick(): void {
      this._openSelector(this._getTemplateOptions(this._filter));
      this._close();
   }

   protected _missSpellClick(): void {
      // Return focus to the input field by changing the keyboard layout
      this.activate();
      this._notify('valueChanged', [this._misspellingCaption]);
      this._changeValueHandler(null, this._misspellingCaption);
      this._setMissSpellingCaption('');
   }

   protected _keydown(event: SyntheticEvent<KeyboardEvent>): void {
      const eventKeyCode = event.nativeEvent.keyCode;
      const isInputKey = PROCESSED_KEYDOWN_KEYS.INPUT.indexOf(eventKeyCode) !== -1;
      const isListKey = eventKeyCode === ENTER_KEY ? this._suggestMarkedKey !== null :
         PROCESSED_KEYDOWN_KEYS.SUGGESTIONS_LIST.indexOf(eventKeyCode) !== -1;

      if (this._options.suggestState) {
         if (isListKey || isInputKey) {
            event.preventDefault();
            event.stopPropagation();
         }

         if (isListKey) {
            if (this._children.inputKeydown) {
               this._children.inputKeydown.start(event);

               // The container with list takes focus away to catch "enter", return focus to the input field.
               // toDO https://online.sbis.ru/opendoc.html?guid=66ae5218-b4ba-4d6f-9bfb-a90c1c1a7560
               if (this._input) {
                  this._input.activate();
               } else {
                  this.activate();
               }
            }
         } else if (isInputKey) {
            if (eventKeyCode === Env.constants.key.esc) {
               this._close();
            }
         }
      }
   }

   static _theme: string[] = ['Controls/suggest'];

   static getOptionTypes(): object {
      return {
         searchParam: descriptor(String).required()
      };
   }

   static getDefaultOptions(): object {
      return {
         emptyTemplate: {
            templateName: 'Controls/suggestPopup:EmptyTemplate'
         },
         footerTemplate: {
            templateName: 'Controls/suggestPopup:FooterTemplate'
         },
         suggestStyle: 'default',
         suggestState: false,
         minSearchLength: 3
      };
   }
}
