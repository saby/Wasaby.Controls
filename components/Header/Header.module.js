define(
   'js!SBIS3.CONTROLS.Header',
   [
      'js!SBIS3.CORE.CompoundControl',
      'tmpl!SBIS3.CONTROLS.Header',
      'Core/CommandDispatcher',
      'Core/Context'
   ],
   function (CompoundControl, dotTplFn, CommandDispatcher, cContext) {

   'use strict';

   var
       DefaultOpacity = 0.5,
       ContextRecordField = 'sbis3-controls-edit-header-record',
       HeaderThemes = {
          WHITE: 'controls-Header__whiteTheme',
          BLACK: 'controls-Header__blackTheme',
          WITHOUT_THEME: 'controls-Header__withoutTheme'
       };

   /**
    * Класс контрола "Корешки закладок с шапкой".
    * @class SBIS3.CONTROLS.Header
    * @extends SBIS3.CORE.CompoundControl
    * @author Крайнов Дмитрий Олегович

    * @cssModifier controls-Header__logoInTabs
    *
    * @css controls-Header__whiteTheme
    * @css controls-Header__blackTheme
    */

   var Header = CompoundControl.extend(/** @lends SBIS3.CONTROLS.Header.prototype */ {
      _dotTplFn: dotTplFn,
      /**
       * @typedef {String} Theme
       * @variant controls-Header__whiteTheme белая тема.
       * @variant controls-Header__blackTheme чёрная тема.
       */
      /**
       * @typedef {Object} EditPanelConfig
       * @property {String} keyField уникальный идентификатор.
       * @property {Array} items элементы панели редактирования.
       */
      $protected: {
         _options: {
            /**
             * @cfg {Theme} Тема которая будет использоваться в качестве тёмной.
             */
            darkTheme: HeaderThemes.BLACK,
            /**
             * @cfg {Theme} Тема которая будет использоваться в качестве светлой.
             */
            lightTheme: HeaderThemes.WHITE,
            /**
             * @cfg {String} Шаблон основной области.
             */
            mainAreaTemplate: undefined,
            /**
             * @cfg {String} Шаблон нижней области.
             */
            bottomAreaTemplate: undefined,
            /**
             * @cfg {Boolean} Возможность редактирования.
             */
            allowEdit: true,
            /**
             * @cfg {String} Ссылка на картинку, которая будет являться логотипом.
             */
            logo: undefined,
            /**
             * @cfg {String} Ссылка на картинку, которая будет являться фоном.
             */
            image: undefined,
            /**
             * @cfg {Number} Прозрачность оверлея.
             */
            opacity: DefaultOpacity,
            /**
             * @cfg {Theme} Тема.
             */
            theme: undefined,
            /**
             * @cfg {EditPanelConfig} Настройки панели редактирования.
             */
            editPanelConfig: undefined
         },
         _editingModel: undefined,
         _originalModel: undefined
      },

      $constructor: function() {
         this._publish('onBeginEdit', 'onEndEdit');
         CommandDispatcher.declareCommand(this, 'beginEdit', this.beginEdit.bind(this));
         CommandDispatcher.declareCommand(this, 'endEdit', this.endEdit.bind(this));
      },

      init: function() {
         Header.superclass.init.apply(this, arguments);
         this._editButton = this.getChildControlByName('beginEditButton');
         this._slider = this.getChildControlByName('opacitySlider');
         this._slider.subscribe('onDrawValueChange', this._onChangeOpacity.bind(this));

         if (!this._options.theme) {
            this._computeTheme(this._options.image);
         }
      },

      beginEdit: function() {
         var context = this._getContext();
         this._notify('onBeginEdit');
         this._toggleEditState(true);
         this._updateSlider();
         context.setValue(ContextRecordField, {});
      },

      endEdit: function(withSave) {
         var context = this._getContext();
         this._toggleEditState(false);
         this._notify('onEndEdit');
         if (withSave) {
            context.setValue(context.getValue(ContextRecordField));
         } else {
            //TODO: Тут нужно каким-то образом синхронизировать контекст, т.к. в контролах мы значения поменяли, а в контексте нет.
            //Нужно чтобы значения из контекста попали в контролы. Другого способа пока что не нашёл.
            context.setValue('controls-Header__updateContextValue', new Date().getTime());
         }
      },

      _toggleEditState: function(isEdit) {
         this._getContext()[isEdit ? 'subscribe' : 'unsubscribe']('onFieldNameResolution', this._contextFieldNameResolution);
         this._container.toggleClass('controls-Header__editing', isEdit);
         this._isEdit = isEdit;
      },

      _contextFieldNameResolution: function (event, fieldName, isSet) {
         var path = fieldName.split(cContext.STRUCTURE_SEPARATOR);

         if (path[0] !== ContextRecordField && (isSet || this.getValue(ContextRecordField).hasOwnProperty(fieldName))) {
            event.setResult(ContextRecordField + cContext.STRUCTURE_SEPARATOR + fieldName);
         }
      },

      //TODO: придрот связанный с тем, что биндинги смотрят на контекст вверх, а на собственный не смотрят.
      //Редактирование работает следующим образом: при начале редактирования на контекст добавляется подписка на
      //событие onFieldNameResolution, и все изменённые значения записываются в отдельный объект, при завершении
      //редактирования, все значения из этого объекта либо сливаются в главный контекст(завершили с сохранением),
      //либо удаляются (завершили без сохранения). Но если onFieldNameResolution вешать на свой контекст, то
      //значения в наш временный объект не запишутся, и сразу попадут в главнй контекст.
      _getContext: function() {
         return this.getContext().getPrevious();
      },

      isEdit: function() {
         return this._isEdit;
      },

      setOpacity: function(opacity) {
         this._options.opacity = opacity;
         $('.controls-Header__overlay', this._container).css('opacity', opacity);
         this._updateSlider();
         this._notifyOnPropertyChanged('opacity');
      },

      getOpacity: function() {
         return this._options.opacity;
      },

      setImage: function(src) {
         this._options.image = src;
         $('.controls-Header__image', this._container).attr('src', src).toggleClass('ws-hidden', !src);
         this._computeTheme(src);
         this._notifyOnPropertyChanged('image');
      },

      getImage: function() {
         return this._options.image;
      },

      setLogo: function(src) {
         this._options.logo = src;
         $('.controls-Header__logo', this._container).attr('src', src);
         this._container.toggleClass('controls-Header__withoutLogo', !src);
         this._notifyOnPropertyChanged('logo');
      },

      getLogo: function() {
         return this._options.logo;
      },

      setAllowEdit: function(allow) {
         this._options.allowEdit = allow;
         this._editButton.toggle(allow);
      },

      getAllowEdit: function() {
         return this._options.allowEdit;
      },

      setTheme: function(theme) {
         this._container.removeClass(Object.values(HeaderThemes).join(' ')).addClass(theme);
         this._options.theme = theme;
         this._notifyOnPropertyChanged('theme');
      },

      getTheme: function() {
         return this._options.theme;
      },

      _updateSlider: function() {
         var opacity = this._options.theme === this._options.darkTheme ? 1 + this._options.opacity : 1 - this._options.opacity;
         this._slider.setEndValue(opacity);
      },

      _onChangeOpacity: function(e, startValue, endValue) {
         var opacity = endValue > 1 ? endValue - 1 : 1 - endValue;
         this.setOpacity(Number(opacity.toFixed(1)));
         if (this._options.theme !== HeaderThemes.WITHOUT_THEME) {
            this.setTheme(endValue < 1 ? this._options.lightTheme : this._options.darkTheme);
         }
      },

      _computeTheme: function(src) {
         var self = this;
         if (src) {
            this._getAverageRGB(src).addCallback(function (rgb) {
               var isBlack = ((rgb[0] + rgb[1] + rgb[2]) / 3) < 127;
               self.setTheme(isBlack ? self._options.darkTheme : self._options.lightTheme);
               self.setOpacity(DefaultOpacity);
            }).addErrback(function() {
               self.setTheme(HeaderThemes.WITHOUT_THEME);
            });
         } else {
            this.setTheme(HeaderThemes.WITHOUT_THEME);
         }
      },

      _getAverageRGB: function(src) {
         var
             bitMap, length,
             r = 0, g = 0, b = 0,
             img = new Image(),
             canvas = $('<canvas>')[0],
             ctx = canvas.getContext("2d"),
             result = new $ws.proto.Deferred();

         img.onload = function() {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            bitMap = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
            length = bitMap.length;
            for (var i = 0; i < length; i+=4) {
               r += bitMap[i];
               g += bitMap[i + 1];
               b += bitMap[i + 2];
            }
            result.callback([Math.round(r / (length / 4)), Math.round(g / (length / 4)), Math.round(b / (length / 4))]);
         };
         img.onerror = function() {
            result.errback();
         };
         img.src = src;
         return result;
      }

   });

   Header.Themes = HeaderThemes;
   return Header;
});
