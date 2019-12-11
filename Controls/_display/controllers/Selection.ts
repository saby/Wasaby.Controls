import Collection from '../Collection';
import { updateCollection } from './controllerUtils';
import { Model } from 'Types/entity';

export interface ISelectionItem {
    getContents(): Model;
    setSelected(selected: boolean|null): void;
    isSelected(): boolean|null;
}

export type TSelectionMap = Map<string|number, boolean|null>;

export function selectItems(collection: Collection<unknown>, selection: TSelectionMap): void {
    updateCollection(collection, () => {
        collection.each((item: ISelectionItem) => {
            const itemId: string|number = item.getContents().getId();
            let selected: boolean|null = false;

            if (selection.has(itemId)) {
                selected = selection.get(itemId);
            }

            item.setSelected(selected);
        });
    });
}
