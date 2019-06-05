export interface IToggleGroupOptions {
    direction?: string;
}

/**
 * Interface for group of toggle control.
 *
 * @interface Controls/_toggle/interface/IToggleGroup
 * @public
 * @author Михайловский Д.С.
 */

export interface IToggleGroup {
    readonly '[Controls/_toggle/interface/IToggleGroup]': boolean;
    /**
     * @name Controls/_toggle/interface/IToggleGroup#direction
     * @cfg {string} Arrangement of elements in the container.
     * @variant horizontal Elements are located one after another.
     * @variant vertical Elements are located one under another.
     * @default Horizontal
     * @example
     * Vertical orientation.
     * <pre>
     *    <Controls.toggle:RadioGroup direction="horizontal"/>
     * </pre>
     */
}
