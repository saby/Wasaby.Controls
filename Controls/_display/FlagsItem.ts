import CollectionItem from './CollectionItem';
import Flags from './Flags';
import {register} from 'Types/di';

/**
 * Элемент коллекции флагов
 * @class Controls/_display/FlagsItem
 * @extends Controls/_display/CollectionItem
 * @private
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
    '[Controls/_display/FlagsItem]': true,
    _moduleName: 'Controls/display:FlagsItem'
});

register('Controls/display:FlagsItem', FlagsItem, {instantiate: false});
