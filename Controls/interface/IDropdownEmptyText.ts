/**
 * Interface for adding "empty selection" to dropdown lists.
 *
 * @interface Controls/interface/IDropdownEmptyText
 * @public
 * @author Золотова Э.Е.
 */
interface IDropdownEmptyText {
   readonly _options: {
      /**
       * @name Controls/interface/IDropdownEmptyText#emptyText
       * @cfg {String} Add an empty item to the list with the given text.
       * @remark
       * true - Add empty item with text 'Не выбрано'
       */
      emptyText: string;
   };
}

export default IDropdownEmptyText;
