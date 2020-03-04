export interface IIconSizeOptions {
   iconSize?: string;
}

/**
 * Интерфейс для контролов, которые поддерживают разные размеры иконок
 *
 * @interface Controls/_interface/IIconSize
 * @public
 * @author Крайнов Д.О.
 */

/*
 * Interface for button icon.
 *
 * @interface Controls/_interface/IIconSize
 * @public
 */
export default interface IIconSize {
   readonly '[Controls/_interface/IIconSize]': boolean;
}
/**
 * @typedef {String} IconSize
 * @variant s Маленькая.
 * @variant m Средняя.
 * @variant l Большая.
 * @variant default По умолчанию.
 */

/**
 * @name Controls/_interface/IIconSize#iconSize
 * @cfg {IconSize} Размер иконки.
 * @default default
 * @remark
 * Каждому значению опции соответствует размер в px. Он зависит от {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/themes/ темы оформления} приложения.
 * В контроле {@link Controls/dropdown:Button} опция задаёт общий размер для иконки внутри кнопки и иконок внутри элементов выпадающего меню.
 * @demo Controls-demo/Buttons/SizesAndHeights/Index
 * @example
 * Кнопка с размером иконки по умолчанию.
 * <pre>
 *    <Controls.buttons:Button icon="icon-Add" viewMode="button"/>
 * </pre>
 * Кнопка с иконкой большого размера (l).
 * <pre>
 *    <Controls.buttons:Button icon="icon-Add" iconSize="l" viewMode="button"/>
 * </pre>
 * @see Icon
 */

/*
 * @name Controls/_interface/IIconSize#iconSize
 * @cfg {Enum} Icon display Size.
 * @variant s
 * @variant m
 * @variant l
 * @variant default
 * @example
 * Button with default icon size.
 * <pre>
 *    <Controls.buttons:Button icon="icon-Add" viewMode="button"/>
 * </pre>
 * Button with large size.
 * <pre>
 *    <Controls.buttons:Button icon="icon-Add" iconSize="l" viewMode="button"/>
 * </pre>
 * @see Icon
 */
