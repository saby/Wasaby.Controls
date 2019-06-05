/**
 * Interface for control DragBorders.
 *
 * @interface Controls/_interface/IDraggableBorders
 * @public
 * @author Zhuravlev M.S.
 */
export type Border = 'left' | 'right';

export interface IDraggableBordersOptions {
    /**
     * @name Controls/_interface/IDraggableBorders#draggableBorders
     * @cfg {Enum} Button display style.
     * @variant primary
     * @variant success
     * @variant warning
     * @variant danger
     * @variant info
     * @variant secondary
     * @variant default
     * @default secondary
     * @example
     * Primary link button with 'primary' style.
     * <pre>
     *    <Controls.buttons:Path caption="Send document" style="primary" viewMode="link" size="xl"/>
     * </pre>
     * Toolbar button with 'danger' style.
     * <pre>
     *    <Controls.buttons:Path caption="Send document" style="danger" viewMode="toolButton"/>
     * </pre>
     * @see Size
     */
    draggableBorders: Border[];
}

interface IDraggableBorders {
    readonly '[Controls/_interface/IDraggableBorders]': boolean;
}

export default IDraggableBorders;
