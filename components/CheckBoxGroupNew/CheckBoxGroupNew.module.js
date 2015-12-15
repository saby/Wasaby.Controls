/**
 * Created by iv.cheremushkin on 13.08.2014.
 */

define('js!SBIS3.CONTROLS.CheckBoxGroupNew', [
      'js!SBIS3.CONTROLS.CheckBoxGroupBaseNew',
      'html!SBIS3.CONTROLS.CheckBoxGroup',
      'js!SBIS3.CONTROLS.Data.Utils',
      'js!SBIS3.CONTROLS.CheckBox'
   ],
   function(CheckBoxGroupBase, dotTplFn, Utils) {

      'use strict';

      /**
       * Контрол, отображающий группу чекбоксов
       * @class SBIS3.CONTROLS.CheckBoxGroupNew
       * @extends SBIS3.CONTROLS.CheckBoxGroupBaseNew
       * @mixes SBIS3.CONTROLS.FormWidgetMixin
       * @demo SBIS3.CONTROLS.Demo.MyCheckBoxGroup
       * @initial
       * <component data-component='SBIS3.CONTROLS.CheckBoxGroup'>
       *    <options name="items" type="array">
       *       <options>
       *          <option name="id">1</option>
       *          <option name="title">CheckBox 1</option>
       *       </options>
       *       <options>
       *          <option name="id">2</option>
       *          <option name="title">CheckBox 2</option>
       *       </options>
       *    </options>
       *    <option name="keyField">id</option>
       *    <option name="displayField">title</option>
       * </component>
       */

      var CheckBoxGroup = CheckBoxGroupBase.extend( /** @lends SBIS3.CONTROLS.CheckBoxGroupNew.prototype */ {
         _dotTplFn : dotTplFn,
          /**
           * @typedef {Object} GroupItems
           * @property {String} id Идентификатор.
           * @property {String} title Подпись.
           */
          /**
           * @cfg {GroupItems[]} Набор исходных данных, по которому строится отображение
           * @name SBIS3.CONTROLS.CheckBoxGroup#items
           * @example
           * <pre>
           *     <options name="items" type="array">
           *        <options>
           *            <option name="id">1</option>
           *            <option name="title">Флажок_1</option>
           *         </options>
           *         <options>
           *            <option name="id">2</option>
           *            <option name="title">Флажок_2</option>
           *         </options>
           *         <options>
           *            <option name="id">3</option>
           *            <option name="title">Флажок_3</option>
           *         </options>
           *      </options>
           * </pre>
           */

         $protected: {
            _options: {

            }
         },

         _getItemTemplate : function(item) {
            return (function (item) {
               var caption = Utils.getItemPropertyValue(item.item, this._options.displayField);
               return '<component data-component="SBIS3.CONTROLS.CheckBox">' +
                  '<option name="caption">'+caption+'</option>'+
                  '</component>';
            }).bind(this);
         }


      });

      return CheckBoxGroup;

   }
);