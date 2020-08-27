import {TKeysSelection} from 'Controls/interface';

/**
 * Интерфейс объекта для перемещения в новой логике
 * @interface Controls/_mover/interface/IMoveObject
 * @public
 * @author Аверкиев П.А.
 */

/*
 * Move object interface
 * @interface Controls/_mover/interface/IMoveObject
 * @public
 * @author Аверкиев П.А.
 */
export interface IMoveObject {
    /**
     * @name Controls/_mover/interface/IMoveObject#selectedKeys
     * @cfg {Controls/interface:TKeysSelection} Список выбранных ключей для перемещения
     */
    /*
     * @name Controls/_mover/Controller/IMoveObject#selectedKeys
     * @cfg {Controls/interface:TKeysSelection}
     */
    selectedKeys: TKeysSelection;
    /**
     * @name Controls/_mover/interface/IMoveObject#excludedKeys
     * @cfg {Controls/interface:TKeysSelection} Список выбранных ключей для исключения из перемещаемых элементов
     */
    /*
     * @name Controls/_mover/Controller/IMoveObject#excludedKeys
     * @cfg {Controls/interface:TKeysSelection}
     */
    excludedKeys: TKeysSelection;
    /**
     * @name Controls/_mover/interface/IMoveObject#filter
     * @cfg {Controls/interface:TKeysSelection} Дополнительный фильтр, применяемый к перемещаемым записям
     */
    /*
     * @name Controls/_mover/Controller/IMoveObject#filter
     * @cfg {Controls/interface:TKeysSelection}
     */
    filter: object;
}
