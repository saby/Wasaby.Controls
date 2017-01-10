/**
 * Created by iv.cheremushkin on 13.08.2014.
 */

define('js!SBIS3.CONTROLS.RadioGroup', ['js!SBIS3.CONTROLS.RadioGroupBase',
      'html!SBIS3.CONTROLS.RadioGroup',
      'html!SBIS3.CONTROLS.RadioGroup/resources/ItemTemplate',
      'js!SBIS3.CONTROLS.ITextValue',
      'js!SBIS3.CONTROLS.RadioButton',
      'css!SBIS3.CONTROLS.RadioGroup'
      ],
function(RadioGroupBase, dotTpl, ItemTemplate, ITextValue) {

   'use strict';

   /**
    * Контрол задающий оформление выбора одного из нескольких значений в виде классических радиокнопок
    * @class SBIS3.CONTROLS.RadioGroup
    * @extends SBIS3.CONTROLS.RadioGroupBase
    * @mixes SBIS3.CONTROLS.FormWidgetMixin
    * @author Крайнов Дмитрий Олегович
    * @demo SBIS3.CONTROLS.Demo.MyRadioGroup
    *
    * @cssModifier controls-ButtonGroup__vertical Для вертикального расположения элементов в группе.
    * @cssModifier controls-Radio__primary акцентные кнопки
    *
    * @ignoreOptions className extendedTooltip handlers linkedContext
    *
    * @ignoreMethods applyState applyEmptyState getClassName findParent getEventHandlers  getEvents getExtendedTooltip
    * @ignoreMethods getOwner getOwnerId getTopParent getUserData makeOwnerName hasEvent hasEventHandlers once setOwner
    * @ignoreMethods sendCommand setClassName setExtendedTooltip setStateKey setUserData subscribe unsubscribe
    *
    * @ignoreEvents onDragIn onDragMove onDragOut onDragStart onDragStop onKeyPressed onTooltipContentRequest
    *
    * @control
    * @public
    * @category Inputs
    * @initial
    * <component data-component='SBIS3.CONTROLS.RadioGroup'>
    *    <option name="displayProperty">title</option>
    *    <option name="idProperty">id</option>
    *    <options name="items" type="array">
    *       <options>
    *          <option name="id">1</option>
    *          <option name="title">RadioButton 1</option>
    *       </options>
    *       <options>
    *          <option name="id">2</option>
    *          <option name="title">RadioButton 2</option>
    *       </options>
    *    </options>
    * </component>
    */

   var RadioGroup = RadioGroupBase.extend([ITextValue], /** @lends SBIS3.CONTROLS.RadioGroup.prototype */ {
      _dotTplFn : dotTpl,
      /**
       * @typedef {Object} GroupItems
       * @property {String} id Идентификатор элемента группы.
       * @property {String} title Заголовок элемента группы.
       * @property {String} caption Заголовок элемента группы.
       * @translatable title caption
       */
      /**
        * @cfg {GroupItems[]} Набор исходных данных, по которому строится отображение
        * @name SBIS3.CONTROLS.RadioGroup#items
        * @example
        * <pre class="brush:xml">
        *     <options name="items" type="array">
        *        <options>
        *            <option name="id">1</option>
        *            <option name="caption">Кнопка_1</option>
        *         </options>
        *         <options>
        *            <option name="id">2</option>
        *            <option name="caption">Кнопка_2</option>
        *         </options>
        *         <options>
        *            <option name="id">3</option>
        *            <option name="caption">Кнопка_3</option>
        *         </options>
        *      </options>
        * </pre>
        */

      $protected: {
         _options: {
            _canServerRender: true,
            _defaultItemTemplate: ItemTemplate
         }
      },

      getTextValue: function() {
         var textValue = '', projItem;
         if (this._getItemsProjection()) {
            projItem = this._getItemsProjection().at(this._options.selectedIndex);
            if (projItem) {
               textValue = this._propertyValueGetter(projItem.getContents(), this._options.displayProperty);
            }
         }

         return textValue;
      }
   });

   return RadioGroup;

});