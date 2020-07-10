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
     * Вычисляет горизонтальные размеры элементов, переданных в первом аргументе
     * Создаёт HTML контейнер с содержимым переданных в itemsHtml элементов и вычисляет гориз. размер каждого элемента.
     * Также вычисляет отступы контейнера, в котором создаются опции. Это позволяет более точно определить,
     * сколько реально опций влезает в контейнер
     * @param itemsHtml
     * @param measurerBlockClass
     * @param itemClass
     */
    static calculateSizesOfItems(itemsHtml: string[], measurerBlockClass: string, itemClass: string): {
        itemsSizes: number[];
        blockSize: number;
    } {
        const itemsSizes: number[] = [];
        const measurer: HTMLElement = document.createElement('div');
        let measurerStyles;
        let blockSize;
        measurer.innerHTML = itemsHtml.join('');
        measurer.classList.add(measurerBlockClass);
        document.body.appendChild(measurer);
        measurerStyles = window.getComputedStyle(measurer);
        blockSize = parseFloat(measurerStyles.paddingLeft) + parseFloat(measurerStyles.paddingRight) +
            parseFloat(measurerStyles.marginLeft) + parseFloat(measurerStyles.marginRight);

        [].forEach.call(measurer.getElementsByClassName(itemClass), (item) => {
            const styles = window.getComputedStyle(item);
            const margin = parseFloat(styles.marginLeft) + parseFloat(styles.marginRight);
            itemsSizes.push(item.clientWidth + margin);
        });
        document.body.removeChild(measurer);
        return {
            itemsSizes,
            blockSize
        };
    }
}
