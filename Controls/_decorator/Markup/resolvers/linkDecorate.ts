/**
 * Created by rn.kondakov on 23.10.2018.
 */
import { clearNeedDecorateGlobals, needDecorate, getDecoratedLink } from '../resources/linkDecorateUtils';

/**
 *
 * Модуль с функцией замены общей ссылки на декорированную ссылку, если это необходимо.
 * Распознаватель тегов для {@link Controls/decorator:Markup}.
 * @example
 * 1) Поиск в текстовых узлах JsonML ссылок, оборачивание их в тег a.
 * <pre class="brush: json">
 * [
 *     ["p", // Ссылка, подходящая для декорирования, сразу в json
 *         ["a",
 *             {"href": "https://ya.ru"},
 *             "https://ya.ru"
 *         ]
 *     ],
 *     ["p", // Ссылка, не подходящая для декорирования, сразу в json
 *         ["a",
 *             {"href": "http://www.google.com"},
 *             "www.google.com"
 *         ]
 *     ],
 *     ["pre", // Не подходящая и подходящая ссылки прямо в plain/text строке, положенной в тег pre для отображения переноса строки \n
 *         "www.google.com\nhttps://ya.ru"
 *     ]
 * ]
 * </pre>
 * 2) Декорирование ссылок
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
 *
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
