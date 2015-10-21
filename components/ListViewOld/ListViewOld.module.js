/**
 * Created by iv.cheremushkin on 14.08.2014.
 */

define('js!SBIS3.CONTROLS.ListViewOld',
   ['js!SBIS3.CORE.CompoundControl',
      'js!SBIS3.CONTROLS.CollectionMixin',
      'js!SBIS3.CONTROLS.MultiSelectable',
      'html!SBIS3.CONTROLS.ListViewOld'
   ],
   function (CompoundControl, CollectionMixin, MultiSelectable, dotTplFn) {

      'use strict';

      /**
       * Контрол, отображающий внутри себя набор однотипных сущностей.
       * Умеет отображать данные списком по определенному шаблону, а так же фильтровать и сортировать их.
       * @class SBIS3.CONTROLS.ListViewOld
       * @extends $ws.proto.Control
       * @mixes SBIS3.CONTROLS.CollectionMixin
       * @mixes SBIS3.CONTROLS.MultiSelectable
       * @control
       * @author Черёмушкин Илья
       */

      var ListView = CompoundControl.extend([CollectionMixin, MultiSelectable], /** @lends SBIS3.CONTROLS.ListViewOld.prototype */ {
         $protected: {
            _dotTplFn: dotTplFn,
            _dotItemTpl: null,
            _itemsContainer: null,
            _actsContainer : null,
            _options: {
               /**
                * @cfg {String} Шаблон отображения каждого элемента коллекции
                */
               itemTemplate: '',
               /**
                * @cfg {Array} Набор действий над элементами, отображающийся в виде иконок.
                * Можно использовать для массовых операций.
                */
               itemsActions: [],
               /**
                * @cfg {Boolean} Разрешено или нет перемещение элементов "Drag-and-Drop"
                * @example
                * <pre>
                *     <option name="itemsDragNDrop">true</option>
                * </pre>
                */
               itemsDragNDrop: false,
               /**
                * @cfg {String|jQuery|HTMLElement} Что отображается когда нет записей
                */
               emptyHTML: null,
               /**
                * @cfg {Function} Обработчик клика на элемент
                */
               elemClickHandler : null,
                /**
                 * @cfg {Boolean} Разрешить множественный выбор
                 * @example
                 * <pre>
                 *     <option name="multiselect">true</option>
                 * </pre>
                 */
               multiselect : false,
                /**
                 * @cfg {Boolean} Разрешить выбор записей
                 * @example
                 * <pre>
                 *     <option name="itemSelect">true</option>
                 * </pre>
                 */
               itemSelect : false
            }
         },

         $constructor: function () {
            $ws.single.ioc.resolve('ILogger').log('ListViewOld', 'ListViewOld устарел. Используйте "ListView".');
            this._items.setHierField(null);
            var self = this;
            this._container.mouseup(function(e){
               if (e.which == 1) {
                  var $target = $(e.target),
                     target = $target.hasClass('controls-ListView__item') ? $target : $target.closest('.controls-ListView__item');
                  if (target.length) {
                     var id = target.attr('data-id');
                     self._elemClickHandler(id, self._items.getItem(id));
                  }
               }
            });
            this._createItemsActions();
         },

         init : function() {
            ListView.superclass.init.call(this);
            this._drawItems();
         },

         /**
          * Установить, что отображается когда нет записей
          * @param html содержимое блока
          */
         setEmptyHTML: function (html) {

         },

         _getItemTemplate : function() {
            return this._options.itemTemplate;
         },

         _elemClickHandler : function(id, data) {
            this.setSelectedKeys([id]);
            if (this._options.elemClickHandler) {
               var parent = this.getParent();
               this._options.elemClickHandler.call(this, id, data);
            }
         },

         _getItemActionsContainer : function(id) {
            return $(".controls-ListView__item[data-id='" + id + "']", this._container.get(0));
         },

         _createItemsActions : function() {
            var self = this;
            this._container.mousemove(function(e){
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

            this._container.mouseout(function(){
               if (self._actsContainer) self._actsContainer.hide();
            });
         },

         _drawSelectedItems : function(idArray) {
            $(".controls-ListView__item", this._container).removeClass('controls-ListView__item__multiSelected');
            $(".controls-ListView__item[data-id='" + idArray[0] + "']", this._container).addClass('controls-ListView__item__multiSelected');
         },

         setElemClickHandler : function(method){
            this._options.elemClickHandler = method;
         },

         setItemsActions : function(itemsActions) {
            this._options.itemsActions = itemsActions;
            this._drawItemsActions(itemsActions);
         },

         _drawItemsActions : function(itemsActions) {
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
                     (function(handler){
                        action.mouseup(function(e){
                           e.stopPropagation();
                           var
                              id = $(this).closest('.controls-ListView__item').attr('data-id'),
                              item = self._items.getItem(id);
                           handler(id, item);
                        });
                     })(acts[i].handler.bind(this));
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
         _drawItemsCallback : function() {
            this._drawItemsActions(this._options.itemsActions);
         }
      });



      return ListView;

   });