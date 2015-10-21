/**
 * Created by am.gerasimov on 19.10.2015.
 */

define('js!SBIS3.CONTROLS.SelectorMixin', [],
   function () {

      'use strict';

      /**
       * Описание логики выбора из диалога/панели.
       * SelectorMixin используется полем связи.
       * @mixin
       * @name SBIS3.CONTROLS.SelectorMixin
       * @public
       */
      var SelectorMixin = {
         $protected: {
            _linkedView: null,
            _selectionConfirmHandler: undefined,
            _dRender: null,
            _options: {
               /**
                * @cfg {Boolean} Разрешить множественный выбор записей
                * <wiTag group="Управление">
                * Возможные значения:
                * <ul>
                *    <li>true - разрешён выбор нескольких записей одновременно;</li>
                *    <li>false - выбор только одной записи.</li>
                * </ul>
                * @example
                * <pre>
                *     <option name="multiSelect">true</option>
                * </pre>
                */
               multiselect: false,
               /**
                * Записи, выбранные в связном представлении
                */
               currentSelectedKeys: [],
               /**
                * Обработчик на закрытие диалога/всплывающей панели
                */
               closeCallback: undefined
            }
         },
         $constructor: function () {
            var self = this;

            /* Подпишемся на готовность диалога/всплывающей панели */
            if (!(self._dRender instanceof $ws.proto.Deferred)) {
               self._dRender = new $ws.proto.Deferred();
               self.subscribe('onAfterLoad', function () {
                  self._dRender.callback();
               });
            }

            this._changeSelectionHandler = function (event, result) {
               if(!self._options.multiselect) {
                  self.close(result);
               }
            };

            this._dRender.addCallback(function(){
               var childControls = self.getChildControls();

               for(var i = 0, l = childControls.length; i < l; i++){
                  var childControl = childControls[i];

                  if($ws.helpers.instanceOfModule(childControl, 'SBIS3.CONTROLS.ListView')){
                     self.setLinkedView(childControl);
                     break;
                  }
               }
            });
         },

         _toggleLinkedViewEvents: function(sub) {
            this._options.multiselect ?
               this[sub ? 'subscribeOnceTo' : 'unsubscribeFrom'](this._linkedView, 'onDrawItems', this._linkedView.setSelectedKeys.bind(this._linkedView, this._options.currentSelectedKeys)) :
               this[sub ? 'subscribeTo' : 'unsubscribeFrom'](this._linkedView, 'onSelectedItemsChange', this._changeSelectionHandler);
         },

         setLinkedView: function (linkedView) {
            this._linkedView && this._toggleLinkedViewEvents(false);
            this._linkedView = linkedView;

            if (linkedView) {
               this._linkedView.setProperty('multiselect', this._options.multiselect);
               this._toggleLinkedViewEvents(true);
               this._linkedView.reload();
            }
         },

         /**
          * Получить связное представление данных для этого диалога выбора
          * @returns {SBIS3.CONTROLS.ListView}
          */
         getLinkedView: function () {
            return this._linkedView;
         },

         before: {
            close: function (value) {
               if (typeof this._options.closeCallback === 'function') {
                  this._options.closeCallback.call(this, value);
               }
            }
         }
      };

      return SelectorMixin;

   });
