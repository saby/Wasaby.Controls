/**
 * Created by am.gerasimov on 19.10.2015.
 */

define('js!SBIS3.CONTROLS.SelectorMixin', [],
   function () {

      'use strict';

      /**
       * ќписание логики выбора из диалога/панели.
       * SelectorMixin используетс€ полем св€зи.
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
                * @cfg {Boolean} –азрешить множественный выбор записей
                * <wiTag group="”правление">
                * ¬озможные значени€:
                * <ul>
                *    <li>true - разрешЄн выбор нескольких записей одновременно;</li>
                *    <li>false - выбор только одной записи.</li>
                * </ul>
                * @example
                * <pre>
                *     <option name="multiSelect">true</option>
                * </pre>
                */
               multiselect: false,
               /**
                * «аписи, выбранные в св€зном представлении
                */
               currentSelectedKeys: [],
               /**
                * ќбработчик на закрытие диалога/всплывающей панели
                */
               closeCallback: undefined
            }
         },
         $constructor: function () {
            var self = this;

            /* ѕодпишемс€ на готовность диалога/всплывающей панели */
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

            this._dRender.addCallback(function(result){
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

         setLinkedView: function (linkedView) {
            var self = this;

            this._linkedView = linkedView;
            if (linkedView) {
               this._linkedView.setProperty('multiselect', this._options.multiselect);
               this._options.multiselect ?
                  this.subscribeOnceTo(this._linkedView, 'onDrawItems', this._linkedView.setSelectedKeys.bind(this._linkedView, this._options.currentSelectedKeys)) :
                  this.subscribeTo(this._linkedView, 'onSelectedItemsChange', this._changeSelectionHandler);

               this._linkedView.reload();
            }
         },

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
