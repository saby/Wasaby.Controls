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
      var idProp;

      if(rec.hasColumn(this._options.keyField)) {
         idProp = this._options.keyField;
      }

      return new Model({
         data: rec.toJSON(),
         adapter: new SbisAdapter(),
         idProperty: idProp ? idProp : rec.getKeyField()
      })
   }

   var ChooserMixin = /**@lends SBIS3.CONTROLS.ChooserMixin.prototype  */{
          /**
           * @event onChooserClick Происходит при клике на кнопку открытия диалога выбора.
           * @return {$ws.proto.Deferred|Boolean|*} Возможные значения:
           * <ol>
           *    <li>$ws.proto.Deferred - {@link $ws.proto.Deferred Деферед}, результатом выполнения которого будут выбранные записи.</li>
           *    <li>Если вернуть false - диалог выбора открыт не будет.</li>
           *    <li>Любой другой результат - диалог выбора будет открыт стандартным образом.</li>
           * </ol>
           * @param {$ws.proto.EventObject} eventObject Дескриптор события.
           */
      $protected: {
         _options: {
            /**
             * @cfg {Boolean} Устанавливает поддержку представлений данных из пространства имен {@link https://wi.sbis.ru/docs/3-8-0/$ws/proto/ SBIS3.CORE}.
             * Данная опция требуется, если в диалоге выбора для отображения данных используются контролы {@link https://wi.sbis.ru/docs/3-8-0/$ws/proto/TableView/ TableView},
             * {@link https://wi.sbis.ru/docs/3-8-0/$ws/proto/TreeView/ TreeView}, {@link https://wi.sbis.ru/docs/3-8-0/$ws/proto/HierarchyView/ HierarchyView}.
             * @example
             * <pre class="brush: xml">
             *     <option name="oldViews">true</option>
             * </pre>
             */
            oldViews: false,
            /**
             * @cfg {String} Устанавливает режим отображения диалога выбора элементов коллекции.
             * * dialog Справочник отображается в новом диалоговом окне.
             * * floatArea Справочник отображается во всплывающей панели.
             * @remark
             * Окно выбора будет отображаться в новом диалоге или на всплывающей панели.
             * Подробно про диалог выбора элементов коллекции можно прочесть {@link dictionaries здесь}.
             * @example
             * Устанавливаем режим отображения {@link dictionaries справочника} для поля связи
             * в новом диалоговом окне:
             * ![](/ChooserMixin01.png)
             * фрагмент верстки:
             * <pre class="brush: xml">
             *     <option name="chooserMode">dialog</option>
             * </pre>
             * @see dictionaries
             */
            chooserMode: 'floatArea'
         },
         _chooserConfig: {
            config: {
               isStack: true,
               autoHide: true,
               autoCloseOnHide: true,
               overlay: true
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
       */
      _showChooser: function(template, componentOptions) {
         var self = this,
             config = this._getAdditionalChooserConfig(),
             version = this._options.oldViews ? 'old' : 'newType',
             selectorConfig, commonConfig, clickResult;

         /* Обработка выбора из справочника со старым представлением данных */
         function oldConfirmSelectionCallback(event, result) {
            self._chooseCallback($ws.helpers.reduce(result, function(res, elem) {
               if(elem !== null) {
                  res.push(recordConverter.call(self, elem));
                  return res;
               }
            }, []));
            /* Если обрабатываем результат deferred'a то в функции нету контекста, проверим на это */
            if(this && this !== window && this.close) {
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

      _getAdditionalChooserConfig: function () {
         return {};
      },

      _chooseCallback : function() {
         /*Method must be implemented*/
      }
   };

   return ChooserMixin;

});