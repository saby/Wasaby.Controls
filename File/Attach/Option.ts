/// <amd-module name="File/Attach/Option" />
/**
 * Класс конфигурации передаваемый в {@link File/Attach}
 * @class File/Attach/Option
 * @public
 * @abstract
 * @see File/Attach
 * @author Заляев А.В.
 */
export abstract class Option {
    protected options: object;
    /**
     * Возвращает параметры вызова конструктора
     * @return {*}
     * @name File/Attach/Option#getOptions
     */
    getOptions(): any {
        return this.options;
    }
}
