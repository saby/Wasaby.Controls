export interface IPropStorageOptions {
    propStorageId?: string;
}

/**
 * Интерфейс для контролов, сохраняющих пользовательскую конфигурацию.
 *
 * @interface Controls/_interface/IPropStorage
 * @public
 * @author Красильников А.С.
 */

export default interface IPropStorage {
    readonly '[Controls/_interface/IPropStorage]': boolean;
}

/**
 * @name Controls/_interface/IPropStorage#propStorageId
 * @cfg {String} Уникальный идентификатор контрола, по которому будет сохраняться конфигурация в хранилище данных.
 */
