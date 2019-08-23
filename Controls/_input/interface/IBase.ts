/**
 * Интерфейс базового поля ввода.
 *
 * @interface Controls/_input/interface/IBase
 * @public
 */
export interface IBaseOptions {
    /**
     * @name Controls/_input/interface/IBase#selectOnClick
     * @cfg {Boolean} Определяет выделение текста после клика по полю.
     * @remark
     * * false - Текст не выделяется.
     * * true - Текст выделяется.
     * @demo Controls-demo/Input/SelectOnClick/Index
     */
    selectOnClick: boolean;

    paste: (value: string) => void;
}

interface IBase {
    readonly '[Controls/_interface/IBase]': boolean;
}

export default IBase;