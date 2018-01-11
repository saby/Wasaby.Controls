/**
 * Created by iv.cheremushkin on 12.08.2014.
 */

define('SBIS3.CONTROLS/TagSelector', ['SBIS3.CONTROLS/TextBox'], function(TextBox) {

   'use strict';

   /**
    * Контрол для списка выбранных значений.
    * Вводим что-то в поле, нажимаем Энтер и значение добавляется с крестиком,
    * если не задать источник данных - коллекцию, то можно добавлять любые значения. Иначе только из списка
    * @class SBIS3.CONTROLS/TagSelector
    * @extends SBIS3.CONTROLS/TextBox
    * @author Крайнов Д.О.
    * @public
    */

   var TagSelector = TextBox.extend(/** @lends SBIS3.CONTROLS/TagSelector.prototype */{
      $protected: {
         _options: {

         }
      },

      $constructor: function() {

      }

   });

   return TagSelector;

});