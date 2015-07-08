/**
 * Created by as.suhoruchkin on 07.04.2015.
 */
define('js!SBIS3.CONTROLS.FilterButton', [
   'js!SBIS3.CORE.CompoundControl',
   'html!SBIS3.CONTROLS.FilterButton',
   'js!SBIS3.CONTROLS.PickerMixin',
   'js!SBIS3.CONTROLS.DSMixin',
   'html!SBIS3.CONTROLS.FilterButton/resources/FilterButtonItemTemplate',
   'js!SBIS3.CONTROLS.Link',
   'js!SBIS3.CONTROLS.Button',
   'js!SBIS3.CONTROLS.FilterButtonCustomItem',
   'js!SBIS3.CONTROLS.ComboBox'
], function(CompoundControl, dotTplFn, PickerMixin, DSMixin, itemDotTpl) {
   var myTpl = '<div><span style="margin-right: 5px;">Год</span><component data-component="SBIS3.CONTROLS.ComboBox" config="{{=$ws.helpers.encodeCfgAttr(it.item.getRaw().cfg)}}"></component></div>';
   var myItems = [ {name: '1993', title: '1993'}, {name: '1994', title: '1994'}, {name: '1995', title: '1995'}, {name: '1996', title: '1996'}, {name: '1997', title: '1997'} ];
   var items = [
      { name: 'Год', componentType: 'SBIS3.CONTROLS.ComboBox', cfg: { field: 'Год', visible: true, items: myItems} },
      { name: 'Год2', cfg: { field: 'Год', tpl: myTpl, items: myItems} },
      { name: 'НаКомMy', cfg: { field: 'НаКом', caption: 'На мне' } },
      { name: 'НаКомFromMe', cfg: { field: 'НаКом', caption: 'От меня' } }
   ];
   var FilterButton = CompoundControl.extend([PickerMixin, DSMixin], {
      _dotTplFn: dotTplFn,

      $protected: {
         _options: {
            linkText: 'Нужно отобрать?',
            moreLinkCaption: 'Другие фильтры...',
            filterAlign: 'right',
            items: items,
            keyField: 'name'
         },
         _buttons: {},
         _filter: {}
      },
      init: function() {
         FilterButton.superclass.init.apply(this, arguments);
         this._buttons.filterLine = this.getChildControlByName('filterLine');
         this._buttons.clearFilterButton = this.getChildControlByName('clearFilterButton');
         this._buttons.applyFilterButton = this.getChildControlByName('applyFilterButton');
         this._bindButtons();
         this.reload();
      },
      $constructor: function() {
         this._buttons = {
            closedButton: this._container.find('.controls__filter-button__closed'),
            openedButton: this._container.find('.controls__filter-button__opened'),
            clearLineButton: this._container.find('.controls__filter-button__clear')
         };
      },
      _bindButtons: function() {
         var buttons = this._buttons;
         buttons.closedButton.bind('click', this.showPicker.bind(this));
         buttons.openedButton.bind('click', this.hidePicker.bind(this));
         buttons.clearLineButton.bind('click', this.resetFilter.bind(this));
         buttons.applyFilterButton.subscribe('onActivated', this._applyFilter.bind(this));
         buttons.clearFilterButton.subscribe('onActivated', this.resetFilter.bind(this));
         buttons.filterLine.subscribe('onActivated', this.showPicker.bind(this));
      },
      _setPickerContent: function() {
         var wrapper = this._container.find('.controls__filter-button__wrapper');
         this._picker.getContainer().append(wrapper.removeClass('ws-hidden'));
      },
      _setPickerConfig: function () {
         return {
            corner: this._options.filterAlign === 'right' ? 'tr' : 'tl',
            target: this,
            horizontalAlign: {
               side: this._options.filterAlign
            }
         };
      },
      _drawItemsCallback: function() {
         console.log('drawn');
      },
      _getItemsContainer: function() {
         return this._container.find('.controls__filter-button__items-container');
      },
      _getItemTemplate: function() {
         return itemDotTpl;
      },
      _applyFilter: function() {
      },
      resetFilter: function() {
      }
   });

   return FilterButton;

});