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
            filterAlign: 'left',
            template: '',
            pickerClassName: 'controls__filterButton__picker',

            filter: {},
            resetFilter: {},

            linkText: linkTextDef,
            resetLinkText: linkTextDef,

            filterFields: [],
            linkTextFields: []
         },
         _pickerContext: null,
         _linkTextFields: null,
         _filterFields: null,
         _linkTextEl: null,
         _linkCrossEl: null,
         _filterChanged: false
      },

      $constructor: function(cfg) {
         function splitFields(fields) {
            return $ws.helpers.isPlainArray(fields) ? fields : ('' + (fields || '')).split(',');
         }
         this._linkTextFields = splitFields(this._options.linkTextFields);
         this._filterFields = splitFields(this._options.filterFields);

         if (cfg.filter) {
            this._filterChanged = true;
         }

         this._container.removeClass('ws-area');
         this._linkTextEl = this._container.find('.controls__filterButton__filterLine-items');
         this._linkCrossEl = this._container.find('.controls__filterButton__filterLine-cross');

         var showButtonEl = this._container.find('.controls__filterButton__filterLine-hoverContainer, .controls__filterButton-button');

         this._linkCrossEl.click(this.resetFilter.bind(this));
         showButtonEl.click(this.showPicker.bind(this));

         this.subscribe('onDestroy' , function() {
            this._forEachFieldLinks(function(fieldLink) {
               ControlHierarchyManager.removeNode(fieldLink.getSuggest());
            });
         });

         this._updateLink();
      },

      _updateLink: function() {
         this._linkTextEl.text(this._options.linkText);
         this._linkCrossEl.toggleClass('ws-hidden', !this._filterChanged);
      },

      _syncContext: function(fromContext, syncText) {
         var
            context = this._pickerContext,
            descrValues, descr;

         if (context) {
            if (fromContext) {
               context.requestUpdate();
               this._options.filter = context.getValue('filter');
            } else if (context) {
               context.setValueSelf('filter', this._options.filter);
            }

            if (syncText) {
               descrValues = $ws.helpers.map(this._linkTextFields, function (fieldName) {
                  var
                     ctx = this._pickerContext,
                     filter = ctx.getValue('filter'),
                     description = ctx.getValue('description'),
                     result;

                  if (fieldName in filter) {
                     result = filter[fieldName];
                  } else {
                     result = description[fieldName] || '';
                  }
                  return result;
               }, this);

               descr = $ws.helpers.filter(descrValues, function (v) {
                  return v !== '';
               }).join(', ');

               this._options.linkText = descr;
               this._updateLink();
            }
         }
      },

      resetFilter: function() {
         this._filterChanged = false;
         this._options.filter = this._options.resetFilter;
         this._options.linkText = this._options.resetLinkText;

         this._syncContext(false, false);
         this._updateLink();
         this._notify('onPropertyChanged');
      },

      applyFilter: function() {
         this._filterChanged = true;

         this.hidePicker();

         this._syncContext(true, true);

         this._notify('onApplyFilter');
         this._notify('onPropertyChanged');
      },

      setFilter: function(filter) {
         this._filterChanged = true;
         this._options.filter = filter;
         this._syncContext(false, true);
         this._notify('onPropertyChanged');
      },

      setLinkText: function(text) {
         this._options.linkText = text;
         this._updateLink();
         this._notify('onPropertyChanged');
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

         $ws.single.CommandDispatcher.declareCommand(this._picker, 'apply-filter', this.applyFilter.bind(this));
         $ws.single.CommandDispatcher.declareCommand(this._picker, 'reset-filter', this.resetFilter.bind(this));

         this._forEachFieldLinks(function(fieldLink) {
            ControlHierarchyManager.addNode(fieldLink.getSuggest());
         });
      },

      _setPickerConfig: function () {
         this._pickerContext = new $ws.proto.Context({restriction: 'set'});
         this._pickerContext.setValueSelf('filter', this._options.filter);
         this._pickerContext.setValueSelf('description', {});

         this._pickerContext.subscribe('onFieldNameResolution', function(event, fieldName) {
            var
               finder = function(field) {
                  return field === fieldName;
               },
               inFilterFields = $ws.helpers.findIdx(this._filterFields, finder) !== -1,
               inDescrFields = $ws.helpers.findIdx(this._linkTextFields, finder) !== -1,
               SEP = $ws.proto.Context.STRUCTURE_SEPARATOR;

            if (inFilterFields) {
               event.setResult('filter' + SEP + fieldName);
            } else if (inDescrFields) {
               event.setResult('description' + SEP + fieldName);
            }
         }.bind(this));

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