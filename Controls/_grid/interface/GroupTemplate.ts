/**
 * Шаблон, который по умолчанию используется для отображения горизонтальной линии-разделителя {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list/grid/grouping/ группы} в {@link Controls/grid:View табличном представлении}.
 * @class Controls/grid:GroupTemplate
 * @author Авраменко А.С.
 * @see Controls/grid:View#groupTemplate
 * @example
 * В следующем примере показано, как изменить параметры шаблона.
 * <pre>
 *    <Controls.grid:View>
 *       <ws:groupTemplate>
 *          <ws:partial template="Controls/grid:GroupTemplate" expanderVisible="{{ false }}">
 *             <ws:contentTemplate>
 *                <ws:if data="{{contentTemplate.itemData.item === 'nonexclusive'}}">Неисключительные права</ws:if>
 *                <ws:if data="{{contentTemplate.itemData.item === 'works'}}">Работы</ws:if>
 *             </ws:contentTemplate>
 *          </ws:partial>
 *       </ws:groupTemplate>
 *    </Controls.grid:View>
 * </pre>
 * @remark
 * Дополнительно о работе с шаблоном читайте {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list/grid/templates/grouping/ здесь}.
 */

/**
 * @name Controls/grid:GroupTemplate#expanderAlign
 * @cfg {String} Расположение кнопки-экспандера относительно заголовка группы.
 * @default left
 * @remark
 * Доступные значения:
 * 
 * * **right** — справа.
 * * **left** — слева.
 * 
 * Кнопка-экспандер позволяет сворачивать/разворачивать группу.
 * @see expanderVisible
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
 * 
 * Кнопка-экспандер позволяет сворачивать/разворачивать группу.
 * @see expanderAlign
 */

/**
 * @name Controls/grid:GroupTemplate#textAlign
 * @cfg {String} Горизонтальное выравнивание заголовка группы.
 * @default undefined
 * @remark
 * Доступные значения:
 * 
 * * **right** — по правому краю.
 * * **left** — по левому краю.
 * * **undefined** — по центру.
 */

/**
 * @name Controls/grid:GroupTemplate#columnAlignGroup
 * @cfg {Number} Номер колонки, относительно которой происходит горизонтальное выравнивание заголовка группы.
 * @default undefined
 */

/**
 * @name Controls/grid:GroupTemplate#separatorVisibility
 * @cfg {Boolean} Видимость горизонтальной линии-разделителя.
 * @default true
 * @remark
 * Доступные значение:
 * 
 * * **true** — отображается.
 * * **false** — скрыта. 
 */

/**
 * @name Controls/grid:GroupTemplate#rightTemplate
 * @cfg {String|Function} Шаблон, выводимый на горизонтальной линии-разделителе в правой части.
 * @default undefined
 * @remark
 * В области видимости шаблона доступна переменная **itemData** со следующими свойствами:
 * 
 * * {@link Types/entity:Record item} — результат того, что возвращено из функции {@link Controls/grid:View#groupingKeyCallback groupingKeyCallback}.
 * * {@link Types/collection:RecordSet#metaData metaData} — метаданные рекордсета, который загружен для таблицы.
 * @example
 * **Пример 1.** Контрол и шаблон сконфигурированы в одном WML-файле.
 * <pre>
 * <Controls.grid:View>
 *    <ws:groupTemplate>
 *       <ws:partial template="Controls/grid:GroupTemplate">
 *          <ws:rightTemplate>
 *             {{ rightTemplate.itemData.metaData.groupResults[rightTemplate.itemData.item] }}
 *          </ws:rightTemplate>
 *       </ws:partial>
 *    </ws:groupTemplate>
 * </Controls.grid:View>
 * </pre>
 * 
 * **Пример 2.** Контрол и шаблоны сконфигурированы в отдельных WML-файлах.
 * <pre>
 * <!-- file1.wml -->
 * <Controls.grid:View>
 *    <ws:groupTemplate>
 *       <ws:partial template="file2.wml" scope="{{groupTemplate}}"/>
 *    </ws:groupTemplate>
 * </Controls.grid:View>
 * </pre>
 * 
 * <pre>
 * <!-- file2.wml -->
 * <ws:partial template="Controls/grid:GroupTemplate">
 *    <ws:rightTemplate>
 *       {{ rightTemplate.itemData.metaData.groupResults[rightTemplate.itemData.item] }}
 *    </ws:rightTemplate>
 * </ws:partial>
 * </pre>
 * 
 * **Пример 3.** Шаблон rightTemplate сконфигурирован в отдельном WML-файле.
 * 
 * <pre>
 * <!-- file1.wml -->
 * <Controls.grid:View>
 *    <ws:groupTemplate>
 *       <ws:partial template="Controls/grid:GroupTemplate">
 *          <ws:rightTemplate>
 *             <ws:partial template="file2.wml" scope="{{rightTemplate}}"/>
 *          </ws:rightTemplate>
 *       </ws:partial>
 *    </ws:groupTemplate>
 * </Controls.grid:View>
 * </pre>
 * 
 * <pre>
 * <!-- file2.wml -->
 * {{ rightTemplate.itemData.metaData.groupResults[rightTemplate.itemData.item] }}
 * </pre>
 */

