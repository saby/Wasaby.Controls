/**
 * Шаблон, который по умолчанию используется для отображения элементов в дополнительном меню {@link Controls/toolbars:View тулбара}.
 * @class Controls/toolbars:ItemTemplate
 * @author Красильников А.С.
 * @public
 * @see Controls/toolbars:View
 * @see Controls/toolbars
 * 
 * @remark
 * Полезные ссылки:
 * * <a href="/doc/platform/developmentapl/interface-development/controls/buttons-switches/toolbar/#template-standart">руководство разработчика</a>
 */

/**
 * @name Controls/toolbars:ItemTemplate#itemsSpacing
 * @cfg {String} Размер расстояния между кнопками.
 * @variant medium
 * @variant big
 * @default medium
 * @remark
 * Размер расстояния задается константой из стандартного набора размеров, который определен для текущей темы оформления.
 */

/**
 * @name Controls/toolbars:ItemTemplate#theme
 * @cfg {String} theme Название темы оформления. В зависимости от темы загружаются различные таблицы стилей и применяются различные стили к контролу.
 */

/**
 * @name Controls/toolbars:ItemTemplate#item
 * @cfg {String} item Элемент тулбара.
 */

/**
 * @name Controls/toolbars:ItemTemplate#buttonTemplate
 * @cfg {String} buttonTemplate Шаблон кнопки тулбара.
 */

/**
 * @name Controls/toolbars:ItemTemplate#buttonTemplateOptions
 * @cfg {String} buttonTemplateOptions Опции шаблона кнопки.
 */

export default interface IItemTemplateOptions {

    /**
     * @deprecated
     */
    buttonStyle?: string;

    /**
     * @deprecated
     */
    buttonReadOnly?: boolean;

    /**
     * @deprecated
     */ 
    buttonTransparent?: boolean;

    /**
     * @deprecated
     */
    buttonViewMode?: string;

    /**
     * @deprecated
     */
    displayProperty?: string;

    /**
     * @deprecated
     */
    iconStyleProperty?: string;

    /**
     * @deprecated
     */
    iconProperty?: string;

    /**
     * @deprecated
     */
    contentTemplate?: string;
 }
 