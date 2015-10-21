/**
 * Created by iv.cheremushkin on 21.08.2014.
 */

define('js!SBIS3.CONTROLS.CompoundControl', ['js!SBIS3.CORE.CompoundControl'], function(Control) {

   'use strict';

   /**
    * Базовый класс для всех контролов. Включает в себя объединенные старые классы Control и CompoundControl.
    * Объединение помогает однозначно понимать от какого класса должны наследоваться все остальные контролы.
    * @class SBIS3.CONTROLS.CompoundControl
    * @author Крайнов Дмитрий Олегович
    * @extends $ws.proto.Control
    */

   return Control.extend( /** @lends SBIS3.CONTROLS.CompoundControl.prototype */{
      $protected: {
         _options : {
            /**
             * @cfg {$ws.proto.Context} Контекст
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
             * Задается либо текст подсказки, либо "true". Во втором случае соджержимое подсказки можно задать с помощью события {@link onTooltipContentRequest}
             * @noShow
             */
            extendedTooltip: false
         }
      },
      $constructor : function(){
         this._container.removeClass('ws-area');
      }
   });

});
