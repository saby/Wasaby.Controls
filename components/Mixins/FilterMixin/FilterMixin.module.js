/**
 * Created by ad.chistyakova on 05.10.2015.
 */
define('js!SBIS3.CONTROLS.FilterMixin', ['js!SBIS3.CONTROLS.FilterButton.FilterToStringUtil'], function (FilterToStringUtil) {


   /**
    * Миксин, задающий любому контролу поведение работы с набором фильтров.
    * @mixin SBIS3.CONTROLS.FilterMixin
    * @public
    * @author Крайнов Дмитрий Олегович
    */
   var FILTER_STRUCTURE_DEFAULT_ELEMENT = {
      internalValueField: null,
      internalCaptionField: null,
      internalVisibilityField: null
      /* По умолчанию их нет
       value: NonExistentValue,
       resetValue: NonExistentValue,
       customValue: NonExistentValue,
       resetCustomValue: NonExistentValue,
       caption: NonExistentValue,
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
             * @property {String} internalVisibilityField Название поля, которое хранит отображение элемента в зависимости от значения. По-умолчанию null.
             * @property {String} caption Текущее текстовое отображение значения. Может быть не определено.
             * @property {Object} visibilityValue ТТекущее состояние отображения элемента. Может быть не определено.
             * @property {null|Object|String|Boolean|Number} value Текущее значение элемента. Может быть не определено.
             * @property {null|Object|String|Boolean|Number} resetValue Значение поля при сбрасывании фильтра, или при пустом значении в value. Может быть не определено.
             * @property {Boolean} resetVisibilityValue Значение поля при сбрасывании фильтра, или при пустом значении в value. Может быть не определено.
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
         var context = this._getCurrentContext(),
             contextName = this.getProperty('internalContextFilterName');

         if (fromContext) {
            this._updateFilterStructure(
                undefined,
                context.getValue(contextName + '/caption'),
                context.getValue(contextName + '/filter')
            );
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

      _updateFilterStructure: function(filterStructure, filter, captions, visibility) {
         var processElementVisibility = function(elem) {
            if(elem.hasOwnProperty('internalVisibilityField')) {
               if(elem.hasOwnProperty('value')) {
                  elem.visibilityValue = !FilterToStringUtil.isEqualValues(elem.value, elem.resetValue);
               } else {
                  elem.visibilityValue = elem.hasOwnProperty('resetVisibilityValue') ? elem.resetVisibilityValue : false;
               }
            }
         };

         if (filterStructure) {
            this._filterStructure = $ws.helpers.map(filterStructure, function(element) {
               var newEl;

               if(typeof element.internalValueField !== 'string') {
                  throw new Error('У элемента структуры должно быть поле internalValueField');
               }

               newEl = $ws.core.merge($ws.core.clone(FILTER_STRUCTURE_DEFAULT_ELEMENT), element);

               if (!newEl.internalCaptionField) {
                  newEl.internalCaptionField = newEl.internalValueField;
               }

               processElementVisibility(newEl);

               return newEl;
            });
         }
         if (filter) {
            this._filterStructure = $ws.helpers.map(this._filterStructure, function(element) {
               var newElement = $ws.core.clone(element),
                   field = newElement.internalValueField;

               function setDescriptionWithReset(description, deleteDescription) {
                  var hasResetValue = element.hasOwnProperty('resetValue'),
                      hasInternalValue = filter.hasOwnProperty(field);

                  if((hasResetValue && hasInternalValue && FilterToStringUtil.isEqualValues(element.resetValue, filter[field])) || (!hasResetValue && !hasInternalValue)) {

                     if (element.hasOwnProperty('resetCaption')) {
                        newElement.caption = element.resetCaption;
                     } else {
                        delete newElement.caption;
                     }
                  } else if(deleteDescription) {
                     delete newElement.caption;
                  } else {
                     newElement.caption = description;
                  }
               }


               if(filter.hasOwnProperty(field)) {
                  newElement.value = filter[field];
               } else {
                  delete newElement.value;
               }

               if (captions && (captions.hasOwnProperty(field))) {
                  setDescriptionWithReset(captions[field]);
               } else if (filter.hasOwnProperty(field)) {
                  setDescriptionWithReset(filter[field]);
               } else {
                  setDescriptionWithReset(undefined, true);
               }

               processElementVisibility(newElement);

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
         this.getLinkedContext().setValueSelf({
            filterChanged: $ws.helpers.reduce(this._filterStructure, function(result, element) {
               return result || (element.hasOwnProperty('value') ? !FilterToStringUtil.isEqualValues(element.resetValue, element.value) : false);
            }, false),
            filterStructure: this._filterStructure,
            filterResetLinkText: this.getProperty('resetLinkText')
         });
      },

      _resetFilter: function(internalOnly) {
         var context = this._getCurrentContext(),
             resetFilter = this.getResetFilter(),
             toSet = {};

         /* Синхронизация св-в должна происходить один раз, поэтому делаю обёртку */
         propertyUpdateWrapper(function() {
            if (context) {
               toSet[this._options.internalContextFilterName] = {
                  filter: resetFilter,
                  visibility: this.getResetVisibilityValue()
               };
               context.setValueSelf(toSet);
            }

            if (!internalOnly) {
               this._updateFilterStructure(undefined, resetFilter);
               this._notifyFilterUpdate();
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
            if (element.hasOwnProperty(prop)) {
               /* Отдаём клон значения, чтобы его не испортили извне,
                  т.к. структуру можно менять только через setFilterStructure +
                  контролы будут правильно приниматься значения при открытии панели фильтрации*/
               result[element.internalValueField] = $ws.core.clone(element[prop]);
            }
            return result;
         }, {});
      },

      _mapFilterStructureByVisibilityField: function(prop) {
         return $ws.helpers.reduce(this._filterStructure, function(result, element) {
            if(element.internalVisibilityField) {
               if (element.hasOwnProperty(prop)) {
                  result[element.internalVisibilityField] = element[prop];
               } else {
                  result[element.internalVisibilityField] = false;
               }
            }
            return result;
         }, {});
      },


      getFilter: function() {
         return this._mapFilterStructureByProp('value');
      },

      getResetVisibilityValue: function() {
         return this._mapFilterStructureByVisibilityField('resetVisibilityValue');
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