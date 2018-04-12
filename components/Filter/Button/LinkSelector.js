/**
 * Created by am.gerasimov on 05.07.2016.
 */
define('SBIS3.CONTROLS/Filter/Button/LinkSelector',
   [
      'Lib/Control/CompoundControl/CompoundControl',
      'tmpl!SBIS3.CONTROLS/Filter/Button/LinkSelector/LinkSelector',
      'WS.Data/Chain',
      'SBIS3.CONTROLS/Link',
      'SBIS3.CONTROLS/Action/SelectorAction'
   ], function(CompoundControl, template, Chain) {
      'use strict';
      
      /**
       * Компонент, отображающий ссылку. Умеет скрваться/отобрадаться в зависимости от опции {@link invertedVisible}
       * Используется на панели {@link SBIS3.CONTROLS/Filter/Button}:
       * @class SBIS3.CONTROLS/Filter/Button/LinkSelector
       * @extends SBIS3.CONTROLS/SelectorButton
       * @author Герасимов А.М.
       * @control
       * @public
       */
      
      var LinkSelector = CompoundControl.extend(/** @lends SBIS3.CONTROLS/Filter/Button/LinkSelector.prototype */{
         _dotTplFn: template,
         $protected: {
            _options: {

               /**
                * @cfg {boolean} Инвертированное значение опции visible.
                * Если значение false - компонент отображается, если значение true - компонент скрыт.
                * @see setInvertedVisible
                * @see getInvertedVisible
                */
               invertedVisible: false,

               /**
                * @cfg {String} Устанавливает надпись на кнопке.
                * @example
                * <pre class="brush:xml">
                *     <option name="caption">Сохранить</option>
                * </pre>
                * @translatable
                * @see setCaption
                * @see getCaption
                */
               caption: '',

               /**
                * @typedef {Array} dictionaries
                * @property {String} template Шаблон справочника. В качестве значения передают имя компонента.
                * @property {Object} componentOptions Опции, которые будут переданы в секцию _options (см. <a href='/doc/platform/developmentapl/interface-development/core/oop/'>ООП-обертка в веб-фреймворке WS</a>) компонента справочника.
                * @translatable caption
                */
               /**
                * @cfg {dictionaries[]} Устанавливает набор справочников для кнопки выбора.
                * @example
                * <pre>
                *    <options name="dictionaries" type="array">
                *       <options>
                *          <option name="caption">Сотрудники</option>
                *          <option name="template">Examples/MyArea/DictEmployees</option>
                *       </options>
                *    <options>
                * </pre>
                */
               dictionaries: [],

               /**
                * @cfg {String[]} Устанавливает массив идентификаторов, по которым будет установлен набор выбранных элементов коллекции.
                * @remark
                * Устанавливает массив идентификаторов элементов коллекции, которые будут по умолчанию выбраны для контрола.
                * @example
                * В контрол, отображающий набор данных в виде таблицы {@link SBIS3.CONTROLS/DataGridView},  переданы три идентификатора элементов коллекции:
                * ![](/MultiSelectable03.png)
                * фрагмент верстки:
                * <pre class="brush: xml">
                *     <options name="selectedKeys" type="array">
                *        <option>2</option>
                *        <option>3</option>
                *        <option>6</option>
                *     </options>
                * </pre>
                * @see setSelectedKeys
                * @see getSelectedKeys
                */
               selectedKeys: [],

               /**
                * @cfg {Object} Устанавливает рекордсет, по которому будет установлен набор выбранных элементов коллекции.
                * @see setSelectedItems
                * @see getSelectedItems
                */
               selectedItems: [],

               /**
                * @cfg {String} Устанавливает поле элемента коллекции, которое является идентификатором записи.
                * @remark
                * Выбранный элемент в коллекции задаётся указанием ключа элемента.
                * @example
                * <pre class="brush:xml">
                *     <option name="idProperty">Идентификатор</option>
                * </pre>
                */
               idProperty: '',

               /**
                * @cfg {String} Устанавливает режим открытия компонента выбора.
                * @variant dialog Открытие производится в новом диалоговом окне.
                * @variant floatArea Открытие производится на всплывающей панели.
                */
               selectMode: 'floatArea',

               /**
                * @cfg {Boolean} Устанавливает режим множественного выбора элементов коллекции.
                * * true Режим множественного выбора элементов коллекции установлен.
                * * false Режим множественного выбора элементов коллекции отменен.
                * @example
                * <pre>
                *    <option name="multiselect">false</option>
                *    <option name="multiselect" type="boolean" value="false"></option>
                * </pre>
                * @see selectedKeys
                */
               multiselect: false
            }
         },
         _modifyOptions: function() {
            var opts = LinkSelector.superclass._modifyOptions.apply(this, arguments);

            /* Если invertedVisible выставлена, то компонент должен быть скрыт */
            if (opts.invertedVisible) {
               opts.visible = false;
            }
            return opts;
         },
         
         init: function() {
            LinkSelector.superclass.init.call(this);
            
            var self = this,
               selectorAction = self.getChildControlByName('linkSelector.selectorAction');
            
            self.subscribeTo(this.getChildControlByName('linkSelector.link'), 'onActivated', function() {
               var selectorActionConfig = self._options.dictionaries[0];
               selectorActionConfig.multiselect = self._options.multiselect;
               selectorAction.execute(selectorActionConfig);
            });
            
            self.subscribeTo(selectorAction, 'onExecuted', function(event, meta, result) {
               if (result) {
                  var keys = Chain(result).reduce(function(result, item) {
                     result.push(item.get(self._options.idProperty));
                     return result;
                  }, []);
                  
                  self.setSelectedKeys(keys);
                  self.setSelectedItems(result);
                  if (keys.length && !!self._options.command) {
                     var args = [self._options.command].concat(self._options.commandArgs);
                     self.sendCommand.apply(self, args);
                  }
               }
            });
         },
   
         //region multiSelectable
         
         getSelectedKeys: function() {
            return this._options.selectedKeys;
         },
         
         setSelectedKeys: function(keys) {
            this._options.selectedKeys = keys;
            this._notifyOnPropertyChanged('selectedKeys');
         },

         getSelectedItems: function() {
            return this._options.selectedItems;
         },

         setSelectedItems: function(items) {
            this._options.selectedItems = items;
            this._notifyOnPropertyChanged('selectedItems');
         },
   
         //endregion multiSelectable
   
         //region invertedVisible
         
         setInvertedVisible: function(invertedVisible) {
            this._options.invertedVisible = invertedVisible;
            this.toggle(!invertedVisible);
            this._notifyOnSizeChanged(this);
            this._notifyOnPropertyChanged('invertedVisible');
         },
         
         getInvertedVisible: function() {
            return this._options.invertedVisible;
         }
   
         //endregion invertedVisible
      });
      
      return LinkSelector;
   });
