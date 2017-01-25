/**
 * Created by am.gerasimov on 21.01.2016.
 */
define('js!SBIS3.CONTROLS.ChooserMixin', [
   "Core/Context",
   "Core/core-functions",
   "Core/core-merge",
   "Core/Deferred",
   "js!WS.Data/Entity/Model",
   "js!WS.Data/Adapter/Sbis",
   "Core/helpers/collection-helpers"
], function( cContext, cFunctions, cMerge, Deferred,Model, SbisAdapter, colHelpers) {
   /**
    * Миксин, добавляющий интерфейс для открытия окна выбора.
    * @mixin SBIS3.CONTROLS.ChooserMixin
    * @public
    * @author Крайнов Дмитрий Олегович
    */

   function recordConverter(rec) {
      var idProp;

      /** !ВНИМАНИЕ! rec - $ws.proto.Record **/

      if(rec.hasColumn(this._options.idProperty)) {
         idProp = this._options.idProperty;
      }

      return new Model({
         rawData: rec.toJSON(),
         adapter: new SbisAdapter(),
         idProperty: idProp ? idProp : rec.getKeyField()
      })
   }

   var ChooserMixin = /**@lends SBIS3.CONTROLS.ChooserMixin.prototype  */{
          /**
           * @event onChooserClick Происходит при клике на кнопку открытия диалога выбора.
           * @return {Deferred|Boolean|*} Возможные значения:
           * <ol>
           *    <li>Deferred - {@link Deferred Деферед}, результатом выполнения которого будут выбранные записи.</li>
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
             version, selectorConfig, commonConfig, clickResult;

         /* Обработка выбора из справочника со старым представлением данных */
         function oldConfirmSelectionCallback(event, result) {
            self._chooseCallback(colHelpers.reduce(result, function(res, elem) {
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

         clickResult = this._notify('onChooserClick', template);
         /* Т.к. не все успели перевести свои панели выбора на новые контролы,
            то при использовании нескольких "Справочников" в поле связи, в событии onChooserClick
            будут менять режим работы. Удалится как поле связи перейдёт на использование action'a */
         version  = this._options.oldViews ? 'old' : 'newType';

         if(clickResult === false) {
            return;
         } else if(clickResult instanceof Deferred) {
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

         commonConfig = cMerge({
            template: template,
            componentOptions: componentOptions || {},
            opener: this,
            parent: this._options.chooserMode === 'dialog' ? this : null,
            context: new cContext().setPrevious(this.getLinkedContext()),
            target: this.getContainer()
         }, config || {});



         requirejs([this._chooserConfig.type[version][this._options.chooserMode]], function(ctrl) {
            new ctrl(cMerge(cFunctions.clone(self._chooserConfig.config), cMerge(selectorConfig[version], commonConfig)));
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