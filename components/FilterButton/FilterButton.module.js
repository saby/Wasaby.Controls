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

   var contextRootName = 'sbis3-controls-filter-button';

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
            linkTextFields: [],

            independentContext: true
         },
         _pickerContext: null,
         _linkTextFields: null,
         _filterFields: null,
         _textToFilterFields: null
      },

      $constructor: function() {
         var
            linkCrossEl = this._container.find('.controls__filterButton__filterLine-cross'),
            showButtonEl = this._container.find('.controls__filterButton__filterLine-hoverContainer, .controls__filterButton-button'),
            split;

         function splitFields(fields, sep) {
            return $ws.helpers.isPlainArray(fields) ? fields : ('' + (fields || '')).split(sep);
         }

         this._filterFields = splitFields(this._options.filterFields, ',');

         this._linkTextFields = [];
         this._textToFilterFields = {};
         split = splitFields(this._options.linkTextFields, ',');

         $ws.helpers.forEach(split, function(textField) {
            var
               splitField = splitFields(textField, ':'),
               textField = splitField[0];;
            if (splitField.length > 1) {
               this._textToFilterFields[textField] = splitField[1];
            }
            this._linkTextFields.push(textField);
         }, this);

         this._container.removeClass('ws-area');

         linkCrossEl.click(function() {
            this._resetFilter(false);
         }.bind(this));

         showButtonEl.click(this.showPicker.bind(this));

         this.subscribe('onDestroy' , function() {
            this._forEachFieldLinks(function(fieldLink) {
               ControlHierarchyManager.removeNode(fieldLink.getSuggest());
            });
         });

         this._recalcInternalContext();
      },

      _recalcInternalContext: function() {
         var
            changed = !$ws.helpers.isEqualObject(this._options.filter, this._options.resetFilter),
            linkText = changed ? this._options.linkText : this._options.resetLinkText;

         this.getLinkedContext().setValueSelf(contextRootName, {
            changed: changed,
            linkText: linkText
         });
      },

      _syncContext: function(fromContext) {
         var
            context = this._pickerContext,
            descrValues, linkText, filter, description;

         if (context) {
            if (fromContext) {
               context.requestUpdate();
               this._options.filter = context.getValue(contextRootName + '/filter');
            } else {
               context.setValueSelf(contextRootName + '/filter', this._options.filter);
            }

            filter = context.getValue(contextRootName + '/filter');
            description = context.getValue(contextRootName + '/description');

            descrValues = $ws.helpers.map(this._linkTextFields, function (textFieldName) {
               var
                  result, fieldName;

               if (textFieldName in filter) {
                  result = filter[textFieldName];
               } else if (textFieldName in this._textToFilterFields) {
                  fieldName = this._textToFilterFields[textFieldName];
                  if (fieldName in filter) {
                     result = description[textFieldName];
                  }
               } else {
                  result = description[textFieldName];
               }

               return result;
            }, this);

            linkText = $ws.helpers.filter(descrValues, function (v) {
               return v !== undefined && v !== '';
            }).join(', ');

            this._options.linkText = linkText;
         }
         this._recalcInternalContext();
      },

      _resetFilter: function(internalOnly) {
         if (internalOnly) {
            this._pickerContext.setValueSelf(contextRootName + '/filter', this._options.resetFilter);
         } else {
            this.setFilter(this._options.resetFilter);
         }
      },

      applyFilter: function() {
         this.hidePicker();

         this._syncContext(true, true);

         this._notify('onApplyFilter');
         this._notify('onPropertyChanged');
      },

      setFilter: function(filter) {
         this._options.filter = filter;
         this._syncContext(false, true);

         this._notify('onPropertyChanged');
      },

      setLinkText: function(text) {
         this._options.linkText = text;

         this._recalcInternalContext();
         this._notify('onPropertyChanged');
      },

      setResetLinkText: function(text) {
         this._options.resetLinkText = text;

         this._recalcInternalContext();
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
         $ws.single.CommandDispatcher.declareCommand(this._picker, 'reset-filter', this._resetFilter.bind(this, true));

         this._forEachFieldLinks(function(fieldLink) {
            ControlHierarchyManager.addNode(fieldLink.getSuggest());
         });
      },

      _setPickerConfig: function () {
         var
            ctx = new $ws.proto.Context({restriction: 'set'}),
            firstTime = true,
            updatePickerContext = function () {
               ctx.setValue(contextRootName, this.getLinkedContext().getValueSelf(contextRootName));
               ctx.setValue(contextRootName + '/filter', this._options.filter);
               ctx.setValue(contextRootName + '/description', {});
            }.bind(this);

         this._pickerContext = ctx;

         updatePickerContext();

         ctx.subscribe('onFieldNameResolution', function(event, fieldName) {
            var
               finder = function(field) {
                  return field === fieldName;
               },
               inFilterFields = $ws.helpers.findIdx(this._filterFields, finder) !== -1,
               inDescrFields = $ws.helpers.findIdx(this._linkTextFields, finder) !== -1;

            if (inFilterFields) {
               event.setResult(contextRootName + '/filter/' + fieldName);
            } else if (inDescrFields) {
               event.setResult(contextRootName + '/description/' + fieldName);
            }
         }.bind(this));

         ctx.subscribe('onFieldsChanged', function() {
            var
               filter = ctx.getValue(contextRootName + '/filter'),
               changed = !$ws.helpers.isEqualObject(filter, this._options.resetFilter);

            ctx.setValueSelf(contextRootName + '/changed', changed);
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
            context: ctx,
            template: dotTplForPicker.call(this, {template: this._options.template}),
            handlers: {
               onClose: function() {
                  this._forEachFieldLinks(function(fieldLink) {
                     fieldLink.getSuggest()._hideMenu();
                  });
               }.bind(this),

               onShow: function() {
                  if (!firstTime) {
                     updatePickerContext();
                  }
                  firstTime = false;
               }.bind(this)
            }
         };
      }
   });

   return FilterButton;
});