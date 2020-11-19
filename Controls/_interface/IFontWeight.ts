export type TFontWeight = 'default' | 'bold';

export interface IFontWeightOptions {
    fontWeight: TFontWeight;
}

/**
 * Интерфейс для контролов, которые поддерживают разные начертания шрифта.
 *
 * @interface Controls/_interface/IFontWeight
 * @public
 * @author Красильников А.С.
 */
export default interface IFontWeight {
    readonly '[Controls/_interface/IFontWeight]': boolean;
}

/**
 * @name Controls/_interface/IFontWeight#fontWeight
 * @cfg {String} Начертание шрифта
 * @variant default
 * @variant bold
 * @default default
 * @demo Controls-demo/Decorator/Money/FontWeight/Index
 */
