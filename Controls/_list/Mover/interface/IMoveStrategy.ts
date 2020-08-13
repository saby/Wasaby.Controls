import {TKeySelection} from 'Controls/interface';

export interface IMoveStrategy {
    movedItems(): TKeySelection;
    beforeItemsMoveResult(): void;

}
