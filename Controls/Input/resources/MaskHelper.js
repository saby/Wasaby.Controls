define('Controls/Input/resources/MaskHelper',
   [],
   function() {

      'use strict';

      var _private = {

      };

      var MaskHelper = {
         /**
          * Получить данные о маске.
          * @param {String} mask маска {@link Controls/Input/Mask#mask}.
          * @param {Object} formatMaskChars ключи и значения маски {@link Controls/Input/Mask#formatMaskChars}.
          * @param {String} replacer заменитель {@link Controls/Input/Mask#replacer}.
          * @return {{searchingGroups: String регулрное выражение для поиска групп, delimiterGroups: Object.<String> значение групп разделителей}}
          */
         getMaskData: function(mask, formatMaskChars, replacer) {

         },

         /**
          * Получить чистые данные.
          * Чистыми данными будем называть: значение без разделителей(чистое) и массив для сопоставления
          * позиций символов исходного значения и символов чистого значение.
          * @param {Object} maskData данные о маске.
          * @param {String} value значение с разделителями.
          * @return {{value: String чистое значение, positions: Array позиция символов исходного значения в чистом значении}}.
          */
         getClearData: function(maskData, value) {

         },

         /**
          * Получить разбиение чистого значения.
          * @param splitValue разбиение исходного значения.
          * @param clearData чистые данные.
          * @return {Object}
          */
         getClearSplitValue: function(splitValue, clearData) {

         },

         /**
          * Вставка.
          * @param maskData данные маски.
          * @param clearSplitValue разбиение чистого значения.
          * @param replacer заменитель.
          * @returns {{value: (String) новая строка, position: (Integer) позиция курсора}}
          */
         insert: function(maskData, clearSplitValue, replacer) {

         },
         /**
          * Удаление.
          * @param maskData данные маски.
          * @param clearSplitValue разбиение чистого значения.
          * @param replacer заменитель.
          * @returns {{value: (String) новая строка, position: (Integer) позиция курсора}}
          */
         delete: function(maskData, clearSplitValue, replacer) {

         },

         /**
          * Удаление через delete.
          * @param maskData данные маски.
          * @param clearSplitValue разбиение чистого значения.
          * @param replacer заменитель.
          * @returns {{value: (String) новая строка, position: (Integer) позиция курсора}}
          */
         deleteForward: function(maskData, clearSplitValue, replacer) {

         },

         /**
          * Удаление через backspace.
          * @param maskData данные маски.
          * @param clearSplitValue разбиение чистого значения.
          * @param replacer заменитель.
          * @returns {{value: (String) новая строка, position: (Integer) позиция курсора}}
          */
         deleteBackward: function(maskData, clearSplitValue, replacer) {

         }
      };

      MaskHelper._private = _private;

      return MaskHelper;
   }
);