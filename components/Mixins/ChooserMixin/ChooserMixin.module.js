/**
 * Created by am.gerasimov on 21.01.2016.
 */
define('js!SBIS3.CONTROLS.ChooserMixin', [
   'js!SBIS3.CONTROLS.Data.Model',
   'js!SBIS3.CONTROLS.Data.Adapter.Sbis'
], function(Model, SbisAdapter) {
   /**
    * Миксин, добавляющий интерфейс для открытия окна выбора.
    * @mixin SBIS3.CONTROLS.ChooserMixin
    * @public
    * @author Крайнов Дмитрий Олегович
    */

   function recordConverter(rec) {
      return new Model({
         data: rec.toJSON(),
         adapter: new SbisAdapter(),
         idProperty: this._options.keyField
      })
   }

   var ChooserMixin = /**@lends SBIS3.CONTROLS.ChooserMixin.prototype  */{
          /**
           * @event onChooserClick При клике на кнопку открытия диалога выбора
           * @return {$ws.proto.Deferred|Boolean|*} Возможные значения:
           * <ol>
           *    <li>$ws.proto.Deferred - Деферед, результатом выполнения которого будут выбранные записи.</li>
           *    <li>Если вернуть false - диалог выбора открыт не будет.</li>
           *    <li>Любой другой результат - диалог выбора будет открыт стандартным образом.</li>
           * </ol>
           * @param {$ws.proto.EventObject} eventObject Дескриптор события.
           */
      $protected: {
         _options: {
            /**
             * @cfg {Boolean} Поддерживать старые представления данных
             * Данная опция требуется, если на диалоге выбора лежит старое представление данных.
             */
            oldViews: false,
            /**
             * @cfg {String} Режим выбора записей. В новом диалоге или во всплывающей панели
             * <wiTag group="Управление">
             * @variant dialog в новом диалоге
             * @variant floatArea во всплывающей панели
             */
            chooserMode: 'floatArea'
         },
         _chooserConfig: {
            config: {
               isStack: true,
               autoHide: true,
               autoCloseOnHide: true,
               overlay: true,
               showDelay: 300
            },
            type: {
               old: {
                  dialog: 'js!SBIS3.CORE.DialogSelector',
                  floatArea: 'js!SBIS3.CORE.FloatAreaSelector'
               },
               newType: {
                  dialog: 'js!SBIS3.CONTROLS.DialogSelector',
                  floatArea: 'js!SBIS3.CONTROLS.FloatAreaSelector'
               }
            }
         }
      },

      $constructor: function() {
         this._publish('onChooserClick');
      },

      /**
       * Показывает диалог выбора
       * @param {String} template имя шаблона в виде 'js!SBIS3.CONTROLS.MyTemplate'
       * @param {Object} componentOptions опции которые прокинутся в компонент выбора
       * @param {object} config Конфигурация диалога выбора
       */
      _showChooser: function(template, componentOptions, config) {
         var self = this,
             version = this._options.oldViews ? 'old' : 'newType',
             selectorConfig, commonConfig, clickResult;

         /* Обработка выбора из справочника со старым представлением данных */
         function oldConfirmSelectionCallback(event, result) {
            self._chooseCallback($ws.helpers.reduce(result, function(res, elem) {
               if(elem !== null) {
                  res.push(recordConverter.call(self, elem));
                  return res;
               }
            }), []);
            /* Если обрабатываем результат deferred'a то в функции нету контекста, проверим на это */
            if(this && this.close) {
               this.close();
            }
         }

         clickResult = this._notify('onChooserClick');

         if(clickResult === false) {
            return;
         } else if(clickResult instanceof $ws.proto.Deferred) {
            clickResult.addCallback(function(result) {
               self._options.oldViews ?
                   oldConfirmSelectionCallback(null, result) :
                   self._chooseCallback(result);
               return result
            });
            return;
         }
         selectorConfig = {
            old: {
               handlers: {
                  onChange: oldConfirmSelectionCallback
               }
            },
            newType: {
               closeCallback: self._chooseCallback.bind(self)
            }
         };

         commonConfig = $ws.core.merge({
            template: template,
            componentOptions: componentOptions || {},
            opener: this,
            parent: this._options.chooserMode === 'dialog' ? this : null,
            context: new $ws.proto.Context().setPrevious(this.getLinkedContext()),
            target: this.getContainer()
         }, config || {});



         requirejs([this._chooserConfig.type[version][this._options.chooserMode]], function(ctrl) {
            new ctrl($ws.core.merge($ws.core.clone(self._chooserConfig.config), $ws.core.merge(selectorConfig[version], commonConfig)));
         });
      },

      _chooseCallback : function() {
         /*Method must be implemented*/
      }
   };

   return ChooserMixin;

});