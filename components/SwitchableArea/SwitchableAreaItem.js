/* На основе SBIS3.CORE.SwitchableAreaItem */
define(['js!SBIS3.CORE.CompoundControl'],
   function(CompoundControl) {
      'use strict';

      /**
       * @class SwitchableAreaItem
       * @extends $ws.proto.CompoundControl
       * @public
       * @ignoreOptions name, allowChangeEnable, className, contextRestriction, enabled, independentContext, tabIndex
       */
      var SwitchableAreaItem = CompoundControl.extend(/** @lends SBIS3.CONTROLS.SwitchableAreaItem.prototype */{
         $protected: {
            _loaded: false,
            _options: {
               /**
                * @cfg {String} Идентификатор области
                * @example
                * <pre>
                *     <options name="items" type="array">
                *        <options>
                *           <option name="content">Вёрстка одной области</option>
                *           <option name="id">1</option>
                *        </options>
                *        <options>
                *           <option name="content">Вёрстка другой области</option>
                *           <option name="id">2</option>
                *        </options>
                *     <options>
                * </pre>
                */
               id: '',
               /**
                * @cfg {Content} Содержимое области
                * @example
                * <pre>
                *     <options name="items" type="array">
                *        <options>
                *           <option name="content">Вёрстка одной области</option>
                *           <option name="id">1</option>
                *        </options>
                *        <options>
                *           <option name="content">Вёрстка другой области</option>
                *           <option name="id">2</option>
                *        </options>
                *     <options>
                * </pre>
                */
               content: '',
               /**
                * @cfg {Boolean} Видимость области
                * @example
                * <pre>
                *     <options name="items" type="array">
                *        <options>
                *           <option name="content">Вёрстка одной области</option>
                *           <option name="id">1</option>
                *        </options>
                *        <options>
                *           <option name="content">Вёрстка другой области</option>
                *           <option name="id">2</option>
                *           <option name="visible">true</option>
                *        </options>
                *     <options>
                * </pre>
                */
               visible: false
            }
         },
         $constructor: function() {
            this._publish('onIdChanged', 'onContentChanged', 'onLoadedChanged');
         },
         // Подмена метода из CompoundControl. Не инстанцируем детей при инициализации.
         // Дети инстанцируются методом loadChildControls
         _loadControls: function(pdResult) {
            return pdResult.done([]);
         },

         getId: function() {
            return this._options.id;
         },
         setId: function(id) {
            var oldId = this.getId();
            if (!id){ // не может быть пустым
               id = $ws.helpers.randomId('ws-area-');
            }
            this._options.id = id;
            this._notify('onIdChanged', oldId, id);
         },
         getContent: function() {
            return this._options.content;
         },
         setContent: function(content) {
            this._options.content = content;
            if (this.isLoaded()){
               this.destroyChildControls();
               this.setLoaded(false);
            }
            this.getContainer().empty();
            this._notify('onContentChanged', this.getId(), content);
         },
         isLoaded: function() {
            return this._loaded;
         },
         setLoaded: function(isLoaded) {
            this._loaded = isLoaded;
            this._notify('onLoadedChanged', this.getId(), isLoaded);
         },
         /**
          * Отложенно инстанцирует дочерние компоненты
          * @returns {$ws.proto.Deferred} - Deferred готовности
          */
         loadChildControls: function() {
            var def = new $ws.proto.Deferred();
            if (!this.isLoaded()){
               var self = this;
               this.setLoaded(true);
               self._loadControlsBySelector(new $ws.proto.ParallelDeferred(), undefined, '[data-component]')
                  .getResult().addCallback(function(){
                     self._notify('onReady');
                     def.callback();
                  });
            }
            else {
               def.callback();
            }
            return def;
         },
         /**
          * Уничтожает инстансы дочерних компонент области
          * @private
          */
         destroyChildControls: function() {
            for (var i = this._childControls.length - 1; i >= 0; i--) {
               if (this._childControls[i] && this._childControls[i].destroy instanceof Function) {
                  this._childControls[i].destroy();
               }
            }
            this._childControls.length = 0;
            this._childContainers.length = 0;
            this.getContainer().empty();
         }
      });

      return SwitchableAreaItem;
   });