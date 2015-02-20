/**
 * Модуль "Компонент SimpleDialogAbstract".
 *
 * @description
 */
define('js!SBIS3.CORE.SimpleDialogAbstract',
   ['js!SBIS3.CORE.Window'],
   function( Window ) {

   "use strict";

   /**
    * @class $ws.proto.SimpleDialogAbstract
    * @extends $ws.proto.Window
    */
   $ws.proto.SimpleDialogAbstract = Window.extend(/** @lends $ws.proto.SimpleDialogAbstract.prototype */{
      $protected : {
         _options : {
            autoWidth: true,
            autoHeight: true,
            modal: true,
            /**
             * @cfg {String} Отображаемое сообщение
             * <wiTag group="Данные">
             * Текст выводится крупным шрифтом.
             * @translatable
             * @see detail
             * @see html
             */
            message : "",
            border: false,
            resizable: false,
             /**
              * @cfg {String} Детали сообщения
              * <wiTag group="Данные">
              * Отрисовывается под текстом сообщения.
              * Текст выводится меньшим шрифтом относительно текста сообщения.
              * @see message
              * @see html
              */
            detail : "",
            /**
             * @typedef {Object} Button
             * @property {Number} tabindex
             * @property {Number} name
             * @property {Number} width
             * @property {String} height
             * @property {Boolean} caption
             * @property {Object} renderStyle
             * @property {Object} handlers
             */
            /**
             * @cfg {Array} Массив конфигураций кнопок
             * <wiTag group="Данные">
             * Массив конфигов для каждой отдельной кнопки диалогового окна.
             * В описании каждой кнопки могут быть следующие параметры:
             * <ol>
             *    <li>tabindex - номер при обходе клавишей Tab;</li>
             *    <li>name - имя;</li>
             *    <li>width - ширина, по умолчанию 100%;</li>
             *    <li>height - высота, по умолчанию 100%;</li>
             *    <li>renderStyle - вид кнопки: "classic" или "asLink" (в виде ссылки);</li>
             *    <li>caption - текст на кнопке, по умолчанию "OK";</li>
             *    <li>handlers - список команд для кнопки, только onActivated;</li>
             * </ol>
             * @see message
             * @see detail
             * @see html
             */
            buttons : [],
             /**
              * @cfg {String} Текст html-вёрстки диалогового окна
              * <wiTag group="Отображение">
              * При задании этой опции не будут выведены тексты сообщений, установленных опциями {@link message} и {@link detail}.
              * @see message
              * @see detail
              * @see buttons
              */
            html : "",
            isRelativeTemplate: true
         },
         _keysWeHandle : [
            $ws._const.key.esc,
            $ws._const.key.tab,
            $ws._const.key.enter,
            $ws._const.key.left,
            $ws._const.key.right
         ],
         _isModal: true,
         _zIndex: 0
      },
      $constructor : function(){
         var self  = this;

         this._window.addClass("ws-smp-dlg");
         this._windowContent.addClass("ws-smp-dlg-content");
         this._window.find('.ws-window-titlebar').remove();
         // Вставляем логику в onAfterLoad, так как иначе EmptyTemplate чистит наш контейнер
         // ToDo: переделать на пользовательский контрол с последующим вызовом его в окне. 
         this.subscribe('onAfterLoad', function(){
            this._container.prepend(
               $([
                  "<div class='ws-smp-dlg-wrapper'>",
                  "<div class='ws-smp-dlg-brd ws-smp-dlg-top'></div>",
                  "<h2 class='ws-smp-header'></h2>",
                  "<p class='ws-smp-message'></p>",
                  "<div class='ws-smp-dlg-html'></div>",
                  "<div class='ws-smp-dlg-btns'>",
                  "</div>",
                  "</div>"
               ].join(""))
            );

            this.show();

            if (this._options.html !== "") {
               this.setHtml();
            }
            else {
               this.setMessage();
            }

            this._addButtons().addCallback(function(){
               self.setActive(true);
            });

            this._window.bind("click", function(e){ //если есть выделение то предполагаем, что пользователь хочет выделить текст,
               if ($ws.helpers.getTextSelection())        //поэтому не даем событию всплыть и фокус не перекинется на какой-нитьбудь контрол
                  e.stopImmediatePropagation();
            });
         });
      },
      init: function() {
         $ws.proto.SimpleDialogAbstract.superclass.init.apply(this, arguments);
      },
      /**
       * Меняет текст и заголовок сообщения
       * @param {String} [m] текст сообщения
       * @param {String} [t] текст заголовка сообщения
       */
      setMessage : function(m, t){
         this._options.message = m ? $ws.helpers.escapeTagsFromStr(m, ['script']) : this._options.message;
         this._options.detail = t ? $ws.helpers.escapeTagsFromStr(t, ['script']) : this._options.detail;

         this.clear();
         this._window.find("h2").show().html($ws.helpers.escapeTagsFromStr(this._options.message, ['script']));
         if(this._options.detail){
            this._window.find("p").show().html($ws.helpers.escapeTagsFromStr(this._options.detail, ['script']));
         }
         else{
            this._window.find("p").hide();
         }
         this._resizeBox();
         this._reviewWhiteSpace();
      },
      /**
       * @param {String} [html]
       */
      setHtml : function(html){
         this._options.hmtl = html ? html : this._options.html;

         this.clear();
         this._window.find(".ws-smp-dlg-html").html($ws.helpers.escapeTagsFromStr(this._options.hmtl, ['script'])).show();
         this._resizeBox();
      },
      clear : function(){
         this._window.find(".ws-smp-dlg-html").empty().hide();
         this._window.find("h2").empty().hide();
         this._window.find("p").empty().hide();
      },
      show : function(){
         //this._container.css("z-index", this._zIndex);
         $ws.proto.SimpleDialogAbstract.superclass.show.apply(this, arguments);
      },
      /**
       * Проверяем влез ли текст по ширине (в случае строки без пробелов),
       * если не влез, вставляем </br> через равные промежутки символов
       */
      _reviewWhiteSpace : function(){
         var
            anyChanges = false,
            wrapper = this._window.find('.ws-smp-dlg-wrapper'),
            p = wrapper.find("p"),
            oldInnerW = p.width();

         //true wrap text
         p.css("float", "left");
         if (wrapper.width() < p.outerWidth()){
            var
               str = p.html(),
               r = p.width() / oldInnerW,
               cuts = [],
               pos,
               chars = parseInt(str.length / r, 10);
            for (var i = 0; i < r; i++){
               pos = chars * (i + 1);
               cuts[0] = str.substring(0, pos);
               cuts[1] = str.substr(pos + 1);
               str = cuts.join("<br/>");
            }
            p.html(str);
            anyChanges = true;
         }
         //revert
         p.css("float", "none");
         if (anyChanges)
            this._resizeBox();
      },
      /**
       * Ресайзит окно
       */
      _resizeBox : function(){
         this._adjustWindowPosition();

         var
            wrapper = this._window.find('.ws-smp-dlg-wrapper').addClass("ws-smp-dlg-wrapper-in-resize"),
            scrollWidth = wrapper.get(0).scrollWidth,
            scrollHeight = wrapper.get(0).scrollHeight,
            s = scrollWidth * scrollHeight,
            newW = Math.sqrt(s/0.75),
            newSize,
            newH;

         this._windowContent.width(newW);
         if (scrollWidth == wrapper.get(0).scrollWidth){
            newW = scrollWidth;
            this._windowContent.width(newW);
         }
         newH = wrapper.outerHeight();
         this._windowContent.height(newH);

         newSize = {
            'height': newH,
            'width' : newW
         };
         this._windowContent.css(newSize);
         this._container.css(newSize);
         wrapper.removeClass("ws-smp-dlg-wrapper-in-resize");
         this.moveWindowToCenter();
      },
      _addButtons : function(){
         var
            self = this,
            btnCfg = this._options.buttons,
            btnCont = this._window.find(".ws-smp-dlg-btns"),
            pd = new $ws.proto.ParallelDeferred();

         if (btnCfg.length){
            btnCont.show();
            for (var i = 0, l = btnCfg.length; i < l; i++){
               btnCont.append(btnCfg[i].element = $("<span class='ws-smp-dlg-button' sbisname='"+ btnCfg[i].name +"'></span>"));
               if (btnCfg[i].width.indexOf("px") !== -1)
                  btnCfg[i].element.width(parseInt(btnCfg[i].width, 10));
               btnCfg[i].parent = self;
               pd.push($ws.core.attachInstance("Control/Button", btnCfg[i]));
            }
         }
         else{
            btnCont.hide();
         }

         return pd.done().getResult();
      },
      /**
       * Обработка клавиатурных нажатий
       * @param {Event} e
       * @return {Boolean} результат работы метода
       */
      _keyboardHover: function(e){
         if(e.which in this._keysWeHandle){
            if(e.which == $ws._const.key.esc){
               this.close();
               return false;
            }
            if(e.which == $ws._const.key.left || e.which == $ws._const.key.right){
               this._switchingBetweenButtons(e);
               return false;
            }
            return $ws.proto.SimpleDialogAbstract.superclass._keyboardHover.apply(this, arguments);
         }
         return true;
      },
      /**
       * Переключение между кнопками диалога при помощи клавиш клавиатуры
       * @param {Event} event
       */
      _switchingBetweenButtons: function(event){
         var btns = this._options.buttons,
             indexOfActiveBtn = 0,
             btnsLength = btns.length,
             newIndex;

         for(var i=0;i<btnsLength;i++){
            if(btns[i].element.wsControl().isActive()){
               indexOfActiveBtn = i;
               break;
            }
         }

         if(event.which == $ws._const.key.left){
            newIndex = indexOfActiveBtn-1;
         }
         if(event.which == $ws._const.key.right){
            newIndex = indexOfActiveBtn+1;
         }

         //будем переходить по кругу
         newIndex = (btnsLength+newIndex)%btnsLength;

         if(btns[newIndex]){
            btns[indexOfActiveBtn].element.wsControl().setActive(false);
            btns[newIndex].element.wsControl().setActive(true);
         }
      }
   });

   return $ws.proto.SimpleDialogAbstract;
});
