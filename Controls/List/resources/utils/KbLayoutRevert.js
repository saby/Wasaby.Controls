/**
 * Модуль для преобразования текста введенного в неверной раскладке
 *
 * @description
 */
define('js!Controls/List/resources/utils/KbLayoutRevert', [
   ], function () {
      
      'use strict';
      /**
       * @author Герасимов Александр
       * @class WSControls/Utils/KbLayoutRevert
       * @public
       */
      
      var layouts = {
         "ru-en" : "йцукенгшщзхъфывапролджэячсмитьбюЙЦУКЕНГШЩЗХЪФЫВАПРОЛДЖЭЯЧСМИТЬБЮqwertyuiop[]asdfghjkl;'zxcvbnm,.QWERTYUIOP{}ASDFGHJKL:\"ZXCVBNM<>"
      };
      
      var cache = {
         layoutObjects : {},
         layoutObjectsSplit : {}
      };
      
      var getLayoutObject = function(layoutId, split) {
            var result,
               layout, i;
            
            if(!layouts[layoutId]) {
               return;
            }
            
            layout = layouts[layoutId];
            
            if(split) {
               
               result = {};
               if(cache.layoutObjectsSplit.hasOwnProperty(layoutId)) {
                  return cache.layoutObjectsSplit[layoutId];
               }
               
               result.straight = {};
               result.reverse = {};
               
               var half = layout.length / 2;
               
               for(i = 0; i < half; ++i) {
                  
                  result.straight[layout[i]] = layout[i + half];
                  result.reverse[layout[i + half]] = layout[i];
               }
               cache.layoutObjectsSplit[layoutId] = result;
            }
            else {
               
               result = [];
               if(cache.layoutObjects.hasOwnProperty(layoutId)) {
                  return cache.layoutObjects[layoutId];
               }
               
               for(i = 0; i < layout.length; ++i) {
                  result[layout[i]] = 0;
               }
               cache.layoutObjects[layoutId] = result;
            }
            
            return result;
         },
         figureLayout = function(text) {
            var result = { matches : 0, layoutId: null };
            for(var layoutId in layouts) {
               
               var layoutObj = getLayoutObject(layoutId),
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
         figureConversionDirectionByWorlds  = function(text, layoutId) {
            var layoutObj = getLayoutObject(layoutId, true),
               words = text.split(/\s/),
               totalDir = 0,
               dir,
               wordsConv = [];
            
            words.forEach(function(word) {
               
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
         };
      
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
      return function process(text, layoutId) {
         layoutId = layoutId || figureLayout(text).layoutId;
         
         if(!layoutId) {
            return text;
         }
         
         var directionByWorld = figureConversionDirectionByWorlds(text, layoutId),
            layoutObj = getLayoutObject(layoutId, true),
            layoutMap = (directionByWorld.direction  === 1) ? layoutObj.straight : layoutObj.reverse,
            result = '';
         
         directionByWorld.words.forEach(function(wordDef) {
            
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
   }
);