import {descriptor} from 'Types/entity';

/**
 * @typedef {String} TBorderVisibility
 * @variant visible
 * @variant partial
 * @variant hidden
 */
export type TBorderVisibility = 'visible' | 'partial' | 'hidden';

/**
 * Интерфейс для контролов, которые поддерживают разное количество видимых границ.
 *
 * @interface Controls/_input/interface/IBorderVisibility
 * @public
 * @author Красильников А.С.
 */
export interface IBorderVisibilityOptions {
    /**
     * @name Controls/_input/interface/IBorderVisibility#borderVisibility
     * @cfg {TBorderVisibility} Видимость границ контрола.
     * @demo Controls-demo/Input/BorderVisibility/Index
     */
    borderVisibility: TBorderVisibility;
}

export function getDefaultBorderVisibilityOptions(): Partial<IBorderVisibilityOptions> {
    return {
        borderVisibility: 'visible'
    };
}

export function getOptionBorderVisibilityTypes(): object {
    return {
        borderVisibility: descriptor<string>(String).oneOf([
            'visible', 'partial', 'hidden'
        ])
    };
}

interface IBorderVisibility {
    readonly '[Controls/interface/IBorderVisibility]': boolean;
}

export default IBorderVisibility;
