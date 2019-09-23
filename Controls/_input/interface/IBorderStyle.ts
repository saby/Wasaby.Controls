export type BorderStyle = 'success' | 'secondary' | 'warning';

/**
 * Интерфейс обводки полей ввода.
 *
 * @interface Controls/_input/interface/IBorderStyle
 * @public
 * @author Красильников А.С.
 */
export interface IBorderStyleOptions {
    /**
     * @name Controls/_input/interface#borderStyle
     * @cfg {Enum} Цвет обводки поля ввода
     * @variant success
     * @variant secondary
     * @variant warning
     * @demo Controls-demo/Input/BorderStyles/Index
     */
    borderStyle: BorderStyle;
}

interface IBorderStyle {
    readonly '[Controls/_input/interface/IBorderStyle]': boolean;
}

export default IBorderStyle;
