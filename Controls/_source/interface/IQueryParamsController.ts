import {IAdditionalQueryParams, Direction} from './IAdditionalQueryParams';
import {RecordSet} from 'Types/collection';
import {Record} from 'Types/entity';
import { Collection } from 'Controls/display';

/**
 * Интерфейс для работы с контроллерами пейджинации
 * @interface Controls/source/IQueryParamsController
 * @private
 * @author Аверкиев П.А.
 */
/*
 * Pagination controller interface
 * @interface Controls/interface/IQueryParamsController
 * @private
 * @author Аверкиев П.А.
 */
export interface IQueryParamsController {
    /**
     * Устанавливает текущую позицию или страницу
     * @remark
     * @param to номер страницы или позиция для перехода
     */
    /*
     * Set current page or position
     * @remark
     * @param to page number or position to go to
     */
    setPageNumber(to: number | unknown): void;

    /**
     * Собирает параметры текущего состояния пейджинации для передачи их в Query
     * @param direction
     */
    /*
     * Collect current pagination state to pass them to Query object
     * @param direction
     */
    prepareQueryParams(direction: Direction): IAdditionalQueryParams;

    /**
     * Метод для разрушения текущего объекта IQueryParamsController
     */
    /*
     * Destroy current object IQueryParamsController
     */
    destroy(): void;

    /**
     * Включает у контроллера IQueryParamsController режим совместимости с SourceController
     */
    /*
     * Will set IQueryParamsController to legacy mode for SourceController
     */
    legacyModeOn(): IQueryParamsController;

    /**
     * Вычисляет следующее состояние контроллера, например, текущую и следующую страницу, или позицию для навигации
     * @param direction {Direction} направление навигации ('up' или 'down')
     * @param list {Types/collection:RecordSet} объект, содержащий метаданные текущего запроса
     */
    /*
     * Calculates current controller state, i.e. current and next page, or position for navigation
     * @param direction {Direction} nav direction ('up' or 'down')
     * @param list {Types/collection:RecordSet} object containing meta information for current request
     */
    calculateState(list?: RecordSet  | {[p: string]: unknown}, direction?: Direction): void;

    /**
     * Считает количество записей всего по мета информации из текущего состояния контроллера и ключу DataSet
     * @param rootKey свойство key в DataSet
     * TODO Возможно, метод устарел
     */
    /*
     * Calculates total records count by meta information from current controller state and DataSet key
     * @param rootKey DataSet key property
     * TODO Probably Deprecated
     */
    getAllDataCount(rootKey?: string|number): boolean | number;

    /**
     * Считает число записей, загружаемых за один запрос
     * TODO Возможно, метод устарел
     */
    /*
     * Calculates count of records loaded per request
     * TODO Probably Deprecated
     */
    getLoadedDataCount(): number;

    /**
     * Проверяет, есть ли ещё данные для загрузки
     * @param direction {Direction} nav direction ('up' или 'down')
     * @param rootKey свойство key в DataSet
     * TODO Возможно, метод устарел
     */
    /*
     * Checks if there any more data to load
     * @param direction {Direction} nav direction ('up' or 'down')
     * @param rootKey DataSet key property
     * TODO Probably Deprecated
     */
    hasMoreData(direction: Direction, rootKey: string|number): boolean|undefined;

    /**
     * Позволяет установить параметры контроллера из Collection<Record>
     * @param model
     * TODO костыль https://online.sbis.ru/opendoc.html?guid=b56324ff-b11f-47f7-a2dc-90fe8e371835
     * TODO Возможно, метод устарел
     */
    /*
     * Allows manual set of current controller state using Collection<Record>
     * @param model
     * TODO Probably Deprecated
     */
    setState(model: Collection<Record>): void;

    /**
     * Устанавливает текущую страницу в контроллере
     * при прокрутке при помощи скроллпэйджинга в самое начало или самый конец списка.
     * @param direction {Direction} направление навигации ('up' или 'down')
     * TODO Возможно, метод устарел
     */
    /*
     * Set current page in controller when scrolling with "scrollpaging" to the top or bottom of the list
     * @param direction {Direction} nav direction ('up' or 'down')
     * TODO Probably Deprecated
     */
    setEdgeState(direction: Direction): void;
}
