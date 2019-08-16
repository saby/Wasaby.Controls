import Collection, {
   ISourceCollection as IGeneralSourceCollection
} from './Collection';
import FlagsItem from './FlagsItem';
import {IFlags, IFlagsValue} from '../collection';
import {register} from '../di';
import {Object as EventObject} from 'Env/Event';

interface IFlagsCollection<T> extends IGeneralSourceCollection<T>, IFlags<T> {
}

/**
 * Обрабатывает событие об изменении состояния Flags
 * @param event Дескриптор события
 * @param name Название флага
 */
function onSourceChange(event: EventObject, name: string | IFlagsValue[]): void {
   if (Array.isArray(name)) {
      name.forEach((selected, index) => {
         const item = this.getItemBySourceIndex(index);
         this.notifyItemChange(item, 'selected');
      });
   } else {
      const item = this.getItemBySourceItem(name);
      this.notifyItemChange(item, 'selected');
   }
}

/**
 * Проекция для типа "Флаги".
 * @class Types/_display/Flags
 * @extends Types/_display/Collection
 * @public
 * @author Мальцев А.А.
 */
export default class Flags<S, T = FlagsItem<S>> extends Collection<S, T> {
   protected _$collection: IFlagsCollection<S>;
   protected _onSourceChange: (event: EventObject, name: string | IFlagsValue[]) => void;

   constructor(options?: object) {
      super(options);

      if (!this._$collection['[Types/_collection/IFlags]']) {
         throw new TypeError(this._moduleName + ': source collection should implement Types/_collection/IFlags');
      }

      if (this._$collection['[Types/_entity/ObservableMixin]']) {
         this._$collection.subscribe('onChange', this._onSourceChange);
      }
   }

   destroy(): void {
      if (this._$collection['[Types/_entity/DestroyableMixin]'] &&
         this._$collection['[Types/_entity/ObservableMixin]'] &&
         !this._$collection.destroyed
      ) {
         this._$collection.unsubscribe('onChange', this._onSourceChange);
      }

      super.destroy();
   }

   getCollection: () => IFlagsCollection<S>;

   protected _bindHandlers(): void {
      super._bindHandlers();

      this._onSourceChange = onSourceChange.bind(this);
   }
}

Object.assign(Flags.prototype, {
   '[Types/_display/Flags]': true,
   _moduleName: 'Types/display:Flags',
   _itemModule: 'Types/display:FlagsItem',
   _localize: true
});

register('Types/display:Flags', Flags);
