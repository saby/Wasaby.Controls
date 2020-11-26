import CollectionItem, {
    IOptions as ICollectionItemOptions,
    ISerializableState as ICollectionItemSerializableState
} from './CollectionItem';
import ExpandableMixin, {IOptions as IExpandableMixinOptions} from './ExpandableMixin';
import BreadcrumbsItem from './BreadcrumbsItem';
import Tree from './Tree';
import {mixin} from 'Types/util';
import TreeChildren from './TreeChildren';
import { TemplateFunction } from 'wasaby-cli/store/_repos/saby-ui/UI/Base';
import { IItemPadding } from 'Controls/_list/interface/IList';

export interface IOptions<T> extends ICollectionItemOptions<T>, IExpandableMixinOptions {
    owner?: Tree<T>;
    node?: boolean;
    childrenProperty?: string;
    hasChildren?: boolean;
    loaded?: boolean;
    parent?: TreeItem<T> | BreadcrumbsItem<T>;
}

interface ISerializableState<T> extends ICollectionItemSerializableState<T> {
    $options: IOptions<T>;
}

/**
 * Элемент древовидной коллеции
 * @class Controls/_display/TreeItem
 * @extends Controls/_display/CollectionItem
 * @mixes Controls/_display/ExpandableMixin
 * @public
 * @author Мальцев А.А.
 */
