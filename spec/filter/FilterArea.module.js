define('js!SBIS3.SPEC.filter.FilterArea', [
], function() {

   /**
    * Область, содержащая в себе три блока:
    * 1) Сам редактор фильтров
    * 2) Блок "Можно отобрать"
    * 3) И список записей из истории
    * @class SBIS3.SPEC.filter.FilterArea
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
    * @name SBIS3.SPEC.filter.FilterArea#items
    * @cfg {Array<PropertyGridItem>} Текущее значение фильтра.
    */


   /**
    * @event SBIS3.SPEC.filter.FilterArea#onPropertyChanged Происходит при изменении фильтра.
    * @param {Object} filter измененные свойства в формате ключ-значение.
    */

});