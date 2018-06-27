define('SBIS3.CONTROLS/Suggest', [
   'Lib/Control/Control',
   'SBIS3.CONTROLS/Mixins/DataBindMixin',
   'SBIS3.CONTROLS/Mixins/PickerMixin',
   'SBIS3.CONTROLS/Mixins/SuggestMixin',
   'Core/helpers/Number/randomId',
   'css!SBIS3.CONTROLS/Suggest/Suggest'
], function (Control, DataBindMixin, PickerMixin, SuggestMixin, randomId) {
   'use strict';

   /**
    * Компонент автодополнения. Можно подключить к любому узлу DOM, в т.ч. в котором уже подключен другой компонент.
    *
    * @class SBIS3.CONTROLS/Suggest
    * @extends Lib/Control/Control
    *
    * @mixes SBIS3.CONTROLS/Mixins/PickerMixin
    * @mixes SBIS3.CONTROLS/Mixins/DataBindMixin
    * @mixes SBIS3.CONTROLS/Mixins/SuggestMixin
    *
    * @author Герасимов А.М.
    */

   var Suggest = Control.Control.extend([PickerMixin, DataBindMixin, SuggestMixin], /** @lends SBIS3.CONTROLS/Suggest.prototype */{
      getId: function () {
         /* Т.к. Suggest может цепляться к контейнеру, в котором уже "живет" другой компонент, то нужно избавиться
          от ситуации, когда у них могут совпадать _id, взятые из html-атрибута id контейнера */
         if (this._id === '') {
            this._id = randomId();
         }
         return this._id;
      }
   });

   return Suggest;
});
