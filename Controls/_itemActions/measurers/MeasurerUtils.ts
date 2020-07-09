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

    /**
     * Позволяет получить горизонтальные размеры опций свайпа для расчёта их видимости в текущем контейнере.
     */
    static calculateActionsSizes(itemActions: IItemAction[], rowWidth: number, itemActionTemplate: Function) {
        let itemsHtml = [];

        // 1. Вызываем шаблон каждой опции и собираем в массив строк HTML
        // 2.
        const itemsSizes = MeasurerUtils.measureSizesOfItems(
            itemsHtml,
            'controls-UtilsItemAction__measurer',
            'controls-itemActionsV__action');
    }

    /**
     * Вычисляет горизонтальные размеры элементов, переданных в первом аргументе
     * Создаёт HTML контейнер с содержимым переданных в itemsHtml элементов и вычисляет гориз. размер каждого элемента
     * @param itemsHtml
     * @param measurerBlockClass
     * @param itemClass
     */
    static measureSizesOfItems(itemsHtml: string[], measurerBlockClass: string, itemClass: string): number[] {
        const itemsSizes: number[] = [];
        const measurer: HTMLElement = document.createElement('div');
        measurer.innerHTML = itemsHtml.join('');
        measurer.classList.add(measurerBlockClass);
        document.body.appendChild(measurer);
        [].forEach.call(measurer.getElementsByClassName(itemClass), (item) => {
            const styles = window.getComputedStyle(item);
            const padding = parseFloat(styles.marginLeft) + parseFloat(styles.marginRight);
            itemsSizes.push(item.clientWidth + padding);
        });
        document.body.removeChild(measurer);
        return itemsSizes;
    }
}
