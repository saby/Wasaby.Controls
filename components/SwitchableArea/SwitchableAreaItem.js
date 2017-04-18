/* На основе SBIS3.CORE.SwitchableAreaItem */
define(['js!SBIS3.CORE.CompoundControl', 'Core/helpers/generate-helpers', 'Core/Deferred', 'Core/ParallelDeferred'],
   function(CompoundControl, genHelpers, Deferred, ParallelDeferred) {
      'use strict';

      /**
       * @class SBIS3.CONTROLS.SwitchableAreaItem
       * @extends SBIS3.CORE.CompoundControl
       * @author Крайнов Дмитрий Олегович
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
               visible: false,
               /**
                * @cfg {Boolean} Валидация области, даже если она является скрытой
                * При валидации области валидируются все внутренние компоненты области.
                * Если область скрыта, по умолчанию внутренние компоненты такой области не валидируются.
                * Но для некоторых областей может потребоваться валидация внутренних компонентов несмотря на скрытость,
                * для этого используется данная опция.
                */
               validateIfHidden: true
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
               id = genHelpers.randomId('ws-area-');
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
          * @returns {Core/Deferred} - Deferred готовности
          */
         loadChildControls: function() {
            var def = new Deferred();
            if (!this.isLoaded()){
               var self = this;
               this.setLoaded(true);
               self._loadControlsBySelector(new ParallelDeferred(), undefined, '[data-component]')
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