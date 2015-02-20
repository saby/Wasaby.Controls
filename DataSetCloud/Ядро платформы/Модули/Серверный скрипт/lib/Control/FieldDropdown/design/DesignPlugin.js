define('js!SBIS3.CORE.FieldDropdown/design/DesignPlugin',
   [
      "js!SBIS3.CORE.FieldDropdown"
   ],
   function(FieldDropdown){
      /**
       * содержит сеттеры, необходимые только в режиме дизайна
       * @class $ws.proto.FieldDropdown.DesignPlugin
       * @extends $ws.proto.FieldDropdown
       * @plugin
       */
      $ws.proto.FieldDropdown.DesignPlugin = FieldDropdown.extendPlugin({
         /**
          * <wiTag group="Данные">
          * Устанавливает режим отображения данных
          * @see mode
          * @param {String} mode
          */
         setMode: function (mode) {
            if (mode !== 'year' || mode !== 'month') {
               mode = '';
            }
            this._options.mode = mode;
            this._prepareFillData();
            this._fillData();
         },
         /**
          * <wiTag group="Данные">
          * Устанавливает отображение контрола
          * @see renderStyle
          * @param {String} renderStyle
          */
         setRenderStyle: function(renderStyle) {
            var
               isSimpleRenderStyle = renderStyle === 'simple';
            $('body')
               .find('.custom-options-container')
                  .toggleClass('custom-options-container-simple', isSimpleRenderStyle);
            this._container
               .toggleClass('ws-field-dropdown-standard', !isSimpleRenderStyle)
               .toggleClass('ws-field-dropdown-simple', isSimpleRenderStyle)
               .find('.custom-select')
                  .toggleClass('asLink', isSimpleRenderStyle);
         },
         /**
          * <wiTag group="Отображение">
          * Устанавливает опцию valueRender - пользовательскую функцию рендеринга отображаемого значения
          * @param {function} valueRender значение опции
          */
         setValueRender: function(valueRender) {
            if (typeof valueRender === 'function') {
               this._options.valueRender = valueRender;
            }
         },
         /**
          * <wiTag group="Отображение">
          * Устанавливает опцию titleRender - функцию рендеринга значения в контейнере выпадающего списка
          * @param {function} titleRender значение опции
          */
         setTitleRender: function(titleRender) {
            if (typeof titleRender === 'function') {
               this._options.titleRender = titleRender;
            }
         }
      });
   });