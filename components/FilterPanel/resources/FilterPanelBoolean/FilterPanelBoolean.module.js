define('js!SBIS3.CONTROLS.FilterPanelBoolean', ['js!SBIS3.CONTROLS.CheckBox', 'js!SBIS3.CONTROLS.IFilterItem', 'tmpl!SBIS3.CONTROLS.FilterPanelBoolean/resources/ContentTemplate'], function (Checkbox, IFilterItem, ContentTemplate) {

var
   FilterPanelBoolean = Checkbox.extend([IFilterItem],/**@lends SBIS3.CONTROLS.FilterPanelBoolean.prototype  */{
      $protected: {
         _options: {
            contentTemplate: ContentTemplate,
            className: 'controls-FilterPanelBoolean'
         },
         _checkClickByTap: false
      },

      _modifyOptions: function() {
         var
            cfg = FilterPanelBoolean.superclass._modifyOptions.apply(this, arguments);
         cfg.checked = cfg.filter;
         return cfg;
      },

      setFilter: function(filter) {
         this._options.filter = filter;
         this.setChecked(filter);
      },

      getFilter: function() {
         return this._options.filter;
      },

      setChecked: function(checked) {
         FilterPanelBoolean.superclass.setChecked.apply(this, arguments);
         this._options.filter = checked;
         this._notifyOnPropertyChanged('filter');
         this._notify('onFilterChange', checked);
      }

   });

   return FilterPanelBoolean;

});