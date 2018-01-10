/**
 * Created by cheremushkin iv on 19.01.2015.
 */
define('SBIS3.CONTROLS/Mixins/IconMixin', ['tmpl!SBIS3.CONTROLS/Mixins/IconMixin/IconTemplate'], function(IconTemplate) {

   /**
    * Миксин, добавляющий иконку
    * @mixin SBIS3.CONTROLS/Mixins/IconMixin
    * @public
    * @author Крайнов Д.О.
    */

   var IconMixin = /**@lends SBIS3.CONTROLS/Mixins/IconMixin.prototype  */{
      $protected: {
         _iconTemplate: IconTemplate,
         _options: {

            /**
             * @cfg {String}  Путь до иконки
             * Путь задаётся относительно корня сайта либо через sprite.
             * @example
             * <pre>
             *     <option name="icon">sprite:icon-16 icon-Arrow1730 icon-primary</option>
             * </pre>
             * @see setIcon
             * @see getIcon
             * @editor ImageEditor
             */
            icon: ''
         }
      },

      after : {
         _modifyOptions: function (opts) {
            if (opts.icon) opts._iconClass = IconTemplate(opts);
            return opts;
         }
      },

      $constructor: function() {

      },

      /**
       * Установить изображение на кнопке.
       * Метод установки или замены изображения, заданного опцией {@link icon}.
       * @param {String} iconPath Путь к изображению.
       * @example
       * <pre>
       *     var btn = this.getChildControlByName("myButton");
       *        btn.setIcon("sprite:icon-16 icon-Successful icon-primary")
       * </pre>
       * @see icon
       * @see getIcon
       */
      setIcon: function(icon) {
         icon = typeof icon === "undefined" ? icon = "" : icon;
         this._options.icon = icon;
         this._options._iconClass = this._iconTemplate(this._options);
         this._drawIcon(icon);
         this._notifyOnPropertyChanged('icon');
      },
      /**
       * Получить изображение на кнопке.
       * Метод получения изображения, заданного опцией {@link icon}, либо методом {@link setIcon}.
       * @example
       * <pre>
       *     var btn = this.getChildControlByName("myButton");
       *     if (/icon-Alert/g.test(btn.getIcon())){
       *        btn.setIcon("sprite:icon16 icon-Alert icon-done");
       *     }
       * </pre>
       * @see icon
       * @see setIcon
       */
      getIcon: function() {
         return this._options.icon;
      },
      _drawIcon: function(icon) {

      }
   };

   return IconMixin;

});