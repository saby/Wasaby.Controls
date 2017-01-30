define('js!SBIS3.CONTROLS.Demo.MyFilterPanel',
    [
        "Core/CommandDispatcher",
        "js!SBIS3.CORE.CompoundControl",
        "js!WS.Data/Source/Memory",
        "js!SBIS3.CONTROLS.Demo.MyFilterPanelData",
        "tmpl!SBIS3.CONTROLS.Demo.MyFilterPanel",
        "css!SBIS3.CONTROLS.Demo.MyFilterPanel",
        "js!SBIS3.CONTROLS.FilterPanel",
        "js!SBIS3.CONTROLS.Link",
        "js!SBIS3.CONTROLS.TreeDataGridView",
        "js!SBIS3.CONTROLS.Demo.SelectorDataFieldLink"
    ],
    function( CommandDispatcher,CompoundControl, Memory, MyFilterPanelData, dotTplFn) {
       var moduleClass = CompoundControl.extend({
          _dotTplFn: dotTplFn,
          _modifyOptions: function() {
             var cfg = moduleClass.superclass._modifyOptions.apply(this, arguments);
             cfg._items = MyFilterPanelData;
             cfg._onFilterChange = this._onFilterChange;
             CommandDispatcher.declareCommand(this, 'toggleFilter', this._toggleFilter);
             return cfg;
          },
          _onFilterChange: function(event, filter) {
             this.getParent()._getFilterPreviewEventContainer().html(JSON.stringify(filter, '', 3));
          },
          _toggleFilter: function() {
             this.getChildControlByName('MyFilterPanel').toggleExpanded();
             this.getChildControlByName('ToggleFilterButton').toggle();
          },
          init: function() {
             this.getLinkedContext().subscribe('onFieldChange', function(event, field, value) {
                if (field === 'DemoFilterField') {
                   this._getFilterPreviewContextContainer().html(JSON.stringify(value, '', 3));
                }
             }.bind(this));
             moduleClass.superclass.init.apply(this, arguments);
             var filterPanel = this.getChildControlByName('MyFilterPanel');
              filterPanel.subscribe('onExpandedChange', function(event, expanded) {
                this.getChildControlByName('ToggleFilterButton').getContainer().toggleClass('ws-hidden', expanded);
             }.bind(this));
              filterPanel.subscribe('onFilterChange', function() {
                this._getTextValuePreviewEventContainer().html(filterPanel.getTextValue());
             }.bind(this));
          },
          _getFilterPreviewContextContainer: function() {
             return $('.controls-MyFilterPanel_filter-preview_context', this.getContainer());
          },
          _getFilterPreviewEventContainer: function() {
             return $('.controls-MyFilterPanel_filter-preview_event', this.getContainer());
          },
          _getTextValuePreviewEventContainer: function() {
             return $('.controls-MyFilterPanel_textValue-preview_event', this.getContainer());
          }
       });
       return moduleClass;
    }
);