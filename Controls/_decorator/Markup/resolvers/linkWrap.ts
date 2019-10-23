/**
 * Created by rn.kondakov on 08.10.2019.
 */
import { wrapLinksInString } from '../resources/linkDecorateUtils';

/**
 *
 * Функция для оборачивания ссылок и адресов электронной почты в тег а.
 * Рассчитан для передачи в опцию tagResolver модуля {@link Controls/decorator:Markup}.
 *
 * @class Controls/_decorator/Markup/resolvers/linkWrap
 * @public
 * @author Кондаков Р.Н.
 */
export default function linkWrap(value, parent) {
    if (typeof value === 'string') {
        return wrapLinksInString(value, parent);
    }
    return value;
};
