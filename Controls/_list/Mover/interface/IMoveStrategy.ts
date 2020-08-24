import {TKeySelection} from 'Controls/interface';

export interface IMoveStrategy<T> {
    movedItems(): TKeySelection;
    beforeItemsMoveResult(): void;
    moveItems(items: T, target, position): Promise<any>
}
