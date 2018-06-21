define('Controls/Popup/Opener/InfoBox',
   [
      'Core/core-merge',
      'Core/core-clone',
      'Controls/Popup/Opener/BaseOpener'
   ],
   function(cMerge, cClone, Base) {
      'use strict';

      /**
       * Класс открытия всплывающей подсказки с расширенными возможностями
       * @class Controls/Popup/Opener/InfoBox
       * @extends Core/Control
       * @control
       * @public
       * @category Popup
       * @author Степин Павел Владимирович
       * @demo Controls-demo/InfoBox/InfoBox
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

      //Конфигурация инфобокса по умолчанию
      var DEFAULT_CONFIG = {
         position: 'tl',
         style: 'default',
         float: false
      };

      var InfoBox = Base.extend({

         /**
          * Открыть инфобокс
          * @function Controls/Popup/Opener/InfoBox#open
          * @param {InfoBoxCfg} cfg Объект с настройками инфобокса
          */
         open: function(cfg) {
            //todo Есть проблема с обновлением в инфобоксе. В update прилетает новый конфиг, но в dom находится
            //еще старая версия подсказки => нельзя получить актуальные размеры, чтобы правильно спозиционироваться.
            if (this.isOpened()) { // Инфобокс всегда один
               this.close();
            }

            cfg = cMerge(cClone(DEFAULT_CONFIG), cfg);
            InfoBox.superclass.open.call(this, {
               target: cfg.target,
               position: cfg.position,
               templateOptions: { // Опции, которые будут переданы в наш шаблон Opener/InfoBox/resources/template
                  template: cfg.template,
                  templateOptions: cfg.templateOptions, // Опции, которые будут переданы в прикладной cfg.template (выполняется построение внутри нашего шаблона)
                  message: cfg.message,
                  float: cfg.float
               },
               className: 'controls-InfoBox__popup controls-InfoBox-style-' + cfg.style,
               template: 'tmpl!Controls/Popup/Opener/InfoBox/resources/template'
            }, 'Controls/Popup/Opener/InfoBox/InfoBoxController');
         }

      });

      InfoBox.getDefaultOptions = function() {
         return {
            closeOnTargetScroll: true
         };
      };

      return InfoBox;
   }
);
