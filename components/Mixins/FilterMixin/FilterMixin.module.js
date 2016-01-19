/**
 * Created by ad.chistyakova on 05.10.2015.
 */
define('js!SBIS3.CONTROLS.FilterMixin', [
], function () {


   /**
    * Миксин, задающий любому контролу поведение работы с набором фильтров.
    * @mixin SBIS3.CONTROLS.FilterMixin
    * @public
    * @author Крайнов Дмитрий Олегович
    */
   var
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

   function isFieldResetValue(element, fieldName, filter) {
      var result =
            ('resetValue' in element && fieldName in filter && filter[fieldName] === element.resetValue) ||
            (!('resetValue' in element) && !(fieldName in filter));

      return result;
   }
   function propertyUpdateWrapper(func) {
      return function() {
         return this.runInPropertiesUpdate(func, arguments);
      };
   }

   var FilterMixin = /**@lends SBIS3.CONTROLS.FilterMixin.prototype  */{
      $protected: {
         _options: {
            /**
             * @typedef {Array} filterStructure
             * @property {String} internalValueField Индекс поля, содержащего значение элемента. По-умолчанию null.
             * @property {String} internalCaptionField Индекс поля, содержащего подпись элемента. По-умолчанию null.
             * @property {Object} caption Текущая подпись элемента. Может быть не определено.
             * @property {Object} value Текущее значение элемента. Может быть не определено.
             * @property {Object} resetValue Значение элемента по-умолчанию, используемое для сброса текущего значения. Может быть не определено.
             * @property {Object} resetCaption Подпись элемента по-умолчанию, использаемая для сброса текущей подписи. Может быть не определено.
             */
            /**
             * @cfg {filterStructure[]} Структура элемента фильтра
             * @remark при установке структуры меняется значение св-ва filter (строится по полям value у структуры)
             */
            filterStructure: [ /*filterStructureElementDef*/ ],
            /**
             * @cfg {String} Поле в контексте, где будет храниться внутренний фильтр компонента
             * @remark
             * !Важно: Если на одной форме, в одном контексте лежит несколько хлебных фильтров, то только в этом случае стоит менять стандартное имя
             */
            internalContextFilterName : 'sbis3-controls-filter-button'
         }
      },

      $constructor: function () {
         this._updateFilterStructure(this._options.filterStructure || {});
      },
      _syncContext: function(fromContext) {
         var
               context = this._getCurrentContext(),
               descrPath = this._options.internalContextFilterName + '/caption',
               filterPath = this._options.internalContextFilterName + '/filter';

         if (fromContext) {
            this._updateFilterStructure(undefined, context.getValue(filterPath), context.getValue(descrPath));
         }
      },

      _notifyFilterUpdate: function() {
         this._notifyOnPropertyChanged('filter');
         this._notifyOnPropertyChanged('filterStructure');
      },

      applyFilter: propertyUpdateWrapper(function() {

         this._syncContext(true);

         this._notify('onApplyFilter');
         this._notifyFilterUpdate();
      }),
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
      _getFilterSctructureItemIndex : function(field){
         for (var i = 0; i < this._filterStructure.length; i++) {
            if (this._filterStructure[i].internalValueField === field) {
               return i;
            }
         }
         return -1;
      },
      _findFilterStructureElement: function(func) {
         return $ws.helpers.find(this._filterStructure, function(element) {
            return func(element);
         });
      },
      _recalcInternalContext: function() {
         var
               changed = $ws.helpers.reduce(this._filterStructure, function(result, element) {
                  return result || (element.value ? !$ws.helpers.isEqualObject(element.resetValue, element.value) : false);
               }, false);

         this.getLinkedContext().setValueSelf({
            filterChanged: changed,
            filterStructure: this._filterStructure,
            filterResetLinkText: this.getProperty('resetLinkText')
         });
      },
      _resetFilter: propertyUpdateWrapper(function(internalOnly) {
         var resetFilter = this.getResetFilter(),
               context = this._getCurrentContext();

         if (context) {
            context.setValueSelf(this._options.internalContextFilterName + '/filter', resetFilter);
         }

         if (!internalOnly) {
            this._updateFilterStructure(undefined, resetFilter);
            this._notifyFilterUpdate();
         }

	      this._notify('onResetFilter');
      }),
      _getCurrentContext : function(){
         /*Must be implemented!*/
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
      }
   };

   return FilterMixin;

});