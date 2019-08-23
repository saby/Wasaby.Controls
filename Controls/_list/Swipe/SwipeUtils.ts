import { IItemAction, ShowType} from './interface/IItemAction';

export function getActualActions(actions: IItemAction[]): IItemAction[] {
    let itemActions = actions.filter((action) => !action.parent);
    itemActions.sort(function(action1, action2) {
        return (action2.showType || ShowType.MENU) - (action1.showType || ShowType.MENU);
    });
    return itemActions;
};
