/**
 * Interface of PropertyGrid property.
 *
 * @interface Controls/_propertyGrid/IProperty
 * @public
 * @author Герасимов А.М.
 */

type TProperty = String | Boolean | Number | Date | number[] | string[];

export default interface IProperty {
    /**
     * @name Controls/_propertyGrid/IProperty#name
     * @cfg {String} property name
     */
    name: string;
    /**
     * @name Controls/_propertyGrid/IProperty#caption
     * @cfg {String} caption A custom caption to appear as label for this field.
     * If specified, the caption will be shown in the name column instead of the property name.
     */

    caption?: string;
    /**
     * @name Controls/_propertyGrid/IProperty#editorTemplateName
     * @cfg {String} Name of the control, the will be user as editor, if left unset the default editor will used
     */
    editorTemplateName?: string;
    /**
     * @name Controls/_propertyGrid/IProperty#editorOptions
     * @cfg {Object} Options for the editor
     */
    editorOptions?: object;
    /**
     * @name Controls/_propertyGrid/IProperty#type
     * @cfg {String} type of property, the available values are:
     * ‘int’, ‘boolean’, ‘string’, ‘enum’, ‘date’,if left unset, type will detected by value.
     */
    type?: TProperty;
    /**
     * @name Controls/_propertyGrid/IProperty#group
     * @cfg {String} by this fieldeditors will grouped.
     */
    group?: string;
}
