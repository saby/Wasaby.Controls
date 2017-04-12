/**
 * Created by ps.borisov on 05.04.2017.
 */
define('js!SBIS3.CONTROLS.Utils.LinkWrap',
   [
      'js!SBIS3.CONTROLS.Utils.WrapFileOpener'
   ],
   function () {
   'use strict';

   var
      urlRegExpString = '(https?|ftp|file):\/\/[-A-Za-zА-ЯЁа-яё0-9.]+(?::[0-9]+)?(\/([-A-Za-zА-ЯЁа-яё0-9+&@#$/%№=~_{|}!?:,.;()\'\[\\\]](?!nbsp;|amp;nbsp;))*)*',
      excludeLinkString = '<[\\s]*a[\\s\\S]*?>[\\s\\S]*?<\/a>|',
      WrapUtil = {
         urlRegExpString: urlRegExpString,
         excludeLinkString: excludeLinkString,
         /**
          * Обернуть текстовые ссылки.
          * @remark
          * Оборачивает ссылки и адреса почты строки в &lt;a&gt;&lt;/a&gt;.
          * Не оборачивает ссылки и адреса почты, которые уже находятся внутри &lt;a&gt;&lt;/a&gt;.
          * <pre>
          *    var text = 'Посетите http://online.sbis.ru/. Вопросы и предложения отправляйте на help@sbis.ru!';
          *    Utils.LinkWrap.wrapURLs(text);
          *    "Посетите <a target="_blank" href="http://online.sbis.ru/">online.sbis.ru</a>. Вопросы и предложения отправляйте на <a target="_blank" href="mailto:help@sbis.ru">help@sbis.ru</a>!"
          * </pre>
          * @param {String} text Текст для преобразования.
          * @param {Boolean} [newTab=true] Открывать ли созданные ссылки в новой вкладке.
          * @returns {String} Текст с обёрнутыми ссылками.
          * @see wrapFiles
          */
         wrapURLs: function() {
            var
               //Откажимся от поддержки TLD(https://en.wikipedia.org/wiki/Top-level_domain)
               emailRegExpString = "[-a-zА-ЯЁа-яё0-9!#$%&*+/=?^_`{|}~]+(?:\\.[-a-zА-ЯЁа-яё0-9!#$%&'*+/=?^_`{|}~]+)*@(?:[a-zА-ЯЁа-яё0-9]([-a-zА-ЯЁа-яё0-9]{0,61}[a-zА-ЯЁа-яё0-9])?\\.)+(?:[a-zА-ЯЁа-яё]{0,10})",
               emailRegExp = new RegExp(excludeLinkString + emailRegExpString, 'gi'),
               urlRegExp = new RegExp(excludeLinkString + urlRegExpString, 'i'),
               urlStartRegExp = new RegExp( "^"+urlRegExpString, "i"),
               quotRegExp = /(&quot;)+$/i,
               cleanRegExp = /^(&nbsp;|,)+/gi,
               specialRegExp = /(&nbsp;|,|&quot;)+/i, //для поиска в ссылки &quot;,&nbsp;
               assembleUrl = function(href, linkText, newTab){
                  return '<a rel="noreferrer" class="asLink"' + ( newTab ? ' target="_blank"' : '') + ' href="' + href + '">' + linkText + '</a>';
               };

            // Как сразу получить одним regExp чистую ссылку, удовлетворяюющую всем юнит тестам, я не знаю
            // Поэтому для начала получаем ссылку с &blank и &quot
            function getLink(str) {
               var linkPos = -1,
                  link = '',
                  linkLength = 0;

               str.replace(urlRegExp, function(a, protocol, href, params, pos) {
                  link = a;
                  linkLength = a.length;
                  linkPos = pos;
               });

               return {
                  link: link,
                  pos: linkPos,
                  length: linkLength
               };
            }

            //ищет в ссылке &quot и &nbsp
            function resolveLink(link, quoted) {
               var result = [link];

               link.replace(specialRegExp, function(founded, part, pos, str){
                  var foundedQuot = false, //найдена &quot;
                     trashIsUrl = false, //является ли ссылкой текст после &nbsp;
                     cleanTrash = ''; //чистый текст после &nbsp

                  if (founded == '&quot;') {
                     foundedQuot = true; //возможно ссылка обёрнута в &quot с двух сторон
                  }

                  var trash = str.substr(pos, str.length);

                  if (trash) {
                     cleanTrash = trash.replace(cleanRegExp, ''); //текст после &nbsp;
                     if (cleanTrash.length > 0) {
                        // текст после &nbsp также является ссылкой?
                        trashIsUrl = urlStartRegExp.exec(cleanTrash);
                     }
                     if ((quoted && foundedQuot) || trashIsUrl || cleanTrash.length == 0) {
                        // если заключена в &quot, или после &nbsp следует новая ссылка, или ссылка заканчивается символом &nbsp, то отделим чистую ссылку
                        result[0] = str.substr(0, pos);
                        result[1] = trash;
                     }
                  }
               });

               return result;
            }

            function prepareResult(beforeStr, cleanLink, resolvedLink, afterStr) {
               var result = [];

               //формируем результат
               result.push(beforeStr + cleanLink);
               if (resolvedLink && resolvedLink.length > 1) {
                  result.push(resolvedLink[1]);
               }
               if (afterStr) {
                  result.push(afterStr);
               }

               return result;
            }

            // ищет в строке ссылки и оборачивает их в тег <a></a>
            function parseElement(str, newTab) {
               var
                  result = [],
                  beforeStr = '', //текст до ссылки
                  strLength = str.length,
                  quoted = false; //заключена ли ссылка в &quot;

               urlRegExp.lastIndex = 0;

               //Получаем ссылку (с &blank и &quot)
               var draftLink = getLink(str);

               if (draftLink.pos !== -1) { //ссылка найдена
                  beforeStr = str.substr(0, draftLink.pos);
                  if (beforeStr) {
                     quoted = quotRegExp.test(beforeStr.trim()); // если ссылка заключена в &quot;
                  }

                  var resolvedLink,
                     cleanLink,
                     lastClose = draftLink.link.lastIndexOf(')'),
                     lastOpen =  draftLink.link.lastIndexOf('(');
                  // не включать последнюю закрывающуюся скобку если после нее есть открвающаяся или перед нет открывающейся
                  while (lastClose != -1 && (lastOpen > lastClose || lastOpen == -1 )) {
                     draftLink.link = draftLink.link.substr(0, lastClose);
                     draftLink.length = draftLink.link.length;
                     lastClose = draftLink.link.lastIndexOf(')');
                     lastOpen =  draftLink.link.lastIndexOf('(');
                  }
                  //если ссылка заключена в " то считаем всё до закрывающейся " ссылкой
                  if (beforeStr && str[draftLink.pos - 1] === '"' && str.indexOf('"', draftLink.pos) !== -1 && draftLink.link[0] != '<') {
                     draftLink.length = str.indexOf('"', draftLink.pos) - draftLink.pos;
                     draftLink.link = str.substr(draftLink.pos, draftLink.length);
                  }
                  while (draftLink.link[draftLink.length - 1] == '.') {
                     draftLink.length --;
                     draftLink.link = str.substr(draftLink.pos, draftLink.length);
                  }
                  if (draftLink.link.charAt(0) != '<' && str.substr(draftLink.pos - 5, 4) !== 'src=' && str.substr(draftLink.pos - 5, 4) !== 'url(') {
                     //ссылку нашли, теперь нужно посмотреть, вдруг она заключена в кавычки или содержит в себе &nbsp;
                     resolvedLink = resolveLink(draftLink.link, quoted);
                     cleanLink = assembleUrl(resolvedLink[0], resolvedLink[0], newTab); //оборачиваем ссылку в тег <a>
                  }
                  else {
                     cleanLink = draftLink.link;
                  }

                  var linkLength = draftLink.length + draftLink.pos,
                     afterStr = linkLength < strLength ?
                        str.substr(linkLength, strLength) : '';

                  result = prepareResult(beforeStr, cleanLink, resolvedLink, afterStr);
               } else {
                  result.push(str);
               }

               return result;
            }

            return function (str, newTab) {
               var
                  idx,
                  arr;
               if (typeof str === 'string') {
                  newTab = newTab === undefined ? true : newTab;
                  arr = [str];
                  idx = 0;
                  if (arr.length) {
                     while (idx < arr.length) {
                        //Тут надо разобрать элемент массива. Результат разбора - массив. Этот массив надо splice к текущему. idx должен увеличиться на один
                        Array.prototype.splice.apply(arr, [idx, 1].concat(parseElement(arr[idx], newTab)));
                        idx++;
                     }
                  }
                  str = arr.join('');

                  // Заменим электронную почту
                  emailRegExp.lastIndex = 0;
                  str = str.replace(emailRegExp, function (result, b, index, fullText) {
                     var afterResultText = fullText.substr(index + result.length);
                     // Если найденная строка является ссылкой или после неё идет символ ':' и он не последний,
                     // то возвращаем ссылку без преобразования
                     if (result.charAt(0) === '<' ||
                        (afterResultText.length > 1 && afterResultText[0] == ':' && !/\s/.test(afterResultText[1])))
                     {
                        return result;
                     }
                     return assembleUrl('mailto:' + result, result, newTab);
                  });
               }
               return str;
            }
         }(),

         /**
          * Обернуть файловые ссылки.
          * @remark
          * Оборачивает ссылки на файлы и папки в &lt;a&gt;&lt;/a&gt;.
          * <pre>
          *    var text = 'Полный список изменений расположен в файле "c:\update.txt"';
          *    Utils.LinkWrap.wrapFiles(text);
          * </pre>
          * @param {String} string Текст, в котором нужно обернуть ссылки.
          * @returns {String} Текст с обёрнутыми ссылками.
          * @see wrapURLs
          */
         wrapFiles: function () {
            var
               //Регулярка для поиска начала ссылки
               startChars = new RegExp(excludeLinkString + '(?:\\b[a-z]:\\\\|\\\\\\\\[a-z0-9 %\._-]+\\\\[a-z0-9 $%\._-]+)', 'i'),
               //Регулярка для поиска окончания ссылки, которая НЕ обрамлена в кавычки
               endLinkRegex = /[:*?"'<>|\r\n]/gi,
               //Регулярка для поиска окончания ссылки, которая обрамлена в кавычки
               endLinkWithCommaRegex = /([,.]+(([ ]|&nbsp;)*[а-я]|([ ]|&nbsp;)+[a-z]|[:*?"'<>|])|[:*?"'<>|])|[.,]+$/gi;
            function parseElement(str) {
               var
                  result = [],
                  idx = -1,
                  beforeStr = '',
                  link = '',
                  startLinkLength = 0,
                  linkLength = 0,
                  length = str.length;
               str.replace(startChars, function (str, pos) {
                  idx = pos;
                  startLinkLength = str.length;
               });
               if (idx !== -1 && str[idx] != '<') {
                  beforeStr = str.substr(0, idx);
                  linkLength = str.substr(idx + startLinkLength).search(str[idx - 1] === '"' || str[idx - 1] === '\'' ? endLinkRegex : endLinkWithCommaRegex);
                  if (linkLength !== -1) {
                     linkLength += startLinkLength;
                     link += str.substr(idx, linkLength);
                     idx += linkLength;
                  } else {
                     link += str.substr(idx);
                     idx = length;
                  }
                  result.push(beforeStr + '<a class="asLink" title="' + rk('Открыть файл (папку)') + '" data-open-file="' + link.replace(/\\/g, '\\\\') + '">' + link + '</a>');
                  if (idx < length) {
                     result.push(str.substr(idx, length));
                  }
               } else if (str[idx] == '<') {
                  beforeStr = str.substr(0, idx);
                  link += str.substr(idx, startLinkLength);
                  idx += startLinkLength;
                  result.push(beforeStr + link);
                  if (idx < length) {
                     result.push(str.substr(idx, length));
                  }
               } else {
                  result.push(str);
               }
               return result;
            };
            return function wrapFiles(str) {
               var
                  idx,
                  arr;
               if (typeof str === 'string') {
                  arr = [str];
                  idx = 0;
                  if (arr.length) {
                     while (idx < arr.length) {
                        //Тут надо разобрать элемент массива. Результат разбора - массив. Этот массив надо splice к текущему. idx должен увеличиться на один
                        Array.prototype.splice.apply(arr, [idx, 1].concat(parseElement(arr[idx])));
                        idx++;
                     }
                  }
                  return arr.join('');
               }
               return str;
            }
         }()
   };

   return WrapUtil;
});