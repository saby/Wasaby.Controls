import {IControlOptions, TemplateFunction} from 'UI/Base';
import {ISourceOptions, IFilter} from 'Controls/interface';

export type TKeys = string[]|number[];

export interface IMenuOptions extends IControlOptions, ISourceOptions, IFilter {
    displayProperty: string;
    itemTemplate?: TemplateFunction;
    emptyText?: string;
    emptyKey?: string|number;
    historyConfig: IHistoryConfig;
    iconSize?: string;
    leftSpacing: string;
    rightSpacing: string;
    multiSelect?: boolean;
    navigation?: object;
    nodeFooterTemplate: TemplateFunction;
    nodeProperty?: string;
    parentProperty?: string;
    groupProperty?: string;
    groupTemplate?: TemplateFunction;
    root?: string|number|null;
    selectedKeys?: TKeys;
    selectorTemplate?: object;
    selectorOpener?: object;
    selectorDialogResult?: Function;
    isCompoundTemplate?: boolean;
    groupingKeyCallback?: Function;
}

export interface IHistoryConfig {
    historyId: string;
    pinned: TKeys|boolean;
    recent: boolean;
    frequent: boolean;
}

/**
 * Интерфейс контрола меню
 * @interface Controls/_menu/interface/IMenuControl
 * @public
 * @author Золотова Э.Е.
 */

/*
 * @interface Controls/_menu/interface/IMenuControl
 * @public
 * @author Золотова Э.Е.
 */
export default interface IMenuControl {
    readonly '[Controls/_interface/IMenu]': boolean;
}

/**
 * @event Controls/_menu/interface/IMenuControl#itemClick Происходит при выборе элемента
 * @param {Vdom/Vdom:SyntheticEvent} eventObject Дескриптор события.
 * @param {Types/entity:Model} item Выбранный элемент.
 * @remark Из обработчика события можно возвращать результат обработки. Если результат будет равен false, подменю не закроется.
 * По умолчанию, когда выбран пункт с иерархией, подменю закрывается.
 * @example
 * В следующем примере показано, как незакрывать подменю, если кликнули на пункт с иерархией.
 * <pre>
 *    <Controls.menu:Control
 *          displayProperty="title"
 *          keyProperty="key"
 *          source="{{_source}}"
 *          on:itemClick="_itemClickHandler()" />
 * </pre>
 * TS:
 * <pre>
 *    protected _itemClickHandler(e, item): boolean {
 *       if (item.get(nodeProperty)) {
 *          return false;
 *       }
 *    }
 * </pre>
 */
