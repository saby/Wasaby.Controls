import Tree from './Tree';
import CollectionItem from './CollectionItem';
import SearchStrategy from './itemsStrategy/Search';
import ItemsStrategyComposer from './itemsStrategy/Composer';
import {register} from '../di';

/**
 * Проекция для режима поиска. Объединяет развернутые узлы в один элемент с "хлебной крошкой" внутри.
 * @class Types/_display/Search
 * @extends Types/_display/Tree
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
   _moduleName: 'Types/display:Search',
   '[Types/_display/Search]': true
});

register('Types/display:Search', Search);
