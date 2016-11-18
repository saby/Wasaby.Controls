define('js!SBIS3.CONTROLS.Demo.MyFilterPanel', [
   "Core/CommandDispatcher",
   "js!SBIS3.CORE.CompoundControl",
   "js!WS.Data/Source/Memory",
   "js!SBIS3.CONTROLS.Demo.MyFilterPanelData",
   "tmpl!SBIS3.CONTROLS.Demo.MyFilterPanel",
   "css!SBIS3.CONTROLS.Demo.MyFilterPanel",
   "js!SBIS3.CONTROLS.FilterPanel",
   "js!SBIS3.CONTROLS.Link"
], function( CommandDispatcher,CompoundControl, Memory, MyFilterPanelData, dotTplFn) {
   /**
    * SBIS3.CONTROLS.Demo.MyFilterPanel
    * @class SBIS3.CONTROLS.Demo.MyFilterPanel
    * @extends $ws.proto.CompoundControl
    * @control
    */
   var moduleClass = CompoundControl.extend(/** @lends SBIS3.CONTROLS.Demo.MyFilterPanel.prototype */{
      _dotTplFn: dotTplFn,
      $protected: {
         _options: {
         }
      },
      _modifyOptions: function() {
         var
            cfg = moduleClass.superclass._modifyOptions.apply(this, arguments);
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
         this.getChildControlByName('MyFilterPanel').subscribe('onExpandedChange', function(event, expanded) {
            this.getChildControlByName('ToggleFilterButton').getContainer().toggleClass('ws-hidden', expanded);
         }.bind(this));
      },
      _getFilterPreviewContextContainer: function() {
         return $('.controls-MyFilterPanel_filter-preview_context', this.getContainer());
      },
      _getFilterPreviewEventContainer: function() {
         return $('.controls-MyFilterPanel_filter-preview_event', this.getContainer());
      }
   });
   return moduleClass;
});