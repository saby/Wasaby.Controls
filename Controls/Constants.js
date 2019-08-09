define('Controls/Constants', [], function() {
   'use strict';
   
   /**
    * Константы
    * <ul>
    *    <li>
    *       view.hiddenGropup - Константа для определения элемента hiddenGroup в {@link Controls/interface/IGrouped#groupingKeyCallback gropingKeyCallback};
    *    </li>
    *    <li>
    *       editing.CANCEL - Константа, которую можно вернуть в {@link Controls/interface/IEditableList#beforeBeginEdit beforeBeginEdit} для отмены редактирования.
    *    </li>
    * </ul>
    *
    * @class Controls/Constants
    * @public
    */

   /*
    * Constants
    * <ul>
    *    <li>
    *       view.hiddenGropup - Constant for determining item in the hiddenGroup in the {@link Controls/interface/IGrouped#groupingKeyCallback gropingKeyCallback}
    *    </li>
    *    <li>
    *       editing.CANCEL - Constant that can be returned in {@link Controls/interface/IEditableList#beforeBeginEdit beforeBeginEdit} to cancel egiting
    *    </li>
    * </ul>
    *
    * @class Controls/Constants
    * @public
    */    

   var
      constants = {
         view: {
            hiddenGroup: 'CONTROLS_HIDDEN_GROUP'
         },
         editing: {
            CANCEL: 'Cancel'
         }
      };
   return constants;
});
