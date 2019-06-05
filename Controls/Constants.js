define('Controls/Constants', [], function() {
   'use strict';
   var
      /**
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