export default class TreeItem<T> extends mixin<
    CollectionItem<any>,
    ExpandableMixin
    >(
    CollectionItem,
    ExpandableMixin
) {
    protected _$owner: Tree<T>;

    /**
     * Родительский узел
     */
    protected _$parent: TreeItem<T> | BreadcrumbsItem<T>;

    /**
     * Является узлом
     * @remark true - узел, false - 'скрытый' узел, null - лист
     */
    protected _$node: boolean|null;

    /**
     * Есть ли дети у узла.
     */
    protected _$hasChildren: boolean;

    /**
     * Название свойства, содержащего дочерние элементы узла. Используется для анализа на наличие дочерних элементов.
     */
    protected _$childrenProperty: string;

    /**
     * Шаблон экспандера
     */
    protected _$expanderTemplate: TemplateFunction;

    /**
     * Иконка экспандера
     */
    protected _$expanderIcon: string;

    /**
     * Размер экспандера
     */
    protected _$expanderSize: string;

    /**
     * Позиция экспандера
     */
    protected _$expanderPosition: string;

    /**
     * Видимость экспандера
     */
    protected _$expanderVisibility: string;

    constructor(options?: IOptions<T>) {
        super(options);
        ExpandableMixin.call(this);

        if (this._$node) {
            this._$hasChildren = true;
        }
        if (options && options.hasChildren !== undefined) {
            this._$hasChildren = !!options.hasChildren;
        }
    }

    // region Public methods

    getOwner(): Tree<T> {
        return super.getOwner() as Tree<T>;
    }

    setOwner(owner: Tree<T>): void {
        super.setOwner(owner);
    }

    /**
     * Возвращает родительский узел
     */
    getParent(): TreeItem<T> {
        return this._$parent as TreeItem<T>;
    }

    /**
     * Устанавливает родительский узел
     * @param parent Новый родительский узел
     */
    setParent(parent: TreeItem<T>): void {
        this._$parent = parent;
    }

    /**
     * Возвращает корневой элемент дерева
     */
    getRoot(): TreeItem<T> {
        const parent = this.getParent();
        if (parent === this) {
            return;
        }
        return parent ? parent.getRoot() : this;
    }

    /**
     * Является ли корнем дерева
     */
    isRoot(): boolean {
        return !this.getParent();
    }

    /**
     * Возвращает уровень вложенности относительно корня
     */
    getLevel(): number {
        // If this is not a root then increase parent's level
        const parent = this._$parent;
        if (parent) {
            let parentLevel = 0;
            if (parent instanceof TreeItem) {
                parentLevel = parent.getLevel();
            } else if (parent instanceof BreadcrumbsItem) {
                parentLevel = parent.getLevel();
            }
            return parentLevel + 1;
        }

        // If this is a root then get its level from owner
        const owner = this.getOwner();
        return owner ? owner.getRootLevel() : 0;
    }

    /**
     * Возвращает признак, является ли элемент узлом
     */
    isNode(): boolean|null {
        return this._$node;
    }

    /**
     * Устанавливает признак, является ли элемент узлом
     * @param node Является ли элемент узлом
     */
    setNode(node: boolean|null): void {
        this._$node = node;
    }

    /**
     * Возвращает признак наличия детей у узла
     */
    isHasChildren(): boolean {
        return this._$hasChildren;
    }

    /**
     * Устанавливает признак наличия детей у узла
     */
    setHasChildren(value: boolean): void {
        this._$hasChildren = value;
    }

    /**
     * Возвращает название свойства, содержащего дочерние элементы узла
     */
    getChildrenProperty(): string {
        return this._$childrenProperty;
    }

    /**
     * Возвращает коллекцию потомков элемента коллекции
     * @param [withFilter=true] Учитывать {@link Controls/display:Collection#setFilter фильтр}
     */
    getChildren(withFilter: boolean = true): TreeChildren<T> {
        return this.getOwner().getChildren(this, withFilter);
    }

    // TODO есть ExpandableMixin, иконку тоже наверное нужно туда перенести
    //  он используется для группы, но можно от него унаследоваться и расширить вот этим кодом
    // region Expandable

    shouldDisplayExpander(expanderIcon: string): boolean {
        if (this.getExpanderIcon(expanderIcon) === 'none' || this.isNode() === null) {
            return false;
        }

        return (this._$expanderVisibility === 'visible' || this.isHasChildren());
    }

    getExpanderTemplate(expanderTemplate?: TemplateFunction): TemplateFunction {
        return expanderTemplate || this._$expanderTemplate;
    }

    getExpanderIcon(expanderIcon?: string): string {
        return expanderIcon || this._$expanderIcon;
    }

    getExpanderSize(expanderSize?: string): string {
        return expanderSize || this._$expanderSize;
    }

    // TODO должно быть в Tree
    getExpanderPosition(): string {
        return this._$expanderPosition;
    }

    // TODO должно быть в Tree
    getExpanderVisibility(): string {
        return this._$expanderVisibility;
    }

    shouldDisplayExpanderPadding(tmplExpanderIcon: string, tmplExpanderSize: string): boolean {
        const expanderIcon = this.getExpanderIcon(tmplExpanderIcon);
        const expanderPosition = this.getExpanderPosition();
        const expanderSize = this.getExpanderSize(tmplExpanderSize);

        if (this.getExpanderVisibility() === 'hasChildren') {
            return this.isHasChildren() && (expanderIcon !== 'none' && expanderPosition === 'default');
        } else {
            // TODO по идее в expanderSize должно быть дефолтное значение 's' и тогда проверка !expanderSize неправильная
            return !expanderSize && (expanderIcon !== 'none' && expanderPosition === 'default');
        }
    }

    getExpanderPaddingClasses(tmplExpanderSize: string, theme: string = 'default'): string {
        // TODO поддержать параметр isNodeFooter
        const isNodeFooter = false;
        const expanderSize = this.getExpanderSize(tmplExpanderSize);
        let expanderPaddingClasses = `controls-TreeGrid__row-expanderPadding controls-TreeGrid__${isNodeFooter ? 'node-footer' : 'row'}-expanderPadding` + `_theme-${theme}`;
        expanderPaddingClasses += ' controls-TreeGrid__row-expanderPadding_size_' + (expanderSize || 'default') + `_theme-${theme}`;
        expanderPaddingClasses += ' js-controls-ListView__notEditable';
        return expanderPaddingClasses;
    }

    getLevelIndentClasses(theme: string = 'default', expanderSize: string = 's', levelIndentSize: string = 's'): string {
        // TODO нужно поддержать expanderSize и levelIndentSize, они не передаются в темплейт сейчас
        const sizes = ['null', 'xxs', 'xs', 's', 'm', 'l', 'xl', 'xxl'];
        let resultLevelIndentSize;

        if (expanderSize && levelIndentSize) {
            if (sizes.indexOf(expanderSize) >= sizes.indexOf(levelIndentSize)) {
                resultLevelIndentSize = expanderSize;
            } else {
                resultLevelIndentSize = levelIndentSize;
            }
        } else if (!expanderSize && !levelIndentSize) {
            resultLevelIndentSize = 'default';
        } else {
            resultLevelIndentSize = expanderSize || levelIndentSize;
        }

        return `controls-TreeGrid__row-levelPadding controls-TreeGrid__row-levelPadding_size_${resultLevelIndentSize}_theme-${theme}`;
    }

    getExpanderClasses(tmplExpanderIcon: string, tmplExpanderSize: string, theme: string = 'default', style: string = 'default'): string {
        const expanderIcon = this.getExpanderIcon(tmplExpanderIcon);
        const expanderSize = this.getExpanderSize(tmplExpanderSize);
        const expanderPosition = this.getExpanderPosition();

        let expanderClasses = `controls-TreeGrid__row-expander_theme-${theme}`;
        let expanderIconClass = '';

        if (expanderPosition !== 'right') {
            expanderClasses += ` controls-TreeGrid__row_${style}-expander_size_${(expanderSize || 'default')}_theme-${theme} `;
        } else {
            expanderClasses += ` controls-TreeGrid__row_expander_position_right_theme-${theme} `;
        }
        expanderClasses += 'js-controls-ListView__notEditable';

        expanderClasses += ` controls-TreeGrid__row-expander__spacingTop_${this.getOwner().getTopPadding()}_theme-${theme}`;
        expanderClasses += ` controls-TreeGrid__row-expander__spacingBottom_${this.getOwner().getBottomPadding()}_theme-${theme}`;

        expanderClasses += ` controls-TreeGrid__row-expander__spacingTop_default_theme-${theme}`;
        expanderClasses += ` controls-TreeGrid__row-expander__spacingBottom_default_theme-${theme}`;

        if (expanderIcon) {
            expanderIconClass = ' controls-TreeGrid__row-expander_' + expanderIcon;
            expanderClasses += expanderIconClass;

            // могут передать node или hiddenNode в этом случае добавляем наши классы для master/default
            if ((expanderIcon === 'node') || (expanderIcon === 'hiddenNode') || (expanderIcon === 'emptyNode')) {
                expanderIconClass += '_' + (style === 'master' || style === 'masterClassic' ? 'master' : 'default');
            }
        } else {
            expanderIconClass = ' controls-TreeGrid__row-expander_' + (this.isNode() ? 'node_' : 'hiddenNode_')
                + (style === 'master' || style === 'masterClassic' ? 'master' : 'default');
        }

        expanderClasses += expanderIconClass + `_theme-${theme}`;

        // добавляем класс свертнутости развернутости для тестов
        expanderClasses += ' controls-TreeGrid__row-expander' + (this.isExpanded() ? '_expanded' : '_collapsed');
        // добавляем класс свертнутости развернутости стилевой
        expanderClasses += expanderIconClass + (this.isExpanded() ? '_expanded' : '_collapsed') + `_theme-${theme}`;

        return expanderClasses;
    }

    // endregion Expandable

    // region SerializableMixin

    _getSerializableState(state: ICollectionItemSerializableState<T>): ISerializableState<T> {
        const resultState = super._getSerializableState(state) as ISerializableState<T>;

        // It's too hard to serialize context related method. It should be restored at class that injects this function.
        if (typeof resultState.$options.parent === 'function') {
            delete resultState.$options.parent;
        }

        return resultState;
    }

    _setSerializableState(state: ISerializableState<T>): Function {
        const fromSuper = super._setSerializableState(state);
        return function(): void {
            fromSuper.call(this);
        };
    }

    // endregion

    // region Protected methods

    /**
     * Генерирует событие у владельца об изменении свойства элемента.
     * Помимо родительской коллекции уведомляет также и корневой узел дерева.
     * @param property Измененное свойство
     * @protected
     */
    protected _notifyItemChangeToOwner(property: string): void {
        super._notifyItemChangeToOwner(property);

        const root = this.getRoot();
        const rootOwner = root ? root.getOwner() : undefined;
        if (rootOwner && rootOwner !== this._$owner) {
            rootOwner.notifyItemChange(this, {property});
        }
    }

    // endregion
}

Object.assign(TreeItem.prototype, {
    '[Controls/_display/TreeItem]': true,
    _moduleName: 'Controls/display:TreeItem',
    _$parent: undefined,
    _$node: false,
    _$expanded: false,
    _$hasChildren: false,
    _$childrenProperty: '',
    _$expanderTemplate: null,
    _$expanderIcon: undefined,
    _$expanderSize: undefined,
    _$expanderPosition: 'default',
    _$expanderVisibility: 'visible',
    _instancePrefix: 'tree-item-'
});
