import { TItemActionShowType } from '../interface/IItemAction';
import { IShownItemAction } from '../interface/IItemActionsContainer';

/**
 * Утилиты для измерения опций свайпа, которые нужно показать на странице
 */
export class MeasurerUtils {
    /**
     * Возвращает набор опций свайпа, которые нужно показать на странице.
     * @param actions
     */
    static getActualActions(actions: IShownItemAction[]): IShownItemAction[] {
        const itemActions = actions.filter((action) => !action.parent);
        itemActions.sort((action1: IShownItemAction, action2: IShownItemAction) => (
            (action2.showType || TItemActionShowType.MENU) - (action1.showType || TItemActionShowType.MENU)
        ));
        return itemActions;
    }
}
