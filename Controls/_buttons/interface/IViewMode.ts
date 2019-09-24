export interface IViewModeOptions {
    viewMode?: string;
}
/**
 * Интерфейс для контролов, которые поддерживают разные режимы отображения кнопки.
 *
 * @interface Controls/_buttons/interface/IViewMode
 * @public
 */

/*
 * Interface for controls, which support different view mode of button.
 *
 * @interface Controls/_buttons/interface/IViewMode
 * @public
 */
export interface IViewMode {
    readonly '[Controls/_buttons/interface/IViewMode]': boolean;
}
/**
 * @name Controls/_buttons/interface/IViewMode#viewMode
 * @cfg {Enum} Режим отображения кнопки.
 * @variant button В виде обычной кнопки по-умолчанию.
 * @variant link В виде гиперссылки.
 * @variant toolButton В виде кнопки для панели инструментов.
 * @default button
 * @demo Controls-demo/Buttons/ViewModes/Index
 * @example
 * Кнопка в режиме отображения 'link'.
 * <pre>
 *    <Controls.breadcrumbs:Path caption="Send document" style="primary" viewMode="link" size="xl"/>
 * </pre>
 * Кнопка в режиме отображения 'toolButton'.
 * <pre>
 *    <Controls.breadcrumbs:Path caption="Send document" style="danger" viewMode="toolButton"/>
 * </pre>
 * Кнопка в режиме отображения 'button'.
 * <pre>
 *    <Controls.breadcrumbs:Path caption="Send document" style="success" viewMode="button"/>
 * </pre>
 * @see Size
 */

/*
 * @name Controls/_buttons/interface/IViewMode#viewMode
 * @cfg {Enum} Button view mode.
 * @variant link Decorated hyperlink.
 * @variant button Default button.
 * @variant toolButton Toolbar button.
 * @default button
 * @example
 * Button with 'link' viewMode.
 * <pre>
 *    <Controls.breadcrumbs:Path caption="Send document" style="primary" viewMode="link" size="xl"/>
 * </pre>
 * Button with 'toolButton' viewMode.
 * <pre>
 *    <Controls.breadcrumbs:Path caption="Send document" style="danger" viewMode="toolButton"/>
 * </pre>
 * Button with 'button' viewMode.
 * <pre>
 *    <Controls.breadcrumbs:Path caption="Send document" style="success" viewMode="button"/>
 * </pre>
 * @see Size
 */