/**
 * @name Controls/grid:GroupTemplate#contentTemplate
 * @cfg {String|Function} Шаблон, описывающий заголовок группы.
 * @remark
 * В области видимости шаблона доступна переменная **itemData** со следующими свойствами:
 * 
 * * {@link Types/entity:Record item} — результат того, что возвращено из функции {@link Controls/grid:View#groupingKeyCallback groupingKeyCallback}.
 * * {@link Types/collection:RecordSet#metaData metaData} — метаданные рекордсета, который загружен для таблицы.
 * @example
 * **Пример 1.** Контрол и шаблон сконфигурированы в одном WML-файле.
 * 
 * <pre class="brush: html">
 * <Controls.grid:View>
 *    <ws:groupTemplate>
 *       <ws:partial template="Controls/grid:GroupTemplate">
 *          <ws:contentTemplate>
 *             <ws:if data="{{contentTemplate.itemData.item === 'nonexclusive'}}">Неисключительные права</ws:if>
 *             <ws:if data="{{contentTemplate.itemData.item === 'works'}}">Работы</ws:if>
 *          </ws:contentTemplate>
 *       </ws:partial>
 *    </ws:groupTemplate>
 * </Controls.grid:View>
 * </pre>
 * 
 * **Пример 2.** Контрол и шаблоны сконфигурированы в отдельных WML-файлах.
 * <pre>
 * <!-- file1.wml -->
 * <Controls.grid:View>
 *    <ws:groupTemplate>
 *       <ws:partial template="file2.wml" scope="{{groupTemplate}}"/>
 *    </ws:groupTemplate>
 * </Controls.grid:View>
 * </pre>
 * 
 * <pre>
 * <!-- file2.wml -->
 * <ws:partial template="Controls/grid:GroupTemplate">
 *    <ws:contentTemplate>
 *       <ws:if data="{{contentTemplate.itemData.item === 'nonexclusive'}}">Неисключительные права</ws:if>
 *       <ws:if data="{{contentTemplate.itemData.item === 'works'}}">Работы</ws:if>
 *    </ws:contentTemplate>
 * <ws:partial>
 * </pre>
 * 
 * **Пример 3.** Шаблон contentTemplate сконфигурирован в отдельном WML-файле.
 * 
 * <pre class="brush: html">
 * <!-- file1.wml -->
 * <Controls.grid:View>
 *    <ws:groupTemplate>
 *       <ws:partial template="Controls/grid:GroupTemplate">
 *          <ws:contentTemplate>
 *             <ws:partial template="file2.wml" scope="{{contentTemplate}}"/>
 *          </ws:contentTemplate>
 *       </ws:partial>
 *    </ws:groupTemplate>
 * </Controls.grid:View>
 * </pre>
 * 
 * <pre>
 * <!-- file2.wml -->
 * <ws:if data="{{itemData.item === 'nonexclusive'}}">Неисключительные права</ws:if>
 * <ws:if data="{{itemData.item === 'works'}}">Работы</ws:if>
 * </pre>
 * 
 */

export default interface IGroupTemplateOptions {
   expanderAlign?: string;
   expanderVisible?: boolean;
   textAlign?: string;
   columnAlignGroup?: number;
   rightTemplate?: string;
}