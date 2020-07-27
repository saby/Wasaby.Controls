import { CollectionItem } from 'Controls/display';
import { Model } from 'Types/entity';
import { IPlaceholders, IDirection } from '../ScrollContainer/interfaces';

// При необходимости, можно будет расширить для горизонтального направления.
interface ITriggers {
    top: HTMLElement,
    bottom: HTMLElement,
}
interface IGeneralScrollConrtoller {

    /**
     * Обработка добавления записей. Производит корректировку отображаемого диапазона и размера распорок.
     * Возвращает размеры распорок после корректировки виртуального скролла.
     * @param newItemsIndex индекс добавляемых записей
     * @param newItems добавляемые записи
     */
    handleAddItems(newItemsIndex: number, newItems: Array<CollectionItem<Model>>): IPlaceholders;

    /**
     * Обработка удаления записей. Производит корректировку отображаемого диапазона и размера распорок.
     * Возвращает размеры распорок после корректировки виртуального скролла.
     * @param newItemsIndex индекс добавляемых записей
     * @param newItems добавляемые записи
     */
    handleRemoveItems(newItemsIndex: number, newItems: Array<CollectionItem<Model>>): IPlaceholders;

    /**
     * Выполняет подскролл к записи. Если элемент не находится в текущем отображаемом диапазоне, 
     * сдвигает диапазон к нужной записи.
     */
    scrollToItem(index: number, toBottom: boolean, force: boolean);

    /**
     * Нужно ли сохранять и восстанавливать позицию скролла
     */
    needSaveAndRestoreScrollPosition(): boolean;

    /**
     * Сдвигает диапазон в указанном направлении, если это возможно. Возвращает true в случае успеха.
     */
    tryShiftToDirection(direction: IDirection): boolean;

    /**
     * Сохраняет DOM-элементы триггеров
     */
    saveTriggers(triggers: ITriggers);

    /**
     * обрабатывает изменение позиции скролла
     */
    scrollPositionChange(params: IScrollParams, virtual: boolean)
}