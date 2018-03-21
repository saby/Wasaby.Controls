/**
 * Created by iv.cheremushkin on 13.08.2014.
 */

define('SBIS3.CONTROLS/CheckBox/Group',
   [
      'SBIS3.CONTROLS/CheckBox/Group/GroupBase',
      'tmpl!SBIS3.CONTROLS/CheckBox/Group/CheckBoxGroup',
      'tmpl!SBIS3.CONTROLS/CheckBox/Group/resources/ItemTemplate',
      'SBIS3.CONTROLS/CheckBox',
      'css!SBIS3.CONTROLS/CheckBox/Group/CheckBoxGroup'
   ],
   function(CheckBoxGroupBase, dotTplFn, ItemTemplate) {

   'use strict';

   /**
    * Контрол, отображающий группу чекбоксов
    * @class SBIS3.CONTROLS/CheckBox/Group
    * @extends SBIS3.CONTROLS/CheckBox/Group/GroupBase
    * @demo Examples/CheckBoxGroup/MyCheckBoxGroup/MyCheckBoxGroup
    * @author Журавлев М.С.
    * @cssModifier controls-ButtonGroup__vertical Задаёт вертикальное расположение элементов в группе.
    *
    * @control
    * @public
    * @category Input
    * @initial
    * <component data-component='SBIS3.CONTROLS/CheckBox/Group'>
    *    <options name="items" type="array">
    *       <options>
    *          <option name="id" type="string">1</option>
    *          <option name="caption">CheckBox 1</option>
    *       </options>
    *       <options>
    *          <option name="id" type="string">2</option>
    *          <option name="caption">CheckBox 2</option>
    *       </options>
    *    </options>
    *    <option name="idProperty">id</option>
    *    <option name="displayProperty">caption</option>
    * </component>
    */

   var CheckBoxGroup = CheckBoxGroupBase.extend( /** @lends SBIS3.CONTROLS/CheckBox/Group.prototype */ {
      _dotTplFn : dotTplFn,
       /**
        * @typedef {Object} GroupItems
        * @property {String} id Идентификатор элемента группы.
        * @property {String} caption Заголовок элемента группы.
        * @translatable caption
        */
       /**
        * @cfg {GroupItems[]} Набор исходных данных, по которому строится отображение группы
        * @name SBIS3.CONTROLS/CheckBox/Group#items
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
            _canServerRender: true,
            _defaultItemTemplate: ItemTemplate
         }
      }
   });

   return CheckBoxGroup;

});
