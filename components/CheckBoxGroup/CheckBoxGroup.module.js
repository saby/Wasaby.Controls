/**
 * Created by iv.cheremushkin on 13.08.2014.
 */

define('js!SBIS3.CONTROLS.CheckBoxGroup', ['js!SBIS3.CONTROLS.CheckBoxGroupBase', 'html!SBIS3.CONTROLS.CheckBoxGroup', 'js!SBIS3.CONTROLS.CheckBox'], function(CheckBoxGroupBase, dotTplFn) {

   'use strict';

   /**
    * Контрол, отображающий группу чекбоксов
    * @class SBIS3.CONTROLS.CheckBoxGroup
    * @extends SBIS3.CONTROLS.CheckBoxGroupBase
    * @mixes SBIS3.CONTROLS.FormWidgetMixin
    * @control
    * @demo SBIS3.CONTROLS.Demo.MyCheckBoxGroup
    * @public
    * @author Крайнов Дмитрий Олегович
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
    * @cssModifier controls-ButtonGroup__vertical Для вертикального расположения элементов в группе.
    */

   var CheckBoxGroup = CheckBoxGroupBase.extend( /** @lends SBIS3.CONTROLS.CheckBoxGroup.prototype */ {
      _dotTplFn : dotTplFn,
       /**
        * @typedef {Object} CheckBoxGroupItems
        * @property {String} id Идентификатор элемента группы.
        * @property {String} title Подпись у элемента группы.
        */
       /**
        * @cfg {CheckBoxGroupItems[]} Набор исходных данных, по которому строится отображение группы
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

      $constructor: function() {

      },

      _getItemTemplate : function(item) {
         var caption = item.get(this._options.displayField);
         return '<component data-component="SBIS3.CONTROLS.CheckBox">' +
                  '<option name="caption">'+caption+'</option>'+
                '</component>';
      }
   });

   return CheckBoxGroup;

});