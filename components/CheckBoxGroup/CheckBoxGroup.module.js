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
    *          <option name="caption">CheckBox 1</option>
    *       </options>
    *       <options>
    *          <option name="id">2</option>
    *          <option name="caption">CheckBox 2</option>
    *       </options>
    *    </options>
    *    <option name="keyField">id</option>
    *    <option name="displayField">caption</option>
    * </component>
    * @cssModifier controls-ButtonGroup__vertical Задаёт вертикальное расположение элементов в группе.
    */

   var CheckBoxGroup = CheckBoxGroupBase.extend( /** @lends SBIS3.CONTROLS.CheckBoxGroup.prototype */ {
      _dotTplFn : dotTplFn,
       /**
        * @typedef {Object} GroupItems
        * @property {String} id Идентификатор элемента группы.
        * @property {String} caption Заголовок элемента группы.
        */
       /**
        * @cfg {GroupItems[]} Набор исходных данных, по которому строится отображение группы
        * @name SBIS3.CONTROLS.CheckBoxGroup#items
        * @example
        * <pre class="brush:xml">
        *     <options name="items" type="array">
        *        <options>
        *            <option name="id">1</option>
        *            <option name="caption">Флажок_1</option>
        *         </options>
        *         <options>
        *            <option name="id">2</option>
        *            <option name="caption">Флажок_2</option>
        *         </options>
        *         <options>
        *            <option name="id">3</option>
        *            <option name="caption">Флажок_3</option>
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