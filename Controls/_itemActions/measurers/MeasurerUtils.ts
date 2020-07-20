import {IItemAction, TItemActionShowType} from '../interface/IItemActions';

/**
 * Утилиты для измерения опций свайпа, которые нужно показать на странице
 */
export class MeasurerUtils {
    /**
     * Возвращает набор опций свайпа, которые нужно показать на странице.
     * @param actions
     */
    static getActualActions(actions: IItemAction[]): IItemAction[] {
        const itemActions = actions.filter((action) => !action.parent);
        itemActions.sort((action1: IItemAction, action2: IItemAction) => (
            (action2.showType || TItemActionShowType.MENU) - (action1.showType || TItemActionShowType.MENU)
        ));
        return itemActions;
    }
}
