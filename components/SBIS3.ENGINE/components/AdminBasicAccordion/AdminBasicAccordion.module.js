define('js!SBIS3.Engine.AdminBasicAccordion', ['js!SBIS3.CORE.CompoundControl',
      'html!SBIS3.Engine.AdminBasicAccordion',
      'css!SBIS3.Engine.AdminBasicAccordion',
      'js!SBIS3.Engine.AccordionNavController'
   ],
   function(CompoundControl, dotTplFn) {

      'use strict';
      var
         _ = require('js!SBIS3.Engine.AccordionNavController')._,
         ls = localStorage,
         bool = function() {
            return !!(arguments[0]);
         },
         moduleClass = CompoundControl.extend({
            _dotTplFn: dotTplFn,
            $protected: {
               _options: {
                  config: ""
               }
            },
            $constructor: function() {
               this._orderMap = [];
               this.REFERENCE_MAP = [];
               this._tempArea = $ws.single.ControlStorage.getByName('Область содержания');
               this._container = $('.cloud_accord');
               this._menus = {};
               this._templates = {};
               this.navController = require('js!SBIS3.Engine.AccordionNavController');

               this._publish('onAccordionStateChange');
            },

            init: function() {
               moduleClass.superclass.init.call(this);



               $ws._cloudAccordion = this;
               this.subscribe('onReady', function() {
                  require([this._options.config], function(config) {
                     $ws._cloudAccordion._menus = config.config;
                     $ws._cloudAccordion._templates = config.templates;
                     $ws._cloudAccordion._default = config.defaultKey;
                     $ws._cloudAccordion._defaultMenu = config.defaultMenu;
                     $ws._cloudAccordion._pathToLogo = config.logoPath ? config.logoPath : undefined;
                     $ws._cloudAccordion.navController.initData(config.config, config.templates);
                     $ws._cloudAccordion.stateMap = $ws._cloudAccordion.navController.stateMap;
                     if (!$('.cloud_accord').length) {
                        $('body').append('<div class="cloud_accord"></div>');
                     }

                     _.forEach($ws._cloudAccordion._menus, function(value, title) {
                        $ws._cloudAccordion._orderMap.push(title);
                        $ws._cloudAccordion.REFERENCE_MAP.push(title);
                     });
                     $ws._cloudAccordion.startDraw(true);
                  });

               });


            },
            startDraw: function(initialLoad, isCompact) {

               var navigationId = '';
               if (!ls.getItem('cloud_new_accord_in_compact')) ls.setItem('cloud_new_accord_in_compact', true);

               if (!isCompact) {
                  var state = $ws.single.NavigationController.getStateByKey('cloudAccord');
                  navigationId = state ? this.stateMap[state.state] : this.stateMap[this._defaultMenu];
                  if (this._options.allowReorder) {
                    for (var title in this._menus) {
                       if (this._menus[title].navId === navigationId) {
                          this.reorderMap(title);
                          break;
                       }
                    }
                 }
                  }

               this.drawMenus();
               this.getContainer().removeClass('ws-area').prepend(this.markupGetters.header());
               var $menus = this.getMenuItem();
               _.forEach($menus, function(menu) {
                var $menu = $(menu),
                navId = $menu.attr('nav_id');
                _.forEach($ws._cloudAccordion._menus, function(menu) {
                    if (menu && menu.navId === navId && menu.iconPath) {
                        $menu.find('.acc_title_img').css('background', 'url(' + menu.iconPath + ')');
                    }
                });
               });
               this._pathToLogo && this.findInContainer('.acc__head__logo').css('backgroundImage', 'url(' + this._pathToLogo + ')');

               this.setListeners();
               if (initialLoad) this.navController.openMenuOnLoad.call(this);
            },
            setListeners: function() {
               var f = this.findInContainer;
               f('.change_view_ico').bind('click', this.changeView);
               f('.expandBranchBtn').bind('click', this.toggleBranch);
               f('.acc__head__logo').bind('click', function() {
                  window.location = '/';
               });
               this.getMenuItem().bind('click', this.groupClickHandler);
               this.getSubMenu().bind('click', this.subMenuClickHandler);
            },
            findInContainer: function(selector) {
               return $ws._cloudAccordion.getContainer().find(selector);
            },
            getOpenedGroup: function() {
               return this._openedGroupNavId || this._default;
            },
            setOpenedGroup: function(id) {
               return !!(this._openedGroupNavId = id);
            },
            getOpenedSubMenu: function() {
               return this._activeSubMenuKey;
            },
            setOpenedSubMenu: function(key) {
               return !!(this._activeSubMenuKey = key);
            },
            getContainer: function() {
               return $('.cloud_accord')
            },
            getRightTemplate: function() {
               return this._activeTemplate || this._tempArea.getTemplateName();
            },
            getSubMenusByParent: function(id) {
               return this.findInContainer(id ? ".accord_submenu[parent_nav=" + id + "]" : ".accord_submenu");
            },
            getSubMenu: function(key) {
               return this.findInContainer(key ? ".accord_submenu[key=" + key + "]" : ".accord_submenu");
            },
            getMenuItem: function(id) {
               return this.findInContainer(id ? ".accord_menu_item[nav_id=" + id + "]" : ".accord_menu_item");
            },
            getSubMenusWrapperById: function(id) {
               return this.getSubMenusByParent(id).parent();
            },
            isInCompactView: function() {
               return this.getContainer().hasClass('acc--compact');
            },

            getChildSubMenus: function(branchKey) {
               for (var title in this._menus) {
                  if (this._menus.hasOwnProperty(title)) {
                     var menuData = this._menus[title].data,
                        recs = _.filter(menuData, function(menu) {
                           return '' + menu[1][0] === branchKey;
                        });
                     if (recs.length) {
                        return _.map(recs, function(rec) {
                           return rec[0];
                        });
                     }
                  }
               }
               return [];
            },
            isSubMenuBranch: function(key) {
               return bool(_.find($ws._cloudAccordion._menus, function(menu) {
                  return bool(_.find(menu.data, function(record) {
                     return record[0] === key;
                  }));
               }));
            },
            getMainSectionByNavId: function(id) {
               if (id == null) {
                  return this._default;
               }
               var mainSection = _.find(this._menus, function(menu) {
                  return menu.navId === id;
               });
               return mainSection ? mainSection.main : this._default;
            },
            setRightTemplate: function(name) {
              if (name === undefined) {
                  return false;
               }
               if ($ws.helpers.type(name) === 'string') {
                  if (this.getRightTemplate() !== name || this.getOpenedGroup() === "ClientsMenuBro") {
                     this._tempArea.setTemplate(name);
                     this._activeTemplate = name;
                  }
               } else if ($ws.helpers.type(name) === 'array') {
                  var templateName = name[0];
                  var params = name[1];
                  var forceChangeTemplateFlag = !!name[2]
                  if (this.getRightTemplate() !== templateName || this.getOpenedGroup() === "ClientsMenuBro" || forceChangeTemplateFlag) {
                     this._tempArea.setTemplate(templateName, params);
                     this._activeTemplate = templateName;
                  }
                  // TODO: когда нибудь избавиться от копипаста
               }
            },
            reorderMap: function(openedGroup) {
               var
                  map = this.REFERENCE_MAP.slice(),
                  index = map.indexOf(openedGroup);
               map.unshift(map[index]);
               map.splice(index + 1, 1);
               this._orderMap = map;
            },
            toggleBranch: function(e) {
               var branchKey, childKeys;
               if (e instanceof Object) {
                  e.stopPropagation();
                  branchKey = $(this).parent().attr('key');
                  $(this).toggleClass('openedBranch');
               } else {
                  branchKey = e;
               }
               childKeys = $ws._cloudAccordion.getChildSubMenus(branchKey);
               _.forEach(childKeys, function(key) {
                  $ws._cloudAccordion.getSubMenu(key).toggle();
               });
            },
            openActiveBranch: function(activeMenuKey, id) {
               var subMenus = this.getSubMenusByParent(id),
                  branchKey, acc = this;
               _.forEach(subMenus, function(subMenu) {
                  var branchKey = $(subMenu).attr('key');
                  if (acc.isSubMenuBranch(+branchKey) && +branchKey !== +activeMenuKey && (acc.getChildSubMenus(branchKey).indexOf(+activeMenuKey) === -1)) {
                     acc.toggleBranch(branchKey);
                  } else {
                     acc.getSubMenu(+branchKey).find('.expandBranchBtn').toggleClass('openedBranch');
                  }
               });
            },
            changeView: function(noMark) {
               var acc = $ws._cloudAccordion,
                  openedGroupId = acc.getOpenedGroup(),
                  navigationState = '';
               acc.getContainer().children().detach();
               acc.findInContainer('.accord-submenu-header--fixed').detach();

               if (acc.isInCompactView()) {
                  var key, state = $ws.single.NavigationController.getStateByKey(openedGroupId);
                  if (state) {
                     key = state.state;
                  }

                  for (var title in acc._menus) {
                     if (acc._menus[title].navId === openedGroupId) {
                        navigationState = title;
                        break;
                     }
                  }

                  acc._options.allowReorder && acc.reorderMap(navigationState);
                  acc.setOpenedGroup(openedGroupId);

                  $('.adminBasic__header').css('margin-left', '236px'); // :((((((
                  ls.setItem('cloud_new_accord_in_compact', false);

               } else {
                  acc._orderMap = acc.REFERENCE_MAP.slice();
                  acc.getSubMenu().hide();
                  acc.findInContainer('.menu_title').toggle();
                  acc.findInContainer('#cloud_logo').hide();
                  acc.navController.storeViewMode.call(acc);
                  $('.adminBasic__header').css('margin-left', '54px');
                  ls.setItem('cloud_new_accord_in_compact', true);

               }
               acc.startDraw(false, true);
               if (acc._tempArea.getContainer().css('left') === '224px') {
                  acc._tempArea.getContainer().css('left', '44px');
                  acc.getContainer().addClass('acc--compact');

               } /// :(((((
               else {
                  acc._tempArea.getContainer().css('left', '224px');
                  acc.getContainer().removeClass('acc--compact');
                  acc.openGroup(acc.getOpenedGroup());
                  acc.openActiveBranch(key, openedGroupId);

               }
               if (noMark instanceof Object) acc.markActive();
               acc._notify('onAccordionStateChange');

            },
            closePreview: function(id) {
               var
                  subMenus = $ws._cloudAccordion.getSubMenusByParent(id),
                  wrap = subMenus.parent(),
                  f = this.findInContainer;
               f('.accord-submenu-header--fixed').detach();
               subMenus.hide();
               f(".accord-submenu--fixed_view").hide();

               wrap.removeClass('wrap-for-second-range');
               this.getMenuItem().removeClass('active_preview_bg');

            },
            showPreview: function(id) {
               if (this.getOpenedGroup() === id && !this.isInCompactView()) {
                  return false;
               }
               var
                  subMenus = this.getSubMenusByParent(id),
                  acc = this,
                  wrap = this.getMenuItem(id).find('.submenus_wrapper');

               this.findInContainer('.accord-submenu-header--fixed').detach();
               this.findInContainer(".accord-submenu--fixed_view").hide();
               subMenus.show().addClass('accord-submenu--fixed_view');
               wrap.addClass('wrap--preview');
               wrap.prepend(this.markupGetters.subMenuHeader(id).addClass('previewHeader-color'));
               this.getMenuItem().removeClass('active_preview_bg');
               this.getMenuItem(id).addClass('active_preview_bg'); // ????? css
               $('.submenu-header-close').bind('click', function(e) {
                  e.stopPropagation();
                  acc.closePreview(id);
               });
               $('.previewHeader-color').bind('click', function(e) {
                  acc.subMenuClickHandler(e, acc.getMainSectionByNavId(id), id);
               });
               wrap.find('.submenu-title-container').removeClass('disablePaddingLeft');
               wrap.find('.expandBranchBtn').detach();
               wrap.show(); // ?????? css
               if (id === "AnalyzeMenuBro") {
                  if (subMenus.length % 2 === 1) {
                     wrap.append("<div style='height:35px'class='accord_submenu' parent_nav='AnalyzeMenuBro'></div>");
                  }

                  $('.previewHeader-color').addClass('second-range-header');
                  wrap.addClass('wrap-for-second-range');
                  if (!($('.left-column').length)) { // ????? жесть
                     wrap.append('<div class="left-column"></div><div class="right-column"></div>');
                     var count = acc.getSubMenusByParent(id).length;
                     $.each(acc.getSubMenusByParent(id), function(n, elem) {
                        var $el = $(elem);
                        $el.detach();
                        n >= count / 2 ? $('.right-column').append($el) : $('.left-column').append($el);
                     });
                  }
               }
            },
            reorderMapAndRedrawAcc: function(stMenu) {
              if (this._options.allowReorder) {
               this.reorderMap(stMenu);
               this.getContainer().children().detach();
               this.startDraw(false, true);
             }
            },
            groupClickHandler: function(e) {
               var navId = $(this).attr('nav_id'),
                  acc = $ws._cloudAccordion,
                  mainSection = acc.getMainSectionByNavId(navId);
               e.stopPropagation();
               if (navId === acc.getOpenedGroup() && acc.getOpenedSubMenu() !== mainSection && !acc.isInCompactView()) {
                  acc.subMenuClickHandler(e, mainSection, navId);
               } else {
                 if (!acc.getSubMenusByParent(navId).length) {
                   acc.subMenuClickHandler(e, mainSection, navId);
                   return;
                 }
                  acc.showPreview(navId);
               }
            },
            openGroup: function(id) {
               this.setOpenedGroup(id);
               this.getSubMenu().hide();
               this.getSubMenusByParent(id).show();
               this.getSubMenusByParent(id).parent().removeClass('wrap--preview');
            },

            closeCompactPreview: function() {
               this.findInContainer('.accord-submenu-header--fixed').detach();
               this.findInContainer(".accord-submenu--fixed_view").hide();
               this.getMenuItem().removeClass('opened_group');
               this.getSubMenu().removeClass('opened_group');
               this.findInContainer('.wrap--preview').hide();
            },
            subMenuClickHandler: function(e) {
               var
                  acc = $ws._cloudAccordion,
                  key = arguments[1] || $(this).attr('key'),
                  id = arguments[2] || $(this).attr('parent_nav');
               e.stopPropagation();
               acc.setOpenedGroup(id);
               acc.setOpenedSubMenu(key);
               acc.navController.setNavigation.call(acc);
               acc.setRightTemplate(acc._templates[key]);
               if (acc.isInCompactView()) {
                  acc.closeCompactPreview();
               } else {
                  acc.closePreview(id);
                  acc.reorderMapAndRedrawAcc(acc.getMenuItem(id).find('.menu_title').html());
                  acc.openGroup(id);
                  acc.openActiveBranch(key, id);
               }
               acc.markActive();
            },
            drawMenus: function() {
               var map = this._orderMap,
                  acc = this;
               _.forEach(map, function(item) {
                  var content = acc._menus[item];
                  acc.drawMenu(acc.getContainer(), item, content).callback();
               });

            },
            drawMenu: function(cont, title, content) {
               var acc = $ws._cloudAccordion,
                  def = new $ws.proto.Deferred(),
                  $menu = acc.markupGetters.menuItem(title, content);
               cont.append($menu);
               def.addCallback(function() {
                  acc.drawSubMenu($menu, content.data, content.navId);
               });
               return def;
            },
            drawSubMenu: function(cont, recs, parentId) {
               if (recs) {
                  var acc = $ws._cloudAccordion;
                  var wrapper = $("<div class='submenus_wrapper'></div>");
                  _.forEach(recs, function(record) {
                     if (record[0] !== acc.getMainSectionByNavId(parentId)) {
                        wrapper.append(acc.markupGetters.subMenu(record, parentId));
                     }
                  });
                  acc.getMenuItem(parentId).append(wrapper);
               }
            },
            markActive: function() {
               this.findInContainer('.menuItemTitleContainer').removeClass('--active');
               this.getSubMenu().removeClass('--active');
               if (!this.isInCompactView()) {
                  if (this.getOpenedSubMenu() === this.getMainSectionByNavId(this.getOpenedGroup())) {
                     this.getMenuItem(this.getOpenedGroup()).find('.menuItemTitleContainer').addClass('--active');
                  } else {
                     this.getSubMenu(this.getOpenedSubMenu()).addClass('--active');
                  }
               } else {
                  this.getMenuItem(this.getOpenedGroup()).find('.menuItemTitleContainer').addClass('--active');
                  this.getSubMenu(this.getOpenedSubMenu()).addClass('--active');
               }
            },
            markupGetters: {
               header: function() {
                  return '<div class="acc__head"><div class="change_view_ico"></div><div class="acc__head__logo"></div></div>';
               },
               menuItem: function(title, content) {
                  return "<div nav_id='" + content.navId + "' class='accord_menu_item'>" +
                     "<div class='menuItemTitleContainer'>" +
                     "<div class='acc_title_img " + content.accordStateId + "'></div>" +
                     "<span class='menu_title'>" + title + "</span></div></div>";
               },
               subMenu: function(rec, id) {
                  var
                     key = rec[0],
                     parent = rec[1][0] || '',
                     title = rec[3],
                     isChild = rec[1][0],
                     isBranch = rec[2],
                     expander = isBranch ? "<span class='expandBranchBtn'></span>" : "",
                     paddingLeft = !isChild ? '32px' : '40px'; // ???? css
                  return "<div class='accord_submenu' key='" + key + "' parent_nav ='" + id + "' parent_menu='" + parent + "'" +
                     "style='display: none'>" + expander + "<span style='padding-left: " + paddingLeft + "' class='submenu-title-container'>" +
                     title + "</span></div>";
               },
               subMenuHeader: function(id) {
                  var menuTitle = '';
                  _.forEach($ws._cloudAccordion._menus, function(content, title) {
                     if (content.navId === id) menuTitle = title;
                  });
                  return $("<div class='accord-submenu-header--fixed accord-menu-item--selected--compact'>" + menuTitle + "<div class='submenu-header-close'></div</div>");
               }
            }

         });
      return moduleClass;
   });
