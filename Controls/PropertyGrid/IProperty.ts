/**
 * Description.
 *
 * @interface Controls/PropertyGrid/IProperty
 * @public
 * @author Герасимов А.М.
 */

type TProperty = String | Boolean | Number | Date | number[] | string[];

export default interface IProperty {
    /**
     * @name Controls/PropertyGrid/IProperty#name
     * @cfg {String} property name
     */
    name: string;
    /**
     * @name Controls/PropertyGrid/IProperty#caption
     * @cfg {String} caption A custom caption to appear as label for this field.
     * If specified, the caption will be shown in the name column instead of the property name.
     */

    caption?: string;
    /**
     * @name Controls/PropertyGrid/IProperty#editorTemplateName
     * @cfg {String} Name of the control, the will be user as editor, if left unset the default editor will used
     */
    editorTemplateName?: string;
    /**
     * @name Controls/PropertyGrid/IProperty#editorOptions
     * @cfg {Object} Options for the editor
     */
    editorOptions?: object;
    /**
     * @name Controls/PropertyGrid/IProperty#type
     * @cfg {String} type of property, the available values are:
     * ‘int’, ‘boolean’, ‘string’, ‘enum’, ‘date’,if left unset, type will detected by value.
     */
    type?: TProperty;
    /**
     * @name Controls/PropertyGrid/IProperty#group
     * @cfg {String} by this fieldeditors will grouped.
     */
    group?: string;
}
