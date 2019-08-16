import CollectionItem, {IOptions as ICollectionItemOptions} from './CollectionItem';
import {register} from '../di';

interface IOptions<T> extends ICollectionItemOptions<T> {
}

/**
 * Элемент коллекции "Группа"
 * @class Types/_display/GroupItem
 * @extends Types/_display/CollectionItem
 * @public
 * @author Мальцев А.А.
 */
export default class GroupItem<T> extends CollectionItem<T> {
   /**
    * Развернута или свернута группа. По умолчанию развернута.
    */
   protected _$expanded: boolean;

   constructor(options?: IOptions<T>) {
      super(options);
      this._$expanded = !!this._$expanded;
   }

   /**
    * Возвращает признак, что узел развернут
    */
   isExpanded(): boolean {
      return this._$expanded;
   }

   /**
    * Устанавливает признак, что узел развернут или свернут
    * @param expanded Развернут или свернут узел
    * @param [silent=false] Не генерировать событие
    */
   setExpanded(expanded: boolean, silent?: boolean): void {
      if (this._$expanded === expanded) {
         return;
      }
      this._$expanded = expanded;
      if (!silent) {
         this._notifyItemChangeToOwner('expanded');
      }
   }

   /**
    * Переключает признак, что узел развернут или свернут
    */
   toggleExpanded(): void {
      this.setExpanded(!this.isExpanded());
   }
}

Object.assign(GroupItem.prototype, {
   '[Types/_display/GroupItem]': true,
   _moduleName: 'Types/display:GroupItem',
   _instancePrefix: 'group-item-',
   _$expanded: true
});

register('Types/display:GroupItem', GroupItem);
