export type TSelectionType = 'all' | 'leaf' | 'node';

export type TKeySelection = number|string|null;
export type TKeysSelection = Array<number|null>|Array<string|null>;

export type TSelectionRecord = Record<{
    marked: TKeysSelection,
    excluded: TKeysSelection,
    type: TSelectionType,
    recursive: boolean
}>;

export interface ISelectionObject {
    selected: TKeysSelection;
    excluded: TKeysSelection;
};

export interface ISelectionTypeOptions {
    selectionType: TSelectionType;
    recursiveSelection: boolean;
};

/**
 * Интерфейс для контролов, поддерживающих выбор записей определённого типа.
 *
 * @interface Controls/_interface/ISelectionType
 * @public
 * @author Герасимов А.М.
 */

export default interface ISelectionType {
    readonly '[Controls/_interface/ISelectionType]': boolean;
};

/**
 * @name Controls/_interface/ISelectionType#selectionType
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
 * @name Controls/_interface/ISelectionType#recursiveSelection
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
