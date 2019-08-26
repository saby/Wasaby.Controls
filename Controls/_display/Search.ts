import Tree from './Tree';
import CollectionItem from './CollectionItem';
import SearchStrategy from './itemsStrategy/Search';
import ItemsStrategyComposer from './itemsStrategy/Composer';
import {register} from 'Types/di';

/**
 * Проекция для режима поиска. Объединяет развернутые узлы в один элемент с "хлебной крошкой" внутри.
 * @class Controls/_display/Search
 * @extends Controls/_display/Tree
 * @public
 * @author Мальцев А.А.
 */
export default class Search<S, T = CollectionItem<S>> extends Tree<S, T> {
   protected _createComposer(): ItemsStrategyComposer<S, CollectionItem<S>> {
      const composer = super._createComposer();
      composer.append(SearchStrategy);

      return composer;
   }
}

Object.assign(Search.prototype, {
   _moduleName: 'Controls/display:Search',
   '[Controls/_display/Search]': true
});

register('Controls/display:Search', Search);
