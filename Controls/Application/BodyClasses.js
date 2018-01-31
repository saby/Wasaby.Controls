/**
 * Created by dv.zuev on 31.01.2018.
 */
define('Controls/Application/BodyClasses',
   ['Core/detection',
    'Core/compatibility'], function(
       detection,
       compatibility){

   return function(){
      var classMap = {
         isIE: 'ws-is-ie',
         isIE10: 'ws-is-ie10',
         isRealIE10: 'ws-is-real-ie10',
         isIE11: 'ws-is-ie11',
         isIE12: 'ws-is-ie12',
         firefox: 'ws-is-firefox',
         opera: 'ws-is-opera',
         chrome: 'ws-is-chrome',
         safari11: 'ws-is-safari11',
         isMobileAndroid: 'ws-is-mobile-android',
         isMobileSafari: 'ws-is-mobile-safari',
         webkit: 'ws-is-webkit',
         isOldWebKit: 'ws-is-old-webkit',
         isWin10: 'ws-is-windows-10',
         isWin8: 'ws-is-windows-8',
         isWin7: 'ws-is-windows-7',
         isWinVista: 'ws-is-windows-vista',
         isWinXP: 'ws-is-windows-xp',
         isUnix: 'ws-is-unix',
         isMac: 'ws-is-mac',
         retailOffline: 'ws-is-sbis-desktop'
      },
         classes = [];
      // Простое соответствие свойств detection - просто отмепить в классы
      for (var prop in classMap) {
         if (detection[prop]) {
            classes.push(classMap[prop]);
         }
      }
      // А комбинации - добавить вручную
      if (detection.chrome && detection.isMobileIOS) {
         classes.push('ws-is-mobile-chrome-ios');
      }
      if (detection.isMobileSafari) {
         if ((detection.IOSVersion || 0) < 8) {
            classes.push('ws-is-mobile-safari-ios-below-8');
         }
      }
      classes.push(detection.isMobilePlatform ? 'ws-is-mobile-platform' : 'ws-is-desktop-platform');
      if (compatibility.touch) {
         classes.push('ws-is-touch');
      }
      if (detection.isMacOSDesktop && detection.safari) {
         classes.push('ws-is-desktop-safari');
      }
      if (((detection.isWin7 || detection.isWinVista || detection.isWinXP) && !detection.firefox) || detection.isUnix) {
         classes.push('ws-fix-emoji');
      }

      return classes.join(' ');
   }
});