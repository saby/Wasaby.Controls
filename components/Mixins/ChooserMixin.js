/**
 * Created by am.gerasimov on 21.01.2016.
 */
define('SBIS3.CONTROLS/Mixins/ChooserMixin', [
   "Core/Context",
   "Core/core-clone",
   "Core/core-merge",
   "Core/Deferred",
   "WS.Data/Entity/Model",
   "WS.Data/Adapter/Sbis"
], function( cContext, coreClone, cMerge, Deferred,Model, SbisAdapter) {
   /**
    * Миксин, добавляющий интерфейс для открытия окна выбора.
    * @mixin SBIS3.CONTROLS/Mixins/ChooserMixin
    * @public
    * @author Крайнов Д.О.
    */

   function recordConverter(rec) {
      var idProp;

      /** !ВНИМАНИЕ! rec - Deprecated/Record **/

      if(rec.hasColumn(this._options.idProperty)) {
         idProp = this._options.idProperty;
      }

      return new Model({
         rawData: rec.toJSON(),
         adapter: new SbisAdapter(),
         idProperty: idProp ? idProp : rec.getKeyField()
      })
   }

   var ChooserMixin = /**@lends SBIS3.CONTROLS/Mixins/ChooserMixin.prototype  */{
          /**
           * @event onChooserClick Происходит при клике на кнопку открытия диалога выбора. Подробнее о создании диалога выбора можно посмотреть {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/forms-and-validation/windows/selector-action/selector-dialog/ здесь}.
           * @param {Core/EventObject} eventObject Дескриптор события.
           * @param {String|Object} template Строка или объект - конфигурация справочника диалога выбора.
           * Для {@link SBIS3.CONTROLS/FieldLink поля связи} значение второго параметра зависит от значения опции {@link SBIS3.CONTROLS/FieldLink#useSelectorAction useSelectorAction}:
           * <ol>
           *    <li> useSelectorAction = true - в параметр придёт объект с полями multiselect, selectedItems, selectionType, template; конфигурация справочника, которая придёт в {@link https://wi.sbis.ru/docs/js/SBIS3/CONTROLS/FieldLink/options/dictionaries/ dictionaries}.</li>
           *    <li> useSelectorAction = false - в параметр придёт строка</li>
           * </ol>
           * @return {Deferred|Boolean|*} Возможные значения:
           * <ol>
           *    <li>Deferred - {@link Deferred Деферед}, результатом выполнения которого будут выбранные записи.</li>
           *    <li>Если вернуть false - диалог выбора открыт не будет.</li>
           *    <li>Любой другой результат - диалог выбора будет открыт стандартным образом.</li>
           * </ol>
           */
      $protected: {
         _options: {
            /**
             * @cfg {Boolean} Устанавливает поддержку представлений данных из пространства имен {@link /docs/3-8-0/$ws/proto/ SBIS3.CORE}.
             * Данная опция требуется, если в диалоге выбора для отображения данных используются контролы {@link /docs/3-8-0/$ws/proto/TableView/ TableView},
             * {@link /docs/js/SBIS3/CORE/TreeView/ TreeView}, {@link /docs/js/SBIS3/CORE/HierarchyView/ HierarchyView}.
             * @example
             * <pre class="brush: xml">
             *     <option name="oldViews">true</option>
             * </pre>
             * @deprecated
             */
            oldViews: false,
            /**
             * @cfg {String} Устанавливает режим отображения диалога выбора элементов коллекции.
             * * dialog Справочник отображается в новом диалоговом окне.
             * * floatArea Справочник отображается во всплывающей панели.
             * @remark
             * Окно выбора будет отображаться в новом диалоге или на всплывающей панели.
             * Подробно про диалог выбора элементов коллекции можно прочесть {@link /docs/js/Lib/Control/FloatArea/FloatArea здесь}.
             * @example
             * Устанавливаем режим отображения {@link /docs/js/Lib/Control/Dialog/Dialog справочника} для поля связи
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
               autoCloseOnHide: true
            },
            type: {
               old: {
                  dialog: 'Deprecated/Controls/DialogSelector/DialogSelector',
                  floatArea: 'Deprecated/Controls/DialogSelector/FloatAreaSelector'
               },
               newType: {
                  dialog: 'SBIS3.CONTROLS/Dialog/DialogSelector',
                  floatArea: 'SBIS3.CONTROLS/FloatArea/FloatAreaSelector'
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
      _showChooser: function(template, componentOptions, dialogOptions, cfg) {
         var self = this,
             config = this._getAdditionalChooserConfig(),
             version, selectorConfig, commonConfig, clickResult;

         /* Обработка выбора из справочника со старым представлением данных */
         function oldConfirmSelectionCallback(event, result) {
            /* Если обрабатываем результат deferred'a то в функции нету контекста, проверим на это */
            if(this && this !== window && this.close) {
               this.close();
            }
            self._chooseCallback(result.reduce(function(res, elem) {
               if (elem !== null) {
                  res.push(recordConverter.call(self, elem));
                  return res;
               }
            }, []));
         }

         clickResult = this._notify('onChooserClick', template, cfg);
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
            context: cContext.createContext(self, null, this.getLinkedContext()),
            target: this.getContainer()
         }, config || {});

         if (dialogOptions) {
            commonConfig = cMerge(commonConfig, dialogOptions);
         }

         requirejs([this._chooserConfig.type[version][this._options.chooserMode]], function(ctrl) {
            self._chooserDialog = new ctrl(cMerge(coreClone(self._chooserConfig.config), cMerge(selectorConfig[version], commonConfig)));
            self._chooserDialog.subscribe('onAfterClose', function() {
               self._chooserDialog = undefined;
            });
         });
      },

      showSelector: function(cfg) {
         this._showChooser(cfg.template, cfg.componentOptions, cfg.dialogOptions);
      },

      _getAdditionalChooserConfig: function () {
         return {};
      },

      _chooseCallback : function() {
         /*Method must be implemented*/
      },

      after : {
         destroy: function () {
            if (this._chooserDialog) {
               this._chooserDialog.destroy();
               this._chooserDialog = undefined;
            }
         }
      }
   };

   return ChooserMixin;

});