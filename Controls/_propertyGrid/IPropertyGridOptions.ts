import IPropertyGridProperty from './IProperty';

/**
 * Property grid options
 *
 * @interface Controls/_propertyGrid/IPropertyGridOptions
 * @public
 * @author Герасимов А.М.
 */
export default interface IPropertyGridOptions {
    /**
     * @name Controls/_propertyGrid/IPropertyGridOptions#editingObject
     * @cfg {Object} data object that will be displayed as editors with values in _propertyGrid
     */
    editingObject: Object;
    /**
     * @typedef {Object} IPropertyGridProperty
     * @property {String} name property name.
     * @property {String} caption A custom caption to appear as label for this field.
     * If specified, the caption will be shown in the name column instead of the property name.
     * @property {String} editorTemplateName Name of the control, the will be user as editor,
     * if left unset the default editor will used.
     * @property {Object} editorOptions Options for the editor.
     * @property {String} type Type of property, the available values are:
     * ‘int’, ‘boolean’, ‘string’, ‘enum’, ‘date’,if left unset, type will detected by value.
     * @property {String} group by this field editors will grouped.
     */

    /**
     * @name Controls/_propertyGrid/IPropertyGridOptions#source
     * @cfg {Array[IPropertyGridProperty]}
     */
    source: IPropertyGridProperty[];
    /**
     * @name Controls/_propertyGrid/IPropertyGridOptions#groupTemplate
     * @cfg {Function} Group template.
     */
    groupTemplate?: Function;
    /**
     * @name Controls/_propertyGrid/IPropertyGridOptions#collapsedGroups
     * @cfg {Array} List of collapsed group identifiers.
     * Identifiers of groups are obtained as a result of calling the groupingKeyCallback.
     */
    collapsedGroups?: Array<string|number>;
}
