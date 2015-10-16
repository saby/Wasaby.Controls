define('js!SBIS3.CONTROLS.FilterButton',
   [
   'js!SBIS3.CORE.CompoundControl',
   'html!SBIS3.CONTROLS.FilterButton',
   'html!SBIS3.CONTROLS.FilterButton/FilterAreaTemplate',
   'js!SBIS3.CONTROLS.PickerMixin',
   'js!SBIS3.CORE.FieldLink',
   'js!SBIS3.CONTROLS.ControlHierarchyManager',
   'js!SBIS3.CONTROLS.Link',
   'js!SBIS3.CONTROLS.Button',
   'js!SBIS3.CONTROLS.FilterButton.FilterLine'
   ],
   function(CompoundControl, dotTplFn, dotTplForPicker, PickerMixin, FieldLink, ControlHierarchyManager) {

   var
      linkTextDef = 'Нужно отобрать?',
      pickerContextRootName = 'sbis3-controls-filter-button',
      filterStructureElementDef = {
         internalValueField: null,
         internalCaptionField: null
         /* По умолчанию их нет
         caption: NonExistentValue,
         value: NonExistentValue,
         resetValue: NonExistentValue,
         resetCaption: NonExistentValue,
         */
      };

   function propertyUpdateWrapper(func) {
      return function() {
         this.runInPropertiesUpdate(func, arguments);
      };
   }

   function isFieldResetValue(element, fieldName, filter) {
      var result =
            ('resetValue' in element && fieldName in filter && filter[fieldName] === element.resetValue) ||
            (!('resetValue' in element) && !(fieldName in filter));

      return result;
   }

   var FilterButton = CompoundControl.extend([PickerMixin],{
      _dotTplFn: dotTplFn,
      _dotTplPicker: dotTplForPicker,
      $protected: {
         _options: {
            filterAlign: 'left',
            template: '',
            pickerClassName: 'controls__filterButton__picker',

            filterLineComponent: 'SBIS3.CONTROLS.FilterButton.FilterLine',
            filterLineTemplate: undefined,

            resetLinkText: linkTextDef,

            /***
             * при установке структуры меняется значение св-ва filter (строится по полям value у структуры)
             */
            filterStructure: [ /*filterStructureElementDef*/ ],

            independentContext: true
         },

         _pickerContext: null,
         _filterStructure: null
      },

      $constructor: function() {
         var
            showButtonEl = this._container.find('.controls__filterButton__filterLine-hoverContainer, .controls__filterButton-button'),
            dispatcher = $ws.single.CommandDispatcher,
            declCmd = dispatcher.declareCommand.bind(dispatcher, this),
            showPicker = this.showPicker.bind(this);

         this._container.removeClass('ws-area');

         declCmd('apply-filter', this.applyFilter.bind(this));
         declCmd('reset-filter-internal', this._resetFilter.bind(this, true));
         declCmd('reset-filter', this._resetFilter.bind(this, false));
         declCmd('show-filter', showPicker);

         showButtonEl.click(showPicker);

         this.subscribe('onDestroy' , function() {
            this._forEachFieldLinks(function(fieldLink) {
               ControlHierarchyManager.removeNode(fieldLink.getSuggest());
            });
         });

         this._updateFilterStructure(this._options.filterStructure || {});
      },

      _updateFilterStructure: function(filterStructure, filter, captions) {
         if (filterStructure) {
            this._filterStructure = $ws.helpers.map(filterStructure, function(element) {
               var
                  newEl = $ws.core.clone(filterStructureElementDef);
               $ws.core.merge(newEl, element);

               if (!newEl.internalValueField || typeof newEl.internalValueField !== 'string') {
                  throw new Error('У элемента структуры должно быть поле internalValueField');
               }

               if (!newEl.internalCaptionField) {
                  newEl.internalCaptionField = newEl.internalValueField;
               }

               return newEl;
            });
         }
         if (filter) {
            this._filterStructure = $ws.helpers.map(this._filterStructure, function(element) {
               var
                  newElement = $ws.core.clone(element),
                  field = newElement.internalValueField;

               function setDescrWithReset(descr, deleteDescr) {
                  if (('resetValue' in element && field in filter && element.resetValue === filter[field]) ||
                      (!('resetValue' in element) && !(field in filter)))
                  {
                     if ('resetCaption' in element) {
                        newElement.caption = element.resetCaption;
                     } else {
                        delete newElement.caption;
                     }
                  } else if (deleteDescr) {
                     delete newElement.caption;
                  } else {
                     newElement.caption = descr;
                  }
               }

               if (field in filter) {
                  newElement.value = filter[field];
               } else {
                  delete newElement.value;
               }

               if (captions && (field in captions)) {
                  setDescrWithReset(captions[field]);
               } else if (field in filter) {
                  setDescrWithReset(filter[field]);
               } else {
                  setDescrWithReset(undefined, true);
               }

               return newElement;
            });
         }
         this._recalcInternalContext();
      },

      _findFilterStructureElement: function(func) {
         return $ws.helpers.find(this._filterStructure, function(element) {
            return func(element);
         });
      },

      _recalcInternalContext: function() {
         var
            changed = $ws.helpers.reduce(this._filterStructure, function(result, element) {
               return result || element.resetValue !== element.value;
            }, false);

         this.getLinkedContext().setValueSelf({
            filterChanged: changed,
            filterStructure: this._filterStructure,
            filterResetLinkText: this.getProperty('resetLinkText')
         });
      },

      _syncContext: function(fromContext) {
         var
            context = this._pickerContext,
            pickerVisible = this._picker && this._picker.isVisible(),
            descrPath = pickerContextRootName + '/caption',
            filterPath = pickerContextRootName + '/filter',
            toSet;

         if (fromContext) {
            this._updateFilterStructure(undefined, context.getValue(filterPath), context.getValue(descrPath));
         } else if (pickerVisible) {
            toSet = {};
            toSet[filterPath] = this.getFilter();
            toSet[descrPath] = this._mapFilterStructureByProp('caption');

            context.setValueSelf(toSet);
         }
      },

      _notifyFilterUpdate: function() {
         this._notifyOnPropertyChanged('filter');
         this._notifyOnPropertyChanged('filterStructure');
      },

      _resetFilter: propertyUpdateWrapper(function(internalOnly) {
         var resetFilter = this.getResetFilter();

         if (this._pickerContext) {
            this._pickerContext.setValueSelf(pickerContextRootName + '/filter', resetFilter);
         }

         if (!internalOnly) {
            this._updateFilterStructure(undefined, resetFilter);
            this._notifyFilterUpdate();
         }
      }),

      applyFilter: propertyUpdateWrapper(function() {
         this.hidePicker();

         this._syncContext(true);

         this._notify('onApplyFilter');
         this._notifyFilterUpdate();
      }),

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

         this._forEachFieldLinks(function(fieldLink) {
            ControlHierarchyManager.addNode(fieldLink.getSuggest());
         });
      },

      _setPickerConfig: function () {
         var
            ctx = new $ws.proto.Context({restriction: 'set'}),
            btnCtx = this.getLinkedContext(),
            rootName = pickerContextRootName,
            firstTime = true,
            updatePickerContext = function () {
               ctx.setValue(rootName, {
                  filterChanged: btnCtx.getValue('filterChanged'),
                  filter: this.getFilter(),
                  caption: this._mapFilterStructureByProp('caption')
               });
            }.bind(this);

         this._pickerContext = ctx;

         updatePickerContext();

         ctx.subscribe('onFieldNameResolution', function(event, fieldName) {
            var
               byFilter = this._findFilterStructureElement(function(element) {
                  return element.internalValueField === fieldName;
               }),
               byCaption = !byFilter && this._findFilterStructureElement(function(element) {
                  return element.internalCaptionField === fieldName;
               });

            if (byFilter) {
               event.setResult(rootName + '/filter/' + byFilter.internalValueField);
            }

            if (byCaption) {
               event.setResult(rootName + '/caption/' + byCaption.internalValueField);
            }
         }.bind(this));

         ctx.subscribe('onFieldsChanged', function() {
            var
               filter = ctx.getValue(rootName + '/filter'),
               changed = $ws.helpers.reduce(this._filterStructure, function(result, element) {
                  return result || !isFieldResetValue(element, element.internalValueField, filter);
               }, false, this);
            ctx.setValueSelf(rootName + '/filterChanged', changed);
         }.bind(this));

         return {
            corner: this._options.filterAlign === 'right' ? 'tr' : 'tl',
            parent: this,
            horizontalAlign: {
               side: this._options.filterAlign
            },
            verticalAlign: {
               side: 'top'
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
      },

      setFilter: function() {
         throw new Error('Свойство "filter" работает только на чтение. Менять его надо через метод setFilterStructure');
      },

      setFilterStructure: propertyUpdateWrapper(function(filterStructure) {
         this._options.filterStructure = filterStructure;

         this._updateFilterStructure(filterStructure);

         this._syncContext(false);

         this._notifyFilterUpdate();
      }),

      _mapFilterStructureByProp: function(prop) {
         return $ws.helpers.reduce(this._filterStructure, function(result, element) {
            if (prop in element) {
               result[element.internalValueField] = element[prop];
            }
            return result;
         }, {});
      },

      getFilter: function() {
         return this._mapFilterStructureByProp('value');
      },

      getFilterStructure: function() {
         return this._filterStructure;
      },

      getResetFilter: function() {
         return this._mapFilterStructureByProp('resetValue');
      },

      setResetLinkText: function(text) {
         if (this._options.resetLinkText !== text) {
            this._options.resetLinkText = text;

            this._recalcInternalContext();
            this._notify('onPropertyChanged', 'resetLinkText');
         }
      }
   });

   return FilterButton;
});