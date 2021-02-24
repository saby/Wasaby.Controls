export interface ITreeGridOptions {
    nodeTypeProperty?: string;
}

/**
 * Интерфейс дерева
 *
 * @public
 * @author Аверкиев П.А.
 */
export default interface ITreeGrid {
    readonly '[Controls/_treeGridNew/interface/ITreeGrid]': boolean;
}

/**
 * @name Controls/_treeGridNew/interface/ITreeGrid#nodeTypeProperty
 * @cfg {String} Имя свойства, содержащего информацию о типе узла элемента.
 * @remark Используется для отображения узлов в виде групп. Если в RecordSet в указанном свойстве с БЛ приходит значение 'group', то такой узел должен будет отобразиться как группа.
 * @example
 * В следующем примере показано, как настроить список на использование узлов-групп
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls.treeGridNew:View
 *    source: {{_source}}
 *    nodeProperty="{{parent@}}"
 *    parentProperty="{{parent}}"
 *    nodeTypeProperty="customNodeType"/>
 * </pre>
 *
 * <pre class="brush: js">
 * class MyControl extends Control<IControlOptions> {
 *    _source: new RecordSet({
 *        rawData: [
 *            {
 *                id: 1,
 *                customNodeType: 'group',
 *                'parent@': true,
 *                parent: null
 *            },
 *            {
 *                id: 2,
 *                customNodeType: null,
 *                ...
 *            },
 *            {
 *                id: 3,
 *                customNodeType: 'group',
 *                'parent@': true,
 *                parent: null
 *            },
 *        ]
 *    })
 * }
 * </pre>
 */
