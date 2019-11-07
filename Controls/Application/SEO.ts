/**
 * @interface Controls/Application/SEO
 *
 * @name Controls/Application#scripts
 * @cfg {Content} Описание скриптов, которые будут вставлены в head страницы
 * <pre class="brush:xml">
 *     <ws:scripts>
 *        <ws:Array>
 *           <ws:Object type="text/javascript" src="/cdn/Maintenance/1.0.1/js/checkSoftware.js" data-pack-name="skip" async=""/>
 *        </ws:Array>
 *     </ws:scripts>
 * </pre>
 * 
 * @name Controls/Application#meta
 * @cfg {Content} Позволяет описывать meta информацию страницы.
 * <pre class="brush:xml">
 *     <ws:meta>
 *        <ws:Array>
 *           <ws:Object name="SKYPE_TOOLBAR" content="SKYPE_TOOLBAR_PARSER_COMPATIBLE"/>
 *        </ws:Array>
 *     </ws:meta>
 * </pre>
 *   
 * @name Controls/Application#links
 * @cfg {Content} Позволяет описывать ссылки на дополнительные ресурсы, которые необходимы при загрузке страницы.
 * <pre class="brush:xml">
 *     <ws:links>
 *        <ws:Array>
 *           <ws:Object rel="shortcut icon" href="{{_options.wsRoot}}img/themes/wi_scheme/favicon.ico?v=2" type="image/x-icon"/>
 *        </ws:Array>
 *     </ws:links>
 * </pre>
 */