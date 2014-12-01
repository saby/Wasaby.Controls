/**
 * Created by iv.cheremushkin on 21.08.2014.
 */

define('js!SBIS3.CONTROLS.CompoundControl', ['js!SBIS3.CORE.CompoundControl'], function(Control) {

   'use strict';

   /**
    * базовый класс для всех контролов. Включает в себя объединенные старые классы Control и CompoundControl.
    * Объединение помогает однозначно понимать от какого класса должны наследоваться все остальные контролы.
    * @class SBIS3.CONTROLS.CompoundControl
    * @extends $ws.proto.Control
    */

   return Control.extend( /** @lends SBIS3.CONTROLS.Control.prototype */{
      _options : {
         /**
          * @cfg {$ws.proto.Context} Контекст
          * <wiTag group="Данные">
          * Свой собственный контекст данной области.
          * Если не передан, создастся новый из предыдущего (родительского) контекста.
          * Если нет родителя (не передали) - создается из Глобального.
          * @see independentContext
          * @noShow
          */
         /**
          * @cfg {Boolean} Независимый контекст
          * Возможность установить для данной области независимый контекст.
          * ВНИМАНИЕ! Может испортить контекст, переданный в опции {@link context} и {@link $ws.proto.Control#linkedContext},
          * поменяв предка контексту! Передавайте данные объектом.
          * Будет создан новый контекст, зависимый от глобального. Т.е. контролы смогут обмениваться информацией с
          * внешнм миром, если в глобальном контексте присутствует устанавливаемое локально значение.
          * @noShow
          */
         independentContext: false,
         /**
          * @cfg {String} Текст всплывающей подсказки
          * Текст вспылающей подсказки можно изменить методом {@link setTooltip}.
          * <wiTag group="Отображение">
          *
          * Пример:
          * <pre>
          *      control.setTooltip('Текст всплывающей подсказки');
          * </pre>
          * @translatable
          * @noShow
          */
         tooltip: '',
         /**
          * @cfg {String|Boolean} Текст расширенной подсказки, отображаемой во всплывающей панельке (Infobox)
          * <wiTag group="Отображение">
          * <wiTag class="GroupCheckBox" noShow>
          * Задается либо текст подсказки, либо "true". Во втором случае соджержимое подсказки можно задать с помощью события {@link onTooltipContentRequest}
          * @noShow
          */
         extendedTooltip: false
      },
      $constructor : function(){
         this._container.removeClass('ws-area');
      }
   });

});
