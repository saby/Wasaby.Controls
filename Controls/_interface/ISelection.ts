export type TSelectionType = 'all' | 'leaf' | 'node';

export type TSelection = Record<{
    marked: number[]|string[],
    excluded: number[]|string[],
    type: TSelectionType,
    recursive: boolean
}>;

export interface ISelectionObject {
    selected: string[]|number[];
    excluded: string[]|number[];
}

export interface ISelectionOptions {
    selectionType: TSelectionType;
    recursiveSelection: boolean;
}

/**
 * Интерфейс для контролов, поддерживающих выбор записей определённого типа.
 *
 * @interface Controls/_interface/ISelection
 * @public
 * @author Герасимов А.М.
 */

export default interface ISelection {
    readonly '[Controls/_interface/ISelection]': boolean;
}

/**
 * @name Controls/_interface/ISelection#selectionType
 * @cfg {String} Тип выбираемых записей.
 * @default all
 * @remark
 * Возможные значения:
 * <ul>
 *     <li>all - для выбора доступны любые типы элементов.</li>
 *     <li>allBySelectAction - для выбора доступен любой тип элемента. Выбор осуществляется нажатием на кнопку «Выбрать».</li>
 *     <li>node - для выбора доступны любые типа «Узел».</li>
 *     <li>leaf - для выбора доступны только элементы типа «лист» и «скрытый узел».</li>
 * </ul>
 *
 * @example
 * В этом примере для выбора будут доступны только узлы.
 *
 * wml:
 * <pre>
 *    <Layout.Selector.Browser parentProperty="Раздел" nodeProperty="Раздел@" selectionType="node">
 *       <ws:content>
 *          <Controls.TreeControl/>
 *       </ws:content>
 *    </Layout.Selector.Browser>
 * </pre>
 */

/**
 * @name Controls/_interface/ISelection#recursiveSelection
 * @cfg {Boolean} Определяет, будут ли выбираться дочерние элементы при выборе папки.
 * @default true
 * @example
 * В этом примере при выборе папки в результат выбора вернётся только сама папке, без вложений.
 *
 * wml:
 * <pre>
 *    <Layout.Selector.Browser parentProperty="Раздел" nodeProperty="Раздел@" selectionType="node" recursiveSelection="{{false}}">
 *       <ws:content>
 *          <Controls.TreeControl/>
 *       </ws:content>
 *    </Layout.Selector.Browser>
 * </pre>
 */
