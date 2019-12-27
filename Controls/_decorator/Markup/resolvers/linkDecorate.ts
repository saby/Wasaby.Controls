/**
 * Created by rn.kondakov on 23.10.2018.
 */
import { clearNeedDecorateGlobals, needDecorate, getDecoratedLink } from '../resources/linkDecorateUtils';

/**
 *
 * Модуль с функцией замены общей ссылки на декорированную ссылку, если это необходимо.
 * Распознаватель тегов для {@link Controls/decorator:Markup}.
 * @example
 * <pre class="brush: json">
 * а) Поиск в текстовых узлах JsonML ссылок, оборачивание их в тег a
 * [
 *    ["p", // Ссылка, подходящая для декорирования, сразу в json
 *       ["a",
 *          {"href": "https://ya.ru"},
 *          "https://ya.ru"
 *       ]
 *    ],
 *    ["p", // Ссылка, не подходящая для декорирования, сразу в json
 *       ["a",
 *          {"href": "http://www.google.com"},
 *          "www.google.com"
 *       ]
 *    ],
 *    ["pre", // Не подходящая и подходящая ссылки прямо в plain/text строке, положенной в тег pre для отображения переноса строки \n
 *       "www.google.com\nhttps://ya.ru"
 *    ]
 * ]
 * </pre>
 * б) Декорирование ссылок, подходящих спецификации @link{http://axure.tensor.ru/standarts/v7/%D0%B2%D0%B8%D0%B7%D0%B8%D1%82%D0%BA%D0%B8_%D0%B8_%D0%B4%D0%B5%D0%BA%D0%BE%D1%80%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%BD%D1%8B%D0%B5_%D1%81%D1%81%D1%8B%D0%BB%D0%BA%D0%B8.html декорирования}.
 * <pre class="html">
 * <div>
 *    <p>
 *       <span class="...">
 *          <a class="..." href="https://ya.ru">
 *             <img class="..." src=".." alt="https://ya.ru"></img>
 *          </a>
 *       </span>
 *    </p>
 *    <p>
 *       <a href="http://www.google.com">www.google.com></a>
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
