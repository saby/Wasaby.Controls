import { CollectionItem } from 'Controls/display';
import { Model } from 'Types/entity';
import { IPlaceholders, IDirection } from '../ScrollContainer/interfaces';

interface ITriggerOffset {
    top: number;
    bottom: number;
}

interface IScrollControllerResult {
    placeholders?: IPlaceholders;
    triggerOffset?: ITriggerOffset;
}

interface IGeneralScrollConrtoller {

    /**
     * Обработка добавления записей. Производит корректировку отображаемого диапазона и размера распорок.
     * Возвращает размеры распорок после корректировки виртуального скролла.
     * @param newItemsIndex индекс добавляемых записей
     * @param newItems добавляемые записи
     */
    handleAddItems(newItemsIndex: number, newItems: Array<CollectionItem<Model>>): IScrollControllerResult;

    /**
     * Обработка удаления записей. Производит корректировку отображаемого диапазона и размера распорок.
     * Возвращает размеры распорок после корректировки виртуального скролла.
     * @param newItemsIndex индекс добавляемых записей
     * @param newItems добавляемые записи
     */
    handleRemoveItems(newItemsIndex: number, newItems: Array<CollectionItem<Model>>): IScrollControllerResult;

    /**
     * Выполняет подскролл к записи. Если элемент не находится в текущем отображаемом диапазоне, 
     * сдвигает диапазон к нужной записи.
     */
    scrollToItem(index: number, toBottom: boolean, force: boolean): Promise;

    /**
     * Нужно ли сохранять и восстанавливать позицию скролла
     */
    needSaveAndRestoreScrollPosition(): boolean;

    /**
     * Сдвигает диапазон в указанном направлении, если это возможно. Возвращает true в случае успеха.
     */
    tryShiftToDirection(direction: IDirection): boolean;

    /**
     * обрабатывает изменение позиции скролла
     */
    scrollPositionChange(params: IScrollParams, virtual: boolean): IScrollControllerResult;

    /**
     * обновление параметров скролла
     * @param params 
     */
    updateScrollParams(params: Partial<IScrollParams>):  IScrollControllerResult;
    /**
     * обновление опций и параметров скролла
     * @param options 
     * @param params 
     */
    update(options, params: Partial<IScrollParams>):  IScrollControllerResult;
    /**
     * обновление высот записей для виртуального скролла
     * @param itemsHeights 
     */
    updateItemsHeights(itemsHeights: IItemsHeights);
    /**
     * Выполнение отложенных на время перерисовки вызовов
     */
    afterRender();
    /**
     * Возвращает параметры для восстановления скролла
     */
    getParamsToRestoreScroll(): IScrollRestoreParams
    /**
     * Сохранения состояния видимости триггеров
     */
    setTriggerVisibility(triggerName: IDirection, triggerVisible: boolean);
}