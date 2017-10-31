define('js!SBIS3.CONTROLS.Utils.Contains', function () {
    /**
     * Модуль, в котором реализована функция <b>contains(parent, child)</b>.
     * Проверяет, лежит ли элемент 2 в дом дереве элемента 1.
     * <h2>Параметры функции</h2>
     * <ul>
     *    <li>{HTMLElement|jQuery} parent</li>
     *    <li>{HTMLElement|jQuery} child</li>
     * </ul>
     *
     * <h2>Возвращает</h2>
     * {Boolean}
     *
     * @class SBIS3.CONTROLS.Utils.Contains
     * @public
     * @author Мальцев Алексей Александрович
     */
    return function (parent, child) {
        var
            contains = false,
            par = parent instanceof jQuery ? parent[0] : parent,
            chi = child  instanceof jQuery ? child[0] : child;

        while (!contains && chi) {
            chi = chi.parentNode;
            contains = par === chi;
        }

        return contains;
    };
});