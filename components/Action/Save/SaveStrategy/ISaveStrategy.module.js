/* global define */
define('js!SBIS3.CONTROLS.ISaveStrategy', [], function () {
    'use strict';

   /**
    * Интерфейс стратегии сохранения данных.
    * @class SBIS3.CONTROLS.ISaveStrategy
    * @public
    * @author Сухоручкин Андрей Сергеевич
    */

    return {
        saveAs: function() {
            throw new Error('Method must be implemented');
        }
    };
});
