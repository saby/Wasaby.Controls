import {IInstantiable, IVersionable, Record} from 'Types/entity';
import {ICollection} from "./ICollection";


export interface ICollectionItem extends IInstantiable, IVersionable {
    getOwner(): ICollection<Record, ICollectionItem>;
    setOwner(owner: ICollection<Record, ICollectionItem>): void;

    /**
     * Получить пердставление текущего элемента
     * @method
     * @public
     * @return {Types/entity:Model} Опции записи
     */
    getContents(): Record;
    setContents(contents: Record, silent?: boolean);
}
