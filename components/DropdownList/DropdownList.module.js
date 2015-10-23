/**
 * Created by am.gerasimov on 10.04.2015.
 */
define('js!SBIS3.CONTROLS.DropdownList',
   [
      'js!SBIS3.CORE.CompoundControl',
      'js!SBIS3.CONTROLS.PickerMixin',
      'js!SBIS3.CONTROLS.DSMixin',
      'js!SBIS3.CONTROLS.MultiSelectable',
      'js!SBIS3.CONTROLS.DataBindMixin',
      'js!SBIS3.CONTROLS.DropdownListMixin',
      'js!SBIS3.CONTROLS.Button',
      'js!SBIS3.CONTROLS.Link',
      'js!SBIS3.CORE.MarkupTransformer',
      'html!SBIS3.CONTROLS.DropdownList',
      'html!SBIS3.CONTROLS.DropdownList/DropdownListItem',
      'html!SBIS3.CONTROLS.DropdownList/DropdownListPicker'
   ],

   function(Control, PickerMixin, DSMixin, MultiSelectable, DataBindMixin, DropdownListMixin, Button, Link, MarkupTransformer, dotTplFn, dotTplFnForItem, dotTplFnPicker) {

      'use strict';
      /**
       * Контрол, отображающий по клику или ховеру список однотипных сущностей.
       * Выпадающий список с разными вариантами отображения и возможностью задать для сущностей шаблон отображения.
       * @class SBIS3.CONTROLS.DropdownList
       * @extends $ws.proto.Control
       * @author Крайнов Дмитрий Олегович
       * @mixes SBIS3.CONTROLS.DSMixin
       * @mixes SBIS3.CONTROLS.MultiSelectable
       * @mixes SBIS3.CONTROLS.Selectable
       * @mixes SBIS3.CONTROLS.DropdownListMixin
       * @mixes SBIS3.CONTROLS.PickerMixin
       * @control
       * @public
       * @cssModifier controls-DropdownList__withoutArrow Убрать стрелочку слева от выбранного текста.
       * @cssModifier controls-DropdownList__withoutCross Убрать крестик справа от выбранного текста.
       * @cssModifier controls-DropdownList__linkStyle Отобразить текст в шапке в виде ссылки.
       */
      var DropdownList = Control.extend([PickerMixin, DSMixin, MultiSelectable, DataBindMixin, DropdownListMixin], {
         $protected: {
            _options: {
               itemTemplate: dotTplFnForItem,
               /**
                * @cfg {String} Режим работы выпадающего списка
                * @remark
                * По умолчанию - 'hover'
                * Если задать 'click', то работа будет по клику
                */
               mode: 'hover',
               defaultValue : 0,
               defaultText : '',
               caption : '',
               /**
                * @cfg {String} Имя фильтра, который отображает данный контрол
                * Опция для пробрасывания имени фильтра обратно в FastDataFilter
                */
               filterName : '',
               pickerClassName: 'controls-DropdownList__picker',
               allowEmptySelection: false
            },
            _dotTplFn: dotTplFn,
            _caption: null,
            _pickerCaption: null,
            _pickerListContainer: null,
            _pickerHeadContainer: null,
            _pickerFooterContainer: null,
            _pickerBodyContainer: null,
            _resetButton: null,
            _pickerResetButton: null,
            _defaultId: null,
            _buttonChoose : null,
            _buttonHasMore: null,
            _currentSelection: {},
            _hideAllowed : true
         },
         $constructor: function() {
            this._container.bind(this._options.mode === 'hover' ? 'mouseenter' : 'mousedown', this.showPicker.bind(this));
            this._publish('onClickMore');
         },
         init : function () {
            DropdownList.superclass.init.apply(this, arguments);
            this._initializePicker();
         },
         _setPickerContent : function () {
            var self = this,
                pickerContainer = this._getPickerContainer(),
                header = pickerContainer.find('.controls-DropdownList__header');
            header.append(this._container.clone().removeAttr('style'));
            this._setVariables();
            this.reload();
            this._bindItemSelect();
            this._pickerResetButton.click(function() {
               self.removeItemsSelectionAll();
               self.hidePicker();
            });
            if(this._options.mode === 'hover') {
               this._pickerHeadContainer.bind('mouseleave', this._pickerMouseLeaveHandler.bind(this, true));
               this._pickerBodyContainer.bind('mouseleave', this._pickerMouseLeaveHandler.bind(this, false));
            }
         },
         _buildTplArgs: function(item) {
            return {
               item: item,
               displayField: this._options.displayField,
               multiselect: this._options.multiselect
            };
         },
         setSelectedKeys : function(idArray){
            //Если у нас есть выбранные элементы, нцжно убрать DefaultId из набора
            //Т.к. ключи могут отличаться по типу (0 !== '0'), то придется перебирать массив самостоятельно.
            if (idArray.length > 1) {
               for (var i = 0; i < idArray.length; i++) {
                  if (idArray[i] == this._defaultId){
                     idArray = idArray.splice(i, 1);
                     break;
                  }
               }

            }
            DropdownList.superclass.setSelectedKeys.apply(this, arguments);
            this._updateCurrentSelection();

         },
         _updateCurrentSelection: function(){
            var keys;
            this._currentSelection = {};
            keys = this.getSelectedKeys();
            for (var i = 0, len = keys.length; i < len; i++ ) {
               this._currentSelection[keys[i]] = true;
            }
         },
         _getCurrentSelection: function(){
            var keys = [];
            for (var i in this._currentSelection) {
               if (this._currentSelection.hasOwnProperty(i) && this._currentSelection[i]) {
                  //Если ключи были number, они станут здесь строкой
                  keys.push(i);
               }
            }
            return keys;
         },
         //Проверка на нестрогое равенство массивов
         //TODO это дублЬ! нужно вынести в хелпер!!!
         _isSimilarArrays : function(arr1, arr2){
            if (arr1.length === arr2.length) {
               for (var i = 0; i < arr1.length; i ++) {
                  if (arr1[i] != arr2[i]) {
                     return false;
                  }
               }
               return true;
            }
            return false;
         },
         _clickItemHandler : function (e) {
            var  self = this,
                row = $(e.target).closest('.' + self._getItemClass()),
                  selected;
            if (row.length && (e.button === ($ws._const.browser.isIE8 ? 1 : 0))) {

               //Если множественный выбор, то после клика скрыть менюшку можно только по кнопке отобрать
               this._hideAllowed = !this._options.multiselect;
               if (this._options.multiselect && !$(e.target).hasClass('controls-ListView__defaultItem') /* && $(e.target).hasClass('js-controls-DropdownList__itemCheckBox')*/) {
                  this._buttonChoose.getContainer().removeClass('ws-invisible');
                  selected =  !row.hasClass('controls-DropdownList__item__selected');
                  row.toggleClass('controls-DropdownList__item__selected', selected);
                  this._currentSelection[row.data('id')] = selected;
               } else {
                  self.setSelectedKeys([row.data('id')]);
                  self.hidePicker();
               }
            }
         },
         _dblClickItemHandler : function(e){
            e.stopImmediatePropagation();
            var  row = $(e.target).closest('.' + this._getItemClass());
            if (row.length && (e.button === ($ws._const.browser.isIE8 ? 1 : 0))) {
               if (this._options.multiselect) {
                  this._hideAllowed = true;
                  this.setSelectedKeys([row.data('id')]);
                  this.hidePicker();
               }
            }

         },
         showPicker: function() {
            var items = this._getPickerContainer().find('.controls-DropdownList__item');
            this._updateCurrentSelection();
            this._hideAllowed = true;
            //Восстановим выделение по элементам
            for (var i = 0 ; i < items.length; i++) {
               $(items[i]).toggleClass('controls-DropdownList__item__selected', !!this._currentSelection[$(items[i]).data('id')])
            }
            DropdownList.superclass.showPicker.apply(this, arguments);
            this._getPickerContainer().toggleClass('controls-DropdownList__equalsWidth', this._pickerListContainer[0].offsetWidth === this._pickerHeadContainer[0].offsetWidth);
            if (this._buttonChoose) {
               this._buttonChoose.getContainer().addClass('ws-invisible');
            }
         },
         hide: function(){
            if (this._hideAllowed) {
               DropdownList.superclass.hide.apply(this, arguments);
            }
         },
         _getItemClass: function(){
            return 'controls-DropdownList__item';
         },
         _getPickerContainer: function() {
            return this._picker.getContainer();
         },
         _pickerMouseLeaveHandler: function(fromHeader, e) {
            if(this._hideAllowed && !$(e.toElement).closest('.controls-DropdownList__' + (fromHeader ? 'body' : 'header')).length) {
               this.hidePicker();
            }
         },
         _drawItemsCallback: function() {

            //Надо вызвать просто для того, чтобы отрисовалось выбранное значение/значения
            if (this._dataSet.getRawData().length) {
               this.setSelectedKeys(this._options.selectedKeys);
            }

         },
         _dataLoadedCallback: function() {
            var item =  this._dataSet.at(0);
            if (item) {
               this._defaultId = item.getKey();
               /* Пока закомментирую, не уверена, что DataSet  сможет правильно  работать с more и так же не уверена, должно ли оно вообще зависеть от more
               if (this._buttonHasMore) {
                  this._buttonHasMore[this._hasNextPage(this._dataSet.getMetaData().more, 0) ? 'show' : 'hide']();
               }*/
            }
         },
         _setVariables: function() {
            var pickerContainer = this._getPickerContainer(),
                  self = this;

            this._caption = this._container.find('.controls-DropdownList__caption');
            this._resetButton = this._container.find('.controls-DropdownList__crossIcon');
            this._pickerCaption  = pickerContainer.find('.controls-DropdownList__caption');
            this._pickerResetButton = pickerContainer.find('.controls-DropdownList__crossIcon');
            this._pickerListContainer = pickerContainer.find('.controls-DropdownList__list');
            this._pickerBodyContainer = pickerContainer.find('.controls-DropdownList__body');
            this._pickerHeadContainer = pickerContainer.find('.controls-DropdownList__header');
            this._pickerFooterContainer = pickerContainer.find('.controls-DropdownList__footer');
            if (this._options.multiselect) {
               this._buttonChoose = this._picker.getChildControlByName('DropdownList_buttonChoose');
               this._buttonChoose.subscribe('onActivated', function(){
                  var currSelection = self._getCurrentSelection();
                  self._hideAllowed = true;
                  if (!self._isSimilarArrays(self.getSelectedKeys(), currSelection)) {
                     self.setSelectedKeys(currSelection);
                  }
                  self.hidePicker();
               });
               this._buttonHasMore = this._picker.getChildControlByName('DropdownList_buttonHasMore');
               this._buttonHasMore.subscribe('onActivated', function(){
                  self._notify('onClickMore');
                  self.hidePicker();
               });
            }
         },
         _addItemAttributes: function (container, item) {
            /*implemented from DSMixin*/
            DropdownList.superclass._addItemAttributes.apply(this, arguments);
            if (item.getKey() == this.getDefaultId()) {
               container.addClass('controls-ListView__defaultItem');
            }
         },

         _drawSelectedItems : function(id) {
            var textValues = [],
                len = id.length,
                self = this,
                pickerContainer,
                def;

            if(len) {
               def = new $ws.proto.Deferred();

               if(this._dataSet) {
                  for(var i = 0; i < len; i++) {
                     textValues.push(this._dataSet.getRecordByKey(id[i]).get(this._options.displayField));
                  }
                  def.callback(textValues);
               } else {
                  //TODO переделать, когда БЛ научится отдавать несколько записей при чтении
                  this._dataSource.read(id[0]).addCallback(function(record) {
                     def.callback([record.get(self._options.displayField)]);
                  })
               }

               def.addCallback(function(textValue) {
                  pickerContainer = self._getPickerContainer();
                  if (!self._options.multiselect) {
                     pickerContainer.find('.controls-DropdownList__item__selected').removeClass('controls-DropdownList__item__selected');
                     pickerContainer.find('[data-id="' + id[0] + '"]').addClass('controls-DropdownList__item__selected');
                  }
                  self.setCaption(textValue.join(', '));
               });
               self._setResetButtonVisibility(id[0] === this._defaultId);
            }
         },
         getDefaultId: function() {
            return this._defaultId;
         },
         setCaption: function(text) {
            if(typeof text === 'string') {
               this._options.caption = text;
               this._caption.text(text);
               this._pickerCaption.text(text);
               this._notifyOnPropertyChanged('caption');
            }
         },
         getCaption: function() {
            return this._options.caption;
         },
         getText: function() {
            return this._caption.text();
         },
         _setResetButtonVisibility: function(show) {
            this._resetButton.toggleClass('ws-hidden', show);
            this._pickerResetButton.toggleClass('ws-hidden', show);
         },
         _getItemsContainer : function () {
            return this._pickerListContainer;
         },
         _setPickerConfig: function () {
            //this.getParent()._context
            var ctx = new $ws.proto.Context({restriction: 'set'}),
               rootName = 'sbis3-controls-fast-filter'/*,
               updatePickerContext = function () {
                  ctx.setValue(rootName, {
                     filterChanged: btnCtx.getValue('filterChanged'),
                     filter: this.getFilter(),
                     caption: this._mapFilterStructureByProp('caption')
                  });
               }.bind(this)*/;
            //this._pickerContext = ctx;

            //updatePickerContext();
            ctx.setPrevious(this.getParent()._context);
            //ctx.subscribe('onFieldNameResolution', function(event, fieldName) {
            //   var
            //         byFilter = this._findFilterStructureElement(function(element) {
            //            return element.internalValueField === fieldName;
            //         }),
            //         byCaption = !byFilter && this._findFilterStructureElement(function(element) {
            //                  return element.internalCaptionField === fieldName;
            //               });
            //
            //   if (byFilter) {
            //      event.setResult(rootName + '/filter/' + byFilter.internalValueField);
            //   }
            //
            //   if (byCaption) {
            //      event.setResult(rootName + '/caption/' + byCaption.internalValueField);
            //   }
            //}.bind(this));

            ctx.subscribe('onFieldsChanged', function() {
               var
                     filter = ctx.getValue(rootName + '/filter'),
                     changed = $ws.helpers.reduce(this._filterStructure, function(result, element) {
                        return result || !isFieldResetValue(element, element.internalValueField, filter);
                     }, false, this);
               ctx.setValueSelf(rootName + '/filterChanged', changed);
            }.bind(this));
            //ctx.subscribe('onFieldChange', function(){
            //   debugger;
            //});
            return {
               corner: 'tl',
               //context: ctx,
               verticalAlign: {
                  side: 'top',
                  offset: -2
               },
               horizontalAlign: {
                  side: 'left',
                  offset: -2
               },
               //Если мы не в ховер-моде, нужно отключить эту опцию, чтобы попап после клика сразу не схлапывался
               closeByExternalOver: this._options.mode === 'hover' && !this._options.multiselect,
               closeByExternalClick : true,
               targetPart: true,
               template : MarkupTransformer(dotTplFnPicker)({'multiselect' : this._options.multiselect})
            };
         },
         //Переопределяю, чтобы элементы чистились в пикере
         _clearItems : function() {
            if (this._picker) {
               DropdownList.superclass._clearItems.call(this, this._pickerListContainer);
            }
         },
         destroy : function(){
            if (this._buttonChoose) {
               this._buttonChoose.destroy();
            }
            if (this._buttonHasMore) {
               this._buttonHasMore.destroy();
            }
            DropdownList.superclass.destroy.apply(this, arguments);
         }
      });

      return DropdownList;
   });
