/* global define */
define('js!SBIS3.CONTROLS.ISaveStrategy', [], function () {
    'use strict';

   /**
    * Интерфейс стратегии сохранения данных.
    * @class SBIS3.CONTROLS.ISaveStrategy
    * @public
    * @author Сухоручкин А.С.
    */

    return /** @lends SBIS3.CONTROLS.ISaveStrategy.prototype */{
        /**
         * Метод сохранения данных.
         */
        saveAs: function() {
            throw new Error('Method must be implemented');
        }
    };
});
