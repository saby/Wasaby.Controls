import {IAdditionalQueryParams, Direction} from './IAdditionalQueryParams';
import {RecordSet} from 'Types/collection';

/**
 * Интерфейс для работы с контроллерами пейджинации
 * @interface Controls/_source/interface/IPaginationController
 * @public
 * @author Аверкиев П.А.
 */
/*
 * Pagination controller interface
 * @interface Controls/_source/interface/IPaginationController
 * @public
 * @author Аверкиев П.А.
 */
export interface IPaginationController {
    /**
     * Вычисляет текущее состояние контроллера, например, текущую и следующую страницу, или позицию для пейджинации
     * @param list {Types/collection:RecordSet} объект, содержащий метаданные текущего запроса
     * @param direction {Direction} направление навигации ('up' или 'down')
     */
    calculateState(list: RecordSet, direction?: Direction): void;

    /**
     * Метод для разрушения текущего объекта IPaginationController
     */
    destroy(): void;

    /**
     * Считает количество данных всего по мета информации из текущего состояния контроллера и ключу DataSet
     * @param rootKey
     */
    getAllDataCount(rootKey?: string|number): boolean | number;

    /**
     * Считает число записей, загружаемых за один запрос
     */
    getLoadedDataCount(): number;

    /**
     * Проверяет, есть ли ещё данные для загрузки
     * @param direction
     * @param key
     */
    hasMoreData(direction: Direction, key: string|number): boolean|undefined;

    /**
     * Позволяет вручную установить текущее состояние контроллера, например, текущую и следующую страницу, или позицию
     * для пейджинации
     * @param state
     * TODO костыль https://online.sbis.ru/opendoc.html?guid=b56324ff-b11f-47f7-a2dc-90fe8e371835
     */
    setState(state: any): void;

    /**
     * Устанавливает текущую страницу в контроллере
     * при прокрутке при помощи скроллпэйджинга в самое начало или самый конец списка.
     * @param direction
     */
    setEdgeState(direction: Direction): void;

    /**
     * Собирает параметры текущего состояния пейджинации для передачи их в Query
     * @param direction
     */
    prepareQueryParams?(direction: Direction): IAdditionalQueryParams;
}
