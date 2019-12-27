/**
 * Created by rn.kondakov on 23.10.2018.
 */
import { clearNeedDecorateGlobals, needDecorate, getDecoratedLink } from '../resources/linkDecorateUtils';

/**
 *
 * Модуль содержит функцию, которая позволяет преобразовать обычную ссылку в декорированную. 
 * Декорации ссылки выполняется через Сервис декорирования ссылок. 
 * Функция предназначена для использования в контроле {@link Controls/decorator:Markup} в опции tagResolver.
 * пример
 * WML:
 * @example
 * <pre class="brush: xml">
 *    <Controls.decorator:Markup value="{{ _json }}" tagResolver="{{ _tagResolver }}" />
 * </pre>
 *  * JS:
 * @example
 * <pre class="brush: js">
 * define("MyControl", ["UI/Base", "wml!MyControl", "Controls/decorator"], 
 * function(Base, template, decorator) {
 *    var ModuleClass = Base.Control.extend({
 *       _template: template,
 * _tagResolver: decorator.linkDecorate
 * _json:
 * [
 *  [
 *    ["p", // Ссылка, подходящая для декорирования, сразу в json
 *       ["a",
 *   {"href": "https://ya.ru
 *   "},
 *    "https://ya.ru"
 *       ]
 *    ],
 *    ["p", // Ссылка, не подходящая для декорирования, сразу в json
 *       ["a",
 *   {"href": "http://www.google.com"},
 *   "www.google.com"
 *       ]
 *    ],
 *    ["pre", 
 *       // Не подходящая и подходящая ссылки прямо в plain/text строке, 
 *       //положенной в тег pre для отображения переноса строки \n
 * "     www.google.com\nhttps://ya.ru"
 *    ]
 *  ]
 * ]
 *    });
 *    return ModuleClass;
 * });
 * </pre>
 * Результат
 * @example
 * <pre class="brush: html">
 * <div>
 *    <p>
 *       <span class="...">
 *          <a class="..." href="https://ya.ru">
 *             <img class="..." src=".." alt="https://ya.ru"></img>
 *          </a>
 *       </span>
 *    </p>
 *    <p>
 *       <a href="http://www.google.com">www.google.com</a>
 *    </p>
 *    <pre>
 *       <a href="http://www.google.com">www.google.com</a>
 *       \n
 *       <span class="...">
 *          <a class="..." href="https://ya.ru">
 *             <img class="..." src="..." alt="https://ya.ru"></img>
 *          </a>
 *       </span>
 *    </pre>
 * </div>
 * </pre>
 * @class Controls/_decorator/Markup/resolvers/linkDecorate
 * @public
 * @author Кондаков Р.Н.
 */

/*
 *
 * Module with a function to replace common link on decorated link, if it needs.
 * Tag resolver for {@link Controls/decorator:Markup}.
 *
 * @class Controls/_decorator/Markup/resolvers/linkDecorate
 * @public
 * @author Кондаков Р.Н.
 */
export default function linkDecorate(value, parent) {
    if (!parent) {
        clearNeedDecorateGlobals();
    }
    let result;
    if (needDecorate(value, parent)) {
        result = getDecoratedLink(value);
    } else {
        result = value;
    }
    return result;
};
