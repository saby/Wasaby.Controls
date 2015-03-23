/**
 * Created by iv.cheremushkin on 14.08.2014.
 */

define('js!SBIS3.CONTROLS.ListViewDS',
   ['js!SBIS3.CORE.CompoundControl',
      'js!SBIS3.CONTROLS.DSMixin',
      'js!SBIS3.CONTROLS.MultiSelectable',
      'html!SBIS3.CONTROLS.ListViewDS'
   ],
   function (CompoundControl, DSMixin, MultiSelectable, dotTplFn) {

      'use strict';

      /**
       * Контрол, отображающий внутри себя набор однотипных сущностей, умеет отображать данные списком по определенному шаблону, а так же фильтровать и сортировать
       * @class SBIS3.CONTROLS.ListViewDS
       * @extends $ws.proto.Control
       * @mixes SBIS3.CONTROLS.DSMixin
       * @mixes SBIS3.CONTROLS.MultiSelectable
       * @control
       */

      var ListViewDS = CompoundControl.extend([DSMixin, MultiSelectable], /** @lends SBIS3.CONTROLS.ListViewDS.prototype */ {
         $protected: {
            _floatCheckBox : null,
            _dotTplFn: dotTplFn,
            _dotItemTpl: null,
            _itemsContainer: null,
            _actsContainer: null,
            _options: {
               /**
                * @cfg {} Шаблон отображения каждого элемента коллекции
                */
               itemTemplate: '',
               /**
                * @cfg {Array} Набор действий, над элементами, отображающийся в виде иконок. Можно использовать для массовых операций.
                */
               itemsActions: [],
               /**
                * @cfg {Boolean} Разрешено или нет перемещение элементов Drag-and-Drop
                */
               itemsDragNDrop: false,
               /**
                * @cfg {String|jQuery|HTMLElement} Что отображается когда нет записей
                */
               emptyHTML: null,
               /**
                * @cfg {Function} Обработчик клика на элемент
                */
               elemClickHandler: null,
               multiselect: false
            }
         },

         $constructor: function () {
            //this._items.setHierField(null);
            var self = this;
            this._container.mouseup(function (e) {
               if (e.which == 1) {
                  var targ = $(e.target).hasClass('controls-ListView__item') ? e.target : $(e.target).closest('.controls-ListView__item');
                  if (targ.length) {
                     var id = targ.data('id');
                     self._elemClickHandler(id, self._dataSet.getRecordByKey(id), e.target);
                  }
               }
            });
            this._createItemsActions();
         },

         init: function () {
            var self = this;
            // запросим данные из источника
            this.reload();
         },

         /**
          * Установить, что отображается когда нет записей
          * @param html содержимое блока
          */
         setEmptyHTML: function (html) {

         },
         _getItemTemplate: function () {
            return this._options.itemTemplate;
         },

         /* +++++++++++++++++++++++++++ */

         _elemClickHandler: function (id, data, target) {
            if (this._options.multiselect) {
               if ($(target).hasClass('controls-ListView__itemCheckBox')) {
                  var key = $(target).closest('.controls-ListView__item').data('id');
                  this.toggleItemsSelection([key]);
               }
               else {
                  if (this._options.elemClickHandler) {
                     this._options.elemClickHandler.call(this, id, data, target);
                  }
               }
            }
            else {
               this.setSelectedItems([id]);
               if (this._options.elemClickHandler) {
                  this._options.elemClickHandler.call(this, id, data, target);
               }
            }
         },

         _getItemActionsContainer: function (id) {
            return $(".controls-ListView__item[data-id='" + id + "']", this._container.get(0));
         },

         _createItemsActions: function () {
            var self = this;
            this._container.mousemove(function (e) {
               var targ = $(e.target).hasClass('controls-ListView__item') ? e.target : $(e.target).closest('.controls-ListView__item');
               if (targ.length) {
                  var id = targ.attr('data-id');

                  if (self._actsContainer) {
                     self._getItemActionsContainer(id).append(self._actsContainer.show());
                  }
               }
               else {
                  if (self._actsContainer) {
                     self._actsContainer.hide()
                  }
               }
            });

            this._container.mouseout(function () {
               if (self._actsContainer) self._actsContainer.hide();
            });
         },

         _drawSelectedItems: function (idArray) {
            $(".controls-ListView__item", this._container).removeClass('controls-ListView__item__selected');
            for (var i = 0; i < idArray.length; i++) {
               $(".controls-ListView__item[data-id='" + idArray[i] + "']", this._container).addClass('controls-ListView__item__selected');
            }
         },

         setElemClickHandler: function (method) {
            this._options.elemClickHandler = method;
         },

         setItemsActions: function (itemsActions) {
            this._options.itemsActions = itemsActions;
            this._drawItemsActions(itemsActions);
         },

         _drawItemsActions: function (itemsActions) {
            var self = this;
            if (itemsActions.length) {
               if (!this._actsContainer) {
                  this._actsContainer = $('<div class="controls-ListView__itemActions"></div>').hide().appendTo(this._container);
               }
               this._actsContainer.empty();
               var acts = itemsActions;
               for (var i = 0; i < acts.length; i++) {
                  var action = $("<span></span>").addClass('controls-ListView__action');
                  if (acts[i].icon && acts[i].icon.indexOf('sprite:') == 0) {
                     action.addClass(acts[i].icon.substring(7));
                  }
                  if (acts[i].handler) {
                     var handler = acts[i].handler.bind(this);
                     action.mouseup(function (e) {
                        e.stopPropagation();
                        var
                           id = $(this).closest('.controls-ListView__item').attr('data-id'),
                           item = self._dataSet.getRecordByKey(id);
                        handler(id, item);
                     })
                  }
                  this._actsContainer.append(action);
               }
            }
            else {
               if (this._actsContainer) {
                  this._actsContainer.remove();
                  this._actsContainer = null
               }
            }
         },
         _drawItemsCallback: function () {
            this._drawItemsActions(this._options.itemsActions);
         },

         _getLeftOfItemContainer : function(container) {
            return container;
         }

      });

      return ListViewDS;

   });