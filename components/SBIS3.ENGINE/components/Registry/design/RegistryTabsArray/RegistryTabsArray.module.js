define('js!genie.RegistryTabsArray',
   [
      'js!genie.PropertyEditorStandardArray',
      'js!SBIS3.CORE.CompoundControl',
      'js!SBIS3.CONTROLS.PopupMixin',
      'html!genie.RegistryTabsArray/RegistryTabsAreaDialog',
      'html!genie.RegistryTabsArray/RegistryTabsAreaGroups',
      'css!genie.RegistryTabsArray'
   ], function (parent, compoundControl, popupMixin, dialogTpl, areaTpl) {
      'use strict';
      var RegistryTabsArray = parent.extend({
         getChildName: function (item, key, index) {
            var name = '',
               value = item.getValue();
            if (value.id || value.title) {
               name = (value.title || 'tabs') + ' [' + (value.id || '') + ']';
            } else {
               name = 'tabs[' + index + ']';
            }
            return name;
         },
         _openEditPopup: function (key, item, line) {
            var doc = this.getActivePage().getDocument(),
               comp = doc.getSelectedComponents(),
               model = doc.getDocModelObj(comp),
               activePageChannel = $ws.single.EventBus.channel('activePage');
            item.getValue().id && model[0].component.getTabButtons().setCurrentTab(item.getValue().id);
            activePageChannel.notify('onChangedProperty');
            return RegistryTabsArray.superclass._openEditPopup.apply(this, arguments)
         },

         addElement: function(container) {
            var self = this;
            this.getConfig().blockOnChange(function () {
               var res = self.getConfig().map(function (item) {
                  var id = item.getValue().id;
                  if (/^id\-(\d)*$/.test(id)) {
                     return parseInt(id.split('-')[1]);
                  }
                  return 0;
               });
               var max = Math.max.apply(undefined, res);
               if (!isFinite(max)) {
                  max = 0;
               }
               self.getConfig().add({id: 'id-' + (max + 1), title: 'newTab'});
            });
         },

         removeElement: function (item, key, index) {
            var tab = item.getValue(),
               tabs = item.getParent().getValue(),
               areas = {'mainArea': 0, 'tabsArea': 0/*, 'topArea': 0*/},
               hasId = false,
               list = {};
            for (var area in areas) {
               if (areas.hasOwnProperty(area) && tab[area]) {
                  var areaOpt = item.getTopParent().getChildByName(area),
                     areaValue = areaOpt.getValue(),
                     i = 0, cnt = 0;
                  hasId = false;
                  while (!hasId && (i < areaValue.length)) {
                     if (tab[area] == areaValue[i].id) {
                        hasId = true;
                        for (var tabIdx = 0; tabIdx < tabs.length; tabIdx++) {
                           if (tabs[tabIdx][area] == areaValue[i].id) {
                              cnt++;
                           }
                        }
                        if (cnt <= 1) {
                           list[area] = {
                              idx: i,
                              name: areaValue[i].id,
                              opt: areaOpt
                           };
                        }
                     }
                     i++;
                  }
               }
            }
            if (Object.keys(list).length > 0) {
               if (this._dialog) {
                  this._dialog.destroy();
               }
               this._dialog = new TabsPopup({
                  parent: this,
                  target: this.getContainer(),
                  isModal: true,
                  closeByExternalClick: true,
                  element: $('<div></div>'),
                  corner: 'br',
                  vertcalAlign: {
                     side: 'bottom'
                  },
                  horizontalAlign: {
                     side: 'right'
                  },
                  areaList: list
               });
               this._dialog.show();
            }
            RegistryTabsArray.superclass.removeElement.apply(this, arguments);
            var doc = this.getActivePage().getDocument(),
               comp = doc.getSelectedComponents(),
               model = doc.getDocModelObj(comp);
            tabs = item.getParent().getValue();
            model[0].component.getTabButtons().setCurrentTab((tabs[0] && tabs[0].id) || '');
         }
      });

      var TabsPopup = compoundControl.extend([popupMixin], {
         _dotTplFn: dialogTpl,
         $protected: {
            _options: {
               areaList: {},
               areaTpl: areaTpl
            }
         },
         $constructor: function () {
            var self = this;
            this._$groups = $('.registryTabsAreaDialog__groups', this.getContainer()[0]);
            this.getContainer().delegate('.registryTabsAreaDialog__removeGroup', 'mouseup', function (event) {
               var $group = $(this).closest('.registryTabsAreaDialog__group'),
                  areaName = $group.attr('area-name'),
                  groupIdx = $group.attr('group-idx');
               self._options.areaList[areaName] && self._options.areaList[areaName].opt.remove(groupIdx);
               self._options.areaList[areaName] = null;
               if (self._options.areaList['mainArea'] || self._options.areaList['topArea'] || self._options.areaList['tabsArea']) {
                  self._$groups.html(self._options.areaTpl({areaList: self._options.areaList}));
               } else {
                  self.hide();
               }
            });
         }
      });
      return RegistryTabsArray;
   });