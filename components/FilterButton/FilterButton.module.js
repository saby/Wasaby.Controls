/**
 * Created by am.gerasimov on 28.04.2015.
 */
define('js!SBIS3.CONTROLS.FilterButton',
   [
   'js!SBIS3.CORE.CompoundControl',
   'html!SBIS3.CONTROLS.FilterButton',
   'html!SBIS3.CONTROLS.FilterButton/FilterAreaTemplate',
   'js!SBIS3.CONTROLS.PickerMixin',
   'js!SBIS3.CORE.FieldLink',
   'js!SBIS3.CONTROLS.ControlHierarchyManager',
   'js!SBIS3.CONTROLS.Link',
   'js!SBIS3.CONTROLS.Button'
   ],
   function(CompoundControl, dotTplFn, dotTplForPicker, PickerMixin, FieldLink, ControlHierarchyManager) {

   var linkTextDef = 'Нужно отобрать?';

   var FilterButton = CompoundControl.extend([PickerMixin],{
      _dotTplFn: dotTplFn,
      _dotTplPicker: dotTplForPicker,
      $protected: {
         _options: {
            linkText: linkTextDef,
            filterAlign: 'left',
            template: '',
            pickerClassName: 'controls__filterButton__picker',
            filter: {},
            linkTextFields: [],
            filterFields: []
         },
         _pickerContext: null,
         _linkTextFields: null,
         _initialFilter: null,
         _filterFields: null
      },

      $constructor: function() {
         this._linkTextFields = (this._options.linkTextFields || '').split(',');
         this._filterFields = (this._options.filterFields || '').split(',');

         this._context.setRestriction('set');
         this._container.removeClass('ws-area');

         this._initEvents();

         this.setLinkText(this._options.linkText);

         this.subscribe('onDestroy' , function() {
            this._forEachFieldLinks(function(fieldLink) {
               ControlHierarchyManager.removeNode(fieldLink.getSuggest());
            });
         });
      },
      _initEvents: function() {
         this._container.find('.controls__filterButton__filterLine-hoverContainer, .controls__filterButton-button').click(this.showPicker.bind(this));
         this._container.find('.controls__filterButton__filterLine-cross').click(this.resetFilter.bind(this));
      },

      resetFilter: function() {
         this._pickerContext.setContextData(this._initialFilter);
         this.setLinkText(linkTextDef);
      },

      applyFilter: function() {
         this.hidePicker();

         this._updateFilter(true);

         this._notify('onApplyFilter');
         this._notify('onPropertyChanged');
      },

      _updateFilter: function(updateDescr) {
         if (this._filterFields.length !== 0) {
            this._options.filter = $ws.helpers.reduce(this._filterFields, function(res, field) {
               res[field] = this._pickerContext.getValue(field);
               return res;
            }, {}, this);
         } else {
            this._options.filter = this._pickerContext.toObject();
         }

         if (!this._initialFilter) {
            this._initialFilter = this._options.filter;
         }

         if (updateDescr) {
            var descr = $ws.helpers.map(this._linkTextFields, function (field) {
               return this._pickerContext.getValue(field);
            }, this).join(', ');

            this.setLinkText(descr);

            console.log('F', this._options.filter, descr);
         }
      },

      _forEachFieldLinks: function(fn) {
         var children = this._picker.getChildControls();
         $ws.helpers.forEach(children, function(child) {
            if (child instanceof FieldLink) {
               fn.call(this, child);
            }
         });
      },

      _setPickerContent: function() {
         this._picker.getContainer().addClass('controls__filterButton-' + this._options.filterAlign);
         this._picker.getChildControlByName('clearFilterButton').subscribe('onActivated', this.resetFilter.bind(this));
         this._picker.getChildControlByName('applyFilterButton').subscribe('onActivated', this.applyFilter.bind(this));

         this._forEachFieldLinks(function(fieldLink) {
            ControlHierarchyManager.addNode(fieldLink.getSuggest());
         });
      },

      setFilter: function(filter) {
         this._options.filter = filter;
         if (this._pickerContext) {
            this._pickerContext.setContextData(filter);
         }
      },

      setLinkText: function(text) {
         this._options.linkText = text;
         this.getLinkedContext().setValue('linkText', text);
      },

      _setPickerConfig: function () {
         this._pickerContext = new $ws.proto.Context({restriction: 'set'});
         this._pickerContext.setContextData(this.getProperty('filter'));

         return {
            corner: this._options.filterAlign === 'right' ? 'tr' : 'tl',
            target: this.getContainer(),
            horizontalAlign: {
               side: this._options.filterAlign
      },
            verticalAlign: {
               side: 'bottom'
      },
            closeButton: true,
            closeByExternalClick: true,
            context: this._pickerContext,
            template: dotTplForPicker.call(this, {template: this._options.template}),
            handlers: {
               onAfterLoad: function() {
                  this._pickerContext.requestUpdate();
                  this._updateFilter(false);
               }.bind(this),

               onClose: function() {
                  this._forEachFieldLinks(function(fieldLink) {
                     fieldLink.getSuggest()._hideMenu();
                  });
               }.bind(this)
            }
         };
      }
   });

   return FilterButton;
});