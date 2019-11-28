/**
 * Шаблон, который по умолчанию используется для редактирования по месту в {@link Controls/list:View плоских списках}.
 * @class Controls/list:EditingTemplate
 * @author Авраменко А.С.
 * @see Controls/list:View
 * @see Controls/list
 * @example
 * В следующем примере показано, как изменить параметры шаблона.
 * <pre>
 * <Controls.list:View>
 *    <ws:itemTemplate>
 *       <ws:partial template="Controls/list:ItemTemplate">
 *          <ws:contentTemplate>
 *             <ws:partial template="Controls/list:EditingTemplate" value="{{ itemTemplate.itemData.item.title }}" enabled="{{true}}">
 *                <ws:editorTemplate>
 *                   <Controls.validate:InputContainer>
 *                      <ws:validators>
 *                         <ws:Function value="{{ itemTemplate.itemData.item.title }}">Controls/validate:isRequired</ws:Function>
 *                      </ws:validators>
 *                      <ws:content>
 *                         <Controls.input:Text bind:value="itemTemplate.itemData.item.title" selectOnClick="{{ false }}" />
 *                      </ws:content>
 *                   </Controls.validate:InputContainer>
 *                </ws:editorTemplate>
 *             </ws:partial>
 *          </ws:contentTemplate>
 *       </ws:partial>
 *    </ws:itemTemplate>
 * </Controls.list:View>
 * </pre>
 * @remark
 * Подробнее о работе с шаблоном читайте {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list/list/edit/#manual здесь}.
 */

/**
 * @name Controls/list:EditingTemplate#editorTemplate
 * @cfg {String|Function} Шаблон, отображаемый поверх строки в режиме редактирования. 
 * @remark
 * В области видимости шаблона доступен объект **itemData**. Из него можно получить доступ к свойству **item** — это объект, который содержит данные редактируемого элемента. Т.е. можно получить доступ к полям и их значениям.
 * @example
 * <pre>
 * <ws:contentTemplate>
 *    <ws:partial template="Controls/list:EditingTemplate" >
 *       <ws:editorTemplate>
 *          <Controls.validate:InputContainer>
 *             ...
 *          </Controls.validate:InputContainer>
 *       </ws:editorTemplate>
 *    </ws:partial>
 * </ws:contentTemplate>
 * </pre>
 */

/**
 * @name Controls/list:EditingTemplate#enabled
 * @cfg {Boolean} Устанавливает выделение фона у поля ввода при наведении курсора мыши.
 * @remark
 * В значении true при наведении курсора мыши на строку будет выделяться фон у поля ввода, которое используется для редактирования строки. Поле ввода устанавливается в параметре {@link editorTemplate}.
 * @default false
 * @example
 * <pre>
 * <ws:contentTemplate>
 *    <ws:partial template="Controls/list:EditingTemplate" enabled="{{true}}">
 *       ...
 *    </ws:partial>
 * </ws:contentTemplate>
 * </pre>
 */

/**
 * @name Controls/list:EditingTemplate#value
 * @cfg {String} Текст, отображаемый в строке в режиме просмотра.
 * @example
 * <pre>
 * <ws:contentTemplate>
 *    <ws:partial template="Controls/list:EditingTemplate" value="{{ itemTemplate.itemData.item.title }}">
 *       ...
 *    </ws:partial>
 * </ws:contentTemplate>
 * </pre>
 */

/**
 * @name Controls/list:EditingTemplate#size
 * @cfg {String|Function} Размер шрифта для текста, который отображается в строке в режиме просмотра. 
 * @default default
 * @remark 
 * Доступные значения: default, m, l, s.
 * По умолчанию высота блока равна 24px, текста - 14px.
 * 
 */

export default interface IEditingTemplateOptions {
    editorTemplate?: string;
    enabled?: boolean;
    value?: string;
    size?: string;
 }
 