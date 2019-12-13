import {
    updateCollection,
    IBaseCollection,
    TCollectionKey
} from './controllerUtils';

import { Model } from 'Types/entity';

export interface ISelectionItem {
    getContents(): Model;
    setSelected(selected: boolean | null): void;
    isSelected(): boolean;
}

export interface ISelectionCollection extends IBaseCollection {
    each(cb: (item: ISelectionItem) => void): void;
}

export type TSelectionMap = Map<TCollectionKey, boolean>;

export function selectItems(
    collection: ISelectionCollection,
    selection: TSelectionMap
): void {
    updateCollection(collection, () => {
        collection.each((item: ISelectionItem) => {
            const itemId: TCollectionKey = item.getContents().getId();
            let selected: boolean = false;

            if (selection.has(itemId)) {
                selected = selection.get(itemId);
            }

            item.setSelected(selected);
        });
    });
}
