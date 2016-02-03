define([
   'js!genie.DesignTime',
   'js!genie.DesignTime/resources/ContainerFrame/ContainerFrame'
], function (DT, CFrame) {
   return {
      'options': [
         {
            action: 'resize'
         },
         {
            action: "titleClick",
            className: "ws-TabButtons__button",
            event: "mousedown"
         },
         {
            action: "searchStringClick",
            className: "registry__searchString",
            event: "mousedown"
         },
         {
            action: "operationsPanelClick",
            className: "registry__operationsPanel",
            event: "mousedown"
         },
         {
            action: "filterControllerClick",
            className: "registry__filterController",
            event: "mousedown"
         },
         {
            action: "defaultClick",
            className: "registry__area",
            event: "mousedown"
         }
         /*,
          {
          action: "titleCaptionClick",
          className: "ws-TabButtons__button",
          event: 'dblclick'
          }*/
      ],
      titleClick: function (tab) {
         var id = $(tab).attr("data-tab-id");
         this._tabButtons.setCurrentTab(id);
         // remove highlight
         $(tab).closest('.registry__area').find('.registry__highlighted').removeClass('registry__highlighted');
      },
      titleCaptionClick: function (tab) {
         var self = this,
            id = $(tab).attr("data-tab-id");
         var caption = prompt("Заголовок" + id, $(tab).find('.ws-TabButtons__buttonTitle').text());
         if (caption !== '' && caption !== null && caption !== undefined) {
            // TODO переделать под новую конфигурацию
            //var optionName = 'ws-config.items[' + this._getTabIndexById(id) + '].title';
            //$ws.single.EventBus.channel("modelChange").notify("onComponentPropertyChanged", self.GDI, optionName, caption);
         }
      },
      searchStringClick: function (elem, obj) {
         var
            activeDoc = obj.get(),
            comps = activeDoc.getSelectedComponents(),
            model = activeDoc.getDocModelObj(comps),
            attr = $(elem).parents('.registry__filtersContent').find('[data-name]').attr('data-name'),
            activepage = $ws.single.EventBus.channel('activePage');
            //gdi = (comps && comps[0] || '') + '-searchString',
            //overlay = DT.getOverlay();
         if (model.length) {
            activepage.notify('onPropertyGridReload', model[0].Config.getCurrentConfig().getChildByName(attr.replace('filtersContent', 'searchString')), '');
            // highlight
            $(elem).parent('.registry__filtersContent').find('.registry__highlighted').removeClass('registry__highlighted');
            $(elem).addClass('registry__highlighted');
         }
      },
      operationsPanelClick: function (elem, obj) {
         var
            activeDoc = obj.get(),
            comps = activeDoc.getSelectedComponents(),
            model = activeDoc.getDocModelObj(comps),
            attr = $(elem).parents('.registry__filtersContent').find('[data-name]').attr('data-name'),
            activepage = $ws.single.EventBus.channel('activePage');
         if (model.length) {
            activepage.notify('onPropertyGridReload', model[0].Config.getCurrentConfig().getChildByName(attr.replace('filtersContent', 'operationsPanel')), '');
            // highlight
            $(elem).parent('.registry__filtersContent').find('.registry__highlighted').removeClass('registry__highlighted');
            $(elem).addClass('registry__highlighted');
         }
      },
      filterControllerClick: function (elem, obj) {
         var
            activeDoc = obj.get(),
            comps = activeDoc.getSelectedComponents(),
            model = activeDoc.getDocModelObj(comps),
            attr = $(elem).parents('.registry__filtersContent').find('[data-name]').attr('data-name'),
            activepage = $ws.single.EventBus.channel('activePage');
         if (model.length) {
            activepage.notify('onPropertyGridReload', model[0].Config.getCurrentConfig().getChildByName(attr.replace('filtersContent', 'filterController')), '');
            // highlight
            $(elem).parent('.registry__filtersContent').find('.registry__highlighted').removeClass('registry__highlighted');
            $(elem).addClass('registry__highlighted');
         }
      },
      defaultClick: function (elem, obj) {
         var
            activeDoc = obj.get(),
            comps = activeDoc.getSelectedComponents(),
            model = activeDoc.getDocModelObj(comps),
            activepage = $ws.single.EventBus.channel('activePage');
         if (model.length) {
            activepage.notify('onPropertyGridReload', model[0].Config.getCurrentConfig(), '');
            // remove highlight
            $(elem).closest('.registry__area').find('.registry__highlighted').removeClass('registry__highlighted');
         }
      }
   }
});