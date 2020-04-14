export type BorderStyle = 'success' | 'secondary' | 'warning';

/**
 * Интерфейс для контролов, которые поддерживают разные цвета границы
 *
 * @interface Controls/interface/IBorderStyle
 * @public
 * @author Красильников А.С.
 */
export interface IBorderStyleOptions {
    /**
     * @name Controls/interface/IBorderStyle#borderStyle
     * @cfg {Enum} Цвет обводки контрола.
     * @variant success
     * @variant secondary
     * @variant warning
     * @demo Controls-demo/Input/BorderStyles/Index
     */
    borderStyle: BorderStyle;
}

interface IBorderStyle {
    readonly '[Controls/interface/IBorderStyle]': boolean;
}

export default IBorderStyle;
