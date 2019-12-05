/**
 * Created by rn.kondakov on 23.10.2018.
 */
import { clearNeedDecorateGlobals, needDecorate, getDecoratedLink } from '../resources/linkDecorateUtils';

/**
 *
 * Модуль с функцией замены общей ссылки на декорированную ссылку, если это необходимо.
 * Распознаватель тегов для {@link Controls/decorator:Markup}.
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
