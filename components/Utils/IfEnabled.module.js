define('js!SBIS3.CONTROLS.Utils.IfEnabled', function() {

    /**
     * Декоратор для методов контролов. Проверяет является ли контрол активным, и только в этом случае запускает
     * задекорированный метод
     * @param {Function} func декорируемфй метод.
     * @returns {Function} Задекорированная функция.
     */
    return function (func) {
        return function () {
           if (this.isEnabled()) {
              return func.apply(this, arguments);
           }
      };
    };
});