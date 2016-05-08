/**
 * Created by am.gerasimov on 06.05.2016.
 */
/**
 * Модуль для преобразования текста введенного в неверной раскладке
 */
define('js!SBIS3.CONTROLS.Utils.KbLayoutRevertUtil',
    [],
    function () {
       'use strict';

       return {
          _layouts :
          {
             "ru-en" : "йцукенгшщзхъфывапролджэячсмитьбюЙЦУКЕНГШЩЗХЪФЫВАПРОЛДЖЭЯЧСМИТЬБЮqwertyuiop[]asdfghjkl;'zxcvbnm,.QWERTYUIOP{}ASDFGHJKL:\"ZXCVBNM<>"
          },
          _cache : {
             layoutObjects : {},
             layoutObjectsSplit : {}
          },
          _getLayoutObject : function(layoutId, split) {

             var result,
                 layout, i;

             if(!this._layouts[layoutId]) {
                return;
             }

             layout = this._layouts[layoutId];

             if(split) {

                result = {};
                if(this._cache.layoutObjectsSplit.hasOwnProperty(layoutId)) {
                   return this._cache.layoutObjectsSplit[layoutId];
                }

                result.straight = {};
                result.reverse = {};

                var half = layout.length / 2;

                for(i = 0; i < half; ++i) {

                   result.straight[layout[i]] = layout[i + half];
                   result.reverse[layout[i + half]] = layout[i];
                }
                this._cache.layoutObjectsSplit[layoutId] = result;
             }
             else {

                result = [];
                if(this._cache.layoutObjects.hasOwnProperty(layoutId)) {
                   return this._cache.layoutObjects[layoutId];
                }

                for(i = 0; i < layout.length; ++i) {
                   result[layout[i]] = 0;
                }
                this._cache.layoutObjects[layoutId] = result;
             }

             return result;
          },
          _figureLayout : function(text) {

             var result = { matches : 0, layoutId: null };
             for(var layoutId in this._layouts) {

                var layoutObj = this._getLayoutObject(layoutId),
                    matches = 0;

                for(var i = 0; i < text.length; ++i) {

                   if(layoutObj.hasOwnProperty(text[i])) {
                      ++matches;
                   }
                }

                if(!result || result.matches < matches) {
                   result = { matches : matches, layoutId : layoutId };
                }
             }

             return result;
          },
          _figureConversionDirectionByWorlds : function(text, layoutId) {

             var layoutObj = this._getLayoutObject(layoutId, true),
                 words = text.split(/\s/),
                 totalDir = 0,
                 dir,
                 wordsConv = [];

             $ws.helpers.forEach(words, function(word) {

                if(!word) {
                   wordsConv.push({ word : ' '});
                   return;
                }

                var straight = 0,
                    reverse = 0;

                for(var i = 0; i < word.length; ++i) {

                   if(layoutObj.straight.hasOwnProperty(word[i])) {
                      ++straight;
                   }
                   if(layoutObj.reverse.hasOwnProperty(word[i])) {
                      ++reverse;
                   }
                }

                dir = (straight >= reverse) ? 1 : -1;
                if(straight && reverse) {
                   dir = (straight >= reverse) ? -1 : 1;
                }
                totalDir += dir;
                wordsConv.push({ word : word, direction: dir});
             });

             return {direction : (totalDir < 0) ? -1 : 1, words : wordsConv};
             //return (totalDir < 0) ? -1 : 1;
          },
          /**
           * Проецирует текст введенный в одной раскладке в другую раскладку. Успешно обрабатываются только те случаи, когда каждое слово введено в ошибочной раскладке.
           *
           * ghbdtn, Fktrc! => привет, Алекс!       OK
           * ghbdtn, Фдуч! => привет, Alex!         OK (в процессе ввода была смена раскладки, но оба слова введены в ошибочной раскладке)
           * ghbdtn, Alex! => привет, Флуч!         BAD (по смыслу второе слово введено верно)
           *
           * @param {string} text          текст для преобразования
           * @param {string} [layoutId]    идентификатор раскладки. Если не указан определяет сам
           * @returns {string}
           */
          process : function(text, layoutId) {

             layoutId = layoutId || this._figureLayout(text).layoutId;

             if(!layoutId) {
                return text;
             }

             var directionByWorld = this._figureConversionDirectionByWorlds(text, layoutId),
                 layoutObj = this._getLayoutObject(layoutId, true),
                 layoutMap = (directionByWorld.direction  === 1) ? layoutObj.straight : layoutObj.reverse,
                 result = '';

             $ws.helpers.forEach(directionByWorld.words, function(wordDef) {

                var word = wordDef.word;

                if (word === ' ') {
                   result += word;
                   return;
                }

                layoutMap = (wordDef.direction === 1) ? layoutObj.straight : layoutObj.reverse;

                if(result.trim().length > 0) {
                   result += ' ';
                }

                for(var i = 0; i < word.length; ++i) {
                   if(layoutMap.hasOwnProperty(word[i])) {
                      result += layoutMap[word[i]];
                   }
                   else {
                      result += word[i];
                   }
                }
             });

             return result;
          }
       };
    }
);