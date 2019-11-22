/**
 * Шаблон, который по умолчанию используется для отображения разделителя {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list/grid/grouping/ группы} в {@link Controls/grid:View табличном представлении}.
 * @class Controls/grid:GroupTemplate
 * @author Авраменко А.С.
 * @see Controls/grid:View#groupTemplate
 * @example
 * В следующем примере показано, как изменить параметры шаблона.
 * <pre>
 *    <Controls.grid:View>
 *       <ws:groupTemplate>
 *          <ws:partial
 *             template="Controls/grid:GroupTemplate"
 *             expanderVisible="{{ false }}"
 *             textAlign="left">
 *             <ws:rightTemplate>
 *                Примечание отобразится справа от кнопки-экспандера.
 *             </ws:rightTemplate>
 *          </ws:partial>
 *       </ws:groupTemplate>
 *    </Controls.grid:View>
 * </pre>
 * @remark
 * Подробнее о шаблоне:
 * 
 * * {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list/grid/templates/grouping/ Руководство разработчика}
 */

/**
 * @name Controls/grid:GroupTemplate#expanderAlign
 * @cfg {String} Расположение кнопки-экспандера, позволяющей сворачивать/разворачивать группу.
 * @default left
 * @remark
 * Доступные значения:
 * 
 * * **right** — справа от заголовка.
 * * **left** — слева от заголовка.
 */

/**
 * @name Controls/grid:GroupTemplate#expanderVisible
 * @cfg {Boolean} Видимость кнопки-экспандера.
 * @default true
 * @remark
 * Доступные значения:
 * 
 * * **true** — отображается.
 * * **false** — не отображается.
 */

/**
 * @name Controls/grid:GroupTemplate#textAlign
 * @cfg {String} Горизонтальное выравнивание заголовка группы.
 * @default center
 * @remark
 * Доступные значения:
 * 
 * * **right** — по правому краю.
 * * **center** — по центру.
 * * **left** — по левому краю.
 */

/**
 * @name Controls/grid:GroupTemplate#columnAlignGroup
 * @cfg {Number} Номер колонки, относительно которой происходит горизонтальное выравнивание текста группы.
 * @default 0
 */

/**
 * @name Controls/grid:GroupTemplate#rightTemplate
 * @cfg {String|Function} Шаблон, выводимый в правой заголовка группы.
 * @default Controls/list:GroupContentResultsTemplate
 */


export default interface IGroupTemplateOptions {
   expanderAlign?: string;
   expanderVisible?: boolean;
   textAlign?: string;
   columnAlignGroup?: number;
   rightTemplate?: string;
}