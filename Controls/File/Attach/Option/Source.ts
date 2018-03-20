/// <amd-module name="Controls/File/Attach/Option/Source" />

/**
 * Класс конфигурации ISource, передаваемый в Attach
 * @class
 * @name Controls/File/Attach/Option/Source
 * @public
 * @see Controls/File/Attach
 * @author Заляев А.В.
 */
class SourceOption {
    /**
     * @cfg {String} source Ссылка на модуль источника данных ISource
     * @see WS.Data/Source/ISource
     */
    /**
     * @cfg {FunctionConstructor} resourceType Конструктор обёртки над ресурсом
     * @see Controls/File/LocalFile
     * @see Controls/File/LocalFileLink
     * @see Controls/File/HttpFileLink
     */
    /**
     * @cfg {Object} options Объект параметров для конструктора ISource
     * @see WS.Data/Source/ISource
     */
    constructor(
        protected source: string,
        protected resourceType: IFileDataConstructor,
        protected options: any
    ){}
    /**
     * Возвращает ссылку на модуль с регестрируемым источником данных
     * @return {string}
     * @name Controls/File/Attach/Option/Source#getSourceName
     */
    getSourceName(): string {
        return this.source;
    }
    /**
     * Параметры вызова конструктора
     * @return {*}
     * @name Controls/File/Attach/Option/Source#getOptions
     */
    getOptions(): any {
        return this.options;
    }
    /**
     * Возвращает конструктор ресурса, для которого будет зарегестрирован источник
     * @return {Controls/File/IFileDataConstructor}
     * @name Controls/File/Attach/Option/Source#getResourceType
     */
    getResourceType(): IFileDataConstructor {
        return this.resourceType;
    }
}
export = SourceOption;