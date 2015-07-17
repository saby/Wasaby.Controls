define('js!SBIS3.CONTROLS.Suggest', [
   'js!SBIS3.CORE.Control',
   'js!SBIS3.CONTROLS.DataBindMixin',
   'js!SBIS3.CONTROLS.PickerMixin',
   'js!SBIS3.CONTROLS.SuggestMixin'
], function (Control, DataBindMixin, PickerMixin, SuggestMixin) {
   'use strict';

   /**
    * Компонент автодополнения. Можно подключить к любому узлу DOM, в т.ч. в котором уже подключен другой компонент.
    *
    * @class SBIS3.CONTROLS.Suggest
    * @extends $ws.proto.Control
    * @mixes SBIS3.CONTROLS.PickerMixin
    * @mixes SBIS3.CONTROLS.DataBindMixin
    * @mixes SBIS3.CONTROLS.SuggestMixin
    * @control
    * @author Алексей Мальцев
    */

   var Suggest = Control.Control.extend([PickerMixin, DataBindMixin, SuggestMixin], /** @lends SBIS3.CONTROLS.Suggest.prototype */{
      getId: function () {
         /* Т.к. Suggest может цепляться к контейнеру, в котором уже "живет" другой компонент, то нужно избавиться
          от ситуации, когда у них могут совпадать _id, взятые из html-атрибута id контейнера */
         if (this._id === '') {
            this._id = $ws.helpers.randomId();
         }
         return this._id;
      }
   });

   return Suggest;
});
