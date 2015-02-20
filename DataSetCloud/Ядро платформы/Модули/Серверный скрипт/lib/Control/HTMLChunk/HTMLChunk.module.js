/**
 * Модуль "Компонент кусок HTML".
 *
 * @description
 */
define("js!SBIS3.CORE.HTMLChunk", ["js!SBIS3.CORE.Control", "html!SBIS3.CORE.HTMLChunk"], function( Control, dotTplFn ) {

   "use strict";

   /**
    * Кусок-HTML
    * Отображает HTML-текст в заданном контейнере
    *
    * @class $ws.proto.HTMLChunk
    * @extends $ws.proto.Control
    * @control
    * @category Decorate
    * @initial
    * <component data-component='SBIS3.CORE.HTMLChunk' style='width: 100px'>
    *    <option name='text'><b>HTML</b>Chunk</option>
    * </component>
    * @cfgOld {String} text HTML-текст для отображения
    */
   $ws.proto.HTMLChunk = Control.Control.extend(/** @lends $ws.proto.HTMLChunk */{
      $protected: {
         _options : {
            cssClassName: 'ws-html-chunk',
            cssClass: 'ws-html-chunk',
            text: null
         }
      },
      $constructor: function() {},
      _dotTplFn: dotTplFn,
      /**
       * Переопределённый вариант ловли фокуса. Фокус куску хтмл не нужен
       * @private
       */
      _initFocusCatch: function() {},
      canAcceptFocus: function() {
         // HTMLChunk НЕ принимает фокус
         return false;
      },

      /**
       * Зависит ли высота контрола от его ширины. Эта функция нужна для оптимизации расчётов старой сетки и ей подобных контролов -
       * чтобы знать, когда вызывать дополнительный пересчёт своего ресайзера, а когда нет. У HTMLChunk высота в общем случае зависит от ширины, поэтому возвращаем true,
       * чтоб не было ошибок в расчёте старой сетки.
       * @returns {boolean}
       * @private
       */
      _isHeightDependentOnWidth: function() {
         return true;
      },

      /**
       * Отдаёт содержимое в виде html. Эквивалентно вызову getContainer().html()
       * @return {String}
       */
      getContent: function() {
         return this._container.html();
      },

      /**
       * Устанавливает содержимое (или его часть по селектору в формате jquery).
       * Эта функция должна использоваться вместо непосредственного редактирования содержимого контейнера (результата функции getContainer),
       * поскольку она делает все необходимые оповещения после изменений.
       * @param {String|jQuery|Element} content Новое содержимое - в виде html-строки, или jquery-объекта, или dom-объекта
       * @param {String} [selector] Селектор в формате jquery, указывающий, содержимое какого под-узла будет установлено.
       * Если селектор не указан, то будет заменено всё содержимое контейнера. Если по селектору выдаётся несколько элементов, то заменено содержимое каждого.
       */
      setContent: function(content, selector) {
         var element = selector ? this._container.find(selector) : this._container;
         element.empty().append(content);
         // TODO потом вставить проверку, стоит ли у контрола авторазмер.
         this._notifyOnSizeChanged(this, this);
      },

      /**
       * Загружает содержимое по URL и устанавливает через метод setContent
       * @param {String} url URL из которого загружать содержимое
       * @returns {$ws.proto.Deferred} результат загрузки
       */
      loadContent: function(url) {
         var self = this;
         if(!url)
            throw new Error("HTMLChunk.loadContent: URL должен быть задан");
         return $ws.single.ioc.resolve('ITransport', {
            url: url
         }).execute().addCallback(function(data){
               self.setContent(data);
               return data;
            });
      },

      /**
       * Этот метод вызывает пересчёт авторазмеров при ручном изменении содержимого чанка.
       * Обычно содержимое чанка задаётся через метод setContent и редактируется через метод editContent, которые сами вызывают
       * пересчёт авторазмеров, но могут быть редкие случаи, когда какая-то часть чанка прячется или показывается по какому-то событию,
       * по таймауту, или каким-то сторонним скриптом.
       * Поскольку изменения при этом происходят в html-dom чанка, его родительские контролы не могут автоматически узнать о том, что им нужно
       * пересчитать свои размеры под изменившийся размер дочерних контролов.
       * В таких редких случаях и нужно после окончания изменения в html-dom чанка вызывать у него recalcOnDOMChange.
       * В большинстве же случаев для работы с содержимым чанка рекомендуется пользоваться методами setContent/editContent
       */
      recalcOnDOMChange: function() {
         this._notifyOnSizeChanged(this, this);
      },

      /**
       * Функция, оборачивающая процесс сложного редактирования содержимого компонента HTMLChunk.
       * Она должна использоваться вместо непосредственного редактирования содержимого контейнера (результата функции getContainer),
       * поскольку она делает все необходимые оповещения после изменений.
       * @param {Function} editCallback Функция, получающая dom-содержимое компонента (результат вызова getContainer), и изменяющая его.
       * Если функция не делала никаких изменений в содержимом компонента, она должна вернуть false - это позволит компоненту не вызывать
       * оповещений и пересчётов у родительских компонентов. Если функция не вернёт никакого результата или вернёт не false, то считается, что она меняла содержимое, и нужно делать все пересчёты.
       * Если у компонента не инициализирован DOM, то editCallback не вызывается.
       */
      editContent:function (editCallback) {
         var updated = false;
         try {
            if (this._isCorrectContainer())
               updated = editCallback(this.getContainer());
         }
         finally {
            if (updated !== false)
               this._notifyOnSizeChanged(this, this);
         }
      },

      destroy: function() {
         this._container.children().remove();
         $ws.proto.HTMLChunk.superclass.destroy.apply(this, arguments);
      }
   });

   return $ws.proto.HTMLChunk;

});