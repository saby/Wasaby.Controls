define('Controls/List/resources/utils/GroupUtil', [
   'Core/UserConfig'
], function(cUserConfig) {
   var
      PREFIX_STORE_KEY_COLLAPSED_GROUP = 'LIST_COLLAPSED_GROUP_',
      GroupUtil = {

         /**
          * Store collapsed groups to UserConfig
          * @param groups List of the collapsed groups
          * @param storeKey Key to store list of collapsed groups
          * @returns {Core/Deferred}
          */
         storeCollapsedGroups: function(groups, storeKey) {
            return cUserConfig.setParam(PREFIX_STORE_KEY_COLLAPSED_GROUP + storeKey, groups);
         },

         /**
          * Restore collapsed groups from UserConfig
          * @param storeKey Key to store list of collapsed groups
          * @returns {Core/Deferred}
          */
         restoreCollapsedGroups: function(storeKey) {
            return cUserConfig.getParam(PREFIX_STORE_KEY_COLLAPSED_GROUP + storeKey);
         }
      };
   return GroupUtil;
});
