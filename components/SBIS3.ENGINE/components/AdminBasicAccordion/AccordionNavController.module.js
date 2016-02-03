define('js!SBIS3.Engine.AccordionNavController', function() {
   'use strict';

   var navUtils = {
      ls: localStorage,
      '_': $ws.helpers,
      stateMap: {

      },

      initData: function(accordionConfig, templatesConfig) {
         this.accordionConfig = accordionConfig;
         this.templatesConfig = templatesConfig;
         navUtils._.forEach(accordionConfig, function(content, title) {
            navUtils.stateMap[content["accordStateId"]] = content["navId"];
         });
      },

      storeViewMode: function() {
         navUtils.ls.setItem('cloud_new_accord_in_compact', !(this.isIntCompactView));
      },
      setNavigation: function() {
         var key = this.getOpenedSubMenu(),
            acc = this,
            navigationId = this.getOpenedGroup(),
            accordionStateId = '';
         navUtils._.forEach(navUtils.accordionConfig, function(menu) {
            if (menu.navId === acc.getOpenedGroup()) {
               accordionStateId = menu.accordStateId;

            }
         });
         $ws.single.NavigationController.setState(navigationId, key);
         $ws.single.NavigationController.setState('cloudAccord', accordionStateId);
      },
      checkForAdditionalCloudTemplate: function() {
         var state = $ws.single.NavigationController.getStateByKey('AdditionalCloudTemplate');
         if (!state) return false;
         var templateName = state.state;
         if (templateName !== 'null') {
            this.setRightTemplate(templateName);
         } else {
            return false;
         }
         return true;
      },
      openMenuOnLoad: function() {
         if (!navUtils.checkForAdditionalCloudTemplate.call(this)) {
            var acc = this,
               accordionInCompact =
               navUtils.ls.getItem('cloud_new_accord_in_compact'),
               state = $ws.single.NavigationController.getStateByKey('cloudAccord'),
               navigationId = state ? navUtils.stateMap[state.state] : navUtils.stateMap[acc._defaultMenu],
               key = acc._default;
            (accordionInCompact == 'true') && acc.changeView(true);
            if (!navigationId) {
               navUtils._.forEach(navUtils.stateMap, function(id) {
                  if ($ws.single.NavigationController.getStateByKey(id)) {
                     navigationId = id;
                  } else {
                     navigationId = acc._defaultMenu;
                  }
               });
            }
            try {
               key = parseInt($ws.single.NavigationController.getStateByKey(navigationId).state);
            } catch (e) {
               key = acc._default;
               $ws.single.NavigationController.setState('cloudAccord', acc._defaultMenu);
            }
            (accordionInCompact === 'false') && acc.openGroup(navigationId);
            acc.setRightTemplate(this._templates[key]);
            acc.setOpenedGroup(navigationId);
            acc.setOpenedSubMenu(key);
            acc.markActive();
            if (!acc.isInCompactView()) {
               navUtils._.forEach(acc.getSubMenusByParent(navigationId), function(subMenu) {
                  var branchKey = $(subMenu).attr('key');
                  if (acc.isSubMenuBranch(+branchKey) && +branchKey !== key && (acc.getChildSubMenus(branchKey).indexOf(key) === -1)) {
                     acc.toggleBranch(branchKey);
                  } else {
                     acc.getSubMenu(+branchKey).find('.expandBranchBtn').toggleClass('openedBranch');
                  }
               });
            }
         }
      }
   };

   return navUtils;

});