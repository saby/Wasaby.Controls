define('SBIS3.CONTROLS/Filter/Button/FieldLinkSelector',
   [
      'Lib/Control/CompoundControl/CompoundControl',
      'tmpl!SBIS3.CONTROLS/Filter/Button/FieldLinkSelector/FieldLinkSelector',
      'SBIS3.CONTROLS/Mixins/MultiSelectable',
      'css!SBIS3.CONTROLS/Filter/Button/FieldLinkSelector/FieldLinkSelector',
      'SBIS3.CONTROLS/FieldLink/Link',
      'SBIS3.CONTROLS/Link'
   ],
   function(CompoundControl, template, MultiSelectable) {
      var _private = {
         
         getFieldLink: function(self) {
            if (!self._fieldLink) {
               self._fieldLink = self.getChildControlByName('selector.fieldLink');
            }
            return self._fieldLink;
         },
         
         getLink: function(self) {
            if (!self._link) {
               self._link = self.getChildControlByName('selector.link');
            }
            return self._link;
         },
         
         getFieldLinkVisibility: function(self) {
            return !_private.getFieldLink(self)._isEmptySelection();
         },
         
         toggleLinksVisibility: function(self) {
            var fieldLinkVisibility = _private.getFieldLinkVisibility(self),
                fieldLinkBlock = self._container.find('.controls-FieldLinkSelector__fieldLink-block');
            
            if (fieldLinkBlock.hasClass('ws-hidden') && fieldLinkVisibility) {
               fieldLinkBlock.removeClass('ws-hidden');
               _private.getLink(self).hide();
            }
         }
      };
      /**
       * @mixes SBIS3.CONTROLS/Mixins/MultiSelectable
       * @public
       * @class SBIS3.CONTROLS/Filter/Button/FieldLinkSelector
       * @extends Lib/Control/CompoundControl/CompoundControl
       * @author Герасимов А.М.
       */
      var Selector = CompoundControl.extend([MultiSelectable], {
         
         _dotTplFn: template,
         $protected: {
            _options: {
               /**
                * @cfg {String} Устанавливает надпись на кнопке.
                * Надпись должна отображать смысл действия клика по кнопке или побуждать к действию.
                * @example
                * <pre class="brush: xml">
                *    <option name="linkCaption">Выберите профессию</option>
                * </pre>
                * @translatable
                */
               linkCaption: '',
               /**
                * @cfg {String} Устанавливает шаблон с полем связи, который отобразится, если выбрана хоть одна запись.
                * @remark Поле связи или компонент с аналогичным интерфейсом должен иметь имя selector.fieldLink
                * @remark
                * @example
                * <pre>
                *   <SBIS3.CONTROLS.Filter.Button.FieldLinkSelector
                *       linkCaption="Выберите профессию"
                *       fieldLinkSpaceTemplate="MyModule/Profession"
                *       selectedKeys="{{'profession'|mutable}}"
                *       textValue="{{'professionText'|bind}}"
                *    />
                * </pre>
                **/
               fieldLinkSpaceTemplate: null
            }
         },
         
         _fieldLink: null,
         _link: null,
         
         init: function() {
            Selector.superclass.init.apply(this, arguments);
            
            var self = this;
            
            /* Прокидываем событие onSelectedItemsChange выше + обновляем видимость поля связи */
            this.subscribeTo(_private.getFieldLink(this), 'onSelectedItemsChange', function(e, keys) {
               var args = [].slice.call(arguments, 1);
               args.unshift('onSelectedItemsChange');
               self._options.selectedKeys = keys;
               self._notifyOnPropertyChanged('selectedKeys');
               self._notify.apply(self, args);
               _private.toggleLinksVisibility(self);
            });
            
            /* При клике на ссылку открываем справочник поля связи */
            this.subscribeTo(_private.getLink(this), 'onActivated', function() {
               _private.getFieldLink(self)._showSelector();
            });
         },
         
         setSelectedKeys: function(keys) {
            _private.getFieldLink(this).setSelectedKeys(keys);
         },
         
         getSelectedKeys: function() {
            return _private.getFieldLink(this).getSelectedKeys();
         },
         
         setSelectedItem: function(item) {
            _private.getFieldLink(this).setSelectedItem(item);
         },
         
         getSelectedItem: function(loadItem) {
            return _private.getFieldLink(this).getSelectedItem(loadItem);
         },
         
         getTextValue: function() {
            return _private.getFieldLink(this).getTextValue();
         },
         
         destroy: function() {
            this._fieldLink = null;
            this._link = null;
            Selector.superclass.destroy.apply(this, arguments);
         }
      });
      
      return Selector;
   }

);