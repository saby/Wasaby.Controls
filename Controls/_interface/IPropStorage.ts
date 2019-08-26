/**
 * Интерфейс для контролов, сохраняющих пользовательскую конфигурацию.
 *
 * @interface Controls/interface/IPropStorage
 * @public
 * @author Красильников А.С.
 */
interface IPropStorage {
    readonly _options: {
        /**
         * @name Controls/interface/IPropStorage#propStorageId
         * @cfg {String} Уникальный идентификатор контрола, по которому будет сохраняться конфигурация в хранилище данных.
         */
        propStorageId: string;
    };
}

export default IPropStorage;
