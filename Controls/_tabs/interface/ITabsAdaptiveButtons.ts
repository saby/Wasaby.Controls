import {ITabsButtons, ITabsButtonsOptions} from './ITabsButtons';
export interface ITabsAdaptiveButtons extends ITabsButtons{
    readonly '[Controls/_tabs/interface/ITabsAdaptiveButtons]': boolean;
}

/**
 * Интерфейс для опций контрола адаптивных вкладок.
 * @interface Controls/_tabs/interface/ITabsAdaptiveButtons
 * @public
 * @author Бондарь А.В.
 */

export interface ITabsAdaptiveButtonsOptions extends ITabsButtonsOptions {
    align?: string;
    containerWidth: number;
}
/**
 * @name Controls/_tabs/interface/ITabsAdaptiveButtons#align
 * @cfg {String} Выравнивание вкладок по правому или левому краю.
 * @variant left Вкладки выравниваются по левому краю.
 * @variant right Вкладки выравниваются по правому краю.
 * @default right
 */

/**
 * @name Controls/_tabs/interface/ITabsAdaptiveButtons#containerWidth
 * @cfg {Number} Ширина контейнера вкладок. Необходимо указывать для правильного расчета ширины вкладок.
 */
