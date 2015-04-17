/**
 * Created by am.gerasimov on 10.04.2015.
 */
define('js!SBIS3.CONTROLS.CustomFilterMenu',
   [
      'js!SBIS3.CORE.CompoundControl',
      'js!SBIS3.CONTROLS.PickerMixin',
      'js!SBIS3.CONTROLS.DSMixin',
      'js!SBIS3.CONTROLS.Selectable',
      'js!SBIS3.CONTROLS.DataBindMixin',
      'html!SBIS3.CONTROLS.CustomFilterMenu',
      'html!SBIS3.CONTROLS.CustomFilterMenu/CustomFilterMenuItem'

   ],

   function(Control, PickerMixin, DSMixin, Selectable, DataBindMixin, dotTplFn, dotTplFnForItem) {


      'use strict';

      var CustomFilterMenu = Control.extend([PickerMixin, DSMixin, Selectable, DataBindMixin], {
         $protected: {
            _options: {

            },
            _dotTplFn: dotTplFn,
            _dotTplFnForItem: dotTplFnForItem,
            _captionField: null,
            _defaultValueId: null,
            _resetButton: null
         },
         $constructor: function() {
            //TODO непонятно, как брать дефолтное значение, поэтому пока просто возьму первое из items
            this._defaultValueId = this._options.items[0].id;
            this._captionField = this._container.find('.controls-CustomFilterMenu__caption');

            if (!this._options.displayField) {
               //По умолчанию отображаемое поле - 'title'
               this._options.displayField = 'title';
            }

            this._initEvents();
         },
         _initEvents: function() {
            var self = this;

            //В зависимости от режима, показываем пикер по клику на котнейнер или по наведению мышки
            this._container.bind(this._options.mode === 'hover' ? 'mouseenter' : 'click', this.showPicker.bind(this));
            this._resetButton = this._container.find('.controls-CustomFilterMenu__crossIcon').click(function() {
               self.setSelectedItem(self._defaultValueId);
            });
         },
         _initComplete: function() {
            CustomFilterMenu.superclass._initComplete.apply(this, arguments);
            this.setSelectedItem(this._defaultValueId);
         },
         _setPickerContent: function () {
            var self = this;

            //Запросим данные
            this.reload();
            this._picker.getContainer().mouseup(function (e) {
               var row = $(e.target).closest('.controls-CustomFilterMenu__item');
               if (row.length) {
                  self.setSelectedItem(row.data('id'));
                  self.hidePicker();
               }
            });
         },
         _drawSelectedItem: function(id) {
            if(id) {
               //TODO Наверное надо сделать ещё с dataSource
               if(this._dataSet) {
                  this._captionField.text(this._dataSet.getRecordByKey(id).get(this._options.displayField));
               } else if (id === this._defaultValueId) { //TODO сделать правильно
                  this._captionField.text(this._options.items[0][this._options.displayField]);
               }
               this._resetButton[id === this._defaultValueId ? 'hide' : 'show']();
            }
         },
         _getItemsContainer: function () {
            return this._picker.getContainer();
         },
         _getItemTemplate: function(item) {
           return this._dotTplFnForItem.apply(this, [item]);
         },
         _setPickerConfig: function () {
            return {
               corner: 'bl',
               verticalAlign: {
                  side: 'top'
               },
               horizontalAlign: {
                  side: 'left'
               },
               closeByExternalOver: true,
               targetPart: true
            };
         },
         //Переопределяю, чтобы элементы чистились в пикере
         _clearItems : function() {
            if (this._picker) {
               CustomFilterMenu.superclass._clearItems.call(this, this._picker.getContainer());
            }
         }
      });

      return CustomFilterMenu;
   });
