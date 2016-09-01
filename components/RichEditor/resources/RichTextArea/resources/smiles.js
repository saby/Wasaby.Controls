/**
 * Created by ps.borisov on 19.07.2016.
 */
define('js!SBIS3.CONTROLS.RichTextArea/resources/smiles', ['i18n!SBIS3.CONTROLS.RichEditor'], function () {

   'use strict';

   /*СПИСОК СМАЙЛОВ*/
   var
      blankImgPath = 'https://cdn.sbis.ru/richeditor/26-01-2015/blank.png',
      renderSmile = function(key, name){
         return '<img class="ws-fre__smile smile' + key + '" data-mce-resize="false" src="'+blankImgPath+'" title="' + name + '" >';
      };

   return [
      { key: 'Smile', value: rk('улыбка'), title: renderSmile('Smile',rk('улыбка')) , alt: ':)'},
      { key: 'Nerd', value: rk('умник'), title: renderSmile('Nerd',rk('умник')), alt: '(nerd)' },
      { key: 'Angry', value: rk('злой'), title: renderSmile('Angry',rk('злой')) , alt: '(angry)'},
      { key: 'Annoyed', value: rk('раздраженный'), title: renderSmile('Annoyed',rk('раздраженный')), alt: '(annoyed)' },
      { key: 'Blind', value: rk('слепой'), title: renderSmile('Blind',rk('слепой')), alt: '(blind)' },
      { key: 'Cool', value: rk('крутой'), title: renderSmile('Cool',rk('крутой')) , alt: '(cool)'},
      { key: 'Cry', value: rk('плачет'), title: renderSmile('Cry',rk('плачет')) , alt: ';('},
      { key: 'Devil', value: rk('дьявол'), title: renderSmile('Devil',rk('дьявол')),alt: '(devil)' },
      { key: 'Dumb', value: rk('тупица'), title: renderSmile('Dumb',rk('тупица')) ,alt: '(dumb)'},
      { key: 'Inlove', value: rk('влюблен'), title: renderSmile('Inlove',rk('влюблен')) , alt: '(inlove)'},
      { key: 'Kiss', value: rk('поцелуй') , title: renderSmile('Kiss',rk('поцелуй')), alt: '(kiss)'},
      { key: 'Laugh', value: rk('смеётся'), title: renderSmile('Laugh',rk('смеётся')), alt: ':D'},
      { key: 'Money', value: rk('алчный'), title: renderSmile('Money',rk('алчный')) , alt: '(money)'},
      { key: 'Neutral', value: rk('нейтральный'), title: renderSmile('Neutral',rk('нейтральный')) , alt: ':|'},
      { key: 'Puzzled', value: rk('недоумевает'), title: renderSmile('Puzzled',rk('недоумевает')) , alt: '(puzzled)'},
      { key: 'Rofl', value: rk('подстолом'), title: renderSmile('Rofl',rk('улыбка')) , alt: '(rofl'},
      { key: 'Sad', value: rk('расстроен'), title: renderSmile('Sad',rk('расстроен')) , alt: ':('},
      { key: 'Shocked', value: rk('шокирован'), title: renderSmile('Shocked',rk('шокирован')) , alt: '(shocked)'},
      { key: 'Snooze', value: rk('дремлет'), title: renderSmile('Snooze',rk('дремлет')) , alt: '(snooze)'},
      { key: 'Tongue', value: rk('дразнит'), title: renderSmile('Tongue',rk('дразнит')), alt: '(tongue)' },
      { key: 'Wink', value: rk('подмигивает'), title: renderSmile('Wink',rk('подмигивает')), alt: ';)' },
      { key: 'Yawn', value: rk('зевает'), title: renderSmile('Yawn',rk('зевает')), alt: '(yawn)' }
   ];
});