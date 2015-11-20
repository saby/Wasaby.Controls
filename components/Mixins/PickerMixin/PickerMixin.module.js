define('js!SBIS3.CONTROLS.PickerMixin', ['js!SBIS3.CONTROLS.FloatArea'], function(FloatArea) {
   /**
    * Миксин, умеющий отображать выдающий вниз блок.
    * Задаётся контент и методы, позволяющие открывать, закрывать блок.
    * @mixin SBIS3.CONTROLS.PickerMixin
    * @public
    * @author Крайнов Дмитрий Олегович
    */
   var PickerMixin = /** @lends SBIS3.CONTROLS.PickerMixin.prototype */{
      $protected: {
         _picker : null,
         _border : 0,
         _options: {
             /**
              * @cfg {String} Имя css-класса, который будет применён к контейнеру выпадающего блока.
              * @example
              * <pre class="brush:xml">
              *     <option name="pickerClassName">control-MyComboBox__ComboBox__position</option>
              * </pre>
              * @remark
              * !Важно: при написании css-селекторов необходимо учитывать, что выпадающий блок располагается в body,
              * а не в конейнере контрола.
              */
            pickerClassName : ''
         }
      },

      $constructor: function() {

      },

      _initializePicker: function () {
         var
            self = this,
            pickerContainer = $('<div></div>'),
            container = self._container;

         if (this._options.pickerClassName) {
            pickerContainer.addClass(this._options.pickerClassName);
         }

         // чтобы не нарушать выравнивание по базовой линии
         $('body').append(pickerContainer);
         self._picker = this._createPicker(pickerContainer);
         this._picker.subscribe('onAlignmentChange', function(event, alignment){
            self._onAlignmentChangeHandler(alignment);
         });
         self._picker.subscribe('onClose', function(){
            self._container.removeClass('controls-Picker__show');
         });
         container.hover(function(){
            self._picker.getContainer().addClass('controls-Picker__owner__hover');
         }, function () {
            self._picker.getContainer().removeClass('controls-Picker__owner__hover');
         });
         self._border = self._container.outerWidth() - self._container.innerWidth();
         self._setPickerContent();
      },

      _createPicker: function(pickerContainer){
         var pickerConfig = this._setPickerConfig();
         pickerConfig.parent = pickerConfig.parent || this.getParent();
         pickerConfig.opener = this;
         if (!pickerConfig.context) {
            pickerConfig.context = this.getParent() ? this.getParent().getLinkedContext() : {};
         }
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
         if (!this._picker) {
            this._initializePicker();
         }
         this._container.addClass('controls-Picker__show');
         this._picker.show();
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
            this._initializePicker();
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
       *        if(self.isPickerVisible()) {
       *           self.hidePicker();
       *        }
       *      })
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
         }
      }

   };

   return PickerMixin;

});