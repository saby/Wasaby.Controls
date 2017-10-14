define('js!SBIS3.SPEC.filter.PropertyGrid', [
], function() {

   /**
    * Редактор свойств фильтра.
    * @class SBIS3.SPEC.filter.PropertyGrid
    * @extends SBIS3.SPEC.Control
    * @control
    * @public
    */

   /**
    * @typedef {Object} PropertyGridItem
    * @variant key идентификатор редактируемого свойства.
    * @variant value редактируемое значение.
    * @variant resetValue значение, устанавливаемое при сбросе фильтра.
    * @variant textValue текствое представление выбранного значения.
    * @variant caption.
    * @variant editingTemplate.
    */


   /**
    * @name SBIS3.SPEC.filter.PropertyGrid#items
    * @cfg {Array<PropertyGridItem>} Текущее значение фильтра.
    */


   /**
    * @event SBIS3.SPEC.filter.PropertyGrid#onPropertyChanged Происходит при изменении фильтра.
    * @param {Object} filter измененные свойства в формате ключ-значение.
    */

});