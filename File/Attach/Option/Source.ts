/// <amd-module name="File/Attach/Option/Source" />
import {IFileDataConstructor} from "File/IFileDataConstructor";
import {IFileData} from "File/IFileData";
/**
 * Класс конфигурации ISource, передаваемый в Attach
 * @class
 * @name File/Attach/Option/Source
 * @public
 * @see File/Attach
 * @author Заляев А.В.
 */
class SourceOption {
    /**
     * @cfg {String} source Ссылка на модуль источника данных ISource
     * @see WS.Data/Source/ISource
     */
    /**
     * @cfg {FunctionConstructor} resourceType Конструктор обёртки над ресурсом
     * @see File/LocalFile
     * @see File/LocalFileLink
     * @see File/HttpFileLink
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
     * @name File/Attach/Option/Source#getSourceName
     */
    getSourceName(): string {
        return this.source;
    }
    /**
     * Параметры вызова конструктора
     * @return {*}
     * @name File/Attach/Option/Source#getOptions
     */
    getOptions(): any {
        return this.options;
    }
    /**
     * Возвращает конструктор ресурса, для которого будет зарегестрирован источник
     * @return {File/IFileDataConstructor}
     * @name File/Attach/Option/Source#getResourceType
     */
    getResourceType(): IFileDataConstructor {
        return this.resourceType;
    }
}
export = SourceOption;