define('js!SBIS3.CONTROLS.Utils.Contains', function () {
    /**
     * Проверяет, лежит ли элемент 2 в дом дереве элемента 1
     * @param {HTMLElement|jQuery} parent
     * @param {HTMLElement|jQuery} child
     * @returns {boolean}
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