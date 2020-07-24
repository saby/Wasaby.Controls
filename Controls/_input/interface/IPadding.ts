import {descriptor} from 'Types/entity';

/**
 * @typedef {String} THorizontalPadding
 * @variant xs
 * @variant null
 */
export type THorizontalPadding = 'xs' | 'null';

/**
 * Интерфейс для контролов, которые поддерживают разные размеры отступов текста от контейнера.
 *
 * @interface Controls/_input/interface/IPadding
 * @public
 * @author Красильников А.С.
 */
export interface IPaddingOptions {
    /**
     * @name Controls/_input/interface/IPadding#horizontalPadding
     * @cfg {THorizontalPadding} Размер отступов контрола по горизонтали.
     */
    horizontalPadding: THorizontalPadding;
}

export function getDefaultPaddingOptions(): Partial<IPaddingOptions> {
    return {
        horizontalPadding: 'xs'
    };
}

export function getOptionPaddingTypes(): object {
    return {
        horizontalPadding: descriptor<string>(String).oneOf([
            'xs', 'null'
        ])
    };
}

interface IPadding {
    readonly '[Controls/interface/IPadding]': boolean;
}

export default IPadding;
