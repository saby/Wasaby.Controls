define('Controls/Popup/Opener/InfoBox',
   [
      'Core/core-merge',
      'Core/core-clone',
      'Controls/Popup/Opener/BaseOpener'
   ],
   function(cMerge, cClone, Base) {
      'use strict';

      /**
       * Класс открытия всплывающей подсказки с расширенными возможностями.
       * 
       * <a href="https://test-wi.sbis.ru/materials/demo-ws4-infobox">Демо-пример</a>.
       * <u>Внимание</u>: временно демо-пример размещён на test-wi.sbis.ru.
       * Для авторизации воспользуйтесь связкой логин/пароль как "Демо_тензор"/"Демо123".
       * 
       * @class Controls/Popup/Opener/InfoBox
       * @extends Core/Control
       * @control
       * @public
       * @category Popup
       * @author Степин Павел Владимирович
       */

      /**
       * @typedef {Object} InfoBoxCfg
       * @property {String} message Сообщение, отображаемое в инфобоксе
       * @property {Style} style Горизонтальное выравнивание инфобокса
       * @property {Boolean} float Должно ли содержимое обтекать крестик закрытия
       * @property {Object} target Таргет, относительно которого неообходимо показать инфобокс
       * @property {Position} position Точка позиционировая инфобокса относительно таргета
       * @property {Function} template Шаблон отображения внутреннего содержимого
       * @property {Object} templateOptions Шаблон отображения внутреннего содержимого
       */

      /**
       * @typedef {String} Style
       * @variant default
       * @variant lite
       * @variant help
       * @variant error
       */

      /**
       * @typedef {String} Position
       * @variant tl Всплывающее окно отображается сверху относительно точки построения, выравнивается по левому краю
       * @variant tc Всплывающее окно отображается сверху относительно точки построения, выравнивается по центру
       * @variant tr Всплывающее окно отображается сверху относительно точки построения, выравнивается по правому краю
       * @variant bl Всплывающее окно отображается снизу относительно точки построения, выравнивается по левому краю
       * @variant bc Всплывающее окно отображается снизу относительно точки построения, выравнивается по центру
       * @variant br Всплывающее окно отображается снизу относительно точки построения, выравнивается по правому краю
       * @variant rt Всплывающее окно отображается справа относительно точки построения, выравнивается по верхнему краю
       * @variant rc Всплывающее окно отображается справа относительно точки построения, выравнивается по центру
       * @variant rb Всплывающее окно отображается справа относительно точки построения, выравнивается по нижнему краю
       * @variant lt Всплывающее окно отображается слева относительно точки построения, выравнивается по верхнему краю
       * @variant lc Всплывающее окно отображается слева относительно точки построения, выравнивается по центру
       * @variant lb Всплывающее окно отображается слева относительно точки построения, выравнивается по нижнему краю
       */
      var INFOBOX_HIDE_DELAY = 300;
      var INFOBOX_SHOW_DELAY = 300;

      // Конфигурация инфобокса по умолчанию
      var DEFAULT_CONFIG = {
         position: 'tl',
         style: 'default',
         float: false,
         hideDelay: INFOBOX_HIDE_DELAY,
         showDelay: INFOBOX_SHOW_DELAY
      };

      var InfoBox = Base.extend({
         _openId: null,
         _closeId: null,

         /**
          * Открыть инфобокс
          * @function Controls/Popup/Opener/InfoBox#open
          * @param {InfoBoxCfg} cfg Объект с настройками инфобокса
          */
         open: function(cfg) {
            // todo Есть проблема с обновлением в инфобоксе. В update прилетает новый конфиг, но в dom находится
            // еще старая версия подсказки => нельзя получить актуальные размеры, чтобы правильно спозиционироваться.
            if (this.isOpened()) { // Инфобокс всегда один
               this.close(0);
            }
            this._clearTimeout();
            cfg = cMerge(cClone(DEFAULT_CONFIG), cfg);

            // TODO код с задержкой дублируется в Popup/Infobox. По задаче нужно обобщить эти 2 компонента: https://online.sbis.ru/opendoc.html?guid=b8584cee-0310-4e71-a8fb-6c38e4306bb5
            if (cfg.showDelay > 0) {
               this._openId = setTimeout(this._open.bind(this, cfg), cfg.showDelay);
            } else {
               this._open(cfg);
            }
         },
         _open: function(cfg) {
            InfoBox.superclass.open.call(this, {
               target: cfg.target,
               position: cfg.position,
               autofocus: false,
               templateOptions: { // Опции, которые будут переданы в наш шаблон Opener/InfoBox/resources/template
                  template: cfg.template,
                  templateOptions: cfg.templateOptions, // Опции, которые будут переданы в прикладной cfg.template (выполняется построение внутри нашего шаблона)
                  message: cfg.message,
                  float: cfg.float
               },
               className: 'controls-InfoBox__popup controls-PreviewerController controls-InfoBox-style-' + cfg.style,
               template: 'tmpl!Controls/Popup/Opener/InfoBox/resources/template'
            }, 'Controls/Popup/Opener/InfoBox/InfoBoxController');
         },
         close: function(delay) {
            delay = delay === undefined ? INFOBOX_HIDE_DELAY : delay;
            this._clearTimeout();
            if (delay > 0) {
               this._closeId = setTimeout(InfoBox.superclass.close.bind(this), delay);
            } else {
               InfoBox.superclass.close.call(this);
            }
         },

         _closeOnTargetScroll: function() {
            this.close(0);
         },

         _clearTimeout: function() {
            clearTimeout(this._openId);
            clearTimeout(this._closeId);
         }
      });

      InfoBox.getDefaultOptions = function() {
         return {
            closeOnTargetScroll: true
         };
      };

      return InfoBox;
   });
