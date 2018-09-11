define('SBIS3.CONTROLS/Mixins/PickerMixin', [
   "SBIS3.CONTROLS/FloatArea"
], function(FloatArea) {
   /**
    * Миксин, умеющий отображать выдающий вниз блок.
    * Задаётся контент и методы, позволяющие открывать, закрывать блок.
    * @mixin SBIS3.CONTROLS/Mixins/PickerMixin
    * @public
    * @author Крайнов Д.О.
    */
   var PickerMixin = /** @lends SBIS3.CONTROLS/Mixins/PickerMixin.prototype */{
      /**
       * @event onPickerOpen Происходит при открытии блока.
       * @param {Core/EventObject} Дескриптор события.
       */
       /**
        * @event onPickerClose Происходит при закрытии блока.
        * @param {Core/EventObject} Дескриптор события.
        */
      $protected: {
         _picker : null,
         _border : 0,
         _options: {
             /**
              * @cfg {String} Устанавливает имя CSS-класса, который будет применён к HTML-контейнеру выпадающего блока.
              * @example
              * <pre class="brush:xml">
              *     <option name="pickerClassName">control-MyComboBox__ComboBox__position</option>
              * </pre>
              * @remark
              * !Важно: при написании CSS-селекторов необходимо учитывать, что выпадающий блок располагается в body,
              * а не в конейнере контрола.
              */
            pickerClassName : '',
            /**
             * @cfg {Object} Устанавливает дополнительные настройки для выпадающего блока {@link SBIS3.CONTROLS/Mixins/PopupMixin}.
             * Опции, значения которых будут использованы при построении выпадающего блока.
             * @example
             * <pre class="brush:xml">
             *    <options name="pickerConfig">
             *       <options name="verticalAlign">
             *          <option name="side">top</option>
             *        </options>
             *    </options>
             * </pre>
             */
            pickerConfig: null
         }
      },

      $constructor: function() {
         this._publish('onPickerOpen', 'onPickerClose');
      },

      _initializePicker: function () {
         var self = this,
             container = this.getContainer(),
             pickerContainer = $('<div></div>');

         if (this._options.pickerClassName) {
            pickerContainer.addClass(this._options.pickerClassName);
         }

         // чтобы не нарушать выравнивание по базовой линии
         $('body').append(pickerContainer);
         this._picker = this._createPicker(pickerContainer);
         this.subscribeTo(this._picker, 'onAlignmentChange', function(event, alignment){
                self._onAlignmentChangeHandler(alignment);
             });
         this.subscribeTo(this._picker, 'onClose', function(){
                container.removeClass('controls-Picker__show');
                self._notify('onPickerClose');
             });

         container
            .on('mouseenter', function() {
               pickerContainer.addClass('controls-Picker__owner__hover');
            })
            .on('mouseleave', function () {
               pickerContainer.removeClass('controls-Picker__owner__hover');
            });

         this.subscribeTo(this._picker, 'onDestroy', function(){
            self.getContainer().off('mouseenter mouseleave');
         });

         this._border = container.outerWidth() - container.innerWidth();
         this._setPickerContent();
         pickerContainer.addClass('js-controls-Picker__initialized');
      },

      _createPicker: function(pickerContainer){
         var pickerConfig = this._setPickerConfig(),
             parent = this;

         if (this._options.pickerConfig) {
            for (var key in this._options.pickerConfig) {
               if(this._options.pickerConfig.hasOwnProperty(key)) {
                  /* Нельзя перебивать обработчики из оригинального конфига, иначе может поломаться логика,
                   просто добавляем к оригинальным обработчикам пользовательские */
                  if(key === 'handlers' && pickerConfig[key]) {
                     for (var handlerKey in this._options.pickerConfig[key]) {
                        if(this._options.pickerConfig[key].hasOwnProperty(handlerKey)) {
                           if(pickerConfig[key][handlerKey]) {
                              pickerConfig[key][handlerKey] = [pickerConfig[key][handlerKey]];
                              pickerConfig[key][handlerKey].push(this._options.pickerConfig[key][handlerKey]);
                           } else {
                              pickerConfig[key][handlerKey] = this._options.pickerConfig[key][handlerKey];
                           }
                        }
                     }
                     continue;
                  }
                  pickerConfig[key] = this._options.pickerConfig[key];
               }
            }
         }

         pickerConfig.parent = pickerConfig.parent !== undefined ? pickerConfig.parent : parent;
         pickerConfig.opener = this;
         pickerConfig.context = pickerConfig.context || (parent && parent.getLinkedContext());
         pickerConfig.target = pickerConfig.target || this._container;
         pickerConfig.element = pickerContainer;
         return new FloatArea(pickerConfig);
      },

      _setPickerConfig: function(){
         return {
            corner: 'bl',
            verticalAlign: {
               side: 'top'
            },
            horizontalAlign: {
               side: 'left'
            },
            closeByExternalClick: true
         };
      },

      _onAlignmentChangeHandler: function(alignment){

      },

      /**
       * Метод показывает выпадающий блок.
       * @remark
       * У контролов выбора периода:
       * <ul>
       *   <li>SBIS3.CONTROLS/Date/Picker</li>
       *   <li>SBIS3.CONTROLS/Date/Range</li>
       *   <li>SBIS3.CONTROLS/Date/RangeSlider</li>
       *   <li>SBIS3.CONTROLS/Date/RangeSliderBig</li>
       * </ul>
       * вызов showPicker() не приводит к мгновенному созданию выпадающего окна и его открытию.
       * Модуль выпадающего окна загружается асинхронно, и только после этого открывается.
       * В связи с этим, если вы пытаетесь получить доступ к выпадающему окну до или сразу же после вызова showPicker(), то получите ошибку.
       * @example
       * <pre>
       *     MenuButton.subscribe('onActivated', function(){
       *        MenuButton.showPicker();
       *     })
       * </pre>
       * @see hidePicker
       * @see togglePicker
       */
      showPicker: function() {
         if (!this._picker || this._picker.isDestroyed()) {
            this._initializePicker();
         }
         this._container.addClass('controls-Picker__show');
         this._picker.show();
         this._notify('onPickerOpen');
      },

      /**
       * Возвращает выпадающий блок.
       * @example
       * <pre>
       *     FieldLink.getPicker().recalcPosition(true);
       * </pre>
       * @see hidePicker
       * @see showPicker
       * @see togglePicker
       */
      getPicker: function(){
         if (!this._picker || this._picker.isDestroyed()) {
            this._initializePicker();
         }
         return this._picker;
      },

      /**
       * Метод скрывает выпадающий блок.
       * @example
       * <pre>
       *     ComboBox.subscribe('onFocusOut', function(){
       *        ComboBox.hidePicker();
       *     })
       * </pre>
       * @see showPicker
       * @see togglePicker
       */
      hidePicker: function() {
         if(this._picker) {
            this._container.removeClass('controls-Picker__show');
            this._picker.hide();
         }
      },
     /**
      * Метод изменяет состояние выпадающего блока на противоположное (скрывает/показывает).
      * @example
      * <pre>
      *    ComboBox.bind('click', function(){
      *       ComboBox.togglePicker();
      *    })
      * </pre>
      * @sse showPicker
      * @see hidePicker
      */
      togglePicker: function() {
         if (!this._picker) {
            this.showPicker();
         }
         else {
            this._container.toggleClass('controls-Picker__show');
            if (this._picker.isVisible()) {
               this.hidePicker();
            } else {
               this.showPicker();
            }
         }
      },

      /**
       * Возвращает, отображается ли сейчас пикер
       * @returns {*|Boolean}
       * @example
       * <pre>
       *    button.bind('click', function(){
       *       if(self.isPickerVisible()) {
       *          self.hidePicker();
       *       }
       *     })
       * </pre>
       */
      isPickerVisible: function() {
         return Boolean(this._picker && this._picker.isVisible());
      },


      _setPickerContent: function () {
         /*Method must be implemented*/
      },

      after : {
         destroy : function(){
            if (this._picker) {
               this._picker.destroy();
            }
            this.getContainer().off('mouseenter mouseleave');
         }
      },

      around : {
         _getScrollContainer: function(parentFunc) {
            if(!this._picker) {
               return parentFunc.call(this);
            }
            return this._picker.getContainer();
         }
      }

   };

   return PickerMixin;

});