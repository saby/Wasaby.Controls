/* global define */
define('SBIS3.CONTROLS/Action/Save/SaveStrategy/ISaveStrategy', [], function () {
    'use strict';

   /**
    * Интерфейс стратегии сохранения данных.
    * @class SBIS3.CONTROLS/Action/Save/SaveStrategy/ISaveStrategy
    * @public
    * @author Сухоручкин А.С.
    */

    return /** @lends SBIS3.CONTROLS/Action/Save/SaveStrategy/ISaveStrategy.prototype */{
        /**
         * Метод сохранения данных.
         */
        saveAs: function() {
            throw new Error('Method must be implemented');
        }
    };
});
