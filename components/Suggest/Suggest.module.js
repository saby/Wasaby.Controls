define('js!SBIS3.CONTROLS.Suggest', [
   'js!SBIS3.CORE.Control',
   'js!SBIS3.CONTROLS.DataBindMixin',
   'js!SBIS3.CONTROLS.PickerMixin',
   'js!SBIS3.CONTROLS.SuggestMixin',
   'Core/helpers/generate-helpers',
   'css!SBIS3.CONTROLS.Suggest'
], function (Control, DataBindMixin, PickerMixin, SuggestMixin, genHelpers) {
   'use strict';

   /**
    * Компонент автодополнения. Можно подключить к любому узлу DOM, в т.ч. в котором уже подключен другой компонент.
    *
    * @class SBIS3.CONTROLS.Suggest
    * @extends SBIS3.CORE.Control
    * @mixes SBIS3.CONTROLS.PickerMixin
    * @mixes SBIS3.CONTROLS.DataBindMixin
    * @mixes SBIS3.CONTROLS.SuggestMixin
    * @author Крайнов Дмитрий Олегович
    */

   var Suggest = Control.Control.extend([PickerMixin, DataBindMixin, SuggestMixin], /** @lends SBIS3.CONTROLS.Suggest.prototype */{
      getId: function () {
         /* Т.к. Suggest может цепляться к контейнеру, в котором уже "живет" другой компонент, то нужно избавиться
          от ситуации, когда у них могут совпадать _id, взятые из html-атрибута id контейнера */
         if (this._id === '') {
            this._id = genHelpers.randomId();
         }
         return this._id;
      }
   });

   return Suggest;
});
