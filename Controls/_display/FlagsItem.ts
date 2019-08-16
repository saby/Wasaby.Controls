import CollectionItem from './CollectionItem';
import Flags from './Flags';
import {register} from '../di';

/**
 * Элемент коллекции флагов
 * @class Types/_display/FlagsItem
 * @extends Types/_display/CollectionItem
 * @public
 * @author Мальцев А.А.
 */
export default class FlagsItem<T> extends CollectionItem<T> {
   protected _$owner: Flags<T>;

   isSelected(): boolean {
      return this._$owner.getCollection().get(
         this._$contents, this._$owner.localize
      );
   }

   setSelected(selected: boolean): void {
      if (this.isSelected() === selected) {
         return;
      }
      this._$owner.getCollection().set(
         this._$contents, selected, this._$owner.localize
      );
   }
}

Object.assign(FlagsItem.prototype, {
   '[Types/_display/FlagsItem]': true,
   _moduleName: 'Types/display:FlagsItem'
});

register('Types/display:FlagsItem', FlagsItem);
