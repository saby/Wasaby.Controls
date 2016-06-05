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
             * @property {String} internalValueField Название поля, которое хранит значение элемента. По-умолчанию null.
             * @property {String} internalCaptionField Название поля, которое хранит текстовое отображение значения. По-умолчанию null.
             * @property {String} caption Текущее текстовое отображение значения. Может быть не определено.
             * @property {null|Object|String|Boolean|Number} value Текущее значение элемента. Может быть не определено.
             * @property {null|Object|String|Boolean|Number} resetValue Значение поля при сбрасывании фильтра, или при пустом значении в value. Может быть не определено.
             * @property {String} resetCaption Текст по умолчанию. Если задали, то при пустом (или заданном в resetValue) значении будет
             * отображаться заданный здесь текст. Может быть не определено.
             * @translatable caption resetCaption
             */
            /**
             * @cfg {filterStructure[]} Структура элемента фильтра
             * @remark Важно! все, что задано в filterStructure влияет на объекты в контексе - filter и filterDescr(строится по полям value у структуры)
             * @example
             * <pre class="brush:xml">
             *     <options name="filterStructure" type="array">
             *        <options>
             *            <option name="internalValueField">Поле1</option>
             *            <option name="internalCaptionField">Поле2</option>
             *            <option name="caption">Текущее текстовое отображение значения</option>
             *            <option name="value">100</option>
             *            <option name="resetValue">10</option>
             *            <option name="resetCaption">Текст по умолчанию</option>
             *         </options>
             *      </options>
             * </pre>
             */
            filterStructure: [ /*filterStructureElementDef*/ ],
            /**
             * @cfg {String} Поле в контексте, где будет храниться внутренний фильтр компонента
             * @remark
             * !Важно: Если на одной форме, в одном контексте лежит несколько хлебных фильтров, то только в этом случае стоит менять стандартное имя
             * @example
             * <pre class="brush:xml">
             *     <option name="internalContextFilterName">sbis3-controls-fast-filter</option>
             * </pre>
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
               var newElement = $ws.core.clone(element),
                   field = newElement.internalValueField;

               function setDescrWithReset(descr, deleteDescr) {
                  var hasResetValue = element.hasOwnProperty('resetValue'),
                      hasInternalValue = filter.hasOwnProperty(field);

                  if((hasResetValue && hasInternalValue && this._isEqualValues(element.resetValue, filter[field])) || (!hasResetValue && !hasInternalValue)) {

                     if (element.hasOwnProperty('resetCaption')) {
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
                  setDescrWithReset.call(this, captions[field]);
               } else if (field in filter) {
                  setDescrWithReset.call(this, filter[field]);
               } else {
                  setDescrWithReset.call(this, undefined, true);
               }

               return newElement;
            }, this);
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
         var changed = $ws.helpers.reduce(this._filterStructure, function(result, element) {
            return result || (element.hasOwnProperty('value') ? !this._isEqualValues(element.resetValue, element.value) : false);
         }, false, this);

         this.getLinkedContext().setValueSelf({
            filterChanged: changed,
            filterStructure: this._filterStructure,
            filterResetLinkText: this.getProperty('resetLinkText')
         });
      },

      _isEqualValues: function(val1, val2) {
         /* Даты нельзя сравнивать по обычному равенству (===) */
         if((val1 && val2) && (val1 instanceof Date || val2 instanceof Date)) {
            return $ws.helpers.compareDates(new Date(val1), '=', new Date(val2));
         }
         return $ws.helpers.isEqualObject(val1, val2);
      },

      _resetFilter: function(internalOnly) {
         var resetFilter = this.getResetFilter(),
             context = this._getCurrentContext(),
             self = this;

         /* Синхронизация св-в должна происходить один раз, поэтому делаю обёртку */
         propertyUpdateWrapper(function() {
            if (context) {
               context.setValueSelf(self._options.internalContextFilterName + '/filter', resetFilter);
            }

            if (!internalOnly) {
               self._updateFilterStructure(undefined, resetFilter);
               self._notifyFilterUpdate();
            }
         }).call(this);

         this._notify('onResetFilter');
      },

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
               /* Отдаём клон значения, чтобы его не испортили извне,
                  т.к. структуру можно менять только через setFilterStructure +
                  контролы будут правильно приниматься значения при открытии панели фильтрации*/
               result[element.internalValueField] = $ws.core.clone(element[prop]);
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