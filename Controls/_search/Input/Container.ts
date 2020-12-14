import {Control, TemplateFunction} from 'UI/Base';
import * as template from 'wml!Controls/_search/Input/Container';
import {SyntheticEvent} from 'UI/Vdom';
import SearchResolver from 'Controls/_search/SearchResolver';
import {ISearchInputContainerOptions} from '../interface';
import {default as Store} from 'Controls/Store';
import {constants} from 'Env/Env';

/**
 * Контрол-контейнер для полей ввода, реализует функционал проверки количества введённых символов,
 * а так же задержку между вводом символа в поле ввода и выполнением поискового запроса.
 * @remark
 * Контрол принимает решение по событию valueChanged, должно ли сработать событие search или нет,
 * в зависимости от заданных параметров поиска - минимальной длины для начала поиска и времени задержки.
 *
 * Если задана опция useStore, то вместо использования события, будет отправлено значение свойства searchValue в Store.
 *
 * Использование c контролом Controls.browser:Browser можно посмотреть в демо Controls-demo/Search/FlatList
 *
 * @example
 * <pre>
 *    <Controls.search:InputContainer on:search="_search()" on:searchReset="_searchReset()">
 *       <Controls.search:Input/>
 *    </Controls.search:InputContainer>
 * </pre>
 * <pre>
 *    class ExampleControl extends Control {
 *       ...
 *       protected _search(event: SyntheticEvent, value: string) {
 *          // Выполняем поиск
 *       }
 *       protected _searchReset(event: SyntheticEvent) {
 *          // Сбрасываем поиск
 *       }
 *       ...
 *    }
 * </pre>
 * @class Controls/_search/Input/Container
 * @implements Controls/_search/interface/ISearchInputContainer
 *
 * @public
 * @author Крюков Н.Ю.
 * @demo Controls-demo/Search/Explorer/Index
 * @demo Controls-demo/Search/FlatList/Index
 * @demo Controls-demo/Search/TreeView/Index
 */
export default class Container extends Control<ISearchInputContainerOptions> {
   protected _template: TemplateFunction = template;

   protected _value: string;
   protected _contextCallbackId: string;
   protected _searchResolverController: SearchResolver = null;

   protected _beforeMount(options?: ISearchInputContainerOptions): void {
      if (this._options.inputSearchValue !== options.inputSearchValue) {
         this._value = options.inputSearchValue;
      }
   }

   protected _beforeUnmount(): void {
      if (this._searchResolverController) {
         this._searchResolverController.clearTimer();
      }
      if (this._contextCallbackId) {
         Store.unsubscribe(this._contextCallbackId);
      }
   }

   protected _beforeUpdate(newOptions: ISearchInputContainerOptions): void {
      if (this._options.inputSearchValue !== newOptions.inputSearchValue) {
         this._value = newOptions.inputSearchValue;
      }
   }

   protected _afterMount(): void {
      if (this._options.useStore) {
         this._contextCallbackId = Store.onPropertyChanged(
             '_contextName',
             () => {
                this._value = this._options.inputSearchValue;
             },
             true
         );
      }
   }

   protected _getSearchResolverController(): SearchResolver {
      if (!this._searchResolverController) {
         this._searchResolverController = new SearchResolver({
            delayTime: this._options.searchDelay,
            minSearchLength: this._options.minSearchLength,
            searchCallback: this._notifySearch.bind(this),
            searchResetCallback: this._notifySearchReset.bind(this)
         });
      }

      return this._searchResolverController;
   }

   protected _notifySearch(value: string): void {
      this._resolve(value);
   }

   private _resolve(value: string): void {
      if (this._options.useStore) {
         Store.dispatch('searchValue', value);
      } else {
         this._notify('search', [value || ''], {bubbling: true});
      }
   }

   protected _notifySearchReset(): void {
      this._notify('searchReset', [], {bubbling: true});
   }

   protected _searchClick(event: SyntheticEvent): void {
      if (this._value) {
         this._getSearchResolverController().setSearchStarted(true);
         this._resolve(this._value);
      }
   }

   protected _valueChanged(event: SyntheticEvent, value: string): void {
      if (this._value !== value) {
         this._value = value;
         this._getSearchResolverController().resolve(value);
      }
   }

   protected _keyDown(event: SyntheticEvent<KeyboardEvent>): void {
      if (event.nativeEvent.which === constants.key.enter) {
         event.stopPropagation();
      }
   }

   static getDefaultOptions(): ISearchInputContainerOptions {
      return {
         minSearchLength: 3,
         searchDelay: 500
      };
   }
}
