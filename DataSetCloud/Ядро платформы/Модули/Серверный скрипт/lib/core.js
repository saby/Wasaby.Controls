/**
 * WI.SBIS 3.0.15
 */
/* jshint ignore:start */
var toS = Object.prototype.toString;

if(typeof(window) == 'undefined') {
   window = undefined;
}
if(typeof(document) == 'undefined') {
   document = undefined;
}
if(typeof(navigator) == 'undefined') {
   navigator = undefined;
}

var nop = function(dummy){}, retTrue = function() { return true };
/**
 * Если инструмент для сбора статистики отсутствует, заменяем его на пустышку
 */
if (typeof(window) == 'undefined' || window.BOOMR === undefined){
   var
      dummyBlock= {closeSyncBlock: nop, openSyncBlock: nop, close: nop, stop: nop},
      dummySpan = { stop: nop };
   BOOMR = {
      page_ready : nop,
      plugins : {
         WS : {
            prepareEnvironment: nop,
            startSpan : function(dummy) { return dummySpan; },
            reportError : nop,
            reportMessage : nop,
            reportEvent: nop,
            logUserActivity: nop,
            startBlock: function(n){ return dummyBlock; }
         }
      },
      version : false
   };
}
/* jshint ignore:end *//* jshint ignore:end */
/*
 * Инициализация объекта для компонентов ядра
 */
(function(){
   var global = (function(){ return this || (0,eval)('this'); }());
   global.SBIS3 = {};
   global.SBIS3.CORE = {};
}());


$ws = (function(){
   var cssTransformProperty = document && (function() {
      var element = document.createElement('div');
      return element.style.transform !== undefined && 'transform' ||        //new browsers
         element.style.msTransform !== undefined && 'msTransform' ||        //ie
         element.style.oTransform !== undefined && 'oTransform' ||          //Opera
         element.style.MozTransform !== undefined && 'MozTransform' ||      //Firefox
         element.style.webkitTransform !== undefined && 'webkitTransform';  //Chrome
   })();

   function IEVersion() {
      var match = navigator && navigator.appVersion.match(/MSIE\s+(\d+)/);
      return match && parseInt(match[1], 10);
   }

   function IOSVersion() {
      var match = navigator && navigator.userAgent.match(/\bCPU\s+(i?)OS\s+(\d+)/);
      return match && parseInt(match[2], 10);
   }

   var now = +new Date(), timeShift2014 = +new Date(2014, 9, 26);

   return {
      /**
       * Неймспейс для всех констант
       * @namespace
       */
      _const: {
         JSONRPC_PROOTOCOL_VERSION: 3,
         fasttemplate: true,
         nostyle: false,
         moscowTimeOffset: now >= timeShift2014 ? 3*60 : 4*60, // UTC+04:00 ... 26/10/2014 UTC+03:00
         javaStartTimeout: 15000,
         styleLoadTimeout: 2000,
         IDENTITY_SPLITTER: ',',
         userConfigSupport: false,
         globalConfigSupport: true,
         theme: '',
         appRoot: '/',
         resourceRoot: '/resources/',
         wsRoot: '/ws/',
         defaultServiceUrl: '/service/sbis-rpc-service300.dll',
         debug: window && window.location.hash.indexOf('dbg') > 0,
         saveLastState: true,
         checkSessionCookie: true,
         i18n:false,
         /**
          * Константы с поддержкой тех или иных фич
          * @namespace
          */
         compatibility: {
            dateBug: (new Date(2014, 0, 1, 0, 0, 0, 0).getHours() !== 0),
            /**
             * Поддержка placeholder'а на элементах input
             */
            placeholder: document && !!('placeholder' in document.createElement('input')),
            /**
             * Поддержка загрузки файлов с использованием стандартного инпута (её может не быть, если, к примеру, у пользователя iPad)
             */
            fileupload: document && (function() { var i = document.createElement('input'); i.setAttribute('type', 'file'); return !i.disabled }()),
            /**
             * У старых версий оперы немного другая обработка клавиатурных нажатий. В ней эта константа будет равна false
             */
            correctKeyEvents: window && (!window.opera || parseFloat(window.opera.version()) >= 12.1),
            /**
             * Поддержка css3-анимаций
             */
            cssAnimations: document && (function(){
               var style = document.createElement('div').style;
               return style.transition !== undefined ||  //Opera, IE 10+, Firefox 16+, Chrome 26+, Safari ?
                  style.mozTransition !== undefined ||   //Firefox 4-15 (?)
                  style.webkitTransition !== undefined;  //Chrome ?-25, Safari ? - ?
            })(),
            /**
             * Поддержка <b>requestFullscreen</b> и подобных на элементе (позволяет показывать в полноэкранном режиме только некоторые элементы)
             */
            fullScreen: document && (function(){
               var element = document.createElement('div');
               return element.requestFullscreen !== undefined ||  //Opera
                  element.mozRequestFullScreen !== undefined ||   //Firefox
                  element.webkitRequestFullscreen !== undefined;  //Chrome
            })(),
            /**
             * Поддержка события прокрутки колеса мыши. Есть 3 основных варианта:
             * 1) 'wheel'. DOM3 событие, поддержка есть пока только в ие 9+ и файерфоксе (17+)
             * 2) 'mousewheel'. Старое, популярное событие. Имеет большие проблемы из-за разных значений в различных браузерах и даже ос. Аналог в файерфоксе - MozMousePixelScroll или DOMMouseWheel.
             * 3) 'DOMMouseWheel'. Для файерфокса версии 0.9.7+
             */
            wheel: document && (function(){
               var element = document.createElement('div');
               return (element.onwheel !== undefined || document.documentMode >= 9) ? 'wheel' : // Firefox 17+, IE 9+
                  element.onmousewheel !== undefined ? 'mousewheel' : // Chrome, Opera, IE 8-
                     'DOMMouseScroll'; // older Firefox
            })(),
            cssTransformProperty: cssTransformProperty,
            /**
             * Поддержка css-трансформаций. Появились в Chrome (изначально), Firefox (3.5), Internet Explorer (9), Opera (10.5), Safari (3.1)
             */
            cssTransform: !!cssTransformProperty,
            /**
             * Есть ли поддержка прикосновений (touch) у браузера
             */
            touch: document && (navigator.msMaxTouchPoints || 'ontouchstart' in document.documentElement),
            /**
             * Определение поддержки стандартной работы со стилями
             */
            standartStylesheetProperty: document && (function(){
               var style = document.createElement('style');
               style.setAttribute('type', 'text/css');
               return !style.styleSheet;
            })()
         },
         /**
          * Константы, которые можно использовать для проверки браузера
          * @namespace
          */
         browser: {
            /**
             * Мобильный сафари - iPhone, iPod, iPad
             */
            isMobileSafari: navigator && /(iPod|iPhone|iPad)/.test(navigator.userAgent) && /AppleWebKit/.test(navigator.userAgent) && /Mobile\//.test(navigator.userAgent),
            /**
             * Мобильные версии браузеров на андроиде
             */
            isMobileAndroid: navigator && /Android/.test(navigator.userAgent) && /AppleWebKit/.test(navigator.userAgent) && /Mobile/.test(navigator.userAgent),
            /**
             * internet explorer
             */
            isIE: navigator && (navigator.appVersion.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident') !== -1),
            /**
             * internet explorer 7
             */
            isIE7: navigator && navigator.appVersion.indexOf('MSIE 7.') !== -1,

            /**
             * internet explorer 8
             */
            isIE8: navigator && navigator.appVersion.indexOf('MSIE 8.') !== -1,

            /**
             * internet explorer 9
             */
            isIE9: navigator && navigator.appVersion.indexOf('MSIE 9.') !== -1,

            /**
             * internet explorer 10
             */
            isIE10: navigator && navigator.appVersion.indexOf('MSIE 10.') !== -1,

            IEVersion: IEVersion(),

            IOSVersion: IOSVersion(),

            /**
             * internet explorer 9+
             */
            isModernIE: !('\v' == 'v'),

            /**
             * Firefox
             */
            firefox: navigator && navigator.userAgent.indexOf('Firefox') > -1,

            /**
             * Chrome
             */
            chrome: window && window['chrome'],

            /**
             * Mac OS
             */
            isMacOSDesktop: navigator &&
                            /\bMac\s+OS\s+X\b/.test(navigator.userAgent) &&
                           !/(iPod|iPhone|iPad)/.test(navigator.userAgent)
         },
         buildnumber:"", // jshint ignore:line
         resizeDelay: 40,
         /**
          * Пакеты XML-файлов
          * Формат:
          *    ИмяШаблона: ФайлПакета, ...
          */
         xmlPackages: {},
         /**
          * Пакеты JS-файлов
          * Формат:
          *    ОригинальноеИмяФайла: ИмяФайлаПакета, ...
          */
         jsPackages:{},
         /**
          * Оглавление. Сопоставление коротких имен полным путям
          * Формат:
          *    ИмяШаблона: ФайлШаблона, ...
          */
         xmlContents: {},
         /**
          * Альтернативные имена входного файла
          */
         htmlNames : {},
         /**
          * Декларативная привязка обработчиков на ресурс
          * Формат:
          *    ИмяШаблона: [ ФайлОбработчиков, ФайлОбработчиков, ... ], ...
          */
         hdlBindings: {},
         /**
          * Хосты, с которых запрашиваются файлы
          * Формат:
          *    Хост1, Хост2, Хост3, ...
          */
         hosts : [],
         services: {},
         modules: {},
         jsCoreModules: {
            'SBIS3.CORE.AttributeCfgParser'    : 'lib/Control/AttributeCfgParser/AttributeCfgParser.module.js',
            'SBIS3.CORE.Marker'                : 'lib/Marker/Marker.module.js',
            'SBIS3.CORE.NavigationController'  : 'lib/NavigationController/NavigationController.module.js',
            'SBIS3.CORE.Control'               : 'lib/Control/Control.module.js',
            'SBIS3.CORE.FileButton'            : 'lib/Control/FileButton/FileButton.module.js',
            'SBIS3.CORE.FileBrowse'            : 'lib/Control/FileBrowse/FileBrowse.module.js',
            'SBIS3.CORE.FileScaner'            : 'lib/Control/FileScaner/FileScaner.module.js',
            'SBIS3.CORE.FileScanLoader'        : 'lib/Control/FileScanLoader/FileScanLoader.module.js',
            "SBIS3.CORE.SelectScannerDialog"   : "lib/Control/FileScanLoader/resources/SelectScannerDialog/SelectScannerDialog.module.js",
            'SBIS3.CORE.FileLoader'            : 'lib/Control/FileLoader/FileLoader.module.js',
            'SBIS3.CORE.FileStorageLoader'     : 'lib/Control/FileStorageLoader/FileStorageLoader.module.js',
            'SBIS3.CORE.FileLoaderAbstract'    : 'lib/Control/FileLoaderAbstract/FileLoaderAbstract.module.js',
            'SBIS3.CORE.FileCam'               : 'lib/Control/FileCam/FileCam.module.js',
            'SBIS3.CORE.FileCamLoader'         : 'lib/Control/FileCamLoader/FileCamLoader.module.js',
            'SBIS3.CORE.CameraWindow'          : 'lib/Control/FileCamLoader/resources/CameraWindow/CameraWindow.module.js',
            'SBIS3.CORE.FileClipboard'         : 'lib/Control/FileClipboard/FileClipboard.module.js',
            'SBIS3.CORE.FileClipboardLoader'   : 'lib/Control/FileClipboardLoader/FileClipboardLoader.module.js',
            'SBIS3.CORE.Button'                : 'lib/Control/Button/Button.module.js',
            'SBIS3.CORE.Infobox'               : 'lib/Control/Infobox/Infobox.module.js',
            'SBIS3.CORE.InfoboxTrigger'        : 'lib/Control/InfoboxTrigger/InfoboxTrigger.module.js',
            'SBIS3.CORE.LoadingIndicator'      : 'lib/Control/LoadingIndicator/LoadingIndicator.module.js',
            'SBIS3.CORE.Paging'                : 'lib/Control/Paging/Paging.module.js',
            'SBIS3.CORE.PathSelector'          : 'lib/Control/PathSelector/PathSelector.module.js',
            'SBIS3.CORE.PathFilter'            : 'lib/Control/PathFilter/PathFilter.module.js',
            'SBIS3.CORE.HierarchyView'         : 'lib/Control/HierarchyView/HierarchyView.module.js',
            'SBIS3.CORE.HierarchyCustomView'   : 'lib/Control/HierarchyCustomView/HierarchyCustomView.module.js',
            'SBIS3.CORE.TreeView'              : 'lib/Control/TreeView/TreeView.module.js',
            'SBIS3.CORE.HierarchyViewAbstract' : 'lib/Control/HierarchyViewAbstract/HierarchyViewAbstract.module.js',
            'SBIS3.CORE.CustomView'            : 'lib/Control/CustomView/CustomView.module.js',
            'SBIS3.CORE.TableView'             : 'lib/Control/TableView/TableView.module.js',
            'SBIS3.CORE.DataViewAbstract'      : 'lib/Control/DataViewAbstract/DataViewAbstract.module.js',
            'SBIS3.CORE.Browser'               : 'lib/Control/Browser/Browser.module.js',
            'SBIS3.CORE.DataView'              : 'lib/Control/DataView/DataView.module.js',
            'SBIS3.CORE.ListView'              : 'lib/Control/ListView/ListView.module.js',
            'SBIS3.CORE.Suggest'               : 'lib/Control/Suggest/Suggest.module.js',
            'SBIS3.CORE.SwitcherAbstract'      : 'lib/Control/SwitcherAbstract/SwitcherAbstract.module.js',
            'SBIS3.CORE.Switcher'              : 'lib/Control/Switcher/Switcher.module.js',
            'SBIS3.CORE.SwitcherDouble'        : 'lib/Control/SwitcherDouble/SwitcherDouble.module.js',
            'SBIS3.CORE.FieldDropdown'         : 'lib/Control/FieldDropdown/FieldDropdown.module.js',
            'SBIS3.CORE.FieldLabel'            : 'lib/Control/FieldLabel/FieldLabel.module.js',
            'SBIS3.CORE.FieldFormatAbstract'   : 'lib/Control/FieldFormatAbstract/FieldFormatAbstract.module.js',
            'SBIS3.CORE.FieldMask'             : 'lib/Control/FieldMask/FieldMask.module.js',
            'SBIS3.CORE.FieldMonth'            : 'lib/Control/FieldMonth/FieldMonth.module.js',
            'SBIS3.CORE.FieldAbstract'         : 'lib/Control/FieldAbstract/FieldAbstract.module.js',
            'SBIS3.CORE.FieldString'           : 'lib/Control/FieldString/FieldString.module.js',
            'SBIS3.CORE.FieldEditAtPlace'      : 'lib/Control/FieldEditAtPlace/FieldEditAtPlace.module.js',
            'SBIS3.CORE.SearchString'          : 'lib/Control/SearchString/SearchString.module.js',
            'SBIS3.CORE.PageFilter'            : 'lib/Control/PageFilter/PageFilter.module.js',
            'SBIS3.CORE.FieldText'             : 'lib/Control/FieldText/FieldText.module.js',
            'SBIS3.CORE.FieldRichEditor'       : 'lib/Control/FieldRichEditor/FieldRichEditor.module.js',
            'SBIS3.CORE.FieldRichEditor.ImagePropertiesDialog' : 'lib/Control/FieldRichEditor/resources/ImagePropertiesDialog/ImagePropertiesDialog.module.js',
            'SBIS3.CORE.Menu'                  : 'lib/Control/Menu/Menu.module.js',
            'SBIS3.CORE.FieldDate'             : 'lib/Control/FieldDate/FieldDate.module.js',
            'SBIS3.CORE.FieldDatePicker'       : 'lib/Control/FieldDatePicker/FieldDatePicker.module.js',
            'SBIS3.CORE.FilterController'      : 'lib/Control/FilterController/FilterController.module.js',
            'SBIS3.CORE.FiltersArea'           : 'lib/Control/FiltersArea/FiltersArea.module.js',
            'SBIS3.CORE.FiltersDialog'         : 'lib/Control/FiltersDialog/FiltersDialog.module.js',
            'SBIS3.CORE.FiltersWindow'         : 'lib/Control/FiltersWindow/FiltersWindow.module.js',
            'SBIS3.CORE.FilterView'            : 'lib/Control/FilterView/FilterView.module.js',
            'SBIS3.CORE.FloatArea'             : 'lib/Control/FloatArea/FloatArea.module.js',
            'SBIS3.CORE.RecordFloatArea'       : 'lib/Control/RecordFloatArea/RecordFloatArea.module.js',
            'SBIS3.CORE.FilterFloatArea'       : 'lib/Control/FilterFloatArea/FilterFloatArea.module.js',
            'SBIS3.CORE.FilterButton'          : 'lib/Control/FilterButton/FilterButton.module.js',
            'SBIS3.CORE.Master'                : 'lib/Control/Master/Master.module.js',
            /*'SBIS3.CORE.SchemeEditor'          : 'lib/Control/SchemeEditor/SchemeEditor.module.js',*/
            'SBIS3.CORE.TabTemplatedArea'      : 'lib/Control/TabTemplatedArea/TabTemplatedArea.module.js',
            'SBIS3.CORE.Tabs'                  : 'lib/Control/Tabs/Tabs.module.js',
            'SBIS3.CORE.Grid'                  : 'lib/Control/Grid/Grid.module.js',
            'SBIS3.CORE.RelativeGrid'          : 'lib/Control/RelativeGrid/RelativeGrid.module.js',
            'SBIS3.CORE.GridLayout'            : 'lib/Control/GridLayout/GridLayout.module.js',
            'SBIS3.CORE.StackPanel'            : 'lib/Control/StackPanel/StackPanel.module.js',
            'SBIS3.CORE.Table'                 : 'lib/Control/Table/Table.module.js',
            'SBIS3.CORE.Accordion'             : 'lib/Control/Accordion/Accordion.module.js',
            'SBIS3.CORE.NavigationPanel'       : 'lib/Control/NavigationPanel/NavigationPanel.module.js',
            'SBIS3.CORE.ToolBar'               : 'lib/Control/ToolBar/ToolBar.module.js',
            'SBIS3.CORE.FieldImage'            : 'lib/Control/FieldImage/FieldImage.module.js',
            'SBIS3.CORE.ImageGallery'          : 'lib/Control/ImageGallery/ImageGallery.module.js',
            'SBIS3.CORE.FieldLink'             : 'lib/Control/FieldLink/FieldLink.module.js',
            'SBIS3.CORE.FieldNumeric'          : 'lib/Control/FieldNumeric/FieldNumeric.module.js',
            'SBIS3.CORE.FieldInteger'          : 'lib/Control/FieldInteger/FieldInteger.module.js',
            'SBIS3.CORE.FieldMoney'            : 'lib/Control/FieldMoney/FieldMoney.module.js',
            'SBIS3.CORE.FieldRadio'            : 'lib/Control/FieldRadio/FieldRadio.module.js',
            'SBIS3.CORE.ProgressBar'           : 'lib/Control/ProgressBar/ProgressBar.module.js',
            'SBIS3.CORE.HTMLChunk'             : 'lib/Control/HTMLChunk/HTMLChunk.module.js',
            'SBIS3.CORE.MasterProgress'        : 'lib/Control/MasterProgress/MasterProgress.module.js',
            'SBIS3.CORE.GroupCheckBox'         : 'lib/Control/GroupCheckBox/GroupCheckBox.module.js',
            'SBIS3.CORE.OperationsPanel'       : 'lib/Control/OperationsPanel/OperationsPanel.module.js',
            'SBIS3.CORE.HTMLView'              : 'lib/Control/HTMLView/HTMLView.module.js',
            'SBIS3.CORE.DateRange'             : 'lib/Control/DateRange/DateRange.module.js',
            'SBIS3.CORE.DateRangeChoose'       : 'lib/Control/DateRangeChoose/DateRangeChoose.module.js',
            'SBIS3.CORE.FieldCheckbox'         : 'lib/Control/FieldCheckbox/FieldCheckbox.module.js',
            'SBIS3.CORE.RecordArea'            : 'lib/Control/RecordArea/RecordArea.module.js',
            'SBIS3.CORE.GridAbstract'          : 'lib/Control/GridAbstract/GridAbstract.module.js',
            'SBIS3.CORE.Dialog'                : 'lib/Control/Dialog/Dialog.module.js',
            'SBIS3.CORE.DialogAlert'           : 'lib/Control/DialogAlert/DialogAlert.module.js',
            'SBIS3.CORE.DialogConfirm'         : 'lib/Control/DialogConfirm/DialogConfirm.module.js',
            'SBIS3.CORE.DialogRecord'          : 'lib/Control/DialogRecord/DialogRecord.module.js',
            'SBIS3.CORE.Selector'              : 'lib/Control/DialogSelector/Selector.module.js',
            'SBIS3.CORE.DialogSelector'        : 'lib/Control/DialogSelector/DialogSelector.module.js',
            'SBIS3.CORE.FloatAreaSelector'     : 'lib/Control/DialogSelector/FloatAreaSelector.module.js',
            'SBIS3.CORE.SimpleDialogAbstract'  : 'lib/Control/SimpleDialogAbstract/SimpleDialogAbstract.module.js',
            'SBIS3.CORE.Window'                : 'lib/Control/Window/Window.module.js',
            'SBIS3.CORE.ModalOverlay'          : 'lib/Control/ModalOverlay/ModalOverlay.module.js',
            'SBIS3.CORE.TemplatedArea'         : 'lib/Control/TemplatedArea/TemplatedArea.module.js',
            'SBIS3.CORE.TemplatedAreaAbstract' : 'lib/Control/TemplatedAreaAbstract/TemplatedAreaAbstract.module.js',
            'SBIS3.CORE.AreaAbstract'          : 'lib/Control/AreaAbstract/AreaAbstract.module.js',
            'SBIS3.CORE.RaphaelMultiGraph'     : 'lib/Control/RaphaelMultiGraph/RaphaelMultiGraph.module.js',
            'SBIS3.CORE.RaphaelPieGraph'       : 'lib/Control/RaphaelPieGraph/RaphaelPieGraph.module.js',
            'SBIS3.CORE.RaphaelChartGraph'     : 'lib/Control/RaphaelChartGraph/RaphaelChartGraph.module.js',
            'SBIS3.CORE.RaphaelDrawerInternal' : 'lib/Control/RaphaelDrawerInternal/RaphaelDrawerInternal.module.js',
            'SBIS3.CORE.DragAndDropPlugin'     : 'lib/Control/DragAndDropPlugin/DragAndDropPlugin.module.js',
            'SBIS3.CORE.CompoundControl'       : 'lib/Control/CompoundControl/CompoundControl.module.js',
            'SBIS3.CORE.TabButtons'            : 'lib/Control/TabButtons/TabButtons.module.js',
            'SBIS3.CORE.CollapsingNavigation'  : 'lib/CollapsingNavigation/CollapsingNavigation.module.js',

            'SBIS3.CORE.CopyPlugin'            : 'lib/Control/DataViewAbstract/plugins/Copy-plugin.js',
            'SBIS3.CORE.HistoryPlugin'         : 'lib/Control/DataViewAbstract/plugins/History-plugin.js',
            'SBIS3.CORE.MarkedRowOptionsPlugin': 'lib/Control/DataViewAbstract/plugins/MarkedRowOptions-plugin.js',
            'SBIS3.CORE.MergePlugin'           : 'lib/Control/DataViewAbstract/plugins/Merge-plugin.js',
            'SBIS3.CORE.PrintPlugin'           : 'lib/Control/DataViewAbstract/plugins/Print-plugin.js',
            'SBIS3.CORE.ToolbarPlugin'         : 'lib/Control/DataViewAbstract/plugins/Toolbar-plugin.js',
            'SBIS3.CORE.MovePlugin'            : 'lib/Control/DataViewAbstract/plugins/Move-plugin.js',

            'SBIS3.CORE.AtPlaceEditPlugin'     : 'lib/Control/TableView/plugins/AtPlaceEdit-plugin.js',
            'SBIS3.CORE.LadderPlugin'          : 'lib/Control/TableView/plugins/Ladder-plugin.js',
            'SBIS3.CORE.ResultsPlugin'         : 'lib/Control/TableView/plugins/Results-plugin.js',
            'SBIS3.CORE.ColorMarkPlugin'       : 'lib/Control/TableView/plugins/ColorMark-plugin.js',
            'SBIS3.CORE.PartScrollPlugin'      : 'lib/Control/TableView/plugins/PartScroll-plugin/PartScroll-plugin.js',
            'SBIS3.CORE.ScrollPaging'          : 'lib/Control/TableView/plugins/ScrollPaging-plugin.js',
            'SBIS3.CORE.RightAccordionPlugin'  : 'lib/Control/TableView/plugins/RightAccordion-plugin/RightAccordion-plugin.js',

            'SBIS3.CORE.CropPlugin'            : 'lib/Control/FieldImage/plugins/FieldImageCrop-plugin.js',
            'SBIS3.CORE.ZoomPlugin'            : 'lib/Control/FieldImage/plugins/FieldImageZoom-plugin.js',

            'SBIS3.CORE.AccordionCollapsePlugin':'lib/Control/Accordion/plugins/Collapse-plugin.js',
            'SBIS3.CORE.NavigationPanelCollapsePlugin':'lib/Control/NavigationPanel/plugins/Collapse-plugin.js',

            'SBIS3.CORE.RequestHistoryPlugin'  : 'lib/Control/FilterButton/plugins/RequestHistory-plugin.js',

            'SBIS3.CORE.Label'                 : 'lib/Control/Label/Label.module.js',
            'SBIS3.CORE.ButtonAbstract'        : 'lib/Control/ButtonAbstract/ButtonAbstract.module.js',
            'SBIS3.CORE.LinkButton'            : 'lib/Control/LinkButton/LinkButton.module.js',
            'SBIS3.CORE.OutlineButton'           : 'lib/Control/OutlineButton/OutlineButton.module.js',
            'SBIS3.CORE.PushButton'            : 'lib/Control/PushButton/PushButton.module.js',
            'SBIS3.CORE.TabControl'            : 'lib/Control/TabControl/TabControl.module.js',
            'SBIS3.CORE.SwitchableArea'        : 'lib/Control/SwitchableArea/SwitchableArea.module.js',
            'SBIS3.CORE.FloatAreaManager'      : 'lib/FloatAreaManager/FloatAreaManager.module.js',

            "SBIS3.CORE.CustomType"            : "lib/Type/CustomType.module.js",
            "SBIS3.CORE.TDataSource"           : "lib/Type/TDataSource/TDataSource.module.js",
            "SBIS3.CORE.TReaderParams"         : "lib/Type/TReaderParams/TReaderParams.module.js",
            "SBIS3.CORE.PluginManager"         : "lib/PluginManager/PluginManager.module.js",
            "SBIS3.CORE.PluginSetupDialog"     : "lib/PluginManager/resources/PluginSetupDialog/PluginSetupDialog.module.js",
            'SBIS3.CORE.DataBoundMixin'        : 'lib/Mixins/DataBoundMixin.module.js',
            'SBIS3.CORE.ServerEventBus'        : 'lib/ServerEventBus/ServerEventBus.module.js',
            'SBIS3.CORE.CloseButton'           : 'lib/Control/CloseButton/CloseButton.module.js',
            'SBIS3.CORE.Cache'                 : 'lib/Cache/Cache.module.js',
            'SBIS3.CORE.CoreValidators'        : 'lib/CoreValidators/CoreValidators.module.js',
            'SBIS3.CORE.KbLayoutRevert'        : 'lib/KbLayoutRevert/KbLayoutRevert.module.js'
         },
         jsModules:{},
         /**
          * Информация о словарях, чтобы знать какие есть и какие грузить
          * Временная мера (все временное постоянно :( )
          */
         jsDictionary:{
            'SBIS3.CORE.DialogConfirm.uk-UA.json'     : 'ws/lib/Control/DialogConfirm/resources/lang/uk-UA/uk-UA.json',
            'SBIS3.CORE.LoadingIndicator.uk-UA.json'  : 'ws/lib/Control/LoadingIndicator/resources/lang/uk-UA/uk-UA.json',
            'SBIS3.CORE.PathSelector.uk-UA.json'      : 'ws/lib/Control/PathSelector/resources/lang/uk-UA/uk-UA.json',
            'SBIS3.CORE.Control.uk-UA.json'           : 'ws/lib/Control/resources/lang/uk-UA/uk-UA.json',
            'SBIS3.CORE.SearchString.uk-UA.json'      : 'ws/lib/Control/SearchString/resources/lang/uk-UA/uk-UA.json'
         },
         classLoaderMappings: {},
         /**
          * Расстояние, утянув объект на которое, начинается drag&drop
          */
         startDragDistance: 4,
         availableLanguage: {},
         /**
          * Классы контролов-окон, которые могут быть родителями других окон и всплывающих панелей.
          */
         WINDOW_CLASSES: ['SBIS3.CORE.FloatArea', 'SBIS3.CORE.Window', 'SBIS3.CORE.FieldEditAtPlace']
      },
      /**
       * Хранилище загруженных обработчиков
       */
      _handlers: {},
      core : {},
      helpers : {},
      java: {},
      /**
       * Хранилище прототипов классов
       */
      proto : {},
      /**
       * Хранилище синглтонов
       */
      single : {},
      /**
       * Хранилище миксинов
       */
      mixins : {},
      /**
       * Рендеры.
       * См. {@link $ws.render.defaultColumn}.
       * @namespace
       */
      render : {
         /**
          * @namespace
          */
         defaultColumn: {
            /**
             * Отображает число с добавлением нулей слева от него.
             * Используется для приведения к виду с заданным количеством знаков.
             * @param {Number} val Число.
             * @param {Number} l Количество знаков, которое должно получиться.
             * @returns {String} Отформатированное число
             * @example
             * <pre>
             *     $ws.render.defaultColumn.leadZero(2, 5); // выведет 00002
             * </pre>
             */
            leadZero : function(val, l){
               var s ='' + Math.floor(val);
               if (s.length < l) {
                  s = '00000000000000000000000000000000'.substr(0, l - s.length) + s;
               }
               return s;
            },
            /**
             * Отображает форматированное целое число.
             * Производит отделение разрядов пробелами.
             * format: -N NNN, ..., -1, 0, 1, ... N NNN.
             * Например, 123456 = 123 456.
             * @param {Number} val Целое число.
             * @param {Boolean} [noDelimiters = false] Не нужны ли разделители:
             * true - не будет производить форматирование по разрядам.
             * false или null - разделит разряды пробелами.
             * @returns {string} Возвращает отформатированное число.
             * @example
             * <pre>
             *     $ws.render.defaultColumn.integer(1111111) // выведет 1 111 111
             * </pre>
             * <pre>
             *     $ws.render.defaultColumn.integer(1111111, true) // выведет 1111111
             * </pre>
             */
            integer : function(val, noDelimiters){
               try {
                  val = String.trim('' + val);
               } catch (e) {
                  val = '';
               }
               //пример регулярки "-000233.222px"
               var numRe = /^-?([0]*)(\d+)\.?\d*\D*$/, f;
               if(!val.match(numRe))
                  return '0';
               f = val.replace(numRe, '$2');
               return (val.substr(0, 1) == '-' ? '-' : '') + (noDelimiters ? f : String.trim(f.replace(/(?=(\d{3})+$)/g, ' ')));
            },
            /**
             * Спан для boolean, формирует вёрстку: если true - чекбокс с галочкой, иначе пустой.
             * @param {Boolean} val Исходное значение.
             * @param {Boolean} [returnStr = false] Нужно ли вернуть как строку или же как jQuery(на случай использования в прикладном коде).
             * По умолчанию возвращает jQuery-объект.
             * @returns {String|jQuery} Cтрока или jQuery-объект.
             * @example
             * <pre>
             *     $ws.render.defaultColumn.logic(true,true); // вернёт "<span class="ws-browser-checkbox-logic true"></span>"
             * </pre>
             */
            logic: function(val, returnStr){
               var className;
               if (val) {
                  className = 'ws-browser-checkbox-logic-true';
               } else {
                  className = 'ws-browser-checkbox-logic-false';
               }
               var str = '<span class="ws-browser-checkbox-logic ' + (className) + '"></span>';
               return returnStr ? str : $(str);
            },
            /**
             * Отображает число в формате денежной единицы
             * Округляет с точностью до двух знаков после запятой, целую часть разделяет на разряды пробелами.
             * Дробная часть округляется математически.
             * format: -N NNN.NN, ..., -1.00, -, 1.00, ... N NNN.NN
             * @param {Number} val Вещественное число.
             * @returns {String} {val} Форматированное вещественное число.
             * @example
             * <pre>
             *     $ws.render.defaultColumn.money(12345.678); // выведет "12 345.68"
             * </pre>
             */
            money : function(val){
               return $ws.render.defaultColumn.real(val, 2, true);
            },
            /**
             * Отображает значение в виде отформатированного числа
             * @param val Вещественное число.
             * @param {Number} integers Количество знаков до запятой.
             * @param {Boolean} delimiters Отделить ли разряды пробелами.
             * @param {Number} decimals Количество знаков после запятой. Если их нет, то допишет нули.
             * @param {Boolean} notNegative Показывать только неотрицательное значения или произвольные
             * @param {Number} maxLength Задание максимальной длины текста в поле
             * @returns {String} val Отформатированное число.
             */
            numeric: function(val, integers, delimiters, decimals, notNegative, maxLength) {
               var
                  // позиция точки
                  dotPos,
                  // позиция второй точки
                  dotSec,
                  // позиция 0 до точки справа
                  lastZeroPos,
                  // присутствует ли минус в значении
                  hasMinus;
               if ((val+'').indexOf('e') !== -1 && !isNaN(parseFloat(val+''))) {
                  val = val.toFixed(20);
                  lastZeroPos = val.length;
                  while (val.charAt(lastZeroPos-1) === '0') {
                     --lastZeroPos;
                  }
                  val = val.substr(0, lastZeroPos);
               }
               val = ('' + val).replace(notNegative ? /[^0-9\.]/g : /[^0-9\.\-]/g,'');
               dotPos = val.indexOf('.');
               dotSec = val.indexOf('.',dotPos+1);
               hasMinus = /\-/.test(val) ? 1 : 0;
               if (dotSec !== -1) {
                  val = val.substring(0,dotSec);
               }
               if (dotPos === val.length-1) {
                  val = val.substr(0,val.length-1);
                  dotPos = -1;
               }
               if(!/^\-?[0-9]*(\.[0-9]*)?$/.test(val)) {
                  val = '';
               }
               if (val === '' || val === null) { // все нумерик поля кроме денег могут иметь значение null
                  val = null;
               } else {
                  if (integers >= 0) {
                     if (dotPos === -1) {
                        dotPos = val.length;
                     }
                     if (integers + hasMinus < dotPos) {
                        val = val.substring(0, integers + hasMinus) + val.substr(dotPos);
                     }
                     dotPos = val.indexOf('.');
                  }
                  if (decimals < 0) {
                     val = dotPos === -1
                        ? $ws.render.defaultColumn.integer(val, !delimiters)
                        : [
                        $ws.render.defaultColumn.integer(val.substring(0, dotPos), !delimiters),
                        val.substr(dotPos)
                     ].join('');
                  } else {
                     val = val.substr(0, maxLength && !delimiters ?  maxLength : val.length);
                     val = $ws.render.defaultColumn.real(val, decimals, delimiters);
                  }
               }
               return val;
            },
             /**
              * Отображает значение в виде отформатированного вещественного числа
              * @param val Вещественное число.
              * @param {Number} decimals Количество знаков после запятой. Если их нет, то допишет нули.
              * @param {Boolean} delimiters Отделить ли разряды пробелами.
              * @returns {String} val Отформатированное вещественное число.
              * @example
              * <pre>
              *     $ws.render.defaultColumn.real(2564, 2, true); // выведет "2 564.00"
              * </pre>
              */
            real : function(val, decimals, delimiters){
               decimals = decimals === undefined ? 0 : decimals;
               var dotPos = (val = (val + "")).indexOf(".");
               // Если передано значение без точки или нам нужна только целая часть
               if (decimals === 0) {
                  return $ws.render.defaultColumn.integer(val, !delimiters);
               }

               var firstPart = val;
               if (dotPos != -1)
                  firstPart = val.substring(0, dotPos);

               // Получаем математическое округление дробной части
               var
                  parsedVal = dotPos != -1 ? val.substr(dotPos) : 0,
                  weNeedDecimals;
               if(parsedVal == '.')
                  parsedVal = '.0';
               weNeedDecimals = parseFloat(parsedVal).toFixed(decimals);
               if(weNeedDecimals == 1)
                  firstPart = parseInt(firstPart,10) +1;
               weNeedDecimals = weNeedDecimals.replace(/.+\./, "");

               var buffer = [];
               buffer.push($ws.render.defaultColumn.integer(firstPart, !delimiters));
               buffer.push('.');
               buffer.push(weNeedDecimals);
               return buffer.join('');
            },
            /**
             * Отображает любое число в виде вещественного с 3 знаками после запятой
             * Может использоваться для перевода из миллисекунд в секунды и других целей.
             * В результате перевода всегда будут 3 знака после запятой - допишутся нули,
             * если их окажется меньше, например 20000 = 20,000.
             * При делении округляет в меньшую сторону, например, 2,65 = 0,002.
             * @param {number} val Вещественное число.
             * @returns {String} Возвращает строку.
             * @example
             * <pre>
             *     $ws.render.defaultColumn.timer(123456); // выведет 123.456
             * </pre>
             */
            timer : function(val){
               return Math.floor(val / 1000) + "." + $ws.render.defaultColumn.leadZero(val % 1000, 3);
            },
            /**
             * Отображает объект Date строкой вида 'DD.MM.YY HH:MM:SS'
             * Например, new Date(2010,8,6,17,44,15) преобразуется в '06.09.10 17:44:15'.
             * Месяцы нумеруются с 0 по 11. 0 - январь, 11 - декабрь.
             * @param {} date объект
             * @param {String} [type] Возможны три вида: "Дата", "Время", "Дата и время".
             * @param {Boolean} [ms = false] если выставить true, то добавит миллисекунды.
             * @returns {String} Возвращает строку.
             * @example
             * <pre>
             *     $ws.render.defaultColumn.timestamp(new Date(2013,10,7,9,27,0,1), "Дата и время", true); // выведет "07.11.13 09:27:00.001"
             * </pre>
             */
            timestamp : function(date, type, ms){
               var retval = "",
                   year, month, day, hours, minutes, seconds, millisec;
               if(date instanceof Date){
                  year = date.getFullYear()%100;
                  month = date.getMonth() + 1;
                  day = date.getDate();
                  hours = date.getHours();
                  minutes = date.getMinutes();
                  seconds = date.getSeconds();
                  millisec = date.getMilliseconds();
                  if(type !== "time" && type !== "Время")
                     retval = ((day < 10 ? "0" : "") + day) + "." + ((month < 10 ? "0" : "") + month) + "." + ((year < 10 ? "0" : "") + year);
                  if(type in {"timestamp": 0, "Дата и время": 0, "time": 0, "Время": 0}){
                     retval += type in {"time": 0, "Время": 0} ? "" : " ";
                     retval +=  ((hours < 10 ? "0" : "") + hours) + ":" + ((minutes < 10 ? "0" : "") + minutes);
                     retval += ":" + (seconds < 10 ? "0" : "") + seconds;

                     if(ms === true) {
                        if(millisec > 0) {
                           if(millisec < 10)
                              retval += ".00" + millisec;
                           else {
                              if(millisec < 100)
                                 retval += ".0" + millisec;
                              else
                                 retval += "." + millisec;
                           }
                        }
                        else
                           retval += ".000";
                     }
                  }
               }
               else {
                  retval = "&minus;";
               }
               return retval;
            },
            /**
              * Отображение по умолчанию для колонок типа "перечисляемое"
              * Отображает текущее значение.
              * @param {$ws.proto.Enum} iEnum Набор доступных значений.
              * @returns {String} Возвращает строковое значение, соответствующее переданному экземпляру.
              * @example
              * <pre>
              *     var myEnum = new $ws.proto.Enum({
              *         availableValues: {
              *             "0" : "синий",
              *             "1" : "красный",
              *             "2" : "белый"
              *         }
              *     });
              *     myEnum.set("1");
              *     $ws.render.defaultColumn.enumType(myEnum); // выведет "красный"
              * </pre>
             */
            enumType: function(iEnum) {
               if(iEnum instanceof $ws.proto.Enum){
                  var value = iEnum.getCurrentValue();
                  if(value === null){
                     return '';
                  }
                  return iEnum.getValues()[iEnum.getCurrentValue()];
               }
               return '';
            },
            /**
             * Отображение по умолчанию для колонок типа "флаги"
             * @param {$ws.proto.Record} record Запись, флаги передаются именно в таком виде.
             * @returns {string} Возвращает строку заголовков активных флагов через запятую.
             * <pre>
             *    var record = new $ws.proto.Record({
             *       colDef: [{
             *          "n": "Первое",
             *          "t": "Логическое"
             *       },{
             *          "n": "Второе",
             *          "t": "Логическое"
             *       },{
             *          "n": "Третье",
             *          "t": "Логическое"
             *       }],
             *       row: [true, false, true]
             *    });
             *    $ws.render.defaultColumn.flags(record); // выведет "Первое, Третье"
             * </pre>
             */
            flags: function(record){
               var res = [];
               record.each(function(title, value){
                  if(value){
                     res.push(title);
                  }
               });
               if(res.length){
                  return res.join(', ');
               }
               return "&minus;";
            },
            /**
             * Проверяет принадлежность типа к строковому
             * @param {String} type Тип данных.
             * @returns {Boolean} true, если передано строковое значение, иначе false.
             * @example
             * <pre>
             *     $ws.render.defaultColumn.isText("xid"); // выведет "false"
             * </pre>
             */
            isText: function(type){
               return type.indexOf('char') !== -1 || type == 'text';
            }
         }
      }
   };
})();

/**
 * IoC контейнер
 * Эта штука позволяет нам конфигурировать, какая конкретная реализация соответствует заданному интерфейсу.
 * Все как во взрослых языках, ога.
 * Это используется например для:
 *    - конфигурирования какой транспорт использовать;
 *    - конфигурирования system-wide логгера.
 *
 * <pre>
 *    $ws.single.ioc.bind('ITransport', 'XHRPostTransport');
 *    $ws.single.ioc.bindSingle('ILogger', 'ConsoleLogger', { ...config...});
 *    ...
 *    $ws.single.ioc.resolve('ITransport', config);
 *    $ws.single.ioc.resolve('ILogger');
 * </pre>
 *
 * @class $ws.single.ioc
 * @singleton
 */
$ws.single.ioc = (function(){
   var
         map = {},
         singletons = {};
   return /** @lends $ws.single.ioc.prototype */ {
      /**
       * Привязывает реализацию к интерфейсу.
       *
       * @param {String} interfaceName
       * @param {String|Function} implementationName Имя реализации или функция-резолвер возвращающая экземпляр
       */
      bind: function(interfaceName, implementationName){
         map[interfaceName] = {
            implementation: implementationName,
            isSingle: 0
         };
      },
      /**
       * Привязывает единственный экземпляр реализации к указанному "интерфейсу"
       *
       * @param {String} interfaceName
       * @param {String} implementationName
       * @param {Object} [config]
       */
      bindSingle: function(interfaceName, implementationName, config) {
         map[interfaceName] = {
            implementation: implementationName,
            isSingle: 1,
            config: config || {}
         };
         singletons[interfaceName] = '';
      },
      /**
       * @param {String} interfaceName
       * @param {Object} [config]
       * @returns {Object}
       * @throws TypeError
       * @throws ReferenceError
       */
      resolve: function(interfaceName, config){
         if(interfaceName in map){
            var
                  binding = map[interfaceName],
                  classConstructorName = binding.implementation,
                  isSingleton = binding.isSingle;
            if(isSingleton && singletons[interfaceName])
               return singletons[interfaceName];

            // resolver mode
            if(typeof classConstructorName == 'function')
               return classConstructorName(config);

            if(typeof($ws.proto[classConstructorName]) == 'function') {
               if(isSingleton)
                  return singletons[interfaceName] = new $ws.proto[classConstructorName](binding.config);
               else
                  return new $ws.proto[classConstructorName](config);
            }
            else
               throw new TypeError("Implementation " + classConstructorName + " is not defined");
         }
         else
            throw new ReferenceError("No mappings defined for " + interfaceName);
      }
   };
})();

/**
 * @class $ws.core
 */
$ws.core = /** @lends  $ws.core.prototype */{
   /**
    * Объединение двух hash.
    * @param {Object} hash Исходный хэш.
    * @param {Object} hashExtender хэш-расширение.
    * @param {Object} [cfg] Параметры работы.
    * @param {Boolean} [cfg.preferSource=false] Сохранять или нет исходное значение. По умолчанию исходное значение не сохраняется.
    * @param {Boolean} [cfg.rec=true] Рекурсивное объединение (по умолчанию - рекурсивное объединение включено).
    * @param {Boolean} [cfg.clone=false] Клонировать элементы или передавать по ссылке (по умолчанию - по ссылке).
    * @param {Boolean} [cfg.create=true] Создавать элементы, отсутствующие в исходном объекте. По умолчанию включено.
    * @param {Boolean} [cfg.noOverrideByNull=false] Запретить заменять исходные значения на null. По умолчанию выключено.
    */
   merge : function wsCoreMerge(hash, hashExtender, cfg){
      if (cfg === undefined)
         cfg = {};
      cfg.preferSource = cfg.preferSource !== undefined ? cfg.preferSource : false; // не сохранять исходное значение
      cfg.rec = cfg.rec !== undefined ? cfg.rec : true;  // объединять рекурсивно
      cfg.clone = cfg.clone !== undefined ? cfg.clone : false; // не клонировать элементы (передаем по ссылке)
      cfg.create = cfg.create !== undefined ? cfg.create : true; // создавать элементы, которых нет в исходном хэше
      cfg.noOverrideByNull = cfg.noOverrideByNull  !== undefined ? cfg.noOverrideByNull : false; // не заменять значения null'овыми

      if(hashExtender instanceof Date) {
         if(cfg.clone) {
            return new Date(hashExtender);
         } else {
            hash = hashExtender;
            return hash;
         }
      }

      function isMergeableObject(o) {
         return o && ((o.constructor == Object && !('$constructor' in o)) || o.constructor == Array);
      }

      function cloneOrCopy(i){
         /**
          * Если к нам пришел объект и можно клонировать
          * Запускаем мерж того, что пришло с пустым объектом (клонируем ссылочные типы).
          */
         if ((typeof(hashExtender[i]) == 'object' && hashExtender[i] !== null) && cfg.clone) {
            if (isMergeableObject(hashExtender[i])) {
               hash[i] = $ws.core.merge(hashExtender[i] instanceof Array ? [] : {}, hashExtender[i], cfg);
            }
            else{
               hash[i] = hashExtender[i];
            }
         }
         /**
          * Иначе (т.е. это
          *  ... не объект (простой тип) или
          *  ... запрещено клонирование)
          *
          * Если к нам пришел null и запрещено им заменять - не копируем.
          */
         else if(!(hashExtender[i] === null && cfg.noOverrideByNull))
            hash[i] = hashExtender[i];
      };

      if(typeof(hash) == 'object' && hash !== null && typeof(hashExtender) == "object" && hashExtender !== null){
         for (var i in hashExtender){
            if (hashExtender.hasOwnProperty(i)){
               // Если индекса в исходном хэше нет и можно создавать
               if (hash[i] === undefined) {
                  if(cfg.create) {
                     if(hashExtender[i] === null)
                        hash[i] = null;
                     else
                        cloneOrCopy(i);
                  }
               }
               else if (!cfg.preferSource){ // Индекс есть, исходное значение можно перебивать
                  if (hash[i] && typeof hash[i] == "object" && typeof hashExtender[i] == "object") {
                     // Объект в объект
                     if(hash[i] instanceof Date) {
                        if(hashExtender[i] instanceof Date) {
                           if (cfg.clone) {
                              hash[i] = new Date(+hashExtender[i]);
                           } else {
                              hash[i] = hashExtender[i];
                           }
                           continue;
                        }
                        else {
                           // Исходный - дата, расщирение - нет. Сделаем пустышку в которую потом замержим новые данные
                           hash[i] = hashExtender[i] instanceof Array ? [] : {};
                        }
                     }
                     else {
                        if(hashExtender[i] instanceof Date) {
                           if (cfg.clone) {
                              hash[i] = new Date(+hashExtender[i]);
                           } else {
                              hash[i] = hashExtender[i];
                           }
                           continue;
                        }
                     }

                     if (cfg.rec && (isMergeableObject(hashExtender[i]) || hashExtender[i] === null)) {
                        hash[i] = $ws.core.merge(hash[i], hashExtender[i], cfg);
                     } else {
                        hash[i] = hashExtender[i];
                     }
                  }
                  else // Перебиваем что-то в что-то другое...
                     cloneOrCopy(i);
               }
               /**
                * Исходное значение имеет приоритет, но разрешена рекурсия
                * Идем глубже.
                */
               else if (typeof hash[i] == "object" && typeof hashExtender[i] == "object" && cfg.rec) {
                  if (isMergeableObject(hashExtender[i]) || hashExtender[i] === null) {
                     hash[i] = $ws.core.merge(hash[i], hashExtender[i], cfg);
                  } else {
                     // Если это сложный объект мы ничего не делаем, т.к. сюда мы попадем только в том случае, если preferSource === true
                     // А значит нам нельзя здесь ничего перетирать
                  }
               }
            }
         }
      }
      else if(!(hashExtender === null && cfg.noOverrideByNull) && !cfg.preferSource)
         hash = hashExtender;

      return hash;
   },

   propertyMerge: function propertyMerge(source, target) {
      /**
       * При конструировании source это конфиг, переданный в new, target - this._options
       * Если есть _goUp это сконструированный класс ферймворка
       */
      for(var prop in source) {
         if (source.hasOwnProperty(prop)) {
            if (prop in target) {
               if (typeof source[prop] == 'object') {
                  if (toS.call(source[prop]) == '[object Object]' && source[prop]) {
                     if (!('_goUp' in source[prop])) {
                        if (toS.call(target[prop]) == '[object Object]' && target[prop]) {
                           if (!('_goUp' in target[prop])) {
                              propertyMerge(source[prop], target[prop]);
                           } else {
                              if ('isCustomType' in target[prop]) {
                                 target[prop].updateProperties(source[prop]);
                              } else {
                                 target[prop] = source[prop];
                              }
                           }
                        } else {
                           target[prop] = source[prop];
                        }
                     } else {
                        target[prop] = source[prop];
                     }
                  } else {
                     target[prop] = source[prop];
                  }
               } else if(toS.call(target[prop]) == '[object Object]' && target[prop] && ('isCustomType' in target[prop])) {
                  // Пропускаем параметр, ничего не присваиваем. Оставим дефолтное значение
                  // Просто любой CustomType может иметь несколько обязательныйх свойств
               } else {
                  target[prop] = source[prop];
               }
            } else {
               target[prop] = source[prop];
            }
         }
      }
   },

   /**
    * Функция, клонирующая объект или массив. Сделана на основе <strong>$ws.core.merge</strong>.
    * @param hash Исходный объект или массив.
    * @return {Object} Клонированный объект или массив.
    */
   clone: function(hash) {
      hash = {v: hash};
      var result = $ws.core.merge({}, hash, {clone: true});
      return result.v;
   },

   /**
    * Функция, делающая поверхностное (без клонирования вложенных объектов и массивов) копирование объекта или массива. Сделана на основе <strong>$ws.core.merge</strong>.
    * @param hash Исходный объект или массив.
    * @return {Object} Скопированный объект или массив.
    */
   shallowClone: function(hash) {
      hash = {v: hash};
      var result = $ws.core.merge({}, hash, {clone: false, rec: false});
      return result.v;
   },

   initializerHelper: (function() {
      var storage = [];

      function replacer(k, v) {
         if (typeof v == 'function') {
            storage[storage.length] = v;
            if (v.prototype && v.prototype.isCustomType) {
               return 'CUSTOMTYPE(' + (storage.length - 1) + ')';
            } else {
               return 'FUNCTION(' + (storage.length - 1) + ')';
            }
         } else if (v === Infinity) {
            return "+INF";
         } else if (v === -Infinity) {
            return "-INF";
         } else if (!isNaN(Number(k)) && Number(k) >= 0 && v === undefined) {
            // В массивах позволяем передавать undefined
            return "UNDEF!";
         } else {
            return v;
         }
      }

      return {
         create: function createInitializer(extender) {
            var text = [ 'var compVal;' ];
            $ws.helpers.forEach(extender.$protected, function(v, k) {
               var isO = (v && typeof v == 'object' && v.constructor == Object);
               var stringified = JSON.stringify(v, replacer);
               if (stringified) {
                  stringified = stringified.replace(/"FUNCTION\((\d+)\)"/g, 'storage[$1]');
                  stringified = stringified.replace(/"CUSTOMTYPE\((\d+)\)"/g, 'new storage[$1]()');
                  stringified = stringified.replace(/"wsFuncDecl::([\w!:.\/]+)"/g, '$ws.helpers.getFuncFromDeclaration("$1")');
                  stringified = stringified.replace(/"\+INF"/g, 'Infinity');
                  stringified = stringified.replace(/"\-INF"/g, '-Infinity');
                  stringified = stringified.replace(/"UNDEF!"/g, 'undefined');
               }
               if (!/^[_a-zA-Z][_a-zA-Z0-9]*$/.test(k)) {
                  k = '["' + k + '"]';
               } else {
                  k = '.' + k;
               }
               if (isO) {
                  if (stringified == '{}' || stringified == '[]') {
                     text.push('this' + k + '= this' + k + ' || ' + stringified + ';');
                  } else {
                     text.push('compVal = ' + stringified + ';');
                     text.push('this' + k + ' !== undefined ? $ws.core.propertyMerge(compVal, this' + k + ') : this' + k + '= compVal;');
                  }
               } else {
                  text.push('this' + k + '=' + stringified + ';');
               }
            });
            return new Function('storage', text.join('\n'));
         },
         bind: function(base, extender, initializer) {
            extender._initializer = function() {
               if (base && base._initializer) {
                  base._initializer.call(this, storage);
               }
               initializer.call(this, storage);
            };
         }
      };
   })(),
   /**
    * Создание класса-наследника.
    *
    * @description
    * Класс-наследник описывается объектом.
    * В нем поддерживаются следующие элементы:
    *  - {Function} $constructor - Функция-конструктор нового класса.
    *  - {Object} $protected - объект-описание защищенных (protected) полей класса.
    *             Описывается как _ИмяПеременной : ЗначениеПоУмолчанию
    *  - {Function} любойМетод - методы класса.
    * Также функция extend доступна как член конструктора любого класса, полученного с помощью нее.
    * В этом случае первый аргумент не используется.
    * Пример:
    * <pre>
    *    // Наследуем SomeClass от Abstract
    *    $ws.proto.SomeClass = $ws.proto.Abstract.extend({
    *       $protected: {
    *          _myProtectedVar: 10,
    *          _myProtectedArray: []
    *       },
    *       $constructor: function(cfg){
    *          this._doInit(); // Call method
    *       },
    *       _doInit: function(){
    *          // do something
    *       },
    *       doSomethingPublic: function(){
    *          // do something public
    *       }
    *    });
    * </pre>
    *
    * @param {Function|Object} classPrototype Родительский класс.
    * @param {Array} mixinsList - массив объектов-миксинов
    * @param {Object} classExtender Объект-описание нового класса-наследника.
    * @returns {Function} Новый класс-наследник.
    */
   extend : (function() {

      function localExtend(mixinsList, classExtender){
         return $ws.core.extend(this, mixinsList, classExtender);
      }

      function localExtendPlugin(pluginConfig){
         return $ws.core.extendPlugin(this, pluginConfig);
      }

      function localMixin(mixinConfig){
         return $ws.core.mixin(this, mixinConfig);
      }

      function mergePropertiesToPrototype(classResult, classExtender) {
         // Copy all properties to a newly created prototype
         for (var i in classExtender){
            if (classExtender.hasOwnProperty(i) && i.charAt(0) != '$') {
               classResult.prototype[i] = classExtender[i];
            }
         }
         // fix for the best browser in the world (IE) (c) ErshovKA
         // IE 7-8 не видит при переборе через for-in свойства valueOf и toString
         if('\v' == 'v') {
            var props = [ 'valueOf', 'toString' ];
            for(i = 0; i < props.length; i++) {
               if(classExtender.hasOwnProperty(props[i])) // property is redefined
                  classResult.prototype[props[i]] = classExtender[props[i]]
            }
         }
      }

      function createInitializer(base, extender) {
         var helper = $ws.core.initializerHelper;
         helper.bind(base, extender, helper.create(extender));
      }


      return function extend(classPrototype, mixinsList, classExtender){
         if (Object.prototype.toString.call(mixinsList) === '[object Array]') {
            classPrototype = $ws.core.mixin(classPrototype, mixinsList);
         }
         else {
            classExtender = mixinsList;
         }

         var
            parentCtor = classPrototype.prototype && classPrototype.prototype.$constructor || null,
            childCtor = classExtender.$constructor,
            constructor = function(){},
            classResult;

         classResult = classExtender.$constructor = function constructFn(cfg){

            this._goUp = this._goUp || 1;

            /**
             * Пойдем к родительской функции-обертке, если она есть
             * Ее нет, если мы на вершине иерархии.
             */
            if (parentCtor) {
               this._goUp++;
               parentCtor.call(this, cfg);
            } else {
               this._initializer();
               if (cfg) {
                  $ws.core.propertyMerge(cfg = $ws.helpers.parseMarkup(cfg), this._options = this._options || {});
               }
            }

            /**
             * Вызов собственного конструктора
             */
            if (childCtor) {
               /**
                * Это честная возможность вернуть из конструктора класса что-то иное...
                */
               var r = childCtor.call(this, cfg);
               if(r)
                  return r;
            }

            --this._goUp;

            if(this._goUp === 0) {
               this.init && this.init();
               this._initComplete && this._initComplete();
               this._isInitialized = true;
               this._allowEvents && this._allowEvents();
               this._constructionDone && this._constructionDone();
            }

            return undefined;
         };

         constructor.prototype = classPrototype.prototype;
         classResult.prototype = new constructor();

         createInitializer(classPrototype.prototype, classExtender);
         mergePropertiesToPrototype(classResult, classExtender);

         classResult.prototype.$constructor = classExtender.$constructor;

         classResult.extend = localExtend;
         classResult.extendPlugin = localExtendPlugin;
         classResult.mixin = localMixin;
         classResult.superclass = classPrototype.prototype;

         return classResult;
      }

   })(),
   /**
    * Расширение класса с помощью "плагина"
    * Подробное описание см. в файле EXTENDING.md
    *
    * @param {Function} classPrototype Прототип расширяемого класса
    * @param {Object} pluginConfig "Конфигурация" плагина
    */
   extendPlugin: function(classPrototype, pluginConfig){
      if(!Object.isEmpty(pluginConfig.$protected)) {
         var initializer = $ws.core.initializerHelper.create(pluginConfig);
         classPrototype.prototype._initializer = classPrototype.prototype._initializer.callNext(initializer);
      }

      pluginConfig.$withoutCondition = $ws.core.hash(pluginConfig.$withoutCondition || []);
      function callNext(classMethod, pluginFunction) {
         var classFunction;
         if (classPrototype.prototype.hasOwnProperty(classMethod)) {
            classFunction = classPrototype.prototype[classMethod];
         } else if(classPrototype.superclass) {
            classFunction = function() {
               var superClassFunction = classPrototype.superclass[classMethod];
               if (superClassFunction) {
                  return superClassFunction.apply(this, arguments);
               }
            };
         }
         if (classFunction) {
            // Делаем исключение для метода destroy, сначала вызовем метод плагина
            var method = classMethod === 'destroy' ? 'callBefore' : 'callNext';
            if (pluginConfig.$condition && pluginConfig.$withoutCondition[classMethod] === undefined) {
               classPrototype.prototype[classMethod] = classFunction[method + 'WithCondition'](pluginFunction, pluginConfig.$condition);
            } else {
               classPrototype.prototype[classMethod] = classFunction[method](pluginFunction);
            }
         }
      }

      function addPluginFunction(functionName, pluginFunction) {
         if (classPrototype.prototype[functionName]) {
            callNext(functionName, pluginFunction);
         } else if (pluginConfig.$condition) {
            classPrototype.prototype[functionName] = pluginConfig.$withoutCondition[functionName] === undefined ?
               pluginFunction.callIf(pluginConfig.$condition) :
               pluginFunction;
         } else {
            classPrototype.prototype[functionName] = pluginFunction;
         }
      }

      for (var i in pluginConfig) {
         if (pluginConfig.hasOwnProperty(i) && !(i in {'$constructor': true, '$protected': true, 'init': true, '$condition': true, '$withoutCondition': true})) {
            addPluginFunction(i, pluginConfig[i]);
         }
      }
      // IE 7-8 не видит при переборе через for-in свойства valueOf и toString
      if ('\v' == 'v') {
         var props = [ 'valueOf', 'toString' ];
         for (i = 0; i < props.length; i++) {
            if (pluginConfig.hasOwnProperty(props[i])) {
               // property is redefined
               addPluginFunction(props[i], pluginConfig[props[i]]);
            }
         }
      }

      if (pluginConfig.$constructor) {
         callNext('init', pluginConfig.$constructor);
         if ($ws.single.ControlStorage) {
            var pluginConstructor = pluginConfig.$constructor,
                controls = $ws.single.ControlStorage.getControls();
            for (var id in controls) {
               if (controls.hasOwnProperty(id)) {
                  if (controls[id] instanceof classPrototype){
                     pluginConstructor.apply(controls[id]);
                  }
               }
            }
         }
      }
   },
   /**
    * Расширение класса с помощью "mixin'а"
    *
    *
    * @param {Function} classPrototype Прототип расширяемого класса
    * @param {Object|Array} mixinConfig "Конфигурация" примеси, или массив описаний нескольких примесей
    * В случае массива будут подмешаны в том порядке, в котором перечислены.
    */
   mixin: function(classPrototype, mixinConfig){
      if(mixinConfig && Object.prototype.toString.call(mixinConfig) === '[object Object]'){
         mixinConfig = [mixinConfig];
      }
      var mixinOptions = {},
          mixinConstructor,
          l = mixinConfig.length,
          i = 0,
          description = {},
          functionCollection,
          callMethod = {
             'around': 'callAround',
             'after': 'callNext',
             'before': 'callBefore'
          };
      for(i = 0; i < l; i++){
         description = mixinConfig[i];
         if (description.$protected) {
            mixinOptions = $ws.core.merge(mixinOptions, description.$protected);
         }
         if (description.$constructor) {
            mixinConstructor = mixinConstructor ? mixinConstructor.callNext(description.$constructor) : description.$constructor;
         }
      }
      var mixin = $ws.core.extend(classPrototype, {
            $protected: mixinOptions,
            $constructor: mixinConstructor || function(){}
         });

      function addSpecialFunctionInIE(descriptionObject, position){
         // IE 7-8 не видит при переборе через for-in свойства valueOf и toString
         if('\v' == 'v') {
            var props = [ 'valueOf', 'toString' ];
            for(k = 0; k < props.length; k++) {
               if(descriptionObject.hasOwnProperty(props[k]) && !(props[k] in {'$protected': 0, '$constructor': 0})) {
                  addMixinFunction(props[k], descriptionObject[props[k]], position);
               }
            }
         }
      }

      function addMixinFunction(functionName, functionDescription, functionPosition){
         if( typeof(functionDescription) === 'function'){
            //проверим определена ли уже функция в классе, иначе добавим
            if ( functionPosition === 'instead' || typeof(mixin.prototype[functionName]) !== 'function') {
               mixin.prototype[functionName] = functionDescription;
            } else {
               var newFunction = mixin.prototype[functionName][callMethod[functionPosition]](functionDescription);
               mixin.prototype[functionName] = newFunction;
            }
         }
      }

      for(i = 0; i < l; i++){
         description = mixinConfig[i];
         for(var k in description){
            if(!( k in {'$protected': 0, '$constructor': 0} )){
               functionCollection = description[k];
               if (functionCollection && Object.prototype.toString.call(functionCollection) === '[object Object]'){
                  for(var j in functionCollection){
                     addMixinFunction(j, functionCollection[j], k);
                  }
                  addSpecialFunctionInIE(functionCollection, k);
               } else {
                  addMixinFunction(k, functionCollection, 'instead');
               }
            }
         }
         addSpecialFunctionInIE(description, 'instead');
      }

      mixin.prototype._mixins = (mixin.prototype._mixins || []).concat(mixinConfig);

      return mixin;
   },
   /**
    * Генерация хэша переданных параметров/объекта.
    */
   hash : function(){
      var
         src = arguments.length > 1 ? Array.prototype.slice.call(arguments) : arguments[0],
         dst = {};
      if (src instanceof Array || src instanceof Object){
         for (var i in src){
            if (src.hasOwnProperty(i)){
               if (typeof src[i] in {"boolean":null, "number":null, "string":null})
                  dst["" + src[i]] = i;
            }
         }
      }
      return dst;
   },
   /**
    * Функция разбивает путь на класс и компонент
    * @param path
    * @returns {{component: *, className: *, moduleName: *, isModule: *}}
    */
   extractComponentPath : function(path){
      var className, modName;
      path = $ws.single.ClassMapper.getClassMapping(path);

      if(path.indexOf(':') == -1){
         path = path.split('/');
         path.push(className = path.pop());
         if(className.indexOf('@') != -1)
            className = className.split('@').pop();
      }
      else{
         path = path.split(':');
         className = path.pop();
         path = path.pop().split('/');
      }

      modName = $ws._const.jsCoreModules[className] ? className :  ($ws._const.jsModules[className] ? className : "SBIS3.CORE." + className);

      return {
         component: path.join('/'),
         className: className,
         moduleName: modName,
         isModule: !!($ws._const.jsCoreModules[modName] || $ws._const.jsModules[modName])
      };
   },

   /**
    * Загружает контролы и их зависимости по массиву конфигов контролов.
    * @param configsPaths Массив путей и конфигов для контролов. Пример:
    *    [
    *       ['Control/DataViewAbstract/TableView', {config}],
    *       ['Control/DataViewAbstract/TreeView', {config}] ....
    *    ]
    * @param resolveCtors Ожидается ли возвращение конструкторов модулями указанных контролов. Если
    * ожидается, то функция будет проверять значения, возвращённые модулями, и кидать исключения, если те не похожи на конструкторы.
    * @returns {$ws.proto.Deferred}
    */
   loadControlsDependencies: function(configsPaths, resolveCtors) {
      var loadedPaths = {},
          reduce = $ws.helpers.reduce.bind($ws.helpers),
          map = $ws.helpers.map.bind($ws.helpers),
          jsModRegex = /js!/;

      function loaderForPath(path, resolveCtor) {
         var result;

         if (jsModRegex.test(path)){
            result = function() {
               var dfr = new $ws.proto.Deferred();
               require([path], function(ctor) {
                  dfr.callback([path, ctor]);
               }, dfr.errback.bind(dfr));
               return dfr;
            };
         } else {
            result = function() {
               var requestedPath = $ws.core.extractComponentPath(path),
                   loadAsModule = requestedPath.isModule,
                   moduleName = requestedPath.moduleName,
                   componentName = requestedPath.className,
                   loadDfr = loadAsModule ? $ws.require("js!" + moduleName) : $ws.core.attachComponent(requestedPath.component);

               loadDfr.addCallback(function(mod){
                  var ctor = loadAsModule ? mod[0] : null;
                  if (!ctor && resolveCtor) {
                     // Шаг 3: Построим запрошенный класс
                     ctor = $ws.proto;
                     if(componentName.indexOf('.') != -1) {
                        var classPath = componentName.split('.');
                        while(classPath.length && ctor) {
                           ctor = ctor[classPath.shift()];
                        }
                     } else {
                        ctor = ctor[componentName];
                     }
                  }

                  return [path, ctor];
               });

               return loadDfr;
            };
         }

         return result;
      }

      function getPathLoadersPDef(configsPaths, needCtors) {
         return reduce(configsPaths, function(pDef, cfgPath) {
            var path_ = cfgPath[0], path, loader;

            if (!(path_ in loadedPaths)) {
               loadedPaths[path_] = true;
               loader = loaderForPath(path_, needCtors);
               pDef.push(loader());
            }

            return pDef;
         }, new $ws.proto.ParallelDeferred()).done().getResult();
      }

      function resolveDepsAsControlConfigs(configsPaths) {
         return reduce(configsPaths, function(result, cfgPath) {
            var path = cfgPath[0],
                cfg = cfgPath[1],
                requestedPath, loadAsModule, moduleName, componentName, depPath, deps;

            if(!jsModRegex.test(path)) {
               requestedPath = $ws.core.extractComponentPath(path);
               loadAsModule = requestedPath.isModule;
               moduleName = requestedPath.moduleName;
               componentName = requestedPath.className;

               depPath = loadAsModule ? moduleName : path;
               deps = $ws.single.DependencyResolver.resolve(depPath, cfg);
               $ws.helpers.forEach(deps, function(dep) {
                  result.push([dep, cfg]);
               });
            }
            return result;
         }, []);
      }

      function constructorsForAllConfigs(configsPaths, pathsConstructors) {
         var hash = reduce(pathsConstructors, function(result, pathConstr) {
            result[pathConstr[0]] = pathConstr[1];
            return result;
         }, {});

         return map(configsPaths, function(cfgPath) {
            var path = cfgPath[0],
                ctor = hash[path];

            if (resolveCtors && typeof ctor !== 'function' ) {
                throw new Error("Can't instantiate class '" + path + "'. Class not exists");
            }

            return ctor;
         });
      }

      function loadPaths(configsPaths, resolveCtors) {
         var loadersPDef = getPathLoadersPDef(configsPaths, resolveCtors);

         return loadersPDef.addCallback(function(pathsConstructors) {
            var depConfigs = resolveDepsAsControlConfigs(configsPaths),
                result;

            if (depConfigs.length > 0) {
               result = loadPaths(depConfigs, false).addCallback(function() { return pathsConstructors; });
            } else {
               result = pathsConstructors;
            }
            return result;
         });
      }

      return loadPaths(configsPaths, resolveCtors).addCallback(constructorsForAllConfigs.bind(undefined, configsPaths));
   },

   /**
    * Загружает зависимости компонента (его модули, и дополнительные модули, требуемые по его конфигурации), и отдаёт
    * deferred, который по готовности выдаёт функцию, конструирующую компонент, и берущую конфиг в качестве аргумента (как его конструктор).
    * Эта функция нужна для случая, когда хочется загрузить зависимости для нескольких компонентов зараз, и потом создать их синхронно,
    * предварительно проверив, не удалился во время загрузки зависимостей родительский контрол.
    * @param {string} path путь компонента и имя класса
    *    /path/to/component:className
    *    /path/to/component - путь к файлу с компонентом
    *    className - имя класса, который надо инстанцировать
    * @param {object} cfg конфиг
    * @returns {$ws.proto.Deferred}
    * @deprecated Используйте {$ws.core.loadControlsDependencies}. Удалено в 3.8.0
    */
   loadAttachInstanceDependencies: function(path, cfg){
      return this.loadControlsDependencies([ [ path, cfg ] ], true).addCallback(function(ctors){
         return function(cfg) {
            return new ctors[0](cfg);
         }
      })
   },

   /**
    * Метод построения компонента
    *
    * @description
    * Пример использования:
    * <pre class="brush: js">
    * var iDef = $ws.core.attachInstance('Control/Field:FieldAbstract', {});
    * iDef.addCallback(function(inst) {
    *    alert("ints instanceOf FieldAbstract: " + (inst instanceof $ws.proto.FieldAbstract).toString());
    *    return inst;
    * }).addErrback(function(e) {
    *    alert(e.message);
    *    return e;
    * });
    * </pre>
    *
    * @param {string} path путь компонента и имя класса
    *    /path/to/component:className
    *    /path/to/component - путь к файлу с компонентом
    *    className - имя класса, который надо инстанцировать
    * @param {object} [cfg] конфиг
    * @returns {$ws.proto.Deferred} Асинхронный результат
    */
   attachInstance : function(path, cfg){
      var
         deps = $ws.core.loadControlsDependencies([[path, cfg]], true),
         block = BOOMR.plugins.WS.startBlock('attachInstance:' + path);
      return deps.addCallback(function(ctor) {
         block.openSyncBlock();
         var result = new ctor[0](cfg);
         block.closeSyncBlock();
         block.close();
         return result;
      });
   },
   /**
    * Подключение цепочки компонентов.
    *
    * @param {String} path Компонент
    * @param {String} [servicePath] Путь к сервису, с которого загружать файлы.
    * @returns {$ws.proto.Deferred}
    */
   attachComponent: function(path, servicePath){
      var resourceRoot;
      if(!servicePath){
         servicePath = '';
         resourceRoot = $ws._const.resourceRoot;
      }
      else
         resourceRoot = '/';
      /**
       * Это - Deferred для всей цепочки. Его успех зависит от выполнения CodeChain
       */
      return $ws.single.Storage.store(path, function(dChainResult){

         // Костыль
         // Если мы на node (есть process) или в браузере (есть window) - грузим через require
         // На серверном скрипте (нет window и нет process) - работаем по старому.
         if ((typeof window !== 'undefined' || typeof process !== 'undefined') && path === 'Source') {
            require(['Lib/Source'], function(){
               dChainResult.callback();
            }, function(){
               dChainResult.errback();
            });
            return;
         }

         var
            queue = path.split("/"),
            codeChain = new $ws.proto.CodeChain(queue.length),
            i = queue.length - 1;
         // строим цепочку вложенных подключений скриптов компонентов
         while (queue.length > 0){
            (function(componentPath, index){
               var libPath,
                   fileUrl;
               if(componentPath.indexOf('@') != -1)
               {
                  componentPath = componentPath.split('@');
                  var module = componentPath.shift();

                  // если модуля нет в списке подключенных модулей,
                  // то, значит, мы подключаем модули на сервере, и в таком случае
                  // транслитерация не нужна
                  if(module in $ws._const.modules)
                     module = $ws._const.modules[module];

                  libPath = servicePath + resourceRoot + module + "/";
               }
               else
                  libPath = servicePath + $ws._const.wsRoot;
               fileUrl = $ws.core.checkPackages(libPath + 'lib/' + componentPath + '.js');
               var wasStored = $ws.single.Storage.isStored(fileUrl);
               /**
                * Это - Deferred для единичного файла цепочки. Его успех зависит от XHR
                * @param {$ws.proto.Deferred} dSingleFileResult
                */
               $ws.single.Storage.store(fileUrl, function(dSingleFileResult){
                  // Этот код должен выполниться только один раз (грузим из сети единожды) ...
                  dSingleFileResult.dependOn(
                     $ws.single.ioc.resolve('ITransport', {
                        url: $ws.core.urlWithHost(fileUrl)
                     }).execute(null)
                  );
               }).addCallback(function(code){
                  /**
                   * ... а этот должен выполняться кажый раз при подключении данного файла
                   * Потому что здесь codeChain и она должна знать, что все компоненты готовы.
                   *
                   * Если данный файл был загружен ранее - не добавляем его код в CodeChain,
                   * просто известим что он готов.
                   */
                  if (codeChain.setCode(index, wasStored ? '' : code))
                     dChainResult.callback(); // Цепочка выполнена
                  // Меняем результат на пустую строку
                  // при следующей загрузке CodeChain посчитает что этот код уже готов к работе
                  return '';
               }).addErrback(function(e){
                  // Построение завершилось ошибкой
                  if (!dChainResult.isReady()) {
                     dChainResult.errback(new Error("Building failed. Reason: " + e.message + ". Component: " + path + ". File: " + fileUrl));
                  }
                  return e;
               });
            })(queue.join('/'), i--);
            queue.pop();
         }
         return dChainResult;
      });
   },
   /**
    * Получает описание переданного имени хэндлера
    *
    * @param {String} name
    * @returns {Object}
    */
   getHandlerInfo: function(name) {
      var
         firstChar = name.substring(0, 1),
         pathParts = name.split('/'),
         handlerName = pathParts.pop(),
         handlerPackage = pathParts.pop(),
         base = (firstChar == '.' || firstChar == '/') ? '' : ($ws._const.wsRoot + 'res/hdl/'),
         ext = '.hdl',
         isModule = false,
         packageUniqName, type, fullPath;

      type = pathParts.pop();  // some kind of peek()
      if(type || type === "")  // if type is not null | undefined
         pathParts.push(type); // return it to path
      if(type != 'render')     // If it is not render
         type = "_handlers";   // ...set default handlers type

      if(handlerPackage in $ws._const.jsCoreModules || handlerPackage in $ws._const.jsModules) {

         pathParts.push($ws._const.jsCoreModules[handlerPackage] || $ws._const.jsModules[handlerPackage]);
         if($ws._const.jsModules[handlerPackage]) {
            base = '/resources/';
         } else {
            base = $ws._const.wsRoot;
         }
         packageUniqName = fullPath = handlerPackage;
         isModule = true;
      } else {
         pathParts.push(handlerPackage + ext);
         packageUniqName = base + pathParts.join('/');
         pathParts.pop();

         pathParts.push(handlerPackage + ext);
         fullPath = base + pathParts.join('/');
      }


      if (packageUniqName.indexOf('/resources/') === 0)
         packageUniqName = packageUniqName.replace('/resources/', $ws._const.resourceRoot);
      if(fullPath.indexOf('/resources/') === 0)
         fullPath = fullPath.replace('/resources/', $ws._const.resourceRoot);
      if(ext && $ws._const.buildnumber && fullPath.indexOf(".v" + $ws._const.buildnumber) == -1)
         fullPath = fullPath.replace(ext, '.v' + $ws._const.buildnumber + ext);

      return {
         type: type,
         name: handlerName,
         'package': packageUniqName,
         url: fullPath,
         isModule: isModule
      };
   },
   /**
    * Загружает пакет, возвращает его через Deferred
    *
    * @param {String} name.
    * @returns {$ws.proto.Deferred} асинхронный результат загрузки пакета.
    */
   getHandlerPackage: function(name) {
      var
            urlSpec = $ws.core.getHandlerInfo(name),
            url = urlSpec.url;

      return $ws.single.Storage.store("hdlpack://" + url, function(dResult){
         (function(){
            if(urlSpec.isModule) {
               return $ws.requireModule(url).addCallback(function(mods){
                  return mods[0];
               });
            } else {
               return $ws.single.ioc.resolve('ITransport', {  // начинаем загрузку
                  url: url
               }).execute(null).addCallback(function(data) {
                  var hdl = null;
                  // Добавим sourceURL для нормальных браузеров
                  // TODO Это устаревший стандарт!
                  if(!$ws._const.browser.isIE){
                     var sourceURL = url.substr(url.lastIndexOf('/') + 1);
                     data += "\n//# sourceURL=" + sourceURL;
                     if(data.indexOf('//@ sourceURL') !== -1){
                        data = data.replace(/\/\/@ sourceURL[^\n]+/, "");//replace "
                     }
                     data += "\n//@ sourceURL=" + sourceURL;
                  }
                  eval(data);                   // эвалим полученный код
                  return hdl;
               });
            }
         }()).addCallbacks(function(hdl){
            for(var f in hdl) {
               if(hdl.hasOwnProperty(f) && typeof hdl[f] == 'function')
                  hdl[f].wsHandlerPath = urlSpec['package'].replace('.hdl', '') + '/' + f;
            }
            $ws[urlSpec.type][urlSpec['package']] = hdl;
            dResult.callback(hdl);
         }, function(res){
            res.message = "getHandler failed (" + name + "). Reason: " + res.message;
            dResult.errback(res);
         });
      });
   },
   /**
    * Загружает и получает указанную функцию-обработчик
    *
    * @param {String} name Имя обработчика в формате HandlerPackage/handlerName.
    * @returns {$ws.proto.Deferred} Deferred, результатом которого будет заказанный обработчик.
    */
   getHandler: function(name){

      var
         urlTemp = $ws.core.getHandlerInfo(name),
         type = urlTemp.type,
         dResult = new $ws.proto.Deferred(),
         handlerName = urlTemp.name,
         handlerPackage = urlTemp['package'],
         funcCheckHandler = function(type, pkgName, hdlName){
            return $ws[type][pkgName] && typeof($ws[type][pkgName][hdlName]) == 'function';
         };

      // есть ли информация о наличии указанного пакета
      if(typeof($ws[type][handlerPackage]) == 'object'){
         if (funcCheckHandler(type, handlerPackage, handlerName))
            dResult.callback($ws[type][handlerPackage][handlerName]);
         else
            dResult.errback(
                  new Error("getHandler failed: package is loaded but function is not present (" + name + ")"));
      }
      else {                                 // загрузка пакета
         $ws[type][handlerPackage] = '';     // система знает о наличии такого обработчика
         dResult.dependOn($ws.core.getHandlerPackage(name)).addCallback(function(){
            if (funcCheckHandler(type, handlerPackage, handlerName))
               return $ws[type][handlerPackage][handlerName];
            else
               throw new Error("getHandler failed: package is loaded but function is not present (" + name + ")");
         });
      }
      return dResult;
   },
   /**
    * Проверяет, имеется ли для файла альтернативный URL
    *
    * @param {String} url исходный URL файла.
    * @returns {String} альтернативный URL для файла (с учетом пакета).
    */
   checkPackages : function(url){
      var shortUrl = url.replace($ws._const.wsRoot, '/');
      var packages = $ws._const.jsPackages;
      return packages[shortUrl] ? ($ws._const.wsRoot + packages[shortUrl]) : url;
   },
   /**
    * Возвращает случайный хост из списка хостов
    *
    * @param {String} url
    * @returns {String} адрес хоста
    */
   urlWithHost: function(url) {
      var l = $ws._const.hosts.length,
          host = '',
          lang = $ws.single.i18n.getLang();
      if (l > 0) {
         host = $ws._const.hosts[Math.floor(Math.random()*l)];
         if (url.substring(0, 1) == '.') {
            var curPath = window.location.pathname;
            curPath = curPath.substring(0, curPath.lastIndexOf('/') + 1);
            url = host + curPath + url.substring(2);
         } else {
            url = host + (url.substring(0, 1) == '/' ? '' : '/') + url;
         }
      }
      if ($ws._const.buildnumber && url.indexOf(".v" + $ws._const.buildnumber) == -1) {
         url = url.replace(/(\.js|\.css|\.xml)/, ".v" + $ws._const.buildnumber + "$1");
      }
      if ($ws._const.i18n && lang && url.indexOf(".l" + lang) == -1) {
         url = url.replace(/(\.xml)/, ".l" + lang + "$1");
      }
      return url;
   },
   /**
    * @function
    * Подключение JS/CSS-файла в контекст документа.
    * @param {String} URL URL подключаемого файла.
    * @param {Object} [options] Опциональные опции. Например options.charset - значение аттрибута charset при подключении (для IE7).
    * @returns {$ws.proto.Deferred}
    */
   attach: function(URL, options){
      URL = $ws.core.checkPackages(URL);
      if(URL.charAt(0) !== '/'){
         URL = $ws._const.wsRoot + URL;
      }
      URL = $ws.core.urlWithHost(URL);
      return $ws.single.Storage.store(URL, function(resource){
         $ws.single.ioc.resolve('IAttachLoader').attach(URL, resource, options);
      });
   },
   /**
    * Подключает переданные файлы по порядку
    * @param {Array} urls Массив строк с адресами файлов для подключения.
    * @return {$ws.proto.Deferred}
    */
   attachSequentally: function(urls) {
      urls = urls || [];
      urls = urls instanceof Array ? urls : [ urls ];
      urls = $ws.helpers.filter(urls);

      var dResult = new $ws.proto.Deferred();

      (function loader() {
         if (urls.length) {
            var url = urls.shift();
            if (/^(js!|css!)/.test(url)) {
               $ws.require(url).addCallbacks(loader, function (e) {
                  dResult.errback(e);
               });
            } else {
               $ws.core.attach(url).addCallbacks(loader, function (e) {
                  dResult.errback(e);
               });
            }
         } else
            dResult.callback();
      })();

      return dResult;
   },
   /**
    * Готовит ядро к работе с указанными компонентами.
    * Фактически замена $ws.core.ready + attachComponent * N.
    * @returns {$ws.proto.Deferred} Deferred готовности ядра + готовности всех компонентов.
    */
   withComponents: function(/*components*/) {
      var components = arguments;
      return $ws.core.ready.addCallback(function(){
         var dComponents = new $ws.proto.ParallelDeferred();
         for (var i = 0, li = components.length; i < li; i++){
            var requestedPath = $ws.core.extractComponentPath(components[i]),
                componentName = requestedPath.className,
                moduleName = $ws._const.jsCoreModules[componentName] ? componentName : "SBIS3.CORE." + componentName;
            (function(moduleName){
               if($ws._const.jsCoreModules[moduleName])
                  dComponents.push($ws.require("js!" + moduleName).createDependent().addCallback( function(){
                     return $ws.core.loadControlsDependencies([[moduleName, {}]], false);
                  }));
               else
                  dComponents.push($ws.core.attachComponent(components[i]));
            })(moduleName);
         }
         return dComponents.done().getResult();
      })
   },
   /**
    * Вызывает диалог-сообщение
    * @param {String} message - текст сообщения.
    * @param {String} [detail] - текст-расшифровка.
    * @param {String} [type] - тип сообщения (info || error || success), по умолчанию "info".
    */
   alert: function(message, detail, type) {
      var
         defOnClose = new $ws.proto.Deferred(),
         types = {"error":0, "success":0, "info":0};
      if (arguments.length == 2 && detail in types){
         type = detail;
         detail = "";
      }
      $ws.core.attachInstance('SBIS3.CORE.DialogAlert', {
         message: message,
         detail: detail,
         type : type,
         handlers : {
            onAfterClose : function(){
               defOnClose.callback();
            }
         }
      });
      return defOnClose;
   },
   getNamedContents: function(name) {
      var isPath = name.lastIndexOf('/');
      if(isPath != -1)
         name = name.substring(isPath + 1);
      return $ws._const.hdlBindings[name] || [];
   },
   /**
    * Устанавливает курсор загрузки или стандартный
    * @param {Boolean} def -- ставить ли стандартный курсор.
    */
   setCursor: function(def){
      $('body').toggleClass('ws-progress', !def);
   },
   /**
    * Возвращает URL сервиса по имени
    * @param {String} serviceName имя сервиса (как указано на 4 шаге мастера выгрузки).
    * @returns {String} URL сервиса.
    */
   getServiceByName: function(serviceName) {
      return $ws._const.services[serviceName] || $ws._const.defaultServiceUrl;
   },
   /**
    * Прописывает оглавление
    * @param {Object} contents.
    * @param {Boolean} [replace] заменять ли содержимое.
    * @param {Object} [options] опции для указания пути до service (/, /auth/ etc.) и resources (resources, myresources etc.).
    */
   loadContents: function(contents, replace, options) {
      if(replace === undefined)
         replace = false;
      if(replace) {
         $ws._const.hosts = [];
         $ws._const.jsPackages = {};
         $ws._const.xmlPackages = {};
         $ws._const.xmlContents = {};
         $ws._const.hdlBindings = {};
         $ws._const.services = {};
         $ws._const.modules = {};
         $ws._const.htmlNames = {};
         $ws._const.jsModules = {};
         $ws._const.availableLanguage = {};
      }
      // Формируем options
      options = options || {};
      if (!options.service) {
         options.service = '/';
      }
      if (!options.resources) {
         options.resources = 'resources';
      }
      function removeLeadingSlash(path) {
         if (path) {
            var head = path.charAt(0);
            if (head == '/' || head == '\\') {
               path = path.substr(1);
            }
         }
         return path;
      }

      function removeTrailingSlash(path) {
         if (path) {
            var tail = path.substr(-1);
            if (tail == '/' || tail == '\\') {
               path = path.substr(0, path.length - 1);
            }
         }
         return path;
      }

      pathjoin = function(path1, path2) {
         path1 = removeLeadingSlash(removeTrailingSlash(path1));
         if (path1 !== '') {
            var head = path1.charAt(0);
            if (head != '/' && head != '\\' && path1.charAt(1) !== ':')  {
               path1 = '/' + path1;
            }
         }
         return path1 + '/' + removeLeadingSlash(removeTrailingSlash(path2));
      };

      if(contents){
         if(contents.jsModules) {
            //Перестраиваем пути в огравлении, с учетом options
            $ws.helpers.forEach(contents.jsModules, function (val, key) {
               contents.jsModules[key] = pathjoin(options.service, options.resources) + '/' + removeLeadingSlash(val);
            });
            $ws._const.jsModules = $ws.core.merge($ws._const.jsModules, contents.jsModules);
         }
         if(contents.dictionary)
            $ws._const.jsDictionary = $ws.core.merge($ws._const.jsDictionary, contents.dictionary);
         if(contents.availableLanguage)
            $ws._const.availableLanguage = $ws.core.merge($ws._const.availableLanguage, contents.availableLanguage);
         if(contents.services) {
            $ws._const.services = contents.services;
         }
         if(contents.modules) {
            $ws._const.modules = contents.modules;
         }
         if (contents.xmlContents){
            //Перестраиваем пути в огравлении, с учетом options
            $ws.helpers.forEach(contents.xmlContents, function(val, key){
               contents.xmlContents[key] = pathjoin(options.service, options.resources) + '/' + removeLeadingSlash(val);
            });
            $ws._const.xmlContents = $ws.core.merge($ws._const.xmlContents, contents.xmlContents);
         }
         if(contents.hosts){
            if(contents.hosts instanceof Array)
               $ws._const.hosts = contents.hosts;
            else
               throw new Error('window.contents.hosts has an illegal format');
         }
         var p = ['xmlPackages', 'jsPackages', 'htmlNames'];
         for(var i = 0, l = p.length; i < l; i++) {
            var currentTarget = p[i];
            if(currentTarget in contents) {
               $ws._const[currentTarget] = $ws._const[currentTarget] || {};
               for(var f in contents[currentTarget]) {
                  if(contents[currentTarget].hasOwnProperty(f))
                     $ws._const[currentTarget][f] = contents[currentTarget][f];
               }
            }
         }
         $ws._const.hdlBindings = contents.hdlBindings || {};
      }
   },
   _initRequireJS: function() {
      this.initRequireJS();
   },
   initRequireJS: function(){
      var
            global = (function() { return this || (0,eval)('this') })(),
            wsPath = $ws._const.wsRoot;

      // TODO СРОЧО ЭТО ВЫПИЛИТЬ! КОНФИГ ДУБЛИРУЕТСЯ!
      global.requirejs.config({
         baseUrl: "/",
         paths: {
            "Ext": wsPath + "lib/Ext",
            "Core": wsPath + "core",
            'Resources': $ws._const.resourceRoot,
            "css": wsPath + "ext/requirejs/plugins/css",
            "js": wsPath + "ext/requirejs/plugins/js",
            "native-css": wsPath + "ext/requirejs/plugins/native-css",
            "normalize": wsPath + "ext/requirejs/plugins/normalize",
            "html": wsPath + "ext/requirejs/plugins/html",
            "text": wsPath + "ext/requirejs/plugins/text",
            "is": wsPath + "ext/requirejs/plugins/is",
            "is-api": wsPath + "ext/requirejs/plugins/is-api",
            "i18n": wsPath + "ext/requirejs/plugins/i18n",
            "json": wsPath + "ext/requirejs/plugins/json"
         },
         waitSeconds: 30,
         nodeRequire: global.require
      });
   },
   /**
    * Классическое наследование на классах
    * @param Child - класс-наследник.
    * @param Parent - класс-родитель.
    */
   classicExtend : function(Child, Parent) {
      var F = function() { };
      F.prototype = Parent.prototype;
      Child.prototype = new F();
      Child.prototype.constructor = Child;
      Child.superclass = Parent.prototype
   },
   /**
    * @param {Function} func
    * @deprecated Используйте $ws.single.EventBus.channel('errors').subscribe('onAuthError', ...); Удаляется с 3.8
    */
   appendAuthError : function(func){
      if (typeof func == "function")
         $ws.core._authError = func;
   }
};

$ws.single.ClassMapper = {
   _mapping: {},
   setClassMapping: function(classSpec, mapTo) {
      if(typeof classSpec == 'string')
         this._mapping[classSpec] = mapTo;
      else if(classSpec !== null && Object.isValid(classSpec)) {
         for(var spec in classSpec) {
            if(classSpec.hasOwnProperty(spec))
               this._mapping[spec] = classSpec[spec];
         }
      }
   },
   getClassMapping: function(classSpec) {
      return this._mapping[classSpec] || classSpec;
   },
   resetClassMapping: function(classSpec) {
      delete this._mapping[classSpec];
   },
   restoreDefaultClassMapping: function() {
      this._mapping = {};
   }
};
$ws.java = {
   canStartComponent: function() {
      var args = arguments;
      return $ws.requireModule('Core/java').addCallback(function(mods) {
         return mods[0].canStartComponent.apply(mods[0], args);
      });
   },
   hasPlugin: function() {
      var args = arguments;
      return $ws.requireModule('Core/java').addCallback(function(mods) {
         return mods[0].hasPlugin.apply(mods[0], args);
      });
   },
   runApplet: function() {
      var args = arguments;
      return $ws.requireModule('Core/java').addCallback(function(mods) {
         return mods[0].runApplet.apply(mods[0], args);
      });
   },
   isValidPlatform: function() {
      var args = arguments;
      return $ws.requireModule('Core/java').addCallback(function(mods) {
         return mods[0].isValidPlatform.apply(mods[0], args);
      });
   }
};
/**
 * Класс вспомогательных функций
 * @class $ws.helpers
 */
$ws.helpers = /** @lends $ws.helpers.prototype */{
   /**
    * Функция, позволяющая сгенерировать URL для открытия страницы редактирования/создания записи
    *
    * @param recordId Идентификатор записи
    * @param {Boolean} isBranch узел или лист
    * @param {Number} parentId идентификатор родителя отображаемой записи
    * @param {Boolean} isCopy копирование
    * @param {String} editDialogTemplate имя шаблона диалога редактирования элемента
    * @param {String} id идентификатор браузера
    * @param {Boolean} readOnly будет ли невозможно менять содержимое
    * @param {Object} dataSource параметры получения данных
    * @param {Object} filter текущий фильтр
    * @param {Object} [reports] список отчетов
    * @param {Object} [handlers] обработчики событий
    * @param {String} [columnParentId] поле иерархии
    * @return {String|Boolean}
     * deprecated Используйте функцию generatePageURL
    */
   generateURL: function(recordId, isBranch, parentId, isCopy, editDialogTemplate, id, readOnly, dataSource, filter, reports, handlers,columnParentId){
       var params = {
           recordId : recordId,
           isBranch : isBranch,
           parentId : parentId,
           isCopy : isCopy,
           editDialogTemplate : editDialogTemplate,
           id : id,
           readOnly : readOnly,
           dataSource : dataSource,
           filter : filter,
           reports : reports,
           handlers : handlers,
           columnParentId : columnParentId
       };
       return $ws.helpers.generatePageURL(params, false);
    },
   /**
    * Функция, позволяющая сгенерировать URL для открытия страницы редактирования/создания записи
    * @param {Object} cfg объект параметров функции.
    * @param {String} cfg.recordId  Идентификатор записи.
    * @param {Boolean} cfg.isBranch узел или лист.
    * @param {Number}  cfg.parentId идентификатор родителя отображаемой записи.
    * @param {Boolean} cfg.isCopy копирование.
    * @param {String} cfg.editDialogTemplate имя шаблона диалога редактирования элемента.
    * @param {String} cfg.id идентификатор браузера.
    * @param {Boolean} cfg.readOnly будет ли невозможно менять содержимое.
    * @param {Object} cfg.dataSource параметры получения данных.
    * @param {Object} cfg.filter текущий фильтр.
    * @param {Object} cfg.reports список отчетов.
    * @param {Object} cfg.handlers обработчики событий. Ключ - имя события, значение - путь к обработчику
    * @param {String} cfg.columnParentId поле иерархии.
    * @param {String} cfg.changedRecordValues хэш-меп значений, которые уже изменены в записи и которые нужно перенести на страницу редактирования.
    * @param {Boolean} cfg.history
    * @param {Boolean} [retParams] признак того, как возвращать результат: в виде объекта или строки.
    * @param {String} [url]
    * @return {String|Boolean}
    * @example
    * <pre>
    *  var params = {
    *      recordId : "1",
    *      editDialogTemplate : "Edit",
    *      id: view.getid(),
    *      readOnly: false,
    *      dataSource: dataSource,
    *      reports : reports,
    *      handlers : {
    *       'onBeforeCreate': ['/resources/Module/handlerFile/handlerFunction']
    *      }
    *  },
    *  paramsObj = $ws.helpers.generatePageURL(params, true );
    * </pre>
    */
   generatePageURL: function(cfg, retParams, url){
      if((cfg.editDialogTemplate && ($ws._const.htmlNames[cfg.editDialogTemplate] || $ws._const.xmlContents[cfg.editDialogTemplate]))) {
         var isHierarchyMode = !!(cfg.isBranch),
             hdlIsObject = cfg.handlers && Object.prototype.toString.call(cfg.handlers) == "[object Object]",
             params = {
                  id : cfg.id,
                  hierMode : isHierarchyMode,
                  pk : cfg.recordId,
                  copy : cfg.isCopy || false,
                  readOnly : cfg.readOnly || false,
                  obj : cfg.dataSource.readerParams.linkedObject,
                  _events : {}
               },
               editTemplate,
               pageURL;
         if(url)
            pageURL = url;
         else if ($ws._const.htmlNames[cfg.editDialogTemplate]) {
            var arr = $ws._const.htmlNames[cfg.editDialogTemplate].split('/');
            pageURL = arr[arr.length - 1];
         }
         else {
            editTemplate = $ws._const.xmlContents[cfg.editDialogTemplate].split('/');
            pageURL = $ws._const.appRoot + editTemplate[editTemplate.length - 1] + ".html";
         }
         params["changedRecordValues"] = cfg.changedRecordValues;
         params["history"] = cfg.history;
         params["format"] = cfg.dataSource.readerParams.format;
         params["type"] = cfg.dataSource.readerType;
         if(cfg.dataSource.readerParams.otherURL !== $ws._const.defaultServiceUrl)
            params["url"] = cfg.dataSource.readerParams.otherURL;
         params["db"] = cfg.dataSource.readerParams.dbScheme;
         params["method"] = cfg.dataSource.readerParams.queryName;
         params["readMethod"] = cfg.dataSource.readerParams.readMethodName;
         params["createMethod"] = cfg.dataSource.readerParams.createMethodName;
         params["updateMethod"] = cfg.dataSource.readerParams.updateMethodName;
         params["destroyMethod"] = cfg.dataSource.readerParams.destroyMethodName;
         if(isHierarchyMode){
            params["branch"] = cfg.isBranch;
            params["pId"] = cfg.parentId;
            if(cfg.columnParentId)
               params["pIdCol"] = cfg.columnParentId;
         }
         if(cfg.recordId === undefined){
            params["filter"] = cfg.filter;
            params._events["onBeforeCreate"] = hdlIsObject && cfg.handlers.onBeforeCreate || [];
            params._events["onBeforeInsert"] = hdlIsObject && cfg.handlers.onBeforeInsert || [];
         }
         params._events["onBeforeRead"] = hdlIsObject && cfg.handlers.onBeforeRead || [];
         params._events["onBeforeUpdate"] = hdlIsObject && cfg.handlers.onBeforeUpdate || [];
         params._events["onBeforeShowRecord"] = hdlIsObject && cfg.handlers.onBeforeShowRecord || [];
         params._events["onLoadError"] = hdlIsObject && cfg.handlers.onLoadError || [];
         if( cfg.reports && !(Object.isEmpty(cfg.reports)) ){
            params["reports"] = cfg.reports;
            params._events["onBeforeShowPrintReports"] = hdlIsObject && cfg.handlers.onBeforeShowPrintReports || [];
            params._events["onPrepareReportData"] = hdlIsObject && cfg.handlers.onPrepareReportData || [];
            params._events["onSelectReportTransform"] = hdlIsObject && cfg.handlers.onSelectReportTransform || [];
         }
         if(retParams)
            return params;
         else{
            pageURL += "?editParams=" + encodeURIComponent($ws.helpers.serializeURLData(params));
            return pageURL;
         }
      } else {
         if(!$ws._const.htmlNames[cfg.editDialogTemplate] && !$ws._const.xmlContents[cfg.editDialogTemplate]) {
            $ws.single.ioc.resolve('ILogger').log('$ws.helpers.generatePageURL', 'ВНИМАНИЕ! Диалог "' + cfg.editDialogTemplate + '" отсутствует в оглавлении!');
         }
         return false;
      }
   },
   /**
    * Проверяет строковое значение даты на соответствие формату ISO 8601
    * @param {String} value строковое значение даты
    * @returns {Boolean} true, если строковое значение даты соответствует формату ISO
    */
   isISODate: function(value) {
      return /^(\d{4}\-\d\d\-\d\d([tT][\d:\.]*)?)([zZ]|([+\-])(\d\d):?(\d\d))?$/g.test(value);
   },
   /**
    * Преобразует строковое значение даты в формате ISO 8601 в Date
    * @param {String} value строковое значение даты в формате ISO 8601
    * @returns {Date|NaN} Date - в случае успешного преобразования, NaN - в противном случае
    */
   dateFromISO: function(value) {
      var day, tz,
            rx= /^(\d{4}\-\d\d\-\d\d([tT][\d:\.]*)?)([zZ]|([+\-])(\d\d):?(\d\d))?$/,
            p= rx.exec(value) || [];
      if(p[1]){
         day= p[1].split(/\D/).map(function(itm){
            return parseInt(itm, 10) || 0;
         });
         day[1]-= 1;
         day= new Date(Date.UTC.apply(Date, day));
         if(!day.getDate()) return NaN;
         if(p[5]){
            tz= parseInt(p[5], 10)*60;
            if(p[6]) tz += parseInt(p[6], 10);
            if(p[4]== "+") tz*= -1;
            if(tz) day.setUTCMinutes(day.getUTCMinutes()+ tz);
         }
         return day;
      }
      return NaN;
   },
   /**
    * Подготавливает пакет для отрпавки запроса JSON RPC
    * @param {String}         method   Название метода.
    * @param {Object}         params   Параметры метода.
    * @param {String|Number}  [id=1]   Идентификатор.
    * @returns {Object}                Объект с двумя полями:
    * reqBody — тело запроса в виде строки,
    * reqHeaders — объект с необходимыми заголовками.
    */
   jsonRpcPreparePacket: function(method, params, id) {
      var
         body = {
            jsonrpc  :  '2.0',
            protocol :  $ws._const.JSONRPC_PROOTOCOL_VERSION,
            method   :  method,
            params   :  params,
            id       :  id !== undefined ? id : 1
         },
         headers = {
            'X-CalledMethod'        : $ws.helpers.transliterate("" + method),
            'X-OriginalMethodName'  : $ws.single.base64.encode("" + method),
            'Accept-Language'       : $ws.single.i18n.getLang() + ';q=0.8,en-US;q=0.5,en;q=0.3'
         };
      return {
         reqBody: JSON.stringify(body),
         reqHeaders: headers
      };
   },
   /**
    * Функция, которая превращает строку вида 'js!SBIS3.EDO.MyPackage:handler' в функцию
    * @param {String} declaration - декларативное описание функции
    * @returns {Function|undefined}
    */
   getFuncFromDeclaration: (function(toJSON){
      return function(declaration){
         var
            paths = declaration.split(':'),
            result, module, p;

         try {
            // Сперва попробуем загрузить модуль.
            // requirejs.defined здес НЕ помогает (Сюрприз!)
            // Контрольный пример: define('x', function(){}); requirejs.defined('x') -> false
            module = requirejs(paths[0]);
         } catch(e) {
            // Если модуля нет - результат будет исходная декларация модуля
            result = declaration;
         }

         if (module) {
            // Если модуль загрузили
            try{
               // Ищем внутренности
               result = module;
               if (paths[1]){
                  paths = paths[1].split('.');
                  while(p = paths.shift()){
                     // try/catch нам тут нужен если указали кривой путь
                     result = result[p];
                  }
                  result._declaration = 'wsFuncDecl::' + declaration;
                  result.wsHandlerPath = declaration;
                  result.toJSON = toJSON;
               }
            }
            catch (e){
               throw new Error('Parsing function declaration "' + declaration + '" failed. Original message: ' + e.message);
            }

            if (typeof result !== 'function'){
               throw new Error('Can`t transform "'+ declaration +'" declaration to function');
            }
         }

         return result;
      }
   }(function(){return this._declaration})),
   /**
    * Функция, которая превращает строку вида 'datasource!SBIS3.EDO.MyDataSourcePackage:datasource_name' в json
    * @param declaration
    * @returns {object}
    */
   getDataSourceFromDeclaration: function (declaration) {
      var parts = declaration.split(':'),
         result;
      try {
         result = require(parts[0]);
         if (parts[1]) {
            var data = result.contents && result.contents[parts[1]];
            result = {
               readerParams: {
                  adapterType: "TransportAdapterStatic",
                  adapterParams: {
                     data: data
                  }
               }
            }
         }
      }
      catch (e) {
         throw new Error('Parsing datasource declaration "' + declaration + '" failed. Message:' + e.massage);
      }
      return result;
   },
   /**
    * Возвращает имя тэга элемента DOM дерева в нижнем регистре. Ф-ция совместима с IE8+.
    * @param {Object} elem - элемент DOM дерева
    * @returns {String}
    */
   getTagName : function (elem) {
      return elem.localName || (elem.nodeName && elem.nodeName.toLowerCase());
      // Bugfix. IE8 DOM localName is undefined, checking nodeName instead.
   },
   getTextWidth : function(text){
      var hiddenStyle = "left:-10000px;top:-10000px;height:auto;width:auto;position:absolute;";
      var clone = document.createElement('div');

      // устанавливаем стили у клона, дабы он не мозолил глаз.
      // Учитываем, что IE не позволяет напрямую устанавливать значение аттрибута style
      document.all ? clone.style.setAttribute('cssText', hiddenStyle) : clone.setAttribute('style', hiddenStyle);

      clone.innerHTML = text;

      parent.document.body.appendChild(clone);

      //var rect = {width:clone.clientWidth,height:clone.clientHeight,text:clone.innerHTML};
      var rect = clone.clientWidth;
      parent.document.body.removeChild(clone);

      return rect;
   },
   /**
    * Достаем значение из localStorage по key.
    * @param {String} key - ключ
    * @returns {String} Значение localStorage по key
    */
   getLocalStorageValue: function(key){
      if("localStorage" in window && window.localStorage !== null){
         var lastSid = localStorage.getItem('__sid'),
             currentSid = $.cookie('sid');

         if (lastSid != currentSid){
            localStorage.setItem('__sid', currentSid);
            //сбросим значения всех параметров, которые мы сохраняли, ибо сессия поменялась
            var localKeys = localStorage.getItem('ws-local-keys');
            localKeys = localKeys ? localKeys.split(',') : [];
            for(var i = 0, l = localKeys.length; i < l; i++){
               //bugFix условие для тех, у кого по какой-либо причине __sid содержится в массиве ключей
               if (localKeys[i] !== '__sid'){
                  $ws.helpers.setLocalStorageValue(localKeys[i], '');
               }
               else{
                  localKeys.splice(i,1);
                  i--;
               }
            }
         }

         return localStorage.getItem(key);
      }
      return undefined;
   },
   /**
    * Устанавливаем значение localStorage по key.
    * @param {String} key - ключ
    * @param {String} value - Значение
    */
   setLocalStorageValue: function(key,value){
      if("localStorage" in window && window.localStorage !== null){
         localStorage.setItem(key,value);
         if(key !== '__sid'){
            var localKeys = localStorage.getItem('ws-local-keys');
            localKeys = localKeys ? localKeys.split(',') : [];
            // если мы еще не запомнили, что мы используем этот ключ, то запомним его в список
            if(Array.indexOf(localKeys, key) === -1){
               localKeys.push(key);
            }
            localStorage.setItem('ws-local-keys', localKeys.join(','));
         }
      }
   },
   /**
    * Превращает переданный контейнер в конфиг компонента, содержащий ссылку на элемент DOM дерева
    * @param {HTMLElement | *} cfg - контейнер для инстанцирования компонента.
    * @returns {Object}
    */
   parseMarkup : (function() {
      var fnStorage = {};

      function toJSON (){
         var id = $ws.helpers.randomId();
         fnStorage[id] = this;
         return 'wsGlobalFnDecl::' + id;
      }

      function parseElem(elem, vStorage){
         var result;

         if (elem.nodeType === 3){ //TEXT_NODE
            //если это любой непробельный символ - считаем, что это часть контента, иначе скорее всего перевод строки - пропускаем
            result = /\S/.test(elem.text) ? {name : 'content', value : elem.text} : false;
         }
         else if (elem.nodeName == 'option' || elem.nodeName == 'opt') {
            var
               obj = {},
               content = "",
               valType = elem.getAttribute('type');

            content = elem.innerHTML();

            function isNumber(n) {
               return !isNaN(parseFloat(n)) && isFinite(n);
            }

            obj.name = elem.getAttribute('name');
            obj.value= elem.getAttribute('value') || '';

            if (content.length){
               obj.value = String.trim(content);
            }

            if (valType == 'function'){
               obj.value = $ws.helpers.getFuncFromDeclaration(obj.value);
            }
            if(valType == 'ref'){
               var k = obj.value;
               obj.value = vStorage.storage[obj.value];
               if (typeof obj.value == 'function' && !obj.value.toJSON){
                  obj.value.toJSON = toJSON;
               }
               delete vStorage.storage[k];
            }

            if (valType !== 'string'){
               if (isNumber(obj.value)){
                  //is number
                  //проверяем наличие лидирующих нулей (строка 0001234 - не должна быть преобразована в число)
                  obj.value = /^0+/.test(obj.value) && obj.value.length > 1 ? obj.value : parseFloat(obj.value);
               }
               else if (obj.value === 'false'){
                  //is boolean "false"
                  obj.value = false;
               }
               else if (obj.value === 'true'){
                  //is boolean "true"
                  obj.value = true;
               }
               else if (/^datasource!/.test(obj.value)) {
                  obj.value = $ws.helpers.getDataSourceFromDeclaration(obj.value);
               }
            }

            result = obj;
         }
         else if (elem.nodeName == 'options' || elem.nodeName == 'opts') {
            var
               isArray = /Array|array/.test(elem.getAttribute('type')),
               res = isArray ? [] : {},
               childRes,
               childNodes = elem.childNodes;

            if (!isArray && !childNodes.length){ //считаем атрибуты свойствами объекта только если у него нет дочерних нод
               for (var aI = 0, attrs = elem.attributes, aL = attrs.length; aI < aL; aI++){
                  res[attrs[aI].name] = attrs[aI].value;
               }
            }

            for (var i = 0, l = childNodes.length; i < l; i++){
               if ((childRes = parseElem(childNodes[i], vStorage)) !== false){
                  if (isArray){
                     res.push(childRes.value);
                  }
                  else{
                     if(childRes.name == 'content' && res.content){
                        res.content += childRes.value;
                     }
                     else{
                        res[childRes.name] = childRes.value;
                     }
                  }
               }
            }

            result =  {
               'name' : elem.getAttribute('name') || 'Object',
               'value': res
            }
         }
         else if ('outerHTML' in elem){
            result = {name : "content", value : elem.outerHTML()};
         }

         return result;
      }

      return function parseMarkupInner(cfg, vStorage, noRevive){
         if (cfg && cfg.getAttribute){ // Bugfix. IE8 type of DOM elements functions == "object".
            var obj, childNodes, name;

            obj = $ws.helpers.decodeCfgAttr(cfg.getAttribute('config') || '{}', fnStorage, noRevive);

            if (!('name' in obj)) {
               name = cfg.getAttribute('name');
               if (name) {
                 obj.name = name;
               }
            }

            if (cfg.cloneNode){
               //Если это прямо настоящая нода, то внутренности парсить не будем
               obj.element = cfg;
               cfg = obj;
            }
            else if (cfg.getAttribute('hasMarkup') !== 'true'){
               //Если это фейковый xml, то парсим его
               childNodes = cfg.childNodes;
               cfg = obj;
               if (childNodes.length){
                  for (var i = 0, l = childNodes.length; i < l; i++){
                     var field = parseElem(childNodes[i], vStorage);
                     if (field){
                        if (field.name == 'content'){
                           cfg.content = cfg.content || '';
                           cfg.content += field.value;
                        }
                        else{
                           cfg[field.name] = field.value;
                        }
                     }
                  }
               }
            }
         }

         return cfg;
      }
   })(),

   setElementCachedSize: function(element, size) {
      var cachedSize = element.data('cachedSize');
      if (!cachedSize || cachedSize.width !== size.width || cachedSize.height !== size.height) {
         element.data('cachedSize', size);
         element.css(size);
      }
   },

   getElementCachedDim: function(element, dim) {
      var size = element.data('cachedSize');
      if (!size) {
         size = {};
         element.data('cachedSize', size);
      }
      if (!(dim in size)) {
         size[dim] = element[dim]();
      }

      return size[dim];
   },

   /**
    * Сохранение файла в  формате pdf или excel
    * В результате выполнения данного метода будет отправлен запрос
    * к методу бизнес-логики, возвращающему файл; и будет выведено окно
    * для сохранения  этого файла.
    * @param {String} object Название объекта бизнес-логики.
    * @param {String} methodName Имя метода.
    * @param {Object} params Параметры. Различные параметры в зависимости от метода.
    * Важно учесть параметр "fileDownloadToken" - он будет добавлен, если не передан.
    * Метод saveToFile при формировании запроса передает в метод бизнес-логики ещё один параметр к перечисленным в
    * объекте params. Дополнительный параметр служит для передачи случайно сгенерированного числа, с помощью которого
    * определяется момент завершения выполнения  метода БЛ. Чтобы воспользоватся методом saveToFile,
    * вызываемый метод БЛ должен:
    * 1. принимать дополнительный параметр с именем "fileDownloadToken" (число целое 8 байт)
    * 2. добавлять cookie с именем (!): "fileDownloadToken_" + значение_параметра_в_виде_строки
    * и значением: значение_параметра_в_виде_строки.
    * @returns {$ws.proto.Deferred}
    */
   saveToFile: function(object, methodName, params, url){
      var dResult = new $ws.proto.Deferred();
      if(object && methodName && params){
         if(!params['fileDownloadToken'])
            params['fileDownloadToken'] = ('' + Math.random()).substr(2)* 1;
         var body = $('body'),
            cookie = 'fileDownloadToken_'+params['fileDownloadToken'],
            fileDownloadCheckTimer,
            cookieValue,
            form = $('.ws-upload-form'),
            iframe = $('.ws-upload-iframe');

         if(!form.length && !iframe.length){
            body.append(form = $('<form enctype="multipart/form-data" target="ws-upload-iframe" '+
               'action="' + ( url ? url : $ws._const.defaultServiceUrl ) +
               '?raw_file_result" method="POST" class="ws-upload-form ws-hidden">'+
               '<input type="hidden" name="Запрос"></form>'));
            body.append(iframe = $('<iframe class="ws-upload-iframe ws-hidden" name="ws-upload-iframe"></iframe>'));
         }
         form.find('[name=Запрос]').val(
            $ws.helpers.jsonRpcPreparePacket(
               object + '.' + methodName,
               params,
               ("" + Math.random()).substr(2)
            ).reqBody
         );
         form.submit();
         fileDownloadCheckTimer = setInterval(function(){
            var iframeText = iframe.contents().find('pre');
            cookieValue = $.cookie(cookie);
            if(parseInt(cookieValue, 10) === params['fileDownloadToken']) {
               clearInterval(fileDownloadCheckTimer);
               $.cookie(cookie, null);
               if(iframeText.length) {
                  dResult.errback(new Error(JSON.parse(iframeText.html()).error.details));
                  iframeText.remove('pre');
               } else {
                  dResult.callback();
               }
            }
         }, 1000);
      }else
         dResult.errback();
      return dResult;
   },
   /**
    * Удаляет все пробелы из строки
    * @param str
    * @returns {*}
    */
   removeWhiteSpaces: function(str){
      return typeof(str) === "string" ? str.replace(/\s/g, "") : undefined;
   },
   /**
    * Удаляем указанные тэги.
    * @param {String} str - строка.
    * @param {Array|String} tags - массив тэгов, которые необходимо убрать из строки.
    */
   escapeTagsFromStr : function(){
      var reCache = {};

      return function(str, tags){
         var tagString, re;
         if (typeof tags == 'string')
            tags = [tags];
         if (typeof str == 'string' && tags instanceof Array) {
            tagString = tags.join('|');
            re = reCache[tagString] || (reCache[tagString] = new RegExp('<(?=\/*(?:' + tagString + '))[^>]+>', 'g'));
            re.lastIndex = 0;
            str = str.replace(re, '');
         }
         return str;
      }
   }(),
   /**
    * Экранирование HTML тэгов
    * @param {String} str строка.
    * @return {String} экранированная строка.
    */
   escapeHtml : function(str){
      if (typeof str == "string") {
         return str.replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g, '&quot;');
      }
      else
         return str;
   },
   /**
    * Разэкранирование HTML тэгов
    * @param {String} str строка.
    * @return {String} разэкранированная строка.
    */
   unEscapeHtml: function(str){
      BOOMR.plugins.WS.reportEvent("ws.helpers", "unEscapeHtml");
      if (typeof str == "string")
         return str.replace(/&lt;/g,'<').replace(/&gt;/g,'>');
      else
         return str;
   },
   /**
    * Экранирование ASCII символов
    * @param {String} str строка.
    * @return {String} экранированная строка.
    */
   escapeASCII: function (str) {
      if (typeof str == "string") {
         return str.replace(/./g, function(str){
            var c = str.charCodeAt(0);
            if ((c < 256) && (c < 48 || c > 57) && (c < 65 || c > 90) && (c < 97 || c > 122)) {
               return '&#' + c + ';';
            } else {
               return str;
            }
         });
      } else {
         return str;
      }
   },
   /**
    * Разэкранирование ASCII символов
    * @param {String} str строка.
    * @return {String} разэкранированная строка.
    */
   unEscapeASCII: function (str) {
      if (typeof str == "string") {
         return str.replace(/&#(.*?);/g, function (str, sub) {
            return String.fromCharCode(sub);
         });
      } else {
         return str;
      }
   },
   /**
    * Преобразование html-сущностей в символы
    * @param {String} str строка.
    * @return {String} преобразованная строка.
    */
   unEscapeHtmlSpecialChars: function(str){
      if (typeof str == "string"){
         var
               chars = {
                  '&minus;': '-',
                  '&nbsp;': ' ',
                  '&#92;': '\\'
               },
               chr;
         for(chr in chars){
            str = str.replace(new RegExp(chr, 'g'), chars[chr]);
         }
      }
      return str;
   },
    /**
     * Подготавливает объект сортировки для передачи на бизнес-логику
     * Создаёт объект вида { d: [], s: [] }.
     * @param filter - текущий фильтр табличного представления.
     * @returns {*} возвращает объект или null.
     */
   prepareSorting: function(filter){
      if(!filter || filter['sorting'] === undefined){
         return null;
      }
      var result = {
         s:[
            {'n': 'n', 't': 'Строка'},
            {'n': 'o', 't': 'Логическое'},
            {'n': 'l', 't': 'Логическое'}
         ],
         d:[]
      };
      for(var len = filter['sorting'].length, i = 0; i < len; ++i){
         result.d.push([filter['sorting'][i][0], filter['sorting'][i][1], !filter['sorting'][i][1]]);
      }
      return result;
   },
    /**
     * Подготавливает фильтр
     * Создаёт объект вида { d: [], s: [] }.
     * @param filter - текущий фильтр табличного представления.
     * @returns {{d: Array, s: Array}} возвращает объект вида { d: [], s: [] }.
     */
   prepareFilter: function(filter){
      var retval = { d: [], s: [] };
      if(filter) {
         for(var i in filter) {
            if(i == 'pageNum' || i == 'pageCount' || i == 'usePages' || i == 'sorting'){
               continue;
            }
            if(filter.hasOwnProperty(i) && filter[i] !== undefined) {
               var serialized = $ws.proto.ReaderSBIS.serializeParameter(i, filter[i]);
               if(filter[i] instanceof Object && filter[i].hasOwnProperty('hierarchy')){
                  retval.d = retval.d.concat(serialized.d);
                  retval.s = retval.s.concat(serialized.s);
               }else{
                  retval.d.push(serialized.d);
                  retval.s.push({ 'n': i, 't': serialized.s });
               }
            }
         }
      }
      return retval;
   },
    /**
     * Возвращает на сколько пикселей сдвинули страницу вниз/влево
     * @returns {{left: (Number), top: (Number)}}
     */
   getScrollOffset: function() {
      return {
         left: window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft,
         top: window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      };
   },
   makeBackground: (function(){
      var backDeffered, backgroundMapper;
      return function(element, image){
         backDeffered = backDeffered || $ws.requireModule('Core/BackgroundMapper').addCallback(function(BackgroundMapper) {
            backgroundMapper=BackgroundMapper[0];
            return backgroundMapper;
         });

         if(!backDeffered.isReady()) {
            backDeffered.addCallback(function (){
               backgroundMapper.makeBackground(element, image);
            })
         } else {
            backgroundMapper.makeBackground(element, image);
         }
         return element;
      }
   })(),
    /**
     * Превращает абстрактный путь к картинке вида "ws:/" к пути относительно корня
     * @param {string} path
     * @returns {*}
     */
   processImagePath: function(path) {
      BOOMR.plugins.WS.reportEvent("ws.helpers", "processImagePath");
      if (typeof path == 'string') {
         if (typeof window == 'undefined') {
            var nodePath = require('path');
         }

         if (path.indexOf('ws:/') === 0) {
            var replaceTo = $ws._const.wsRoot + 'img/themes/' + $ws._const.theme;
            if (typeof window == 'undefined') {
               var wsRoot = (typeof process !== 'undefined' && process.domain) ? process.domain.wsRoot || $ws._const.wsRoot : $ws._const.wsRoot;
               replaceTo = nodePath.join('/', nodePath.relative($ws._const.appRoot, wsRoot), 'img/themes', $ws._const.theme);
            }
            path = path.replace('ws:', replaceTo);
         }
         else if(/^js!/.test(path)) {
            var modulePath = $ws.helpers.resolveModule(path.replace(/^js!|\/.*/g, ''));
            if (modulePath) {
               if (typeof window == 'undefined') {
                  modulePath = nodePath.join('/', nodePath.relative($ws._const.appRoot, modulePath));
               }
               path = path.replace(/^js![^\/]*/, modulePath.replace(/\/[^\/]*$/, ''));
            }
         }
         if ($ws._const.buildnumber && !/\.v[0-9a-z]+/.test(path)) {
            path = path.replace(/(jpg|png|gif)$/, "v" + $ws._const.buildnumber + ".$1");
         }
      }
      return path;
   },
   /**
    * Превращаем упрощенный путь до ресурсов компонента в "настоящий"
    * @param {String} path упрощенный путь до ресурсов комопнента, например, 'SBIS3.CORE.Button/resources/images/process.gif'.
    * <pre>
    *    var image = $ws.helpers.resolveComponentPath('SBIS3.CORE.Button/resources/images/process.gif');
    * </pre>
    */
   resolveComponentPath: function(path){
      var
         pA = path.split("/"),
         componentName = pA.shift(),
         rA = [$ws._const.wsRoot],
         relativePath = $ws._const.jsCoreModules[componentName] || $ws._const.jsModules[componentName];

      rA.push(relativePath ? relativePath.replace(/\/[^\/]*$/, "/") : componentName);
      rA.push(pA.join("/"));
      return rA.join("");
   },
    /**
     * Переводит строку адреса в строку base64
     * @param {string} data - строка адреса
     * @returns {String}
     */
   serializeURLData: function(data) {
      // Шилов 12.10.2012
      // Если это IE8 или мало ли какой паразит, то преобразуем в UTF-8
      var stringified = JSON.stringify(data);
      if( stringified.indexOf( "\\u" ) != -1 )
         stringified  = unescape(stringified.replace(/\\u/g, '%u'));

      return $ws.single.base64.encode(stringified);
   },
    /**
     * Переводит строку из base64 в обычную строку
     * @param {string} serialized
     * @returns {*}
     */
   deserializeURLData: function(serialized) {
      var parseFunc = JSON && JSON.parse ? JSON.parse : $.parseJSON;
      return parseFunc($ws.single.base64.decode(serialized));
   },
   /**
    * Функция для приведения строки к валидной для XSLT трансформации
    */
   removeInvalidXMLChars: function(valueStr) {
      if (typeof valueStr == "string"){
         valueStr = valueStr.replace(/[^\x09\x0A\x0D\x20-\uD7FF\uE000-\uFFFD\u10000-\u10FFFF]*/g, "");
      }
      return valueStr;
   },

   /**
    * Делает функцию, вызывающую заданный метод у объекта, который будет передан ей в качестве аргумента.
    * Удобно для передачи метода объекта в качестве функции-итератора в forEach и ему подобные.
    * @param String methodName Имя метода
    * @param [Any] args Аргументы метода
    * @returns {Function}
    * @example
    * <pre>
    *     $ws.helpers.forEach([control1, control2, control3], $ws.helpers.methodCaller('destroy'));//вызовет destroy у всех контролов
    *     $ws.helpers.forEach([window1, floatArea1], $ws.helpers.methodCaller('hide'));//закроет окно и плав. панель
    * </pre>
    */
   methodCaller: function(methodName, args) {
      return function(obj) {
         return args ? obj[methodName].apply(obj, args) : obj[methodName]();
      }
   },

   /**
    * Функция для обхода элементов объекта или массива (взята отсюда: http://documentcloud.github.com/underscore/#each).
    * Вызывает iterateCallback для каждого элемента (при этом обрабатываются только собственные элементы-свойства объекта, прототипные игнорируются).
    * Если obj - массив, то iterateCallback вызывается с аргументами (element, index, array), где array === obj (исходный массив).
    * Если obj - объект, то iterateCallback вызывается с аргументами (value, key, obj), где obj - исходный объект.
    * @param obj {Object|Array} Объект/массив, свойства/элементы которого перебираются.
    * @param iterateCallback Функция, вызываемая для каждого элемента/свойства.
    * @param [context] - опциональный аргумент, указывающий контекст, в котором будет выполняться iterateCallback.
    */
   forEach: function(obj, iterateCallback, context) {
      if (obj === null || obj === undefined || obj.length === 0)
         return;

      /**
       * Это место переписано так не случайно.
       * При необъяснимых обстоятельствах на iOS 8.1 старая проверка
       * (obj.length === +obj.length) для obj === { 0: ??? }
       * давала положительный результат (obj.length в момент проверки был === 1)
       * Но следующая строка при чтении obj.length уже давала как и положено `undefined`
       * Как показали опыты, переписанная нижеследующим образом проверка не багает
       */
      if ('length' in obj && (obj.length - 1) in obj) {
         for (var i = 0, l = obj.length; i < l; i++) {
            if (i in obj)
               iterateCallback.call(context, obj[i], i, obj);
         }
      } else {
         for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
               iterateCallback.call(context, obj[key], key, obj);
            }
         }
      }
   },

   /**
    * Функция для создания нового массива из преобразованных элементов/свойств исходного массива/объекта (взята отсюда: http://documentcloud.github.com/underscore/#map).
    * Вызывает iterateCallback для каждого элемента (при этом обрабатываются только собственные элементы-свойства объекта, прототипные игнорируются),
    * и добавляет результат iterateCallback в выходной массив.
    * Если obj - массив, то iterateCallback вызывается с аргументами (element, index, array), где array === obj (исходный массив).
    * Если obj - объект, то iterateCallback вызывается с аргументами (value, key, obj), где obj - исходный объект.
    * @param obj {Object|Array} Исходный объект/массив.
    * @param iterateCallback Функция, вызываемая для каждого элемента/свойства. Должна возвращать преобразованный элемент.
    * @param [context] - опциональный аргумент, указывающий контекст, в котором будет выполняться iterateCallback.
    */
   map: function(obj, iterateCallback, context) {
      var results = [];
      if (obj === null || obj === undefined)
         return results;

      $ws.helpers.forEach(obj, function(value, index, list) {
         results[results.length] = iterateCallback.call(context, value, index, list);
      }, context);
      if (obj.length === +obj.length)//если на входе массив - подгоним длину
         results.length = obj.length;
      return results;
   },

   /**
    * Функция для создания нового массива из фильтрованных элементов/свойств исходного массива/объекта (взята отсюда: http://documentcloud.github.com/underscore/#filter).
    * Вызывает iterateCallback для каждого элемента (при этом обрабатываются только собственные элементы-свойства объекта, прототипные игнорируются),
    * и добавляет элемент в выходной массив, если результат iterateCallback для него положителен (!!result).
    * Если obj - массив, то iterateCallback вызывается с аргументами (element, index, array), где array === obj (исходный массив).
    * Если obj - объект, то iterateCallback вызывается с аргументами (value, key, obj), где obj - исходный объект.
    * @param obj {Object|Array} Исходный объект/массив
    * @param [iterateCallback] Функция, вызываемая для каждого элемента/свойства. Должна возвращать true или эквивалентное ему значение, которое показывает, добавлять ли объект в массив результатов. Может быть не указана, тогда вместо неё используется преобразование тек. элемента в bool (!!obj[i])
    * @param [context] - опциональный аргумент, указывающий контекст, в котором будет выполняться iterateCallback.
    */
   filter: function(obj, iterateCallback, context) {
      var results = [];
      if (obj === null || obj === undefined)
         return results;

      $ws.helpers.forEach(obj, function(value, index, list) {
         if (iterateCallback) {
            if (iterateCallback.call(context, value, index, list))
               results[results.length] = value;
         } else if (value)
            results[results.length] = value;
      }, context);

      return results;
   },

   /**
    * Функция для поиска элемента в массиве/объекте (взята отсюда: http://documentcloud.github.com/underscore/#find).
    * Вызывает iterateCallback для каждого элемента (при этом обрабатываются только собственные элементы-свойства объекта, прототипные игнорируются),
    * и возвращает первый элемент, результат iterateCallback для которого положителен (!!result).
    * Если obj - массив, то iterateCallback вызывается с аргументами (element, index, array), где array === obj (исходный массив).
    * Если obj - объект, то iterateCallback вызывается с аргументами (value, key, obj), где obj - исходный объект.
    * @param obj {Object|Array} Исходный объект/массив.
    * @param [iterateCallback] Функция, вызываемая для каждого элемента/свойства. Должна возвращать true или эквивалентное ему значение, которое показывает, добавлять ли объект в массив результатов. Может быть не указана, тогда вместо неё используется преобразование тек. элемента в bool (!!obj[i])
    * @param [context] - опциональный аргумент, указывающий контекст, в котором будет выполняться iterateCallback.
    */
   find: function(obj, iterateCallback, context) {
      var result = undefined;
      if (obj === null || obj === undefined)
         return result;

      var i, l, key;
      if (obj.length === +obj.length) { //хак, определяющий массив
         if (iterateCallback) {
            for (i = 0, l = obj.length; i < l; i++) {
               if (i in obj) {
                  if (iterateCallback.call(context, obj[i], i, obj)) {
                     result = obj[i];
                     break;
                  }
               }
            }
         } else {
            for (i = 0, l = obj.length; i < l; i++) {
               if (i in obj) {
                  if (!!obj[i]) {
                     result = obj[i];
                     break;
                  }
               }
            }
         }
      } else {
         if (iterateCallback) {
            for (key in obj) {
               if (obj.hasOwnProperty(key)) {
                  if (iterateCallback.call(context, obj[key], key, obj)) {
                     result = obj[key];
                     break;
                  }
               }
            }
         } else {
            for (key in obj) {
               if (obj.hasOwnProperty(key)) {
                  if (!!obj[key]) {
                     result = obj[key];
                     break;
                  }
               }
            }
         }
      }

      return result;
   },

   /**
    * Функция для поиска индекса (ключа) элемента в массиве/объекте. Если элемент не найден, возвращает -1 (число).
    * Вызывает iterateCallback для каждого элемента (при этом обрабатываются только собственные элементы-свойства объекта, прототипные игнорируются),
    * и возвращает индекс первого элемента, результат iterateCallback для которого положителен (!!result).
    * Если obj - массив, то iterateCallback вызывается с аргументами (element, index, array), где array === obj (исходный массив).
    * Если obj - объект, то iterateCallback вызывается с аргументами (value, key, obj), где obj - исходный объект.
    * @param obj {Object|Array} Исходный объект/массив.
    * @param [iterateCallback] Функция, вызываемая для каждого элемента/свойства. Должна возвращать true или эквивалентное ему значение, которое показывает, добавлять ли объект в массив результатов. Может быть не указана, тогда вместо неё используется преобразование тек. элемента в bool (!!obj[i])
    * @param [context] - опциональный аргумент, указывающий контекст, в котором будет выполняться iterateCallback.
    */
   findIdx: function(obj, iterateCallback, context) {
      BOOMR.plugins.WS.reportEvent("ws.helpers", "find");
      var result = -1;
      if (obj === null || obj === undefined)
         return ;

      var i, l, key;
      if (obj.length === +obj.length) { //хак, определяющий массив
         if (iterateCallback) {
            for (i = 0, l = obj.length; i < l; i++) {
               if (i in obj) {
                  if (iterateCallback.call(context, obj[i], i, obj)) {
                     result = i;
                     break;
                  }
               }
            }
         } else {
            for (i = 0, l = obj.length; i < l; i++) {
               if (i in obj) {
                  if (!!obj[i]) {
                     result = i;
                     break;
                  }
               }
            }
         }
      } else {
         if (iterateCallback) {
            for (key in obj) {
               if (obj.hasOwnProperty(key)) {
                  if (iterateCallback.call(context, obj[key], key, obj)) {
                     result = key;
                     break;
                  }
               }
            }
         } else {
            for (key in obj) {
               if (obj.hasOwnProperty(key)) {
                  if (!!obj[key]) {
                     result = key;
                     break;
                  }
               }
            }
         }
      }

      return result;
   },

   /**
    * Функция, которая не делает ничего. Бывает нужна в качестве коллбека-заглушки, чтобы не проверять коллбеки на null
    */
   nop: function() {
   },

   /**
    * Функция для свёртки массива или набора свойств объекта в скалярное значение. (взята отсюда: http://documentcloud.github.com/underscore/#reduce).
    * Вызывает iterateCallback для каждого элемента (при этом обрабатываются только собственные элементы-свойства объекта, прототипные игнорируются),
    * при этом её параметр memo будет равен результату предыдущего вызова iterateCallback или начальному значению, заданному аргументом memoInitial.
    * Если obj - массив, то iterateCallback вызывается с аргументами (memo, element, index, array), где array === obj (исходный массив).
    * Если obj - объект, то iterateCallback вызывается с аргументами (memo, value, key, obj), где obj - исходный объект.
    * @param obj {Object|Array} Исходный объект/массив
    * @param iterator {Function} Функция, вызываемая для каждого элемента/свойства. Должна возвращать новое значение memo, вычисленное на основе аргументов memo и value.
    * @param memoInitial
    * @param [context] опциональный аргумент, указывающий контекст, в котором будет выполняться iterateCallback.
    */
   reduce: function(obj, iterator, memoInitial, context) {
      var initial = arguments.length > 2, memo = memoInitial;

      if (obj === null || obj === undefined)
         obj = [];

      $ws.helpers.forEach(obj, function(value, index, list) {
         if (!initial) {
            memo = value;
            initial = true;
         } else {
            memo = iterator.call(context, memo, value, index, list);
         }
      });

      if (!initial)
         throw new TypeError('Reduce of empty array with no initial value');

      return memo;
   },

   memoize: function(func, cachedFuncName) {
      var wrapFn = function() {
         var res = func.call(this),
             cached = function() { return res;},
             self = this;

         cached.reset = function() {
            self[cachedFuncName] = wrapFn;
         };

         this[cachedFuncName] = cached;
         return res;
      };
      wrapFn.reset = function() {};

      return wrapFn;
   },

   /**
    * Оборачивает указанную функцию в функцию, проверяющую, удалён ли указанный в аргументе selfControl контрол.
    * Если selfControl не задан, то используется обычный this (предполагается, что функция будет вызываться на этом контроле).
    * Если контрол удалён (его метод isDestroyed() возвращает true), то функция func вызываться не будет.
    * @param func {Function} Функция, которая будет работать только на живом контроле.
    * @param [selfControl] Ссылка на контрол. Если не указана, то используется this (такой вариант удобно использовать
    * для оборачивания методов контрола).
    * @returns {Function}
    */
   forAliveOnly: function (func, selfControl) {
      return function() {
         var self = selfControl || this;
         if (!self.isDestroyed()) {
            return func.apply(self, arguments);
         }
      }
   },

   /**
    * Определяет, разрешена ли прокрутка (скроллбары) в элементе (по свойствам overflow/overflow-x/y).
    * При isScrollable === false прокрутки при вылезании содержимого элемента за его границы не будет.
    * @param element - Элемент HTML DOM или jQuery
    * @param [kind] {String} Какой тип прокрутки (скроллбара) имеется в виду:
    *  <strong>kind === undefined</strong> - любой,
    *  <strong>kind === 'x'</strong> - горизонтальный,
    *  <strong>kind === 'y'</strong> - вертикальный.
    * @return {Boolean}
    */
   isScrollable: function(element, kind) {
      var el = $(element),
          overflow = el.css('overflow'),
          overflowX, overflowY;

      return (overflow === 'scroll' || overflow === 'auto') ||
             ((kind === undefined || kind === 'y') &&
              ((overflowY = el.css('overflow-y')) === 'auto' || overflowY === 'scroll')) ||
             ((kind === undefined || kind === 'x') &&
              ((overflowX = el.css('overflow-x')) === 'auto' || overflowX === 'scroll'));
   },

   /**
    * Определяет, показаны ли полосы прокрутки (скроллбары) в элементе.
    * Способ не очень быстрый, но надёжный.
    * @param element - Элемент HTML DOM или jQuery.
    * @param [kind] {String} Какой тип прокрутки (скроллбара) имеется в виду:
    *  <strong>kind === undefined</strong> - любой,
    *  <strong>kind === 'x'</strong> - горизонтальный,
    *  <strong>kind === 'y'</strong> - вертикальный.
    * @return {Boolean}
    */
   hasScrollbar: function(element, kind) {
      var el, result = false;

      element = $(element);//это может быть DOM-объект, а не jQuery-объект
      if (element.size() > 0) { //проверим, есть ли полосы прокрутки
         el = element.get(0);
         if (kind === undefined || kind === 'y') {
            result = (el.scrollHeight !== el.clientHeight);
         }

         if (!result && (kind === undefined || kind === 'x')) {
            result = (el.scrollWidth !== el.clientWidth);
         }
      }

      return result;
   },

   /**
    * Определяет, показана ли вертикальная полоса прокрутки в элементе.
    * @param element - Элемент HTML DOM или jQuery.
    * @return {Boolean}
    */
   hasVerticalScrollbar: function(element) {
      return this.hasScrollbar(element, 'y');
   },

   /**
    * Определяет, показана ли горизонтальная полоса прокрутки в элементе.
    * @param element - Элемент HTML DOM или jQuery.
    * @return {Boolean}
    */
   hasHorizontalScrollbar: function(element) {
      return this.hasScrollbar(element, 'x');
   },
    /**
     * Возвращает случайный идентификатор в виде "префикс"-123...
     * Идентификатор без префикса составляет 16 знаков.
     * @param {String} [prefix='ws-'] Префикс идентификатора
     * @returns {string} Случайный идентификатор с префиксом или без него в зависимости от переданного параметра.
     * @example
     * <pre>
     *     $ws.helpers.randomId(); // выведет идентификатор вида "ws-5543191684409976"
     * </pre>
     */
   randomId: function(prefix) {
      return (prefix || 'ws-') + Math.random().toString(36).substr(2) + (+new Date());
   },
   /**
    * Создает "GUID"
    * В кавычках потому, что он не настоящий, только выглядит как GUID.
    * Используется свой аглоритм, не такой как настоящий.
    *
    * @returns {String} "GUID"
    */
   createGUID: function() {
      var
            i = 0, s = 0, pad = new Date().getTime().toString(16);
      pad = '000000000000'.substr(0, 12 - pad.length) + pad;
      var p = function() {
         return (pad.substring(s, s += (i++ % 2 ? 2 : 1)) + (((1+Math.random())*0x10000)|0).toString(16)).substring(0, 4);
      };
      return (p()+p()+'-'+p()+'-'+p()+'-'+p()+'-'+p()+p()+p());
   },
    /**
     * Метод разбора сложного ключа
     * в объект вида
     * {
     *    objName: name,
     *    objKey: key
     * }
     * @param {string} key - сложный идентификатор.
     * @returns {*}
     */
   parseComplexKey: function(key) {
      if(typeof key == 'string') {
         var splitPos = key.indexOf($ws._const.IDENTITY_SPLITTER);
         if(splitPos != -1) {
            return {
               objName: key.substr(splitPos+1),
               objKey: key.substr(0, splitPos)
            }
         }
      }
      return {
         objName: '',
         objKey: key
      };
   },
    /**
     * Формирует GET запрос к бизнес-логике
     * Подготавливает адрес для вызова метода БЛ через GET запрос. Например, чтобы при клике на ссылку начиналась
     * загрузка какого-либо файла, расположенного в базе данных бизнес-логики.
     * @param {String} object Объект бизнес-логики.
     * @param {String} method Метод бизнес-логики.
     * @param {Object} args Аргументы  вызова бизнес-логики. Можно передать пустой объект {}.
     * @param {$ws.proto.Context} [context=$ws.single.GlobalContext] Контекст для параметров (см. пример).
     * @param {String} [serviceUrl=$ws._const.defaultServiceUrl] Адрес сервиса бизнес-логики.
     * @returns {String} Возвращает строку GET запроса.
     * @example
     * <pre>
     *     // параметр 'Версия' берётся из поля 'version' глобального контекста
     *     $ws.helpers.prepareGetRPCInvocationURL('ВерсияВнешнегоДокумента', 'ПолучитьФайл', {'ИдО': 123, 'Версия' : {fieldName : 'version'}})
     * </pre>
     */
   prepareGetRPCInvocationURL: function(object, method, args, context, serviceUrl) {
      var
         baseUrl = serviceUrl || $ws._const.defaultServiceUrl,
         rpcMethod = encodeURIComponent(object + '.' + method),
         filterParams = $ws.core.merge({}, args || {}),
         complexKey, objName;

      for(var fName in filterParams) {
         if(filterParams.hasOwnProperty(fName)) {
            var param = filterParams[fName];
            if(param !== null && typeof param == 'object' && 'fieldName' in param) {
               filterParams[fName] = (context || $ws.single.GlobalContext).getValue(param.fieldName);
            }
            if(fName == 'ИдО') {
               var oN = filterParams[fName];
               if(!oN) {
                  return '';
               }
               if(typeof oN == 'string') {
                  complexKey = $ws.helpers.parseComplexKey(oN);
                  objName = complexKey.objName || object;

                  if (complexKey.objKey) {
                     filterParams[fName] = complexKey.objKey;
                  }
                  rpcMethod = encodeURIComponent(objName + '.' + method);
               }
            }
         }
      }

      return baseUrl +
            '?id=' + ('' + Math.random()).substr(2) +
            '&method=' + rpcMethod +
            '&protocol=3' +
            '&params=' + encodeURIComponent( $ws.helpers.serializeURLData(filterParams) );
   },
   /**
    * Выполняет GET запрос на получение файла с помощью метода БЛ.
    * @param {String} objectName имя объекта БЛ. Например "Контакт".
    * @param {String} methodName имя метода БЛ. Например "Список".
    * @param {Object} params JSON-объект параметров запроса
    * @param {String} serviceUrl путь до сервиса, на котором надо выполнить метод
    * @return $ws.proto.Deferred объект deferred с результатом запроса
    */
   fetchFile : function(objectName, methodName, params, serviceUrl){
      return $ws.single.ioc.resolve('ITransport', {
         method: 'GET',
         dataType: 'text',
         url: $ws.helpers.prepareGetRPCInvocationURL(objectName, methodName, params, null, serviceUrl)
      }).execute();
   },
    /**
     * Метод для создания запросов.
     * @param {String} object Имя таблицы, у которой будет вызван метод.
     * @param {String} [method] Имя метода БЛ.
     * @param {Object} [filter] Параметры фильтрации.
     * @param {String} [reader = ReaderUnifiedSBIS] Используемый Reader.
     * @param {Boolean} [autoQuery = true] Производить ли начальное заполнение RecordSet'а.
     * @param {String} [url] Адрес сервиса.
     * @param {String} [hierarchyField = ''] Поле иерархии.
     * @param {Object} [readerParams = {}] Дополнительные параметры Reader, например, readMethodName.
     * @returns {$ws.proto.Deferred} В случае успеха подписант на результа deferred получит RecodSet (@link $ws.proto.RecordSet).
     * В противном случае происходит ошибка.
     * @example
     * <pre>
     *    fieldLink.subscribe('onBeforeShowRecord', function(event, record){
     *       if (record.isBranch()) {
     *          //не показываем диалог для выбранного подразделения.
     *          event.setResult(false);
     *       } else if (record.get('Сотрудник.Лицо1') !== $ws.single.GlobalContext.getValue('currentOrganization')) {
     *          //если сотрудник в текущей организации, то её запись уже есть и отдадим на показ её.
     *          event.setResult(window.currentOrgRecord);
     *       } else {
     *          //иначе вычитаем.
     *          var waitOrg = new $ws.proto.Deferred();
     *          event.setResult(wait);
     *          $ws.helpers.newRecordSet('Организация', 'Список', {}, undefined, false).addCallback(function(rs){
     *             waitOrg.dependOn(rs.readRecord(record.get('Сотрудник.Лицо1')));
     *          }).addErrback(function(error){
     *             waitOrg.errback(error);
     *          });
     *       }
     *    });
     * </pre>
     */
    newRecordSet : function(object, method, filter, reader, autoQuery, url, hierarchyField, readerParams){
        var result = new $ws.proto.Deferred();
        autoQuery = ((autoQuery === undefined) ? true : !!autoQuery);
        hierarchyField = (hierarchyField === undefined ? '' : hierarchyField);
        readerParams = $ws.core.merge({
                    otherUrl : url,
                    dbScheme: '',
                    linkedObject: object,
                    queryName: method
              }, (!!readerParams && readerParams.constructor === Object) ? readerParams : {});
        $ws.core.attachInstance('Source:RecordSet', {
            hierarchyField: hierarchyField,
            firstRequest: autoQuery && !!method,
            filterParams: filter,
            readerType: reader || 'ReaderUnifiedSBIS',
            readerParams: readerParams,
            handlers: {
                onAfterLoad: function(eventState, recordSet, isSuccess, error){
                    recordSet.unsubscribe('onAfterLoad', arguments.callee);
                    if(autoQuery) {
                        if(isSuccess){
                            result.callback(recordSet);
                        }
                        else{
                            result.errback(error);
                        }
                    }
                }
            }
      }).addCallbacks(function(rs){
         if(!autoQuery)
            result.callback(rs);
      }, function(e){
         result.errback(e);
      });
      return result;
   },
    /**
     * Назначает обработчик на на событие keydown
     * Для одинаковой обработки событий в разных браузерах.
     * Актуально для старых версий, например, Opera до 12.10.
     * @param object - jQuery объект, на который вешается обработчик события нажатия клавиши.
     * @param callback - функция, которая сработает при нажатии клавиши.
     */
   keyDown: function(object, callback){
      object[$ws._const.compatibility.correctKeyEvents ? 'keydown' : 'keypress'](function(e){
         if(!$ws._const.compatibility.correctKeyEvents){
            if(e.which === e.keyCode){
               if(e.which >= 97 && e.which <= 122){
                  e.which = e.keyCode - 32;
               }
               else if(e.which in $ws._const.operaKeys){
                  e.which = $ws._const.key[$ws._const.operaKeys[e.which]];
               }
            }
            if(e.which === 0){
               e.which = e.keyCode;
            }
            e.keyCode = e.which;
         }
         callback(e);
      });
   },
   /**
    * Рисует календарик
    * @param {String} id - идентификатор элемента, в который вставляем календарик.
    * @param {Function} func  - функция для изменения отображения дней в календаре.
    * @param {Date} [firstDayToShow] - дата дня, на котором нужно сфокусировать календарь.
    * Вызов showDatePicker("datepicker", dayFormat);
    * @returns {$ws.proto.Deferred} асинхронное событие. Нужно для того, чтобы знать,
    * что календарик уже нарисовался.
    * Пример функции func
    * @example
    * <pre>
    * // <div id="test"></div> Должен существовать блок с идентификатором 'test'
    * $ws.helpers.showDatePicker('test', function dayFormat(date) {
    *  // Если отображаемый день месяца меньше 15
    *   if (date.getDate() < 15) {
    *    // [может ли быть выбрано, 'css-класс для добавления к ячейке дня', "текст всплывающей подсказки"]
    *       return [true, 'ui-state-highlight', "tooltip"];
    *   }
    *   return [true, ''];
    * });
    * </pre>
    */
   showDatePicker:function  (id , func, firstDayToShow){
      var idd = "#" + id,
          def = new $ws.proto.Deferred();
      $ws.core.ready.addCallback(function (){
         $ws.require(["js!Ext/jquery-ui/jquery-ui-1.8.5.custom.min",
                      "css!Ext/jquery-ui/jquery-ui-1.8.5.custom",
                      "js!SBIS3.CORE.FieldDate/resources/ext/jquery.ui.datepicker-ru"])
               .addCallback(function(){
               $(idd).datepicker({
                  beforeShowDay: func,
                  defaultDate: firstDayToShow
               });
               def.callback();
            });
         });
      return def;
   },
   /**
    * Переводит число/денежное значение из его цифрового представления в строковое(словесное)
    * @description
    *   Диапазон значений параметра numAsStr:
    *      от 0 до 999999999999999 - целая часть
    *      от 0 .. 99 дробная часть (если есть еще дробные знаки, то они отбрасываются)
    *   Целая или дробная часть могут отсутствовать.
    *
    * Примеры использования:
    * @example
    * <pre>
    *   var num = '673453453535.567';
    *   var vs = $ws.helpers.numToWritten(num, true);
    *   var num = '673453453535.567';
    *   // результат = 'шестьсот семьдесят три миллиарда четыреста пятьдесят три миллиона четыреста пятьдесят три тысячи пятьсот тридцать пять руб пятьдесят шесть коп'
    *
    *   var vs = $ws.helpers.numToWritten(num, false);  // или что тоже самое var vs = $ws.helpers.numToWritten(num);
    *   // результат = 'шестьсот семьдесят три миллиарда четыреста пятьдесят три миллиона четыреста пятьдесят три тысячи пятьсот тридцать пять рублей пятьдесят шесть копеек'
    * </pre>
    *
    * @param {String} numAsStr Число
    * @param {Boolean} pSocr Сокращать до 'руб' 'коп' или полностью ('рубли' 'копейки')
    * @returns {String} Значение прописью
    */
   numToWritten : function(numAsStr, pSocr) {
      // pSexFemale = true если для женского рода, например для тысяч
      function numberToWritten999(value, pSexFemale) {
         var
            digits = {'0':'','1':'один','2':'два','3':'три','4':'четыре','5':'пять','6':'шесть','7':'семь','8':'восемь','9':'девять','10':'десять','11':'одиннадцать','12':'двенадцать','13':'тринадцать','14':'четырнадцать','15':'пятнадцать','16':'шестнадцать','17':'семнадцать','18':'восемнадцать','19':'девятнадцать'},
            dozens = {'2':'двадцать','3':'тридцать','4':'сорок','5':'пятьдесят','6':'шестьдесят','7':'семьдесят','8':'восемьдесят','9':'девяносто'},
            hundreds = {'0': '','1':'сто','2':'двести','3':'триста','4':'четыреста','5':'пятьсот','6':'шестьсот','7':'семьсот','8':'восемьсот','9':'девятьсот'},
            result, h, d;
         if(pSexFemale === true) {
            digits['1'] = 'одна';
            digits['2'] = 'две';
         }
         d = value % 100;
         d = d <= 19 ? digits[d] : dozens[Math.floor(d/10)] + (d%10 ? ' ' : '') + digits[d%10];
         h = hundreds[Math.floor(value / 100)];
         if( h && d ) { h += ' '; }
         result = h + d;
         return result;
      }

      function chooseNumericEndingType(value) {
         var
            fst = Math.abs(value % 10),
            sec = Math.abs(value % 100);
         if(fst === 0 || fst >= 5 || sec >= 11 && sec <= 19) {
            return 0;
         }
         if(fst === 1) {
            return 1; // 11 excluded
         }
         return 2;
      }

      // pSexFemale = true если для женского рода, например для тысяч
      function numberToWritten(numAsStr,pSexFemale,allowMinus) {
         allowMinus = allowMinus || true;
         var
            result = '',
            i = 0,
            trizryads = {
               0:{'0':'',              '1':'',              '2':''},
               1:{'0':'тысяч',         '1':'тысяча',        '2':'тысячи'},
               2:{'0':'миллионов',     '1':'миллион',       '2':'миллиона'},
               3:{'0':'миллиардов',    '1':'миллиард',      '2':'миллиарда'},
               4:{'0':'триллионов',    '1':'триллион',      '2':'триллиона'},
               5:{'0':'квадриллионов', '1':'квадриллион',   '2':'квадриллиона'},
               6:{'0':'квинтиллионов', '1':'квинтиллион',   '2':'квинтиллиона'},
               7:{'0':'сикстиллионов', '1':'сикстиллион',   '2':'сикстиллиона'},
               8:{'0':'септиллионов',  '1':'септиллион',    '2':'септиллиона'},
               9:{'0':'октиллионов',   '1':'октиллион',     '2':'октиллиона'},
              10:{'0':'нониллионов',   '1':'нониллион',     '2':'нониллиона'},
              11:{'0':'дециллионов',   '1':'дециллион',     '2':'дециллиона'}
            },
            three, writning, negative;
         if(numAsStr.charAt(0)==='-') {
            if(allowMinus) {
               negative = true;
               numAsStr = numAsStr.slice(1);
            }
            else {
               return 'ОШИБКА';
            }
         }
         if(parseInt(numAsStr,10) === 0) {
            return 'ноль';
         }
         if(isNaN(numAsStr)){
            return 'ОШИБКА';
         }
         if(''===numAsStr){
            return '';
         }
         while(numAsStr.length > 0) {
            three = parseInt(numAsStr.substr(Math.max(numAsStr.length-3,0),3),10);
            var ct = chooseNumericEndingType(three);
            writning = trizryads[i] && trizryads[i][ct] ? ' ' + trizryads[i][ct] : '';

            if(three > 0) {
               if(i && writning === '') {
                  return 'ОШИБКА'; // Слишком много разрядов
               }
               result = numberToWritten999(three,i===1 || pSexFemale) + writning + (result ? ' ' + result : '');
            }
            numAsStr = numAsStr.slice(0,-3);
            i++;
         }
         if(negative) {
            result = 'минус ' + result;
         }
         return result;
      }

      // если pSocr = true, то тоже самое что и moneyToWritten, но сокращенно аббревиатуры руб и коп.
      // если pSocr = false или не указана, то полностью, например, рублей и копеек.
      function moneyToWritten (numAsStr, pSocr) {
         // Все операции проводим со строками, чтобы можно было оперировать с большими числами
         numAsStr = (numAsStr+'').replace(/\s/g,'');
         if(isNaN(numAsStr) || !numAsStr.match(/^[-0-9.]*$/)){ return 'ОШИБКА'; }
         if(''===numAsStr){ return ''; }
         var
            arr = (numAsStr+'').split('.'),
            rub = arr[0] || '0',
            kop = arr[1] || '00',
            rubles = {'0':'рублей', '1':'рубль',   '2':'рубля'},
            kopeks = {'0':'копеек', '1':'копейка', '2':'копейки'},
            rubR, kopR, result;
         if(rub === '-') { rub = '-0'; }
         if(kop.length === 1){ kop += '0'; }
         if(kop.length > 2){
            // rounding
            var flow = kop.charAt(2);
            kop = kop.substr(0,2);
            if(flow >= '5') {
               kop = parseInt(kop,10)+1+'';
               if(kop.length === 1){ kop = '0' + kop; }
               if(kop === '100') {
                  kop = '00';
                  if(rub === '') {
                     rub = 1;
                  }
                  var pos = rub.length - 1, after = '';
                  while(true) {
                     if(pos < 0 || isNaN(parseInt(rub.charAt(pos),10))) {
                        after = (pos >= 0 ? rub.substr(0,pos+1) : '') +'1' + after;
                        break;
                     }
                     else if(rub.charAt(pos) === '9') {
                        after = '0' + after;
                        pos--;
                     }
                     else {
                        after = rub.substr(0,pos) + (parseInt(rub.charAt(pos),10)+1) + after;
                        break;
                     }
                  }
                  rub = after;
               }
            }
         }

         rubR = numberToWritten(rub);
         if(rubR === 'ОШИБКА'){ return 'ОШИБКА'; }
         rubR = rubR || 'ноль';
         rubR += ' ' + (pSocr ? 'руб' : rubles[chooseNumericEndingType(parseInt(rub.substr(Math.max(0,rub.length-2),2),10))]);
         kopR = ' ' + kop + ' ' + (pSocr ? 'коп' : kopeks[chooseNumericEndingType(parseInt(kop,10))]);
         if(parseInt(kop.substr(0,2),10) > 0 && rub.charAt(0)==='-' && rubR.charAt(0) !== 'м') {
            rubR = 'минус ' + rubR; // так как 0 рублей, то минус не прописался
         }
         result = rubR + kopR;
         result = result.charAt(0).toUpperCase() + result.substr(1);
         return result;
      }

      return moneyToWritten(numAsStr, pSocr);
   },
   /**
    * Получает и парсит атрибут alignmargin, отвечающий за отступы контрола.
    * Если атрибута нет, марджины ставятся в ноль по умолчанию.
    * @param {jQuery} elem  элемент, у которого получить марджины.
    * @returns {Object} Объект марджинов.
    */
   parseMargins:function (elem){
      var result, wsMargin, margins;
      BOOMR.plugins.WS.reportEvent("ws.helpers", "parseMargins");

      elem = $(elem);

      wsMargin = elem.attr('alignmargin');
      if(wsMargin){
         margins = wsMargin.split(',');
         result = {
            'top':parseInt(margins[0], 10),
            'right':parseInt(margins[1], 10),
            'bottom':parseInt(margins[2], 10),
            'left':parseInt(margins[3], 10)
         }
      } else {
         result = {};
      }

      $ws.helpers.forEach(result, function(val, key) {
         result[key] = result[key] || parseInt(elem.css('margin-' + key), 10) || 0;
      });
      return result;
   },
   NON_CTRL: '.ws-non-control',

   /**
    * Получить авто-размер для неконтрола
    * @param {Object} collection jQuery-набор элементов - неконтролов.
    * @param {String} type Height|Width - тип размера.
    * @returns {Number} значение.
    */
   getNonControlSize: function(collection, type){
      var max = 0, curr = 0, i, ln = (collection && collection.length) || 0, isHidden, ltype;

      if (ln > 0) {
         isHidden = jQuery.expr.filters.hidden,
         ltype = type.toLowerCase();

         for (i = 0; i < ln; i++)  {
            var elem = collection[i], jqElem;

            if (!isHidden(elem)) {
               jqElem = $(elem);

               var attr = elem.getAttribute('orig' + type);
               if (attr === null || attr === "auto" || attr === "Auto") {
                  curr = jqElem['getNative' + type]();
               } else {
                  curr = parseFloat(attr);

                  var margins = elem.getAttribute('alignmargin');
                  if (margins !== null) {
                     margins = margins.split(',');

                     if (type === 'Height') {
                        curr += ((parseInt(margins[0], 10) + parseInt(margins[2], 10)) || 0);
                     } else {
                        curr += ((parseInt(margins[1], 10) + parseInt(margins[3], 10)) || 0);
                     }
                  }

                  // добавляем padding+border, если есть.
                  curr += jqElem["outer"+type]() - jqElem[ltype]();
               }
               max = (curr > max) ? curr : max;
            }
         };
      }

      return max;
   },
   /**
    * Проверяет нажата ли клавиша CapsLock
    * @param {Event} keypressEvent jQuery событие keypress, для которого проверяется нажат капс-лок или нет.
    * @returns {Boolean} нажат ли капс-лок. undefined возвращается когда определить невозможно.
    */
   checkCapsLock:function (keypressEvent){
      if (!keypressEvent || !keypressEvent.which)
         return undefined;
      var asciiCode = keypressEvent.which;
      var letter = String.fromCharCode(asciiCode);
      var upper = letter.toUpperCase();
      var lower = letter.toLowerCase();
      var shiftKey = keypressEvent.shiftKey;

      // Если верхние и нижние регистры равны, то нет возможности определить нажат ли капс-лок
      if(upper !== lower){

         // Если вводится верхний символ при ненажатом шифте, значит капс-лок включен
         if(letter === upper && !shiftKey){
            return true;
            // Если нижний, то выключен.
         } else if(letter === lower && !shiftKey){
            return false;
            // Если нижний при нажажатом шифте, то включен
         } else if(letter === lower && shiftKey){
            return true;
         } else if(letter === upper && shiftKey){
            if(navigator.platform.toLowerCase().indexOf("win") !== -1){
               // Если на Windows, то выключен
               return false;
            } else{
               if(navigator.platform.toLowerCase().indexOf("mac") !== -1){
                  // Если на Mac, то выключен
                  return false;
               } else{
                  return undefined;
               }
            }
         } else{
            return undefined;
         }
      } else{
         return undefined;
      }
   },

   /**
    * Построить строку заданного формата по объекту/записи/контексту
    * Принимает следующие типы шаблонов:
    * t: $имя поля$<b>t</b>$формат даты$ - дата/время, используется формат функции {@link Date#strftime}.
    * d: $имя поля$<b>d</b>$ - целое число (D - с разделителями).
    * f: $имя поля$<b>f</b>$[точность$] - вещественное число (F - с разделителями).
    * s: $имя поля$<b>s</b>$ - прочее, строки, в т.ч. Enum.
    * @param {Object|$ws.proto.Record|$ws.proto.Context} source Объект/запись/контекст - источник.
    * @param {String} format Строка формата.
    * @example
    * <pre>
    *    var
    *       formatString = 'Сегодня $date$t$%e %q %Y года$ и курс доллара составляет $number$F$3$ рублей.',
    *       object = {number:1234.5678, date:new Date()},
    *       result = $ws.helpers.format(object, formatString);
    *       // "Сегодня 11 октября 2013 года и курс доллара составляет 1 234.568 рублей."
    * </pre>
    * @returns {String}
    */
   format:function(source,format){
      if (typeof format !== "string")
         return "";
      return format.replace(/\$([а-яА-Яa-zA-Z0-9_ .]+)\$(?:([sdD])|([t])\$([\s\S]*?)|([fF])(?:\$([0-9]+))?)\$/g, function(str, m0, m1, m2, m3, m4, m5) {
         var
            field =
               source ?
                  (
                     source instanceof $ws.proto.Record && source.hasColumn(m0) ? source.get(m0) :
                     source.getValue && typeof source.getValue === 'function' ? source.getValue(m0) :
                     source[m0] ) :
                  null;
         if (m2)
            m1 = m2;
         if (m4)
            m1 = m4;
         if (m1 === 't')
            return field ? field.strftime(m3) : "";
         if (m1 === 'd' || m1 === 'D')
            return $ws.render.defaultColumn.integer( field, !!(m1 === 'd') );
         if (m1 === 'f' || m1 === 'F')
            return $ws.render.defaultColumn.real( field, m5 ? m5 : 2, m1 !== 'f' );
         //if (m1 === 's')
         if (field instanceof $ws.proto.Enum)
            return $ws.render.defaultColumn.enumType( field );
         else
            return field ? field : "";
      });
   },
   /**
    * Информационное окно "Общий вопрос".
    * Пользователю будет доступно 2 варианта ответа: "Да" и "Нет".
    * Результатом является $ws.proto.Deferred, в который передаётся:
    * 1. 'true' - при нажатии кнопки "Да".
    * 2. 'false' - при нажатии кнопки "Нет".
    * 3. 'undefined' - при нажатии на клавишу "Esc".
    * <wiTag group="Управление" class="Window" page=2>
    * @param {string} text Текст вопроса
    * @param {object} [cfg] Можно переопределить стандартный вид диалога.
    * @returns {$ws.proto.Deferred} Стреляет ответом пользователя /Да/Нет/undefined (если нажали Esc).
    * @example
    * 1. Вызвать окно "Общий вопрос" можно следующим образом:
    * <pre>
    *    $ws.helpers.question('Сохранить изменения?');
    * </pre>
    *
    * 2. Использование результата ответа пользователя:
    * <pre>
    *  $ws.helpers.question('Сохранить изменения?').addCallback(function(result){
    *      //тело функции
    *      //в переменную result занесён результат выбора пользователя: true, false или undefined
    *  });
    *  </pre>
    *
    *  3. Можно настроить, какую из кнопок "Да"/"Нет" выделить оранжевым цветом по умолчанию.
    *  <pre>
    *       //Для этого вторым параметром передаём объект с invertDefaultButton: false/ true:
    *       //'true' - по умолчанию установлена кнопка "Да".
    *       //'false' - по умолчанию установлена кнопка "Нет".
    *       //Этим свойством мы инвертируем кнопку, выбранную по умолчанию:
    *      $ws.helpres.question('Сохранить изменения?', {invertDefaultButton: true});
    *  </pre>
    * @see alert
    * @see message
    */
   question: function( text, cfg, opener ){
      var res = new $ws.proto.Deferred(),
          escPressed = false;
      $ws.core.attachInstance('SBIS3.CORE.DialogConfirm', $ws.core.merge({
         message: text,
         'opener': opener,
         handlers: {
            onKeyPressed : function (event, result){
               if(result.keyCode == $ws._const.key.esc) {
                  escPressed = true;
               }
            },
            onConfirm: function(event, result) {
               //Он может зайти сюда ещё раз из какого-то обработчика в res.callback
               // (например, из opener-a - FloatArea, которая будет закрываться сама и закрывать свои дочерние окна,
               // и это окно в том числа),
               // тогда он может попытаться стрельнуть ещё раз, и будет ошибка
               if (!res.isReady()) {
                  if(escPressed) {
                     res.callback(undefined);
                  }
                  else {
                     res.callback( result );
                  }
               }
            }
         }
      }, cfg || {} ) ).addErrback(function(err){
         res.errback( err );
      });
      return res;
   },
   /**
    * Показывает сообщение. Возвращает Deferred, который сработает при закрытии окна.
    * @param {String} text Текст.
    * @param {Object} cfg  Параметры, которые могут переопределять/дополнять стандартные.
    * @param {String} type Тип. 'info', 'error' или 'complete'.
    * @param {Object} opener контрол, который вызвал функцию (нужен в случае вызова из floatArea)
    * @returns {$ws.proto.Deferred}
    * @private
    */
   _messageBox: function(text, cfg, type, opener){
      var res = new $ws.proto.Deferred();
      $ws.core.attachInstance('SBIS3.CORE.DialogAlert', $ws.core.merge({
            message: text,
            type: type,
            'opener': opener,
            handlers: {
               onAfterClose: function(){
                  res.callback();
               }
            }
         }, cfg || {})).addErrback(function(err){
            res.errback(err);
         });
      return res;
   },
   /**
    * Информационное окно "Ошибка"
    * Возвращает $ws.proto.Deferred, который сработает при закрытии окна.
    * <wiTag group="Управление" class="Window" page=4>
    * @param {String|Error} text  Текст сообщения.
    * @param {Object} [cfg] Параметры окна, которые могут переопределять стандартные.
    * @param {Boolean} [cfg.checkAlreadyProcessed=false] Если передан true и вместо текста передан объект ошибки, проверяет флаг processed (указывает на то что ошибка уже обработана и не надо о ней более извещать) и если флаг выставлен - не показывает сообщение
    * @param {Object} [opener] Контрол, который вызвал функцию (нужен в случае вызова из floatArea)
    * @returns {$ws.proto.Deferred}
    * @example
    * 1. Окно "Ошибка" (предупреждение, alert) можно вызвать так:
    * <pre>
    *    $ws.helpers.alert('Сообщение об ошибке!');
    * </pre>
    *
    * 2. Окно возвращает $ws.proto.Deferred, который сработает при закрытии окна. Но как подписаться на результат? Делаем следующее:
    * <pre>
    *    $ws.helpers.alert('Соообщение об ошибке!').addBoth(function(){
    *       //внутрь функции всегда передаётся одинаковое значение, вне зависимости от действий пользователя: нажал кнопку "ОК" или "Ecs"
    *       //тело функции, которая должна быть выполнена
    *    });
    * </pre>
    *
    * 3. Если требуется, например, изменить состояние флага после нажатия кнопки "ОК" в окне "Ошибка"(Alert), то:
    * <pre>
    * $ws.helpers.alert('Сообщение об ошибке').addBoth(function(){
    *     //устанавливаем флаг сброшенным
    *     $ws.single.ControlStorage.getByName('ИмяФлага').setValue(false);
    * });
    * </pre>
    * @see message
    * @see question
    */
   alert: function(text, cfg, opener){
      if (text instanceof Error) {
         if (cfg && cfg.checkAlreadyProcessed) {
            if (text.processed) {
               return new $ws.proto.Deferred().callback();
            } else {
               text.processed = true;
            }
         }
         text = (text.message || '').replace(/\n/mg, '<br />');
      }

      if (text) {
         return $ws.helpers._messageBox(text, cfg, 'error', opener);
      } else {
         return new $ws.proto.Deferred().callback();
      }
   },
   /**
    * Информационное окно "Сообщение"
    * Возвращает $ws.proto.Deferred, который сработает при закрытии окна.
    * <wiTag class="Window" group="Управление" page=3>
    * @param {String} text  Текст сообщения.
    * @param {Object} [cfg] Параметры окна, которые могут переопределять стандартные.
    * @returns {$ws.proto.Deferred}
    * @example
    * 1. Вызвать информационное окно "Сообщение" можно так:
    * <pre>
    *    $ws.helpers.message('Это информационное окно "Сообщение"!');
    * </pre>
    *
    * 2. Это окно возвращает $ws.proto.Deferred. Как это использовать? Можно, например, выполнять функции только закрытия окна:
    * <pre>
    *    $ws.helpers.message('Это информационное окно "Сообщение"!').addBoth(function(){
    *        //тело функции
    *    });
    * </pre>
    * @see alert
    * @see question
    */
   message: function(text, cfg, opener){
      return $ws.helpers._messageBox(text, cfg, 'info', opener);
   },
   /**
    * Создает контекстное меню по упрощенным параметрам - список пунктов и м.б. функция активации
    * @param {Array} items Пункты меню.
    * @param {Function} [onActivate] Функция, которая будет выполняться при выборе пункта меню.
    * @returns {$ws.proto.Deferred} Стреляет созданным контекстным меню.
    */
   newContextMenu: function(items, onActivate){
      var config = [];
      for(var k = 0, l = items.length; k < l; k++){
         config[k] = {
            caption: items[k],
            id: items[k],
            handlers: {}
         };
         if(typeof(onActivate) == 'function')
            config[k].handlers['onActivated'] = onActivate;
      }
      return $ws.core.attachInstance('Control/Menu', {
         data: config
      });
   },
   /**
    * Показывает стандартный платформенный диалог печати.
    * @param {String|Object} htmlText|cfg Если этот параметр-строка, то в нём лежит html-текст, который нужно показать в окне предварительного просмотра при печати.
    * Если этот параметр-объект, то в нём лежит набор аргументов функции плюс, если нужно, параметры, используемые в конструкторе диалога печати (см. справку по конструктору $ws.proto.Dialog).
    * Первый параметр можно задавать объектом, чтобы было удобнее передать только те аргументы, которые нужно, и не писать undefined вместо остальных.
    *
    * @param {Number} [top] отступ сверху для окна предварительного просмотра
    * @param {Number} [left] отступ слева для окна предварительного просмотра
    * @param {Object} [opener] контрол, который вызвал функцию (нужен в случае вызова из floatArea)
    *
    * @param {String} cfg.htmlText html-текст, который нужно показать в окне предварительного просмотра при печати
    * @param {Number} [cfg.top] отступ сверху для окна предварительного просмотра
    * @param {Number} [cfg.left] отступ слева для окна предварительного просмотра
    * @param {$ws.proto.Control} [cfg.opener] контрол, который вызвал функцию (нужен в случае вызова из floatArea)
    * @param {Object} [cfg.handlers] Обработчики событий для окна предварительного просмотра
    *
    * @returns {$ws.proto.Deferred} стреляет созданным окном предварительного просмотра
    */
   showHTMLForPrint: function(htmlText, top, left, opener){

      var def = new $ws.proto.Deferred(),
          options = typeof(htmlText) === 'string' ? {} :
                    $ws.core.shallowClone(htmlText);

      function setHandler(handlerName, defHandler) {
         var handler = options.handlers[handlerName];
         if (!handler) {
            options.handlers[handlerName] = defHandler;
         } else if (typeof handler === 'function') {
            options.handlers[handlerName] = [defHandler, handler]; //обработчики, которые ставит showHTMLForPrint, должны быть первыми
         } else {
            options.handlers[handlerName] = [defHandler].concat(handler);
         }
      }

      function removeUndefinded(obj) {
         $ws.helpers.forEach(obj, function(val, key) {
            if (val === undefined) {
               delete obj[key];
            }
         });
         return obj;
      }

      //Параметры должны перебивать опции
      $ws.core.merge(options, removeUndefinded({
         top: top,
         left: left,
         opener: opener
      }), {clone: false, rec: false});

      //Устанавливаем неустановленные опции в дефолтные значения
      $ws.core.merge(options, {
         htmlText: String(htmlText),
         template: 'printDialog',
         resizable: true,
         parent: null,
         handlers: {}
      }, {preferSource: true});

      setHandler('onReady', function () {
         var htmlView = this.getChildControlByName('ws-dataview-print-report'),
            window = this;
         htmlView.subscribe('onContentSet', function(){
            if (!def.isReady()) {
               def.callback(window);
            }
         });
         htmlView.subscribe('onContentReady', function(){
            //Блокируем навигацию по клику на ссылки
            $(htmlView.getIframeDocument()).delegate('a', 'click', function(event) {
               event.preventDefault();
            });

            window._container.toggleClass('ws-hidden', false);
            $ws.helpers.toggleIndicator(false);
         });
      });

      setHandler('onAfterShow', function () {
         this._container.toggleClass('ws-hidden', true);
         $ws.helpers.toggleIndicator(true);
         this.getChildControlByName('ws-dataview-print-report').setHTML(options.htmlText);
      });

      $ws.core.attachInstance('SBIS3.CORE.Dialog', options);
      return def;
   },
   /**
    * Вычисляет ширину скроллбара в текущем браузере
    * @return {*}
    */
   getScrollWidth: function() {
      if(document && document.body) {
         var div = document.createElement('div');
         div.style.cssText="position:absolute;height:50px;overflow-y:hidden;width:50px;visibility:hidden";
         div.innerHTML = '<div style="height:100px"></div>';
         var innerDiv = div.firstChild;

         document.body.appendChild(div);
         var w1 = innerDiv.offsetWidth;
         div.style.overflowY = 'scroll';
         var scrollWidth = w1 - innerDiv.offsetWidth;
         document.body.removeChild(div);

         $ws.helpers.getScrollWidth = function() { return scrollWidth; };
         return scrollWidth;
      } else if (!document) {
         throw new Error('Ошибка: функция $ws.helpers.getScrollWidth вызвана на сервере. Она должна вызываться только в клиентском браузере.');
      } else {
         throw new Error('Ошибка: функция $ws.helpers.getScrollWidth вызвана на клиентском браузере, однако body ещё не готово.');
      }
   },
   /**
    * Вычисляет координаты элемента с учетом скроллинга
    * @param elem Элемент, координаты которого надо вычислить.
    * @return {Object} Координаты элемента в виде объекта { top: , left: }
    */
   getOffsetRect: function(elem) {
      var box = elem.getBoundingClientRect(),
          body = document.body,
          docElem = document.documentElement,
          scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop,
          scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft,
          clientTop = docElem.clientTop || body.clientTop || 0,
          clientLeft = docElem.clientLeft || body.clientLeft || 0,
          top = box.top + scrollTop - clientTop,
          left = box.left + scrollLeft - clientLeft;
      return { top: Math.round(top), left: Math.round(left) };
   },
   /**
    * Возвращает слово в нужном падеже, в зависимоси от числа,
    * например (10, "рублей", "рубль", "рубля") возвратит слово "рублей".
    * @param {Number} num Число, стоящее перед словом.
    * @param {String} word0 Падеж, соответствующий числу 0.
    * @param {String} word1 Падеж, соответствующий числу 1.
    * @param {String} word2 Падеж, соответствующий числу 2.
    * @returns {String}
    */
   wordCaseByNumber: function (num, word0, word1, word2) {
      num = Math.abs(num);

      // если есть дробная часть
      if (num % 1 > 0)
         return word2;

      // если две последние цифры 11 ... 19
      num = num % 100;
      if (num >= 11 && num <= 19)
         return word0;

      // все остальные случаи - по последней цифре
      num = num % 10;

      if (num == 1)
         return word1;

      if (num == 2 || num == 3 || num == 4)
         return word2;
      else
         return word0;
   },
   addXmlLog: function(templateName){
      var tplListElem = $('#xmlContent');
      if(!tplListElem.length){
         tplListElem = $('<div id="xmlContent" style="display:none; visibility: hidden;"></div>');
         $('body').append(tplListElem);
      }
      if(!tplListElem.data(templateName)){
         tplListElem.data(templateName, true);
         tplListElem.append('<div name="'+templateName+'">')
      }
   },
   /**
    * Если есть deferred, то дожидается его окончания и выполняет callback, иначе просто выполняет callback
    * @param {*} deferred То, чего ждём.
    * @param {Function} callback То, что нужно выполнить.
    * @return {$ws.proto.Deferred|*} Если есть деферред, то возвращает его, иначе - результат выполнения функции.
    */
   callbackWrapper: function(deferred, callback){
      if(deferred && deferred instanceof $ws.proto.Deferred){
         return deferred.addCallback(callback);
      }
      else{
         return callback(deferred);
      }
   },
   /**
    * Вставляет кусок css на страницу
    * @param {String} style CSS-текст, который нужно вставить.
    * @param {Boolean} [waitApply=false] Нужно ли ожидание применения css. Если задано true, то возвращает Deferred, сигнализирующий готовность css (применённость к документу).
    * @param {String} [hint] "Подсказка". Присутствует в сообщении об ошибке если стили не удалось применить.
    * @returns {Deferred|null} Если waitApply = true, то возвращает Deferred, сигнализирующий готовность css (применённость к документу), иначе null.
    */
   insertCss: function(style, waitApply, hint){
      /**
       * Возвращает тэг для вставки css
       * @return {*}
       */
      function getCurStyleHolder(){
         var tag;
         if ("getElementsByClassName" in document){
            tag = document.getElementsByClassName("ws-style-holder-current")[0];
         }
         else{
            var styles = document.getElementsByTagName("style");
            for (var i = 0, l = styles.length; i < l; i++){
               if (hasClass(styles[i], "ws-style-holder-current")){
                  tag = styles[i];
                  break;
               }
            }
         }
         tag = tag || createStyleHolder();
         return tag;
      }

      /**
       * Создает новый тэг style
       * @return {HTMLElement}
       */
      function createStyleHolder(){
         var sHolder = document.createElement('style');
         var head = document.getElementsByTagName('head')[0];

         sHolder.setAttribute('type', 'text/css');
         sHolder.setAttribute('media', 'all');
         sHolder.className = 'ws-style-holder ws-style-holder-current';
         head.appendChild(sHolder);

         return sHolder;
      }

      /**
       * Проверяет есть ли у элемента указанные классы
       * @param {HTMLElement} element.
       * @param {String} cls классы через пробел.
       * @return {Boolean}
       */
      function hasClass(element, cls) {
         var
            className = ' ' + element.className + ' ',
            m = cls.split(" ");
         for (var i = 0, l = m.length; i < l; i++){
            if (className.indexOf(' ' + m[i] + ' ') == -1){
               return false;
            }
         }
         return true;
      }

      /**
       * Функция проверки применения стилей
       * @returns {boolean}
       */
      function checkMarkerDiv() {
         var pos = markerDiv.css('position'),
            ok = (pos === 'absolute'),
            timeout = +new Date() - start > $ws._const.styleLoadTimeout;

         if (ok || timeout) {
            markerDiv.remove();
            if (waitInterval) {
               clearInterval(waitInterval);
               timeout ?
                  result.errback('Timeout waiting for styles to apply' + (hint ? ' for ' + hint : '')) :
                  result.callback();
            }
         }
         return ok;
      }

      var
         markerCss = '',
         result = null,
         markerDivId, markerDiv, waitInterval, start, styleHolder;

      if (waitApply) {
         markerDivId = $ws.helpers.randomId('cssReady-');

         markerDiv = $('<div id="' + markerDivId + '" style="display: none;" />').appendTo($('body'));
         markerCss = '#' + markerDivId + ' { position: absolute; }';
      }

      if ($ws._const.compatibility.standartStylesheetProperty){
         styleHolder = createStyleHolder();
         styleHolder.appendChild(document.createTextNode(style + markerCss));
      }
      else {
         styleHolder = getCurStyleHolder();
         style = style + markerCss;
         var
            cssText = styleHolder.styleSheet.cssText,
            curRulesCnt = (cssText.match(/\{|,/g) || []).length,
            insRulesCnt = (style.match(/\{|,/g) || []).length;

         if (curRulesCnt + insRulesCnt > 4000){
            styleHolder.className = 'ws-style-holder';
            styleHolder = createStyleHolder();
         }

         styleHolder.styleSheet.cssText += style;
      }

      if (waitApply) {
         start = +new Date();
         if (!checkMarkerDiv()) {
            result = new $ws.proto.Deferred();
            waitInterval = setInterval(checkMarkerDiv, 1);
         }
      }

      return result;
   },

   /**
    * Возвращает выделенный на странице текст
    * @return {String}
    */
   getTextSelection : function(){
      var txt;

      if (window.getSelection)
         txt = window.getSelection().toString();
      else if (document.getSelection)
         txt = document.getSelection().toString();
      else if (document.selection)  // IE 6/7
         txt = document.selection.createRange().text;

      return txt;
   },
    /**
     * Скрывает/показывает индикатор загрузки
     */
   toggleIndicator: (function(){
      var indicInstance, indicDeffered;
      function indicatorVisible(toggle){
         if(!!toggle) {
            // Если передали Deferred
            if( toggle instanceof $ws.proto.Deferred ){
               // Если он еще не готов
               if(!toggle.isReady()) {
                  // Покажем
                  indicInstance.show();
                  // Подпишемся на завершение с любым статусом ...
                  toggle.addBoth(function( res ){
                     // и скроем индикатор
                     indicInstance.hide();
                     return res;
                  });
               }
               else{ // Скроем индикатор, если Deferred сразу готов
                  indicInstance.hide();
               }
            }
            else {
               indicInstance.show();
            }
         } else {
            indicInstance.hide();
         }
      }
      return function (toggle) {
         indicDeffered = indicDeffered || $ws.requireModule('SBIS3.CORE.LoadingIndicator').addCallback(function() {
            indicInstance = new $ws.proto.LoadingIndicator({message: 'Пожалуйста, подождите…'});
            return indicInstance;
         });
         if(!indicDeffered.isReady()) {
            //Идет попытка загрузить LoadingIndicator, но он еще не готов
            indicDeffered.addCallback(function (){
               indicatorVisible(toggle);
            })
         } else {
            // Был определен LoadingIndicator, обрабатываем индикатор
            indicatorVisible(toggle);
         }
      }
   })(),

   /**
    * Показывает всплывающую панель с указанным конфигом. Если она уже есть, не создаёт новую. Для корректной работы необходим name в config
    * @param {Object} config Конфигураци панели. Если указать в конфиге filter (=true), то будет подключать FilterFloatArea вместо обычной FloatArea.
    * @return {$ws.proto.Deferred}
    */
   showFloatArea: function(config){
      var id = config.id,
         name = config.name,
         storage = $ws.helpers.showFloatArea.storage,
         area;
      if(!storage){
         $ws.helpers.showFloatArea.storage = storage = {
            id: {},
            name: {}
         };
      }
      var className = 'Control/Area/FloatArea';
      if( config.filter ){
         className += ':FilterFloatArea';
      }
      if((area = storage.id[id] || storage.name[name]) !== undefined){
         return area.addCallback(function(instance){
            if(instance.isCorrect()){
               if(config.target){
                  instance.setTarget(config.target);
               }

               if(config.hoverTarget){
                  instance.setHoverTarget(config.hoverTarget, true);
               }
               //переустановим opener-а на случай, если старый удалился, и панель от него отвязалась, оставшись без opener-а
               if (config.opener) {
                  instance.setOpener(config.opener);
               }
               if(config.autoShow || config.autoShow === undefined || !config.hoverTarget){
                  instance.show();
               }
            }
            else{
               return $ws.core.attachInstance(className, config);
            }
            return instance;
         });
      }
      else{
         var result = $ws.core.attachInstance(className, config);
         if(id !== undefined){
            storage.id[id] = result;
         }
         if(name !== undefined){
            storage.name[name] = result;
         }

         result.addCallback(function(instance) {
            //при удалении области выкидываем её из кеша,
            //чтоб зря память не ела.
            instance.once('onDestroy', function() {
               if(id !== undefined){
                  delete storage.id[id];
               }
               if(name !== undefined){
                  delete storage.name[name];
               }
            });
            return instance;
         });

         return result;
      }
   },
   /**
    * Показывает всплывающую панель, аналогично {@link showFloatArea}. Только панель показывается при ховере по элементу. Является надстройкой, позволяющей избежать ситуации, когда на элемент навели мышь, панель загружается, мышь убрали, панель показалась и больше никогда не убирается.
    * @param {jQuery|HTMLElement|String}  element  Элемент, при наведении мыши на который будет показана всплывающая панель.
    * @param {Boolean}                    hovered  Находится ли мышь над нужным элементом (при этом панель будет показана после загрузки).
    * @param {Object}                     config   Конфигурация панели.
    * @return {$ws.proto.Deferred}
    */
   showHoverFloatArea: function(element, hovered, config){
      var hover = hovered || false,
         block = $(element).bind('mouseenter.wsShowHoverFloatArea', function(){
            hover = true;
         }).bind('mouseleave.wsShowHoverFloatArea', function(){
               hover = false;
            });
      config.autoShow = false;
      config.hoverTarget = element;
      return $ws.helpers.showFloatArea(config).addCallback(function(area){
         block.unbind('.wsShowHoverFloatArea');
         if(hover){
            area.show();
         }
         return area;
      });
   },
   /**
    * Проверяет, лежит ли элемент 2 в дом дереве элемента 1 
    * @param {HTMLElement|jQuery} parent
    * @param {HTMLElement|jQuery} child
    * @returns {boolean}
    */
   contains: function(parent, child) {
      var
         contains = false,
         par = parent instanceof jQuery ? parent[0] : parent,
         chi = child  instanceof jQuery ? child[0]  : child;

      while(!contains && chi) {
         chi = chi.parentNode;
         contains = par === chi;
      }
      
      return contains;
   },
   /**
    * Очистка выделения на странице
    * Если передали currentContainer, и window.getSelection().getRangeAt(0).startContainer находится в нём, 
    * то будет произведено selection.collapseToStart(). Иначе будет произведено selection.removeRange(), иначе 
    * collapse может приводить к получению фокуса теряющим активность контролом. 
    * @param {HTMLElement|jQuery} [currentContainer] Контейнер в котором должен сохраняться фокус. 
    */
   clearSelection: function(currentContainer){
      if(window.getSelection){
         var
            elem,
            selection = window.getSelection(),
            collapsed = false; 
         
         try {
            elem = selection.getRangeAt(0).startContainer;
            
            // Если выделение находится в активном контейнере, то просто сколлапсим его вместо очищения 
            if($ws.helpers.contains(currentContainer, elem)) {
               selection.collapseToStart();
               collapsed = true;
            }
         } catch (w) {
         }
         
         if(collapsed) {
            return;
         }
         
         // Если выделение не сколлапсили в начало, то просто очистим его 
         try { //If node is invisible "INVALID_STATE_ERR: DOM Exception 11", mb there's other cases
            if (selection && selection.removeRange) {
               selection.removeRange();
            } else if (selection && selection.empty) {
               selection.empty(); // ie
            }
         } catch(e) {
         }
      }
      else if(document.selection && document.selection.empty){
         try {
            document.selection.empty();
         }
         catch(e) {
         }
      }
   },
   /**
    * Располагает элемент так, чтобы он полностью помещался в окне (координаты - абсолютные, скролл учитывается
    * @param {Object} offset Объект с координатами top и left.
    * @param {Number} width Ширина объекта.
    * @param {Number} [height] Высота объекта. Если не передать, не будет переносить вниз.
    * @returns {Object} Объект с координатами top и left (тот же самый объект, что и offset).
    */
   positionInWindow: function(offset, width, height){
      var scrollTop = $ws._const.$win.scrollTop(),
         scrollLeft = $ws._const.$win.scrollLeft(),
         maxWidth = $ws._const.$win.width(),
         maxHeight = $ws._const.$win.height();

      offset.top -= scrollTop;
      offset.left -= scrollLeft;

      if(offset.left + width > maxWidth){
         offset.left = maxWidth - width;
      }
      if(offset.left < 0){
         offset.left = 0;
      }
      if(height !== undefined && offset.top + height > maxHeight){
         offset.top = maxHeight - height;
      }
      if(offset.top < 0){
         offset.top = 0;
      }

      offset.top += scrollTop;
      offset.left += scrollLeft;

      return offset;
   },

   /**
    * Вызываем DialogSelector, выполняет функцию для каждой выбранной записи,
    * если функция возвращает Deferred, то они объединяются в ParallelDeferred;
    * и ParallelDeferred дождется их завершения с любым результатом, в этом случае будет показан индикатор.
    * @param cfg - конфиг DialogSelector, не стоит использовать handlers.
    * @param func - функция вида func( record, номер_среди_выбранных, массив_выбранных_записей ).
    * @param [ctx] - контекст, чтобы можно было обращаться из фильтра браузера к полям контекста.
    * @return {$ws.proto.Deferred} стрельнет, когда будет произведен выбор, и все результаты будут обработаны.
    */
   showDialogSelector: function( cfg, func, ctx ){
      return this._showSelector( cfg, func, ctx, 'SBIS3.CORE.DialogSelector');
   },

   /**
    * Вызываем flowAreaSelector, выполняет функцию для каждой выбранной записи,
    * если функция возвращает Deferred, то они объединяются в ParallelDeferred;
    * и ParallelDeferred дождется их завершения с любым результатом, в этом случае будет показан индикатор.
    * @param cfg - конфиг flowAreaSelector.
    * @param func - функция вида func( record, номер_среди_выбранных, массив_выбранных_записей ).
    * @param [ctx] - контекст, чтобы можно было обращаться из фильтра браузера к полям контекста.
    * @return {$ws.proto.Deferred} стрельнет, когда будет произведен выбор, и все результаты будут обработаны.
    */
   showFloatAreaSelector: function( cfg, func, ctx ) {
      return this._showSelector(cfg, func, ctx, 'SBIS3.CORE.FloatAreaSelector');
   },
   /**
    * Вызываем селектор, выполняет функцию для каждой выбранной записи,
    * если функция возвращает Deferred, то они объединяются в ParallelDeferred;
    * и ParallelDeferred дождется их завершения с любым результатом, в этом случае будет показан индикатор.
    * @param cfg {object} - конфиг для селектора
    * @param func {Function} - функция вида func( record, номер_среди_выбранных, массив_выбранных_записей ).
    * @param ctx контекст, чтобы можно было обращаться из фильтра браузера к полям контекста.
    * @param moduleName {string} - подключаемый модуль
    * @returns {$ws.proto.Deferred} стрельнет, когда будет произведен выбор, и все результаты будут обработаны.
    * @private
    */
   _showSelector: function( cfg, func, ctx, moduleName ){
      var result = new $ws.proto.Deferred(),
          needIndic = false;

      $ws.core.attachInstance(moduleName, $ws.core.merge({
         context: new $ws.proto.Context().setPrevious(ctx),
         handlers: {
            onChange: function (event, records){
               var self = this;
               // если выбор только листьев, то для папки может прийти [ null ], проверка на это
               if( records && records[0] ){
                  // чтобы дождаться всех
                  var ready = new $ws.proto.ParallelDeferred({ stopOnFirstError : false });
                  $ws.helpers.forEach(records, function (){
                     var funcRes = func.apply(self, arguments);
                     // может не нужна ансинхронная обработка, тогда индикатор не покажем
                     needIndic |= funcRes instanceof $ws.proto.Deferred;
                     ready.push( funcRes );
                  });
                  if( needIndic ) {
                     $ws.helpers.toggleIndicator(true);
                  }
                  this.close(ready.done().getResult());
               }
            },
            onAfterClose: function (event, res){
               //  если просто закрыли диалог, то res будет false вроде
               if(res && res instanceof $ws.proto.Deferred)
                  result.dependOn(res);
               else
                  result.callback(res);
            }
         }
      }, cfg )).addErrback(function (err){
         result.errback(err);
         return err;
      });
      result.addBoth(function (res){
         if( needIndic )
            $ws.helpers.toggleIndicator(false);
         return res;
      });
      return result;
   },

   /**
    * Возврат jQuery элемента в виде строки
    * @param {jQuery}jq
    * @return {String}
    */
   jQueryToString: function (jq){
      var res = [];
      for(var i = 0, l = jq.length; i < l; i++) {
         res.push(jq.get(i).outerHTML);
      }
      return res.join('');
   },
   parseIdentity: function(value) {
      if(value instanceof Array) {
         if(value.length === 1 && value[0] === null)
            return null;
         return value.join($ws._const.IDENTITY_SPLITTER);
      }
      else
         return value;
   },
   
   /**
    * Обернуть текстовые ссылки
    * Оборачивает ссылки и адреса почты строки в &lt;a&gt;&lt;/a&gt;.
    * Не оборачивает ссылки и адреса почты, которые уже находятся внутри &lt;a&gt;&lt;/a&gt;.
    * <pre>> var text = 'Посетите http://online.sbis.ru/. Вопросы и предложения отправляйте на help@sbis.ru!'; $ws.helpers.wrapURLs(text);
    * "Посетите <a target="_blank" href="http://online.sbis.ru/">online.sbis.ru</a>. Вопросы и предложения отправляйте на <a target="_blank" href="mailto:help@sbis.ru">help@sbis.ru</a>!"
    * </pre>
    * @param   {String}    text           Текст, в котором нужно обернуть ссылки.
    * @param   {Boolean}   [newTab=true]  Открывать ли созданные ссылки в новой вкладке.
    * @returns {String}                   Текст с обёрнутыми ссылками.
    */
   wrapURLs: function() { 
      // регулярки взяты из сети
      var
         urlRegExpString = '(https?|ftp|file):\/\/[-A-Za-zА-ЯЁа-яё0-9.]+(?::[0-9]+)?(\/[-A-Za-zА-ЯЁа-яё0-9+&@#$/%=~_{|}!?:,.;()]*)*',
         emailRegExpString = "[-a-zА-ЯЁа-яё0-9!#$%&'*+/=?^_`{|}~]+(?:\\.[-a-zА-ЯЁа-яё0-9!#$%&'*+/=?^_`{|}~]+)*@(?:[a-zА-ЯЁа-яё0-9]([-a-zА-ЯЁа-яё0-9]{0,61}[a-zА-ЯЁа-яё0-9])?\\.)*(?:aero|arpa|asia|biz|cat|com|coop|edu|gov|info|int|jobs|mil|mobi|museum|name|net|org|pro|tel|travel|[a-zА-ЯЁа-яё][a-zА-ЯЁа-яё])",
         excludeLinkString = '<[\\s]*a[\\s\\S]*?>[\\s\\S]*?<\/a>|',
         urlRegExp = new RegExp( urlRegExpString, "gi"),
         searchRegExp = new RegExp( excludeLinkString + urlRegExpString, 'gi'),
         emailRegExp = new RegExp( excludeLinkString + emailRegExpString, 'gi'),
         assembleUrl = function(href, linkText, newTab){
            return '<a class="asLink"' + ( newTab ? ' target="_blank"' : '') + ' href="' + href + '">' + linkText + '</a>';
         };
      
      return function(text, newTab) {
         if (typeof text === 'string') {
            newTab = newTab === undefined ? true : newTab;
            searchRegExp.lastIndex = 0;
            text = text.replace(searchRegExp, function (a, protocol, href, pos, str) {
               if (a.charAt(0) != '<' && str.substr(pos - 5, 4) !== 'src=') {
                  urlRegExp.lastIndex = 0;
                  var text = urlRegExp.exec(a)[0];
                  if (text.charAt(text.length - 1) === '\/') {
                     text = text.substr(0, text.length - 1);
                  }
                  return assembleUrl(a, text, newTab);
               } else {
                  return a;
               }
            });

            // Заменим электронную почту
            emailRegExp.lastIndex = 0;
            text = text.replace(emailRegExp, function (result) {
               if (result.charAt(0) === '<') {
                  // Мы нашли ссылку, ничего делать с ней не нужно.
                  return result;
               }
               return assembleUrl('mailto:' + result, result, newTab);
            });
         }
   
         return text;
      }
   }(),
   
   /**
    * Открывает указанный файл при помощи FileLink плагина нотификатора.
    * <pre>
    * $ws.helpers.openFile('C:\update.txt').addCallback(function() {
    *    $ws.helpers.alert('Файл успешно открыт!');
    * }).addErrback(function() {
    *    $ws.helpers.alert('При открытии файла произошла ошибка.');
    * });
    * </pre>
    * @param {String} fileName Имя открываемого файла.
    * @returns {Deferred} Деферред с результатом выполнения функции.
    */
   openFile: function(fileName) {
      var result = new $ws.proto.Deferred();
      require(['js!SBIS3.CORE.PluginManager'], function(plugins) {
         plugins.getPlugin('FileLink', '1.0.0.4', {}).addCallbacks(function(plugin) {
            var def = plugin.OpenLink(fileName);
            def.addCallbacks(function(){
               result.callback();
            }, function() {
               $ws.single.ioc.resolve('ILogger').log('$ws.helpers.openFile', 'error opening file "' + fileName + '".');
               result.errback();
            });
         }, function() {
            $ws.single.ioc.resolve('ILogger').log('$ws.helpers.openFile', 'error opening file "' + fileName + '".');
            result.errback();
         });
      });
      return result;
   },
   /**
    * Обернуть файловые ссылки.
    * Оборачивает ссылки на файлы и папки в &lt;a&gt;&lt;/a&gt;.
    * <pre>
    *    var text = 'Полный список изменений расположен в файле "c:\update.txt"';
    *    $ws.helpers.wrapFiles(text);
    * </pre>
    * @param {String} string Текст, в котором нужно обернуть ссылки.
    * @returns {String} Текст с обёрнутыми ссылками.
    */
   wrapFiles: function() {
      var excludeLinkString = /(?:\b[`a-z]:|\\\\[a-z0-9 %._-]+\\[a-z0-9 $%._-]+)\\(?:[^\\\/:*?"'<>|\r\n]+\\)*[^\\\/:*?"'<>|\r\n]*/gi;
      return function(string) {
         if (typeof string === 'string') {
            excludeLinkString.lastIndex = 0;
            string = string.replace(excludeLinkString, function (file, pos, str) {
               if (pos >= 0 && str.substr(pos - 31, 8) !== 'onclick=' && str.substr(pos + file.length, 4) !== '</a>') {
                  return '<a class="asLink" title="Открыть файл (папку)" onclick="$ws.helpers.openFile(\'' + file.replace(/\\/g, '\\\\') + '\');">' + file + '</a>';
               } else {
                  return file;
               }
            });
         }
         return string;
      }
   }(),
   /**
    * Открытие диалога просмотра изображений
    * в модальном окне.
    * @param {Object} event
    */
   openImageViewer: function(event) {
      var target = event.target;
      if (target.tagName === 'IMG') {
         $('<img src="' + target.getAttribute('src') + '">').bind('load', function() {
            var
               // изображение
               self = this,
               doc = document.documentElement,
               // коэффициент отступа
               perIndent = 0.05,
               // минимальная ширина/длина модального окна
               dialogDimensionMin = 100,
               // ширина окна документа
               docWidth = doc.clientWidth,
               // длина окна документа
               docHeight = doc.clientHeight,
               // расчет процента превышения размера изображения над размером документа
               perDimension = function (docDimension, imgDimension) {
                  return docDimension > imgDimension ? 1 : docDimension / imgDimension;
               },
               // выбор наибольшего соотношения сторон по которому производить уменьшение изображения
               perMostSide = function (dimensions) {
                  var
                     widthPer = perDimension(dimensions.docW, dimensions.imgW),
                     heightPer = perDimension(dimensions.docH, dimensions.imgH),
                     // чем больше процент, тем меньше соотношение сторон
                     isHeightMostSide = widthPer >= heightPer,
                     mostSidePer = 0;
                  if (widthPer !== heightPer) {
                     mostSidePer = isHeightMostSide ? heightPer : widthPer;
                     if (mostSidePer > perIndent) {
                        mostSidePer -= perIndent;
                     }
                     $(self).css(isHeightMostSide ? 'height' : 'width', '100%');
                  }
                  self.style.margin = '0 auto';
                  self.style.display = 'block';
                  return mostSidePer;
               },
               // расчёт сторон окна для оптимального просмотра изображения
               sideDimension = function (docDimension, imgDimension, percentageRatio) {
                  if (percentageRatio) {
                     imgDimension *= percentageRatio;
                  }
                  return imgDimension < dialogDimensionMin ? dialogDimensionMin : imgDimension;
               },
               // процент уменьшения изображения
               perRatio = perMostSide({
                  docW: docWidth,
                  docH: docHeight,
                  imgW: target.naturalWidth,
                  imgH: target.naturalHeight
               });
            $ws.core.attachInstance('SBIS3.CORE.Dialog', {
               name: 'modal_picture',
               caption: self.getAttribute('alt'),
               border: false,
               resizable: false,
               opener: $(event.target).wsControl(),
               width: sideDimension(docWidth, target.naturalWidth, perRatio),
               height: sideDimension(docHeight, target.naturalHeight, perRatio)
            }).addCallback(function(dialog) {
               var
                  // контейнер для кнопки закрытия модального окна
                  $btnContainer;
               dialog.getContainer()
                  .append(self)
                  .append($btnContainer = $('<div class="ws-closeBtn">'))
                  .css("padding", "0");
               $ws.core.attachInstance('SBIS3.CORE.CloseButton', {
                  name: 'closeBtn',
                  element: $btnContainer,
                  parent: dialog,
                  handlers: {
                     onActivated: function(){
                        dialog.close();
                     }
                  }
               });
            });
         });
      }
      event.stopPropagation();
   },
   /**
    * Метод, который добавляет обработчик на вращение колеса мыши
    * @param {jQuery} element Элемент, над которым нужно вращать колесо мыши. В некоторых браузерах также необходимо, чтобы страница имела фокус.
    * @param {Function} callback Функция, которая будет вызвана. Получит один аргумент - event, объект jQuery-события. У него будет задано свойство wheelDelta. При вращении колеса вниз значение будет отрицательным, вверх - положительным. Значение примерно равно количеству пикселей, на которое будет проскроллен блок, но не гарантируется, что в разных браузерах это значение будет одинаковым.
    * @return {jQuery}
    */
   wheel: function(element, callback){
      var support = $ws._const.compatibility.wheel;
      return element.bind(support, function(event){
         var originalEvent = event.originalEvent;
         if( support === 'wheel' ){
            event.wheelDelta = -originalEvent.deltaY;
            if( originalEvent.deltaMode === 1 ){
               event.wheelDelta *= 40;
            }
         }
         else if( support === 'DOMMouseScroll' ){
            event.wheelDelta = -originalEvent.detail * 40;
         }
         callback.call(this, event);
      });
   },

   /**
    * Пробрасывает события колёсика из iframe в родительский документ. Обычно ифреймы захватывают мышиные события и не прокидывают их в родительский документ,
    * что не даёт возможности его крутить, если курсор расположен над ифреймом.
    * Этот метод устанавливает обработчик события колёсика, который смотрит, находится ли мышиный курсор над чем-то в ифрейме, у чего есть верт. прокрутка
    *  (чтобы можно было крутить прокручиваемые области внутри ифрейма),
    * и, если нет, то пробрасывает событие родителям ифрейма вверх по иерархии.
    * @param {jQuery|HTMLElement} iframe
    */
   dispatchIframeWheelEventsToParentDocument: function(iframe) {
      if (iframe.contentDocument) {
         var ingnoreProps = {target: true, eventPhase: true, explicitOriginalTarget: true, originalTarget: true,
                             timeStamp: true, isTrusted: true, defaultPrevented: true,  cancelable: true, bubbles: true},
             doc = $(iframe.contentDocument);

         // Attach a new onmousemove listener
         $ws.helpers.wheel(doc, function(event) {
            var target = $(event.target, doc),
               hasScrollable = target.parents().filter(function() {
                  return this.scrollHeight > this.offsetHeight && /auto|scroll/.test($(this).css('overflow-y'));
               }).length;

            if (!hasScrollable) {
               var evt = doc.get(0).createEvent("Event"),
                  e = event.originalEvent;

               evt.initEvent(e.type, true, false);

               for (var key in e) {
                  if (!(key in ingnoreProps) && key.charAt(0) === key.charAt(0).toLowerCase()) {
                     try {
                        evt[key] = e[key];
                     } catch (err) {
                        //если вдруг встретим неучтённое свойство, которое нельзя копировать
                     }
                  }
               }

               iframe.dispatchEvent(evt);
            }
         });
      }
   },


   /**
   * Функция позволяет получить инвертированную строку при неверной расскладке клавиатуры
   * @param {String} words.
   * @param {Boolean} switched_kb - true, если был ввод в начале на неверной расскладке, потом включена требуемая.
   * @returns {String}
   * @example
   * <pre>
    *    $ws.helpers.invertedInput("ckjdj") // слово
   * </pre>
   */
   invertedInput: function (words, switched_kb) {
      var keyboardEn = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', '\'', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '{', '}', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ':', '"', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '<', '>', '?'],
          keyboardRu = ['й', 'ц', 'у', 'к', 'е', 'н', 'г', 'ш', 'щ', 'з', 'х', 'ъ', 'ф', 'ы', 'в', 'а', 'п', 'р', 'о', 'л', 'д', 'ж', 'э', 'я', 'ч', 'с', 'м', 'и', 'т', 'ь', 'б', 'ю', '.', 'Й', 'Ц', 'У', 'К', 'Е', 'Н', 'Г', 'Ш', 'Щ', 'З', 'Х', 'Ъ', 'Ф', 'Ы', 'В', 'А', 'П', 'Р', 'О', 'Л', 'Д', 'Ж', 'Э', 'Я', 'Ч', 'С', 'М', 'И', 'Т', 'Ь', 'Б', 'Ю', ','],
          res = '',
          i, j, k, l, l2, l3;
      function evalDirection(data) {
         var directionEn = false,
             stop = false,
             i, j, l, l2;

         for (i = 0, l = data.length; i < l; i++) {
            if (stop) break;
            for (j = 0, l2 = keyboardEn.length; j < l2; j++) {
               if (data.charAt(i) === keyboardEn[j]) {
                  directionEn = true;
                  stop = true;
                  break;
               }
            }
            for (j = 0, l2 = keyboardRu.length; j < l2; j++) {
               if (data.charAt(i) === keyboardRu[j]) {
                  directionEn = false;
                  stop = true;
                  break;
               }
            }
         }
         return directionEn;
      }

      var directionEn = evalDirection(words);

      for (i = 0, l = words.length; i < l; i++) {
         var invSymbol = null;

         if (switched_kb === true) {
            if (directionEn) {
               for (j = 0, l2 = keyboardRu.length; j < l2; j++) {
                  if (words.charAt(i) === keyboardEn[j]) {
                     invSymbol = keyboardRu[j];
                     break;
                  }
               }
            } else {
               for (j = 0, l2 = keyboardEn.length; j < l2; j++) {
                  if (words.charAt(i) === keyboardRu[j]) {
                     invSymbol = keyboardEn[j];
                     break;
                  }
               }
            }
            if (!invSymbol) {
               invSymbol = words[i];
            }
         } else {
            for (j = 0, l2 = keyboardRu.length; j < l2; j++) {
               if (words.charAt(i) === keyboardEn[j]) {
                  invSymbol = keyboardRu[j];
                  break;
               }
            }
            if (!invSymbol) {
               for (j = 0, l2 = keyboardEn.length; j < l2; j++) {
                  if (words.charAt(i) === keyboardRu[j]) {
                     invSymbol = keyboardEn[j];
                     break;
                  }
               }
            }
            if (!invSymbol) invSymbol = words[i];
         }
         res += invSymbol;
      }
      return res;
   },
   /**
    * Выполняет четыре проверки:
    * 1) object - что объект существует.
    * 2) typeof(object) === 'object'.
    * 3) property in object - что проверяемое свойство у данного объекта есть.
    * 4) typeof(object[property]) === "function".
    * @param {Object} object
    * @param {String} property
    * @return {Boolean}
    */
   hasFunctionProperty: function(object, property) {
      return object &&
         typeof(object) === 'object' &&
         property in object &&
         typeof(object[property]) === 'function';
   },
   /**
    * Выполняет транслитерацию строки. Заменяет пробелы на _, вырезает мягкий и твердый знаки
    * @param {String} string Исходная строка
    * @returns {String}
    */
   transliterate: (function() {
      var charMap = {
         'а': 'a',
         'б': 'b',
         'в': 'v',
         'г': 'g',
         'д': 'd',
         'е': 'e',
         'ё': 'e',
         'ж': 'j',
         'з': 'z',
         'и': 'i',
         'й': 'j',
         'к': 'k',
         'л': 'l',
         'м': 'm',
         'н': 'n',
         'о': 'o',
         'п': 'p',
         'р': 'r',
         'с': 's',
         'т': 't',
         'у': 'u',
         'ф': 'f',
         'х': 'h',
         'ц': 'ts',
         'ч': 'ch',
         'ш': 'sh',
         'щ': 'sch',
         'ъ': '',
         'ы': 'y',
         'ь': '',
         'э': 'e',
         'ю': 'yu',
         'я': 'ya',
         ' ': '_'
      };
      for(var k in charMap) {
         if(charMap.hasOwnProperty(k)) {
            charMap[k.toUpperCase()] = charMap[k].toUpperCase();
         }
      }
      return function(string) {
         var result = [], c, i, l;
         for(i = 0, l = string.length; i < l; i++) {
            c = string.charAt(i);
            result[i] = (c in charMap) ? charMap[c] : c;
         }
         return result.join('');
      }
   })(),
    /**
     * Проверяет поддерживается ли конкретным браузером указанный плагин
     * @param mimeType
     * @returns {boolean}
     */
   checkMimeSupport: function(mimeType) {
      if (navigator.mimeTypes) {
         return !!navigator.mimeTypes[mimeType];
      } else {
         // Невозможно точно выяснить. Скажем что поддерживается.
         return true;
      }
   },
   /**
    * Открывает диалог с результатами выполнения массовых операций
    * @param cfg - конфигурация
    * Пример кода:
    * @example
    * <pre>
    *    $ws.helpers.openErrorsReportDialog({
            'numSelected':cntSelected, //Количество обработанных\выделенных записей
            'numSuccess':cntSuccess,   //Количество успешно выполненных операций
            'errors':errors,        //{$ws.proto.Array} Список всех ошибок.
            'title': 'Итоги операции: "Отправить"' //Заголовок - опция для вывода названия операции, которая выполнялась
         });})
    * </pre>
    */
   openErrorsReportDialog: function(cfg){
      var numSelected = cfg.numSelected || 0,
         numSuccess = cfg.numSuccess || 0,
         numErrors = numSelected - numSuccess,
         errors = cfg.errors || [],
         context = new $ws.proto.Context(),
         title = cfg.title || '',
         errorsText = [];
      context.setValue('Отмечено', numSelected);
      context.setValue('Обработано', numSuccess);
      context.setValue('НеВыполнено', numErrors);
      for (var i = 0, len = errors.length; i < len; i++){
         var text = errors[i] instanceof Error ? errors[i].message : errors[i];
         if ($.inArray(text, errorsText)===-1){
            errorsText.push(text);
            if (errorsText.length > 5)
               break;
         }
      }
      context.setValue('ТекстОшибки', errorsText.join('<br>'));
      $ws.core.attachInstance('Control/Area:Dialog', {
         template: 'errorsReportDialog',
         context: context,
         resizable: false,
         isReadOnly: true,
         handlers: {
            'onAfterLoad':function(e){
               if (title) {
                  this.setTitle(title);
               }
               this.getChildControlByName('ТекстОшибки').setContent('<div style="color:red; overflow: auto;">'+errorsText.join('<br>')+'</div>');
               if (numErrors===0){
                  $("div[sbisname='заголовокОшибок']").css('display','none');
                  this.getChildControlByName('НеВыполнено').hide();
                  this.getChildControlByName('ТекстОшибки').hide();
               }
            }
         }
      });
   },
   /**
    * Возвращает путь до картинки, лежащей в ресурсах компонента
    * @param {String} name Строка в формате "имя компонента|имя картинки"
    * @returns {String}
    */
   getImagePath: function(name){
      var
            moduleAndName = name.split('|'),
            img = moduleAndName.pop(),
            module = moduleAndName.pop();
      return $ws._const.wsRoot + 'lib/Control/' + module + '/resources/images/' + img;
   },
   /**
    * Возвращает путь с готовым блоком картинки или sprite
    * @param {String} img Ссылка на картинку или sprite
    * @returns {String}
    */
   getImageBlock: function(img){
      var imgBlock = document.createElement('div');
      var isSpriteImage = (img.indexOf('sprite:') !== -1);

      if(!isSpriteImage){
         $(imgBlock).append('<img src="' + img + '" />');
      }
      else{
         $(imgBlock).addClass(img.replace("sprite:",""));
      }
      return imgBlock;
   },
   /**
    * Мержит набор строк, переданных в аргументах, рассматривая их как значения, разделенные пробелами
    * Функция дял слияния таких DOM-аттрибутов как class.
    * @returns {Array}
    */
   mergeAttributes: function() {
      var unfilteredList, prev = null;

      unfilteredList = $ws.helpers.map(arguments, function(element){
         return String.trim(element || '').split(/\s+/);
      });

      unfilteredList = Array.prototype.concat.apply([], unfilteredList).sort();

      return $ws.helpers.filter(unfilteredList, function(item) {
         var check = item !== prev;
         prev = item;
         return check;
      });
   },
    /**
     * Помещает xhtml разметку файла в контейнер создаваемого компонента
     * Зовётся с браузера, либо с препроцессора; заполнит нужным содержимым компонент при создании.
     * @param container - контейнер.
     * @param markup - xhtml разметка файла.
     * @returns {Node}
     */
   replaceContainer: function(container, markup) {
      var
         attributes,
         rCounter = 0;

      markup = markup.replace(/(<\/?)option/g, function(str, bkt){
         rCounter++;
         return bkt + 'opt';
      });

      if (rCounter){
         BOOMR.plugins.WS.reportMessage('Configuration warning: tags <option> and <options> was deprecated, please use tags <opt> and <opts> respectively');
      }
      if("jquery" in container){ // from browser
         markup = $(markup);

         // get unique class names
         var mergingClass = $ws.helpers.mergeAttributes(container.attr('class'), markup.attr('class'));

         attributes = {};
         // copy all the attributes to the shell
         $.each(container.get(0).attributes, function(index, attribute) {
            attributes[attribute.name] = attribute.value;
         });
         // assign attributes
         markup.attr(attributes);
         // merge attribute "class"
         markup.attr('class', mergingClass.join(' '));
         // copy the data
         markup.data(container.data());
         // replace
         container.replaceWith(markup);
         // emtpy jQuery collection
         container.length = 0;
         // add markup into empty collection
         container.push(markup.get(0));
         container.attr("hasMarkup", "true");

         return container;
      }
      else{ // from preprocessor
         var document = container.ownerDocument,
               id = container.getAttribute('id'),
               element = document.createElement("div"),
               attrsToMerge, values,
               result;

         attrsToMerge = {
            'class': 1
         };

         element.innerHTML = markup;
         if(element.firstChild) {
            attributes = container.attributes;
            for(var i = 0, l = attributes.length; i < l; i++) {
               var attr = attributes[i], attrname = attr.nodeName;
               if(attrname in attrsToMerge) {
                  values = $ws.helpers.mergeAttributes(attr.nodeValue, element.firstChild.getAttribute(attrname));
                  element.firstChild.setAttribute(attrname, values.join(' '));
               } else {
                  if(!element.firstChild.hasAttribute(attrname)) {
                     element.firstChild.setAttribute(attrname, attr.nodeValue);
                  }
               }
            }

            result = element.firstChild;
            container.parentNode.replaceChild(result, container);
         } else {
            result = container;
         }

         result.setAttribute("hasMarkup", "true");
         return result;
      }
   },
    /**
     * Строит путь до компонента по его имени
     * По имени компонента, который хотим получить,
     * строит до него путь вида /ws/... или /resources/...
     * @param name - имя компонента.
     * @param plugin - плагин, который запрашиваем.
     * @returns {*}
     */
   requirejsPathResolver: function(name, plugin){
      var plugins = {
         'js': 0,
         'css': 0,
         'html': 0,
         'i18n': 0,
         'json': 0,
         'dpack': 0,
         'xml': 0
      };

      function pathResolver(plugin){
         var path,
             reModName =
             buildNum = $ws._const.buildnumber ? ".v" + $ws._const.buildnumber : "",
             ext;

         if (plugin == 'html') {
            ext = '.xhtml';
         } else if (plugin == 'i18n') {
            var currLang = $ws.single.i18n.getLang();
            ext = '/resources/lang/' + currLang + '/' + currLang + '.json'
         } else {
            ext = '.' + plugin;
         }

         if (/\//.test(name)) {
            var paths = name.split('/'),
                moduleName = paths.shift();

            path = $ws.helpers.resolveModule(moduleName);
            if (path) {
               path = path.replace(/(\w|\.)+\.module\.js$/, paths.join('/') + ext);
            } else {
               var regexp = new RegExp('\\' + ext + '$');
               path = name + ((plugin === 'js' || regexp.test(name)) ? '' : ext);
            }
         } else {
            path = $ws.helpers.resolveModule(name);
            if (!path) {
               throw new Error("Module " + name + " is not defined");
            }

            if (plugin == 'i18n') {
               path = path.replace(/(\/|\\)(\w|\.)+\.module\.js$/, ext);
            } else if (plugin != 'js') {
               path = path.replace(/(\.module\.js|\.js)$/, ext)
            }
         }

         if (typeof window !== 'undefined' && buildNum) {
            if (path.indexOf(buildNum) === -1) {
               if (path == name) {
                  path += buildNum;
               } else {
                  path = path.replace(/(\.[^\.]+$)/, function(e) {return buildNum + e});
               }
            }
         }

         return path;
      }

      if (!(plugin in plugins)) {
         throw new Error("Plugin " + plugin + " is not defined");
      }

      return pathResolver(plugin);
   },
   /**
    * Возвращает путь до модуля по его имени
    * @param {String} name имя модуля
    * @returns {string}
    */
   resolveModule : function(name){
      if ($ws._const.jsCoreModules[name]){
         return $ws._const.wsRoot + $ws._const.jsCoreModules[name];
      } else {
         var jsMod = $ws._const.jsModules[name];
         if (jsMod) {
            if (jsMod.charAt(0) == '/' || jsMod.substr(0, 4) == 'http' || jsMod.charAt(1) == ':') {
               return jsMod;
            } else {
               return $ws._const.resourceRoot + jsMod;
            }
         }
      }
      return '';
   },
   /**
    * Возвращает стек ошибки
    * @param e - ошибка
    */
   getStackTrace: function(e){
      var
         getChromeStack = function() {
            var obj = {};
            Error.captureStackTrace(obj, getChromeStack);
            return obj.stack;
         },
         stringifyArguments = function(args) {
            var result = [];
            var slice = Array.prototype.slice;
            for (var i = 0; i < args.length; ++i) {
               var arg = args[i];
               if (arg === undefined) {
                  result[i] = 'undefined';
               } else if (arg === null) {
                  result[i] = 'null';
               } else if (arg.constructor) {
                  if (arg.constructor === Array) {
                     if (arg.length < 3) {
                        result[i] = '[' + stringifyArguments(arg) + ']';
                     } else {
                        result[i] = '[' + stringifyArguments(slice.call(arg, 0, 1)) + '...' + stringifyArguments(slice.call(arg, -1)) + ']';
                     }
                  } else if (arg.constructor === Object) {
                     result[i] = '#object';
                  } else if (arg.constructor === Function) {
                     result[i] = '#function';
                  } else if (arg.constructor === String) {
                     result[i] = '"' + arg + '"';
                  } else if (arg.constructor === Number) {
                     result[i] = arg;
                  }
               }
            }
            return result.join(',');
         },
         other = function(curr) {
            var ANON = '{anonymous}', fnRE = /function\s*([\w\-$]+)?\s*\(/i, trace = [], fn, args, maxStackSize = 40;
            while (curr && curr['arguments'] && trace.length < maxStackSize) {
               fn = fnRE.test(curr.toString()) ? RegExp.$1 || ANON : ANON;
               args = Array.prototype.slice.call(curr['arguments'] || []);
               trace[trace.length] = fn + '(' + stringifyArguments(args) + ')';
               curr = curr.caller;
            }
            return trace.join('\r\n');
         },
         stack;

      if (e && e.stack) {
         stack = e.stack;
      } else {
         if (Error && Error.captureStackTrace) {
            stack = getChromeStack();
         } else if ((stack = Error().stack)) {
            return stack;
         } else {
            // ie11 thinks he is in strict mode. Yes, some kind of...
            try {
               stack = other(arguments.callee);
            } catch(e) {
               stack = '';
            }
         }
      }
      return stack;
   },
   /**
    * Преобразование массива объектов в коллекцию
    * @param {Array} arr
    * @return {Array}
    * <pre>
    *    var collection = $ws.helpers.collection([
    *       {
    *          "name": "Bob",
    *          "age": 23
    *       },
    *       {
    *          "name": "Alice",
    *          "age": 21
    *       }
    *    ]);
    * </pre>
    *    у коллекции есть событие на изменение onChange
    * <pre>
    *    collection.subscribe('onChange', function(){
    *       alert("collection changed!");
    *    });
    * </pre>
    * Также есть событие на добавление элементов onInsertItem.
    * В него приходят новые элементы и их позиции в получившейся коллекции
    * <pre>
    *    collection.subscribe('onInsertItem', function(event, elements, positions){
    *       alert("collection changed!");
    *    });
    * </pre>
    * И событие на удаление элементов onRemoveItem.
    * В него приходят удаленные элементы и позиции, которые они занимали в коллекции
    * <pre>
    *    collection.subscribe('onRemoveItem', function(event, elements, positions){
    *       alert("collection changed!");
    *    });
    * </pre>
    */
   collection: function(arr){
      arr._eventBusChannel = $ws.single.EventBus.channel({
         strictMode : true
      });
      arr._eventBusChannel.publish("onChange", "onRemoveItem", "onInsertItem", "onMove", "onChangeOrder");
      var notifyChanges = function(){
         this._eventBusChannel.notify("onChange");
      },
      notifyChagesAndChangeOrder = function(){
         notifyChanges.apply(this);
         this._eventBusChannel.notify("onChangeOrder");
      },
      toCollection = function(){
         return $ws.helpers.collection(arguments[arguments.length - 1]);
      },
      onInsertItems = function(items, indexes){
         notifyChanges.apply(this, []);
         this._eventBusChannel.notify("onInsertItem", items, indexes);
      },
      onRemoveItems = function(items, indexes){
         notifyChanges.apply(this, []);
         this._eventBusChannel.notify("onRemoveItem", items, indexes);
      },
      callMethod = function(methodName, args){
         this._eventBusChannel[methodName].apply(this._eventBusChannel, args);
         return this;
      },
      getItems = function(){
         return Array.prototype.slice.apply(arguments, [0, arguments.length - 1]);
      },
      getIndexes = function(start, length){
         var indexes = [];
         for(var i = 0; i < length; i++){
            indexes.push(start + i);
         }
         return indexes;
      };
      arr.subscribe = function(event, $handler){
         this._eventBusChannel.subscribe(event, $handler, this);
         return this;
      };
      arr.once = function(){
         return callMethod.apply(this, ["once", arguments]);
      };
      arr.unsubscribe = function(){
         return callMethod.apply(this, ["unsubscribe", arguments]);
      };
      arr.unbind = function(){
         return callMethod.apply(this, ["unbind", arguments]);
      };
      arr.slice = Array.prototype.slice.callNext(toCollection.bind(arr));
      arr.concat = Array.prototype.concat.callNext(toCollection.bind(arr));
      arr.pop = Array.prototype.pop.callNext(function(element){
         if(this._eventBusChannel.hasEventHandlers("onRemoveItem")){
            onRemoveItems.apply(this, [[element], [this.length]]);
         } else if(this._eventBusChannel.hasEventHandlers("onChange")){
            notifyChanges.apply(this, []);
         }
      });
      arr.push = Array.prototype.push.callNext(function(){
         if(this._eventBusChannel.hasEventHandlers("onInsertItem")){
            var items = getItems.apply(this, arguments),
                l = items.length,
                indexes = getIndexes(this.length - l, l);
            onInsertItems.apply(this, [items, indexes]);
         } else if(this._eventBusChannel.hasEventHandlers("onChange")){
            notifyChanges.apply(this, []);
         }
      });
      arr.reverse = Array.prototype.reverse.callNext(notifyChagesAndChangeOrder.bind(arr));
      arr.shift = Array.prototype.shift.callNext(function(){
         if(this._eventBusChannel.hasEventHandlers("onRemoveItem")){
            onRemoveItems.apply(this, [Array.prototype.slice.apply(arguments, []), [0]]);
         } else if(this._eventBusChannel.hasEventHandlers("onChange")){
            notifyChanges.apply(this, []);
         }
      });
      arr.unshift = Array.prototype.unshift.callNext(function(){
         if(this._eventBusChannel.hasEventHandlers("onInsertItem")){
            var items = getItems.apply(this, arguments).reverse(),
                indexes = getIndexes(0, items.length);
            onInsertItems.apply(this, [items, indexes]);
         } else if(this._eventBusChannel.hasEventHandlers("onChange")){
            notifyChanges.apply(this, []);
         }
      });
      arr.sort = Array.prototype.sort.callNext(notifyChagesAndChangeOrder.bind(arr));
      arr.splice = Array.prototype.splice.callNext(function(start, deleteCount){
         var ln = arguments.length,
             needNotifyChanges = true;
         if(this._eventBusChannel.hasEventHandlers("onRemoveItem") && deleteCount > 0){
            var deletedItems = arguments[ln - 1];
            needNotifyChanges = false;
            onRemoveItems.apply(this, [deletedItems, getIndexes(start, deletedItems.length)]);
         }
         if(this._eventBusChannel.hasEventHandlers("onInsertItem") && ln > 3){
            var items = Array.prototype.slice.apply(arguments, [2, ln - 1]);
            needNotifyChanges = false;
            onInsertItems.apply(this, [items, getIndexes(start, items.length)]);
         }
         if(needNotifyChanges)
            notifyChanges.apply(this, []);
         return toCollection.apply(this, arguments);
      });
      arr.move = function(from, to){
         var element = this[from];
         Array.prototype.splice.apply(this, [from, 1]);
         Array.prototype.splice.apply(this, [to, 0, element]);
         this._eventBusChannel.notify("onMove", from, to);
         notifyChagesAndChangeOrder.bind(arr).apply(this);
         return this;
      };
      return arr;
   },
   /**
    * Возвращает координаты первого нажатия по jQuery-событию
    * @param {Object} event jQuery-событие
    * @returns {{x: Number, y: Number}}
    */
   getTouchEventCoords: function(event) {
      var x = event.clientX,
         y = event.clientY;
      if (!x) {
         var touch = event.originalEvent.touch || event.originalEvent.touches[0] ||
            event.originalEvent.changedTouches[0];
         if (touch) {
            x = touch.pageX;
            y = touch.pageY;
         }
      }
      return {'x': x, 'y': y};
   },
   instanceOfModule: function(inst, moduleName){
      return requirejs.defined("js!" + moduleName) ? (inst instanceof requirejs("js!" + moduleName)) : false;
   },
   instanceOfMixin: function(inst, mixin) {
      return requirejs.defined("js!" + mixin) ? Array.indexOf(inst._mixins || [], requirejs("js!" + mixin)) !== -1 : false;
   },
   /**
    * Метод для поиска только "своих" элементов верстки (не отосящихся в верстке вложенных компонентов, если они есть)
    * @param {jQuery} root корневой элемент, в котором осуществляется поиск
    * @param {String} selector селектор, по кторому осуществляется поиск
    * @returns {Array} массив найденных элементов
    * @protected
    */
   getChildContainers: function(root, selector){
      var
         topParent = root.get(0),
         components = root.find(selector),
         deadCollection = [];

      components.each(function(){
         var
            elem = this,
            p = elem;

         while((p = p.parentNode) !== null){
            if (p === topParent){
               deadCollection.push(elem);
               break;
            }
            else if(p.getAttribute("hasMarkup") == "true" || $ws.helpers.getTagName(p) == 'component'){
               break;
            }
         }
      });

      return deadCollection;
   },
   /**
    * Метод для поиска контейнеров дочерних компонентов 1ой вложенности
    * @param {jQuery} root корневой элемент, в котором осуществляется поиск
    * @returns {Array} массив найденных элементов
    * @protected
    */
   getNestedComponents: function(root){
      var
         topParent = root.get(0),
         components,
         deadCollection = [];

      if (topParent.id){
         components = topParent.querySelectorAll('[data-pid="'+ topParent.id +'"]');
         for (var i = 0, l = components.length; i < l; i++){
            deadCollection.push(components[i]);
         }
      }
      else{
         deadCollection = $ws.helpers.getChildContainers(root, '[data-component]');
      }

      return deadCollection;
   },
   /**
    * Метод для определения типа элемента. Умеет распознавать следующие типы:
    * Метод для определения типа элемента.
    * Умеет распознавать следующие типы:
    *    ~ тип ~           ~ примеры ~
    *    number            1, 0, -3, 123456
    *    nan               NaN
    *    infinity          Infinity, -Infinity
    *    string            '', 'строчка'
    *    boolean           true, false
    *    undefined         undefined
    *    null              null
    *    date              new Date()
    *    regexp            /регулярка/, /[0-9]{6,8}/
    *    function          function(){}
    *    object            {}, { field1: 1, field2: '2' }
    *    array             [], [1, 'a']
    *    error             new Error()
    *    element           document, document.body, document.head
    * @param {*} elem - Произвольный объект, тип которого необходимо определить
    * @returns {String} Строка - тип элемента elem
    * @example
    * <pre>
    * if($ws.helpers.type(style) === 'array'){
    *    styleString = style.join(';');
    * }
    * </pre>
    */
   type: function(elem) {
      // обработка null для старых версий IE
      if (elem === null)
         return 'null';

      // обработка DOM-элементов
      if (elem && (elem.nodeType === 1 || elem.nodeType === 9))
         return 'element';

      var regexp = /\[object (.*?)\]/,
         match = Object.prototype.toString.call(elem).match(regexp),
         type = match[1].toLowerCase();

      // обработка NaN и Infinity
      if (type === 'number') {
         if (isNaN(elem))
            return 'nan';
         if (!isFinite(elem))
            return 'infinity';
      }

      return type;
   },
   /**
    * Проверить видимость элемента
    * Метод выполняет для переданного элемента две проверки:
    * 1. Элемент находится в DOM (у него есть родитель 'html').
    * 2. У него нет невидимых родителей ('.ws-hidden').
    * @param   {jQuery}    elem  Проверяемый на видимость элемент.
    * @returns {boolean}         Видимость элемента.
    */
   isElementVisible: (function() {
      var invisibleRe = /\bws-hidden\b/;
      return function isElementVisibleInner(elem) {
         var classes, doc = document;

         elem = (elem && elem.jquery) ? elem[0] : elem;

         while (elem && elem.getAttribute) {
            classes = elem.getAttribute('class');
            if (classes && invisibleRe.test(classes)) {
               break;
            }
            elem = elem.parentNode;
         }
         return elem === doc;
      }
   })(),
   /**
    * Приводит innerHTML, отдаваемый ie8 к стандарту
    * @param html
    * @returns {XML|string|void}
    */
   ieFixInnerHTML: function (html){
      var
         tRegExp = /<(?:[A-Z][A-Z0-9]*)\b[^>]*>/gi,
         aRegExp = /\s+\S+=[^'"\s>]+/g;

      return html.replace(tRegExp, function(tag){
         return tag.replace(aRegExp, function(attr){
            var a = attr.split('=');
            a[1] = '"'+a[1]+'"';
            return a.join('=');
         });
      });
   },
   /**
    * Возвращает набор дефолтных опций для переданного конструктора класса
    * @param {Function} ctor
    * @param {Object} [options] набор опций, который нужно вмержить в опции по умолчанию.
    * Если не передан, метод возвращает опции по умолчанию
    * @returns {*}
    */
   resolveOptions: function(ctor, options) {
      if (ctor) {
         var
            baseConfig,
            finalConfig;

         if (ctor.prototype._initializer) {
            var cfg = {};
            ctor.prototype._initializer.call(cfg);

            if (options){
               finalConfig = cfg._options || {};
               $ws.core.propertyMerge(options, finalConfig);
               if (ctor.prototype._contentAliasing){
                  finalConfig = ctor.prototype._contentAliasing.apply(cfg, [finalConfig]);
               }
            }
            else{
               finalConfig = cfg._options || {};
            }
         } else {
            finalConfig = $ws.core.merge(
               this.resolveOptions(ctor.superclass && ctor.superclass.$constructor),
               ctor.prototype.$protected && ctor.prototype.$protected._options || {},
               { clone:true });

            if (options){
               finalConfig = $ws.core.merge(finalConfig, options);
               if (ctor.prototype._contentAliasing){
                  finalConfig = ctor.prototype._contentAliasing(finalConfig);
               }
            }
         }
         return finalConfig;
      } else
         return {};
   },
   /**
    * Сравнивает два слова
    * @param {String} firstWord
    * @param {String} secondWord
    * @returns {boolean | Array}
    * Возвращает массив вида [Общая часть двух слов, хвост первого слова, хвост второго слова]
    * Если слова одинаковые вернёт false
    */
   searchSymbolsDifference: function(firstWord, secondWord) {
      if(typeof firstWord === 'string' && typeof secondWord === 'string' && firstWord.length && secondWord.length){
         for (var i = 0, len = firstWord.length; i < len; i++) {
            if (firstWord[i] !== secondWord[i]) {
               return [firstWord.substr(0, i), firstWord.substr(i), secondWord.substr(i)];
            }
         }
         return false;
      }
   },
   /**
    * Сравнение двух дат без учета времени.
    *
    * В качестве примера, "12.12.2012 13:23:12" и "12.12.2012 14:43:52" равны.
    *
    * @param date1 - первая дата
    * @param date2 - вторая дата
    * @param sign - тип сравнения дат. Например, " >= " - первая дата больше или равна второй
    * @returns {boolean}
    */
   compareDates: function(date1, sign, date2){
      if(!date1 || !date2)
         return false;

      var equal = date1.toSQL() == date2.toSQL();

      switch(sign){
         case '<':
            return !equal && date1 < date2;
         case '<=':
            return equal || date1 < date2;
         case '=':
            return equal;
         case '==':
            return equal;
         case '>=':
            return equal || date1 > date2;
         case '>':
            return !equal && date1 > date2;
         default:
            return false;
      }
   },
   encodeCfgAttr: function(json){
      return encodeURIComponent(JSON.stringify(json)).replace(/'/g, '&apos;');
   },
   decodeCfgAttr: (function(){

      function JSONreviver(key, value){
         if (typeof value === 'string'){
            if(value.beginsWith('wsFuncDecl::')) {
               return $ws.helpers.getFuncFromDeclaration(value.replace('wsFuncDecl::', ''));
            }
            else if(value.beginsWith('wsGlobalFnDecl::')){
               var
                  sKey = value.replace('wsGlobalFnDecl::', ''),
                  result = this[sKey];
               delete this[sKey];
               return result;
            }
            else if (value.beginsWith('moduleFunc#')){
               var
                  m = value.replace(/^moduleFunc#/, '').split("/"),
                  fName = m.length > 1 ? m.pop() : '',
                  mName = m.join('/');
               try{
                  value = require("js!" + mName)[fName];
               }
               catch(e){
                  throw new Error('Parsing moduleFunc "' + value + '" failed. Original message: ' + e.message)
               }
            } else if (value.beginsWith('datasource!')) {
               return $ws.helpers.getDataSourceFromDeclaration(value);
            }
         } else if (value && value.s && value.d && value._type) {
            if (value._type == 'recordset' && $ws.proto.RecordSet) {
               return new $ws.proto.RecordSet({
                  readerParams: {
                     adapterType: 'TransportAdapterStatic',
                     adapterParams: {
                        data: {
                           d: value.d,
                           s: value.s
                        }
                     }
                  }
               });
            } else if (value._type == 'record' && $ws.proto.Record) {
               return new $ws.proto.Record({
                  row: value.d,
                  colDef: value.s,
                  pkValue: value._key
               });
            }
         }

         return value;
      }

      return function(encodedCfg, fnStorage, noRevive){
         var
            reviver = noRevive ? undefined : JSONreviver.bind(fnStorage),
            result;

         try{
            result = JSON.parse(decodeURIComponent(encodedCfg.replace(/&apos;|"/g,'\'')), reviver);
         }
         catch(e){
            try{
               result = JSON.parse(encodedCfg, reviver);
            }
            catch(error){
               throw new Error('Ошибка разбора конфигурации компонента!');
            }
         }

         return result;
      }
   }()),

   /**
    * Принудительно обновляет позиции элементов, отслеживаемых функцией $ws.helpers.trackElement.
    * Может потребоваться в редких случаях, когда меняются параметры body  типа overflow-y, в результате чего пропадает прокрутка у body,
    * и требуется исправить координаты элементов, абсолютно спозиционированных в body.
    * Такое происходит при показе первой панели в стеке панелей, и при скрытии последней панели из стека, и тогда, чтобы
    * не ждать обновления позиций по таймеру, чтобы элементы не "прыгали", стек панелей вызывает эту функцию.
    */
   updateTrackedElements: function() {
      $ws.single.EventBus.channel('ticker').notify('onTickFast', true);
   },

   /**
    * @param {jQuery|Element} element
    * @param {Boolean} [doTrack = true]
    * @returns {$ws.proto.EventBusChannel}
    * @type function
    */
   trackElement: (function() {

      var
         CHANNEL_HOLDER = 'ws_trackerChannelId',
         STATE_HOLDER = 'ws_trackerState';

      function setData(element, key, value) {
         var el = element[0];
         if (el) {
            el[key] = value;
         }
      }

      function getData(element, key) {
         var el = element[0];
         return el && el[key];
      }


      function attachChannel($element) {
         var
            id = $ws.helpers.randomId('tracker-'),
            channel = $ws.single.EventBus.channel(id);
         setData($element, CHANNEL_HOLDER, id);
         channel.setEventQueueSize('*', 1);
         return channel;
      }

      function getState($element) {
         var isVisible = $ws.helpers.isElementVisible($element);

         return {
            visible: isVisible,
            position: isVisible ? $element.offset() : { left: 0, top: 0 }
         }
      }

      function tracker(force) {
         //Если есть активные пакеты, то обновлять позиции элементов не надо, поскольку они ещё не окончательные,
         //и можно сэкономить на этом расчёте при наличии активных пакетов.
         if ($ws.single.ControlBatchUpdater.haveBatchUpdate() && !force) {
            return;
         }

         var
            $element = $(this),
            channelId = getData($element, CHANNEL_HOLDER),
            lastState = getData($element, STATE_HOLDER),
            currentState, channel;

         if (!lastState) {
            lastState = {
               position : {}
            };
         }

         currentState = getState($element);
         channel = $ws.single.EventBus.channel(channelId);

         if (currentState.visible !== lastState.visible) {
            channel.notify('onVisible', currentState.visible);
         }

         if (currentState.visible) {
            if (currentState.position.left !== lastState.position.left || currentState.position.top !== lastState.position.top) {
               channel.notify('onMove', currentState.position);
            }
         }

         setData($element, STATE_HOLDER, currentState);
      }

      function beginTrackElement($element) {
         $ws.single.EventBus.channel('ticker').subscribe('onTickFast', tracker, $element[0]);
      }

      function stopTrackElement($element) {
         $ws.single.EventBus.channel('ticker').unsubscribe('onTickFast', tracker, $element[0]);
      }


      return function(element, doTrack) {
         var $element = $(element),
            channelId = getData($element, CHANNEL_HOLDER),
            channel;

         if (doTrack === undefined) {
            doTrack = true;
         }

         // Кому-то уже выдан канал
         if (channelId) {
            channel = $ws.single.EventBus.channel(channelId);
         } else {
            channel = attachChannel($element);
         }

         // Если попросили остановить отслеживание
         if (doTrack) {
            // Канала еще нет и попросили начать следить
            beginTrackElement($element);
         } else {
            stopTrackElement($element);
            setData($element, CHANNEL_HOLDER, null);
            setData($element, STATE_HOLDER, null);
            channel.destroy();
         }

         return channel;
      }
   })(),
   compareValues: function(a, b) {
      var comparisonResult
      if(a && a.equals) {
         comparisonResult = a.equals(b);
      } else {
         comparisonResult = (a == b);
      }
      return comparisonResult;
   }
};

/**
 * Хранилище асинхронных событий.
 *
 * @singleton
 * @class $ws.single.Storage
 */
$ws.single.Storage = /** @lends $ws.single.Storage.prototype */{
   _storage : {},
   /**
    * @param {string} name Уникальное имя асинхронной операции
    * @param {Function} constructor Функция, выполняющая асинхронное действие.
    *    Первым и единственным аргументом принимает {$ws.proto.Deferred},
    *    у которого по завершении должна вызвать .callback
    * @returns {$ws.proto.Deferred}
    */
   store : function(name, constructor){
      // помещаем ресурс в хранилище и блокируем возможность повторной загрузки
      if(!(name in this._storage)) {
         if(typeof(constructor) != 'function')
            throw new Error("Constructor is not specified for newly created async resource");
         this._storage[name] = new $ws.proto.Deferred();
         // запускаем асинхронное событие
         constructor(this._storage[name]);
      }
      return new $ws.proto.Deferred().dependOn(this._storage[name]);
   },
   /**
    * Проверяет существует ли deferred с данным именем
    * @param {string} name имя
    * @return {Boolean}
    */
   isStored : function(name){
      return name in this._storage;
   }
};

/**
 * Работа с Json-rpc
 * @class $ws.proto.RPCJSON
 *
 * @cfgOld {String} serviceUrl
 */
$ws.proto.RPCJSON = $ws.core.extend({}, /** @lends $ws.proto.RPCJSON.prototype */ {
   $protected: {
      _transport: null,
      _options: {
         serviceUrl: ''
      }
   },
   $constructor : function(){
      this._transport = $ws.single.ioc.resolve('ITransport', {
         url: this._options.serviceUrl || $ws._const.defaultServiceUrl,
         method: 'POST',
         dataType: 'json',
         contentType: 'application/json; charset=utf-8'
      });
   },
   _handleRPCError: function(dResult, method, args, response) {
      var
         error = response.error,
         transportError = new TransportError(
               error.message,
               '',
               error.code,
               method,
               error.details || '',
               this._options.serviceUrl || $ws._const.defaultServiceUrl,
               error.data && error.data.classid || '',
               error.type || 'error',
               error.data && error.data.addinfo || ''
         );

      $ws.single.EventBus.channel('errors').notify('onRPCError', transportError);
      dResult.errback(transportError);
   },
   _handleHTTPError: function(dResult, method, args, error) {
      var errInst,
          payload;
      if(error instanceof HTTPError) {
         var message = error.message, details = '', code = 0, classid = '', errType = '', addinfo = '';
         try {
            payload = JSON.parse(error.payload);
            if(payload.error) {
               message = payload.error.message || message;
               details = payload.error.details;
               code = payload.error.code;
               if(payload.error.data) {
                  classid = payload.error.data.classid || classid;
                  addinfo = payload.error.data.addinfo || addinfo;
               }
               errType = payload.error.type;
            }
         } catch (e) {}
         errInst = new TransportError(message, error.httpError, code, method, details, error.url, classid, errType || 'error', addinfo || '');
         $ws.single.EventBus.channel('errors').notify('onRPCError', errInst);
      } else
         errInst = error;

      dResult.errback(errInst);
      if(errInst.processed)
         error.processed = true;
   },
   /**
    * @param {String} method
    * @param {Array|Object} args
    * @returns {$ws.proto.Deferred}
    */
   callMethod: function(method, args){
      var dResult = new $ws.proto.Deferred(),
          rpcErrorHandler = this._handleRPCError.bind(this, dResult, method, args),
          httpErrorHandler = this._handleHTTPError.bind(this, dResult, method, args),
          req = $ws.helpers.jsonRpcPreparePacket(method, args),
          dExecute;
      dExecute = this._transport.execute(req.reqBody, req.reqHeaders);
      if ($ws._const.debug) {
         dExecute.addCallbacks(
            function(r){
               $ws.single.ioc.resolve('ILogger').info( method, '(args:', args, ') =', 'error' in r ? r.error : r.result );
               return r;
            },
            function(e){
               $ws.single.ioc.resolve('ILogger').info( method, '(args:', args, ') =', e ? e.details || e : e );
               return e;
            }
         );
      }

      dExecute.addCallbacks(
         function(r){
            r = r || {
               error: {
                  message: "Получен пустой ответ от сервиса",
                  code: "",
                  details: ""
               }
            };
            if('error' in r) {
               // Это 200 ОК, но внутри - ошибка или нет JSON
               rpcErrorHandler(r);
            }
            else {
               // Пробросим результат дальше
               dResult.callback(r.result);
            }
            return r;
         },
         function(e){
            // НЕ 200 ОК, какая-то ошибка, возможно не просто HTTP.
            httpErrorHandler(e);
            return e;
         });
      return dResult;
   },
   /**
    * Прерывает загрузку
    */
   abort: function(){
      this._transport.abort();
   }
});

/**
 * Абстрактный траспорт
 *
 * @class $ws.proto.ITransport
 */
$ws.proto.ITransport = $ws.core.extend({}, /** @lends $ws.proto.ITransport.prototype */{
   /**
    * Отправка запроса
    *
    * @param data данные
    * @param {Object} [headers] Заголовки запроса
    * @returns {$ws.proto.Deferred}
    */
   execute: function(data, headers){
      throw new Error("Method not implemented");
   }
});

/**
 * Интерфейс предназначен для организации логирования в приложениях.
 * Работа с интерфейсом обеспечивается с помощью механизма {@link https://ru.wikipedia.org/wiki/Инверсия_управления ioc}
 * Это важно учитывать при вызове методов класса.
 * Доступ к реализации осуществляется с помощью вызова конструкции $ws.single.ioc.resolve('ILogger').
 * По умолчанию в ws для интерфейса ILogger включена реализация {@link $ws.proto.ConsoleLogger}.
 * @class $ws.proto.ILogger
 */
$ws.proto.ILogger = $ws.core.extend({}, /** @lends $ws.proto.ILogger.prototype */{
   /**
    * Задать текст выводимого сообщения.
    * @param {String} tag Заголовок.
    * @param {String} message Текст выводимого сообщения.
    * @example
    * <pre>
    *     //в консоль будет выведено сообщение вида "tag: message" (при условии, что реализация интерфейса настроена на $ws.proto.ConsoleLogger)
    *     $ws.single.ioc.resolve('ILogger').log('tag','message')
    * </pre>
    * @see error
    * @see info
    */
   log: function(tag, message){
      throw new Error("ILogger::log method is not implemented");
   },
    /**
     * Задать текст сообщения об ошибке.
     * Текст будет со специальной пометкой "ошибка" в начале и красным цветом.
     * Удобно использовать для представления информации об ошибках и критических условиях.
     * @param tag Заголовок ошибки - краткое описание.
     * @param message Текст выводимого сообщения.
     * @example
     * <pre>
     *     //в ConsoleLogger будет выведено сообщение вида "tag: message"
     *     $ws.single.ioc.resolve('ILogger').error('tag','message')
     * </pre>
     * @see log
     * @see info
     */
   error: function(tag, message){
      throw new Error("ILogger::error method is not implemented");
   },
    /**
     * Задать тест выводимой информации.
     * Текст будет со специальной пометкой "информация" в начале.
     * Данный метод удобно использовать для предупреждения о различных событиях.
     * @example
     * <pre>
     *     $ws.single.ioc.resolve('ILogger').info('Информация для пользователя')
     * </pre>
     * @see log
     * @see error
     */
   info: function(){
      // чтобы серверный скрипт не падал, не кидаем исключение
   }
});

/**
 * Интерфейс для подключения JS/CSS-файла в контекст документа.
 *
 * @class $ws.proto.IAttachLoader
 */
$ws.proto.IAttachLoader = $ws.core.extend({}, /** @lends $ws.proto.IAttachLoader.prototype */{
   /**
    * Подключить файл.
    * @param {String} URL URL подключаемого файла.
    * @param {$ws.proto.Deferred} resource Deferred, который будет зависеть от загрузки файла.
    * @param {Object} [options] Опции.
    */
   attach: function(URL, resource, options){
      throw new Error("IAttachLoader::attach method not implemented");
   }
});

/**
 * Этот класс задаёт реализацию интерфейса ILogger по умолчанию в ws, обеспечивает работу механизма {@link https://ru.wikipedia.org/wiki/Инверсия_управления ioc}.
 * Доступ к реализации осуществляется с помощью вызова конструкции $ws.single.ioc.resolve('ILogger').
 * @class $ws.proto.ConsoleLogger
 * @extends $ws.proto.ILogger
 */
$ws.proto.ConsoleLogger = $ws.proto.ILogger.extend(/** @lends $ws.proto.ConsoleLogger.prototype */{
   $protected: {
      _con: null
   },
   $constructor: function(){
      if("jstestdriver" in window)
         this._con = window['jstestdriver']['console'];
      else
         if("console" in window && window['console']['log'])
            this._con = window['console'];
   },
   log: function(tag, message) {
      BOOMR.plugins.WS.reportMessage(tag + ": " + message);
      if(this._con && typeof(this._con) === 'object' &&'log' in this._con && typeof(this._con.log) == 'function')
         this._con.log(tag + ": " + message + "\n");
      else {
         try {
            this._con.log(tag + ": " + message + "\n");
         } catch(e) {
         }
      }
   },
   error: function(tag, message, exception) {
      exception && exception.httpError !== 0 && BOOMR.plugins.WS.reportError(exception, tag + ": " + message, $ws.helpers.getStackTrace(exception));
      message = message + (exception && exception.stack ? '\nStack: ' + exception.stack : '');
      if(this._con && typeof(this._con) === 'object' &&'error' in this._con && typeof(this._con.error) === 'function'){
         this._con.error(tag + ": " + message);
      } else{
         try{
            this._con.error(tag + ": " + message + "\n");
         } catch(e){
            this.log(tag, message);
         }
      }
   },
   info: function(){
      if(this._con && typeof(this._con) === 'object' && 'info' in this._con && typeof(this._con.info) === 'function'){
         this._con.info.apply( this._con, arguments );
      } else {
         try{
            this._con.info.apply( this._con, arguments );
         } catch(e){
         }
      }
   }
});

/**
 * @class $ws.proto.WindowAttachLoader
 * @extends $ws.proto.IAttachLoader
 */
$ws.proto.WindowAttachLoader = $ws.proto.IAttachLoader.extend(/** @lends $ws.proto.WindowAttachLoader.prototype */{
   attach: function (URL, resource, options) {
      var
          nodeType = URL.replace(/^.*\.([^\.]+)(\?.*)?$/ig, "$1").toLowerCase(),
          nodePath = URL,
          nodeAttr = {
             css:{
                tag : "LINK",
                rel : "stylesheet",
                type : "text/css",
                href : nodePath
             },
             js:{
                tag : "SCRIPT",
                charset: options && options.charset || 'UTF-8',
                type : "text/javascript",
                src : nodePath
             }
          }[nodeType];
      // создаем ресурс в контексте документа
      if (nodeAttr !== undefined) {
         var
             head = document.getElementsByTagName("head")[0],
             node = document.createElement(nodeAttr.tag),
             ready = false;
         delete nodeAttr.tag;
         for (var i in nodeAttr)
            node.setAttribute(i, nodeAttr[i]);

         var span = BOOMR.plugins.WS.startSpan('Loading resource: '+nodePath);
         node.onerror = function (exception) {
            span.stop();
            BOOMR.plugins.WS.reportError(exception, "Error loading resource: "+nodePath);
            resource.errback(new Error('attach: cannot load resource: ' + nodePath));
         };

         switch (node.tagName.toUpperCase()) {
            case "LINK":
               require(['native-css!' + nodePath], function() {
                  span.stop();
                  resource.callback();
               }, function(error) {
                  span.stop();
                  BOOMR.plugins.WS.reportError(error, "Error loading resource: "+nodePath);
                  resource.errback(error);
               });
               break;
            case "SCRIPT":
               node.onload = node.onreadystatechange = function () {
                  var state = this.readyState;
                  if (!ready && (!state || state == "loaded" || state == "complete")) {
                     ready = true;
                     node.onload = node.onreadystatechange = null;
                     span.stop();
                     // Такой результат здесь нужен для корректной работы attachComponent,
                     // в случае, если мы сделали сначала attach, а потом attachComponent и он загрузил
                     // тот же файл
                     resource.callback('');
                  }
               };
               head.appendChild(node);
               break;
         }
      } else
         resource.errback(new Error("attach: Unknown resource type specified: " + URL));
   }
});

/**
 * Объект события, приходит в обработчики после {@link $ws.proto.Abstract#_notify}
 * @class
 * @name $ws.proto.EventObject
 */
$ws.proto.EventObject = function(eventName) { this.name = this._eventName = eventName; };
$ws.proto.EventObject.prototype = /** @lends $ws.proto.EventObject.prototype */{
   _isBubbling: true,
   _result: undefined,
   _eventName: null,

   /**
    * Отменить дальнейшую обработку
    */
   cancelBubble: function(){ this._isBubbling = false; },

   /**
    * Будет ли продолжена дальнейшая обработка
    * @returns {Boolean}
    */
   isBubbling: function() { return this._isBubbling; },

   /**
    * Возвращает результат
    * @returns {*}
    */
   getResult: function(){ return this._result; },

   /**
    * Устанавливает результат
    * @param {*} r
    */
   setResult: function(r){ this._result = r; }
};

/**
 * Шина для обмена сообщениями
 *
 * @class $ws.proto.EventBusChannel
 */
$ws.proto.EventBusChannel = (function(){

   var DEFAULT_MAX_LISTENERS = 10;
  /**
   * @alias $ws.proto.EventBusChannel
   */
   function EventBusChannel(cfg) {
      this._events = {};
      this._eventQueue = [];
      this._eventsAllowed = false;
      this._isDestroyed = false;
      this._onceEvents = {};
      // Очередь нотификаций события для отложенной подписки. Обрабатывается слева-на-право. 0 индекс будет взят первым
      this._notificationQueue = {};
      this._queueSize = {};
      this._waitForPermit = cfg && cfg.waitForPermit || false;
      this._strictMode = cfg && cfg.strictMode || false;
      this._name = cfg && cfg.name || '';
      this._maxListeners = cfg && cfg.numMaxListeners || DEFAULT_MAX_LISTENERS;

      this.publish('onDestroy');
   }

   /**
    * Возвращает признак того, удалён канал или нет (отработала ли функция destroy).
    * Функция полезна в обработчиках асинхронных вызовов, обращающихся к объектам, которые могли быть удалены за время
    * асинхронного вызова. Удалённый канал обнуляет все свои подписки, и не принимает новых подписок на события.
    * @returns {Boolean} true - объект удалён, false - объект не удалён, функция {@link destroy} не отработала.
    * @example
    * @see destroy
    */
   EventBusChannel.prototype.isDestroyed = function(){
      return this._isDestroyed;
   };

   /**
    * Декларирует наличие у объекта событий
    * События могут быть переданы в виде строки, в виде массива строк.
    */
   EventBusChannel.prototype.publish = function(/*$event*/){
      for (var i = 0, li = arguments.length; i < li; i++){
         var event = arguments[i];
         if (event && !event.charAt) {
            throw new Error('Аргументами функции publish должно быть несколько строк - имён событий');
         }
         this._events[event] = this._events[event] || [];
         this._notificationQueue[event] = this._notificationQueue[event] || [];
      }
      return this;
   };

   /**
    * Задачет длину орчереди для события. Если очередь не нулевая - сохраняется заданное количество последних нотификаций.
    * Новые подписчики получат все события, сохраненные в очереди.
    *
    * @param {String|Object} [event='*'] Название события или '*' для всех событий.
    * Чтобы применить ограничение для всех события можно также позвать метод с одним целочесленным аргументом.
    * Можно передать объект: ключи - события, значение - размер очереди
    * @param {Number} queueLength Желаемая длина очереди
    *
    * @example
    * <pre>
    *    // Событие onFoo - очередь 3
    *    channel.setEventQueueSize('onFoo', 3);
    *    // Для всех событий очередь 5, для onFoo - 3, onBar - 4
    *    channel.setEventQueueSize({
    *       onFoo: 3,
    *       onBar: 4,
    *       '*': 5
    *    });
    *    // Для всех событий очередь 5
    *    channel.setEventQueueSize('*', 5); // эквивалентно следующему
    *    channel.setEventQueueSize(5);
    * </pre>
    */
   EventBusChannel.prototype.setEventQueueSize = function(event, queueLength) {
      var eventList;

      if (typeof event == 'number') {
         queueLength = event;
         event = '*';
      }

      if (typeof event == 'object') {
         $ws.helpers.forEach(event, function(limit, event) {
            this.setEventQueueSize(event, limit);
         }, this);

         return;
      }

      this._queueSize[event] = queueLength;

      if (event == '*') {
         eventList = Object.keys(this._notificationQueue);
      } else {
         eventList = [event];
      }

      $ws.helpers.forEach(eventList, function(event) {
         if (this._notificationQueue[event] && this._notificationQueue[event].length > queueLength) {
            this._notificationQueue[event].slice(0, queueLength);
         }
      }, this);
   };

   EventBusChannel.prototype._notifyToHandler = function(eventName, eventState, handler, args) {
      try {
         if (!eventState) {
            eventState = new $ws.proto.EventObject(eventName);
         }

         args = [].concat(args);
         args.unshift(eventState);
         if (handler && (!handler.ctx || !handler.ctx.isDestroyed || !handler.ctx.isDestroyed())) {
            handler.fn.apply(handler.ctx, args);
         }

         if(!eventState.isBubbling() || !this._events) {
            return false;
         }
      } catch(e) {
         $ws.single.ioc.resolve('ILogger').error(
            (handler.ctx && handler.ctx.describe) ? handler.ctx.describe() : 'Unknown Object',
            'Event handler for "' + eventName + '" returned error: ' + e.message,
            e);
      }
   };

   /**
    * Извещает всех подписантов события
    * Все аргументы после имени события будут переданы подписантам.
    * @param {string} event Имя события.
    * @param [arg1, [...]] Параметры, получаемые подписантами.
    * @returns {Boolean|String|Object} Результат выполнения цепочки.
    */
   EventBusChannel.prototype.notify = function(event/*, payload*/){
      var
         result = undefined,
         queueLimit = this._queueSize[event] || this._queueSize['*'] || 0,
         args, notifyQueue, eventState, eventSaved;

      if(this._waitForPermit && !this._eventsAllowed) {
         this._eventQueue.push(Array.prototype.slice.call(arguments));
      }
      else {
         var handlers = this._events[event], ln;

         if (!handlers) {
            if (this._strictMode) {
               throw new Error('Event "' + event + '" have not published yet');
            }
            else {
               handlers = [];
               this._events[event] = handlers;
            }
         }

         ln = handlers.length;
         if (ln !== 0) {

            // Первый аргумент сейчас - имя события. Извлечем его отсюда
            args = Array.prototype.slice.call(arguments),
            args.shift();

            eventSaved = event;
            eventState = new $ws.proto.EventObject(event);

            for(var i = 0; i < ln; i++) {
               if(this._notifyToHandler(eventSaved, eventState, handlers[i], args) === false) {
                  break;
               }
            }
            result = eventState.getResult();
         }

         // Если включена запись нотификаций для событий...
         if (queueLimit > 0) {
            notifyQueue = (this._notificationQueue[event] = this._notificationQueue[event] || [])
            // Если в очереди накопилось больше чем положено
            if (notifyQueue.length >= queueLimit) {
               // Уберем первый элемент
               notifyQueue.shift();
            }
            // Добавим новый в конец очереди
            if (!args) {
               // Первый аргумент сейчас - имя события. Извлечем его отсюда
               args = Array.prototype.slice.call(arguments),
               args.shift();
            }

            notifyQueue.push(args);
         }
      }
      return result;
   },

   /**
    * Показывает, включена ли отсылка событий.
    * Если она отключена, то при вызовах notify события будут накапливаться в очереди, и отсылаться
    * после вызова метода allowEvents. Подробнее см. метод allowEvents.
    * @returns {boolean}
    */
   EventBusChannel.prototype.eventsAllowed = function() {
      return this._eventsAllowed;
   };

   /**
    * Включает отсылку событий, и отсылает все события, скопленные до вызова этого метода, пока отсылка была выключена.
    * Откладывание отсылки событий используется при конструировании контролов, чтобы события остылались после окончания работы всей
    * цепочки конструкторов по иерархии наследования.
    */
   EventBusChannel.prototype.allowEvents = function(){
      if(this._eventsAllowed === false) {
         this._eventsAllowed = true;
         for(var i = 0, l = this._eventQueue.length; i < l; i++){
            this.notify.apply(this, this._eventQueue[i]);
         }
         this._eventQueue.length = 0;
      }
   };

   /**
    * <wiTag group="Управление">
    * Выполнит обработчик события единожды
    * @param {String} event Имя события, при котором следует выполнить обработчик.
    * @param {Function} handler Функция-обработчик события.
    * @param {Object} ctx Контекст, в котором выполнится обработчик.
    * <pre>
    *    eventBusChannel.once('onSome', function(event){
    *       //do smth
    *    });
    * </pre>
    */
   EventBusChannel.prototype.once = function(event, handler, ctx, first) {
      function handlerWrapper() {
         self._unsubscribeFromOnce(event, handler, ctx, handlerWrapper);
         handler.apply(this, arguments);
      }

      var
         self = this,
         object = {
            handler: handler,
            ctx: ctx,
            wrapper: handlerWrapper
         };

      if(!this._onceEvents[event]) {
         this._onceEvents[event] = [];
      }
      this._onceEvents[event].push(object);
      
      return this.subscribe(event, handlerWrapper, ctx, first);
   };
   /**
    * <wiTag group="Управление">
    * Добавить обработчик на событие.
    * Подписывает делегата на указанное событие текущего объекта.
    * @param {String} event Имя события, на которое следует подписать обработчик.
    * @param {Function} handler Функция-делегат, обработчик события.
    * @param {Object} ctx Контекст, в котором выполнится обработчик.
    * @throws Error Выкидывает исключение при отсутствии события и передаче делегата не-функции.
    * @example
    * <pre>
    *    eventBusChannel.subscribe('onSome', function(event){
    *       //do smth
    *    });
    * </pre>
    */
   EventBusChannel.prototype.subscribe = function(event, handler, ctx, first){

      var handlerObject;

      if (this._isDestroyed) {
         throw new Error("Trying to subscribe event '" + event + "', but EventBusChannel is destroyed");
      } else if (this._strictMode && !(event in this._events)) {
         throw new Error("Event '" + event + "' is not registered");
      } else {
         if (typeof handler === 'function'){
            /**
             * Да, ты совершенно прав. Этот код делает ничего.
             *
             * Это костыль против бага оптимизирующегно компилятора в Chrome 33 версии.
             * Оптимизация, а затем де-оптимизация кода приводила к том, что в момент деоптимизации
             * все шло не так как было задумано и толи с массива пропадает push толи массив перестает быть массивом...
             *
             * Блок кода ниже не дает компилятору оптимизировать код из-за наличия arguments
             *
             * Это необходимо выпилить после того, как Chrome 33 пропадет с наших радаров...
             */
           /* if (arguments[100]) {
               void(0);
            }*/

            handlerObject = {
               fn : handler,
               ctx : ctx
            };

            this._events[event] = this._events[event] || [];
            this._events[event].push(handlerObject);

            if (false && this._events[event].length > this._maxListeners) {
               $ws.single.ioc.resolve('ILogger').error(
                     'EventBusChannel',
                     'Потенциальная проблема производительности! ' +
                     'На событие "' + event + '" канала "' + (this._name || 'noname') + '" добавлено слишком много обработчиков!');
            }

            if (this._notificationQueue[event] && this._notificationQueue[event].length) {
               $ws.helpers.forEach(this._notificationQueue[event], function(args) {
                  this._notifyToHandler(event, null, handlerObject, args);
               }, this);
            }

            return this;
         } else {
            throw new TypeError("Event '" + event + "' has unexpected handler");
         }
      }
   };

   /**
    * Отписаться от обработчиков, добавленных через once
    * @param {String}   event       Имя события.
    * @param {Function} handler     Функция-обработчик события.
    * @param {Object}   [ctx]       Контекст, в котором выполнялся обработчик.
    * @param {Function} [wrapper]   Сама обёртка, если отписываемся из уже стрельнувшего через once события.
    * @private
    */
   EventBusChannel.prototype._unsubscribeFromOnce = function(event, handler, ctx, wrapper) {
      var
         i, elem,
         events = this._onceEvents[event],
         found = [];
      if(!events) {
         return;
      }
      for(i = 0; i < events.length; ++i) {
         elem = events[i];
         if(elem.handler === handler && (!ctx || elem.ctx === ctx) && (!wrapper || wrapper === elem.wrapper)) {
            found.push(i);
         }
      }
      for(i = found.length - 1; i >= 0; --i) {
         this.unsubscribe(event, events[found[i]].wrapper, ctx);
         this._onceEvents[event].splice(found[i],1);
      }
   };

   /**
    * <wiTag group="Управление">
    * Снять подписку заданного обработчика с заданного события
    * @param {String} event Имя события.
    * @param {Function} handler Функция-обработчик события.
    * @param {Object} [ctx] Контекст, в котором выполнялся обработчик.
    * <pre>
    *    eventBusChannel.unsubscribe('onSome', function(event){
    *       //do smth
    *    });
    * </pre>
    */
   EventBusChannel.prototype.unsubscribe = function(event, handler, ctx) {
      if (!handler || typeof handler !== 'function'){
         throw new TypeError("Unsubscribe: second argument is not a function");
      }
      var handlers = this._strictMode ? this._events[event] : this._events[event] = this._events[event] || [];
      if (handlers) {
         this._unsubscribeFromOnce(event, handler, ctx);
         handlers = this._events[event];
         var newHandlers, i, last, ln;
         for (i = 0, ln = handlers.length; i !== ln; i++) {
            if (handlers[i]["fn"] === handler && (handlers[i]["ctx"] && ctx ? handlers[i]["ctx"] === ctx : true)) {
               newHandlers = handlers.slice(0, i);

               i++;
               last = i;
               for (; i !== ln; i++) {
                  if (handlers[i]["fn"] === handler && (handlers[i]["ctx"] && ctx ? handlers[i]["ctx"] === ctx : true)) {
                     if (last !== i)
                        newHandlers = newHandlers.concat(handlers.slice(last, i));
                     last = i + 1;
                  }
               }

               if (last !== ln) {
                  newHandlers = newHandlers.concat(handlers.slice(last, ln));
               }

               this._events[event] = newHandlers;
               break;
            }
         }

         return this;
      } else {
         throw new Error("Event '" + event + "' is not registered");
      }
   };

   /**
    * <wiTag group="Управление">
    * Возвращает имя канала
    * @returns {String} Возвращает имя контрола, на который применили метод.
    * @example
    * <pre>
    *     class.getName();
    * </pre>
    */
   EventBusChannel.prototype.getName = function(){
      return this._name;
   };

   EventBusChannel.prototype.destroy = function(){
      this.notify('onDestroy');

      $ws.helpers.forEach(this._events, function (handlers, eventName, events) {
         if (events[eventName]) {
            events[eventName].length = 0;
         }
      });
      if (this._name) {
         $ws.single.EventBus.removeChannel(this._name);
      }
      this._isDestroyed = true;
   };

   /**
    * <wiTag group="Управление">
    * Снимает все обработчики с указанного события
    * @param {String} event Имя события.
    * <pre>
    *    eventBusChannel.unbind('onSome');
    * </pre>
    */
   EventBusChannel.prototype.unbind = function(event){
      this._events[event] = [];

      return this;
   };

   /**
    * <wiTag group="Управление">
    * Проверка наличия указанного события
    * @param {String} name Имя события.
    * @return {Boolean} Есть("true") или нет("false") событие у класса.
    * <pre>
    *    if(eventBusChannel.hasEvent('onSome'))
    *       eventBusChannel.unbind('onSome');
    * </pre>
    */
   EventBusChannel.prototype.hasEvent = function(name){
      return !this._strictMode || this._events && !!this._events[name];
   };

   /**
    * <wiTag group="Управление">
    * Возвращает список зарегистрированных событий
    * @return {Array} Массив зарегистрированных событий.
    * @example
    * <pre>
    *     eventBusChannel.getEvents();
    * </pre>
    */
   EventBusChannel.prototype.getEvents = function(){
      return Object.keys(this._events);
   };

   /**
    * <wiTag group="Управление">
    * Проверка наличия обработчиков на указанное событие
    * @param {String} name Имя события.
    * @return {Boolean} Есть("true") или нет("false") обработчики.
    * @example
    * <pre>
    *     class.hasEventHandlers();
    * </pre>
    */
   EventBusChannel.prototype.hasEventHandlers = function(name){
      return !!this._events[name] && this._events[name].length > 0;
   };

   /**
    * <wiTag group="Управление">
    * Получение списка обработчиков, подписанных на событие
    * @param {String} name Имя события.
    * @return {Array} Массив функций-обработчиков.
    * @example
    * <pre>
    *     var handlers = eventBusChannel.getEventHandlers('onSomeEvent');
    *     log('Событие onSomeEvent имеет ' + handlers.length + ' обработчиков');
    * </pre>
    */
   EventBusChannel.prototype.getEventHandlers = function(name){
      return $ws.helpers.map(this._events[name] || [], function(i){ return i.fn });
   };

   return EventBusChannel;

})();



/**
 * @class $ws.single.EventBus
 * @single
 */
$ws.single.EventBus = /** @lends $ws.single.EventBus */{
   _channels : {},
   /**
    * Возвращает канал с указанным именем, если он есть, в противном случае создает новый
    * <wiTag group="Управление">
    * @param [name] - имя канала.
    * @param [options] - опции канала.
    * @returns {$ws.proto.EventBusChannel}
    */
   channel : function(name, options){
      var channel;

      if (arguments.length == 1 && typeof name == "object"){
         options = name;
         name = '';
      }

      if (name) {
         options = options || {};
         options.name = name;

         return this._channels[name] = this._channels[name] || new $ws.proto.EventBusChannel(options);
      } else {
         return new $ws.proto.EventBusChannel(options);
      }
   },
   /**
    * Удаляет канал с указанным именем
    * <wiTag group="Управление">
    * @param {String} name имя канала.
    */
   removeChannel : function(name){
      delete this._channels[name];
   },
   /**
    * Проверяет наличие канала с указанным имененм
    * <wiTag group="Управление">
    * @param {String} name имя канала.
    * @returns {Boolean}
    */
   hasChannel: function(name){
      return this._channels[name] !== undefined;
   },

   /**
    * Отдаёт "глобальный" канал, в котором дублируются все события контролов, и сигналятся некоторые "глобальные" события,
    * происходящие при изменении некоторых параметров документа, могущих повлиять на позиции некоторых контролов, например, лежащих в body.
    * Подробное описание смотри в объекте $ws.single.EventBusGlobalChannel.
    * @returns {$ws.proto.EventBusChannel}
    */
   globalChannel: function() {
      return $ws.single.EventBus.channel('Global');
   }
};

/**
 * "Глобальный" канал, в котором дублируются все события контролов, и сигналятся некоторые "глобальные" события,
 * происходящие при изменении некоторых параметров документа, могущих повлиять на позиции некоторых контролов, например, лежащих в body.
 * Этот объект здесь объявлен только для удобства документирования, поскольку в описании метода $ws.single.EventBus.globalChannel
 * нельзя указать события.
 * @type {$ws.proto.EventBusChannel}
 */
/**
 * @lends $ws.single.EventBusGlobalChannel
 * @event onBodyMarkupChanged Событие, возникающее при изменении внутренних размеров body или каких-то других элементов
 * вёрстки, заданных в html-шаблоне (не в компонентах). Такие изменения происходят, например, при показе или скрытии стека панелей:
 * у body меняется margin и overflow-y. Некоторым контролам может потребоваться при этом изменении подогнать свою позицию под новые
 * параметры вёрстки body.
 */
$ws.single.EventBusGlobalChannel = $ws.single.EventBus.globalChannel();

/**
 * Абстрактный класс.
 * Здесь живет событийная модель.
 * Все, кому нужны события, должны наследоваться от него.
 *
 * EventObject
 * В обработчик события первым параметром ВСЕГДА приходит объект, используя который можно работать с текущим событием.
 * Событию можно запретить всплытие(Bubbling) и сменить результат.
 * В зависимости от результата оно продолжит выполняться дальше, либо перестанет.
 * Интерфейс EventObject:
 * void     cancelBubble()    - метод, запрещающий дальнейшее всплытие.
 * boolean  isBubbling()      - получение статуса всплытия.
 * boolean  getResult()       - получение результата события.
 * void     setResult(result) - смена результата события.
 *
 * @class $ws.proto.Abstract
 */
$ws.proto.Abstract = $ws.core.extend({}, /** @lends $ws.proto.Abstract.prototype */{
   /**
    * @event onInit При инициализации класса
    * Событие, возникающее непосредственно после построения экземпляра класса через attachInstance.
    * <wiTag group="Управление">
    * @param {$ws.proto.EventObject} eventObject Дескриптор события.
    * @return Результат не обрабатывается.
    * @example
    * 1. При инициализации класса вывести об этом информацию в элемент с идентификатором status.
    * <pre>
    *    onInit: function(eventObject) {
    *       $('#status').html('Инициализация прошла успешно');
    *    }
    * </pre>
    *
    * 2. При инициализации контрола проверить значение поля контекста.
    * При необходимости запретить пользователю взаимодействовать с контролом.
    * <pre>
    *    control.subscribe('onInit', function(eventObject) {
    *       var value = this.getLinkedContext().getValue('РазрешеноРедактирование');
    *       this.setEnabled(!!value);
    *    });
    * </pre>
    */
   /**
    * @event onReady При готовности класса
    * Событие, возникающее при готовности класса, что означает:
    * 1. С экземпляром класса уже можно полноценно работать.
    * 2. Все дочерние элементы построены и доступны для взаимодействия.
    * <wiTag group="Управление">
    * @param {$ws.proto.EventObject} eventObject Дескриптор события.
    * @return Результат не обрабатывается.
    * @example
    * 1. При готовности класса вывести об этом информацию в элемент с идентификатором status.
    * <pre>
    *    onReady: function(eventObject) {
    *       $('#status').html('Готовность к работе');
    *    }
    * </pre>
    *
    * 2. При готовности табличного браузера (tableView) изменить фильтр.
    * <pre>
    *    tableView.subscribe('onReady', function(eventObject) {
    *       this.setQuery({'Тип': 'Все'});
    *    });
    * </pre>
    *
    * 3. При готовности контрола (control) установить открытие группы аккордеона в верхней позиции.
    * <pre>
    *    control.subscribe('onReady', function(eventObject) {
    *       this.getChildControlByName('Аккордеон').setDragToTop(true);
    *    });
    * </pre>
    */
   /**
    * @event onDestroy При уничтожении экземпляра класса
    * Событие, возникающее при уничтожении экземпляра класса.
    * Происходит, например, при закрытии страницы или смене шаблона области по шаблону.
    * <wiTag group="Управление">
    * @param {$ws.proto.EventObject} eventObject Дескриптор события.
    * @return Результат не обрабатывается.
    * @example
    * 1. При уничтожении экземпляра класса вывести об этом информацию в элемент с идентификатором status.
    * <pre>
    *    onDestroy: function(eventObject) {
    *       $('#status').html('Экземпляр класса уничтожен');
    *    }
    * </pre>
    *
    * 2. При смене шаблона Области по шаблону (template) сбросить группу флагов (groupCheckbox) к значениям по умолчанию.
    * <pre>
    *    template.subscribe('onDestroy', function(eventObject) {
    *       var value = groupCheckbox.getDefaultValue();
    *       groupCheckbox.setValue(value);
    *    });
    * </pre>
    */
   $protected: {
      _eventBusChannel : null,
      _isDestroyed : false,
      /**
       * Показывает, окончен ли процесс конструирования и инициализации этого объекта.
       */
      _isInitialized: false,
      /**
       * @cfg {object} handlers Обработчики событий
       * <wiTag group="Управление">
       * Обработчик - это функция, выполняемая при возникновении определённого события.
       *
       * При каждом событии может существовать несколько обработчиков.
       * В таком случае они будут выполняться последовательно, согласно порядку их объявления.
       *
       * @example
       * Изменить подпись флага в зависимости от его состояния.
       * <pre>
       *    $ws.core.attachInstance('SBIS3.CORE.FieldCheckbox', {
       *       element: 'left2',
       *       name: 'Флаг3',
       *       cssClassName: 'classic',
       *       tabindex: 4,
       *       caption: 'Изменить текст подписи флага?',
       *       handlers: {
       *          //обработчик получает значение флага, в которое его установили
       *          onValueChange: function(event, value) {
       *             this.setCaption(value ? 'Текст подписи флага изменён!' : 'Изменить текст подписи флага?');
       *          }
       *       }
       *    });
       * </pre>
       */
      _handlers : {},
      _subscriptions: [],
      _subDestroyControls: [],

      _options : {
         eventBusId : null
      }
   },
   $constructor : function(cfg){
      if (cfg && cfg.handlers && typeof cfg.handlers == "object"){
         this._handlers = cfg.handlers;
      }
      this._publish('onInit', 'onInitComplete', 'onReady', 'onDestroy');
   },

   /**
    * Подписка на событие у другого контрола (или канала событий - см. EventBusChannel), с автоматической отпиской при
    * разрушении объекта, который подписывается, или того, на чьё событие происходит подписка.
    * @param {$ws.proto.Abstract|$ws.proto.Control|$ws.proto.EventBusChannel} control Объект, на чьё событие происходит подписка
    * @param {String} event Событие
    * @param {Function} handler Обработчик
    */
   subscribeTo: function(control, event, handler) {
      this._subscribeTo(control, event, handler, false);
   },

   /**
    * Подписка на событие у другого контрола (или канала событий - см. EventBusChannel), с автоматической отпиской
    * после срабатывания события, а также при разрушении объекта, который подписывается, или того, на чьё событие происходит подписка.
    * @param {$ws.proto.Abstract|$ws.proto.Control|$ws.proto.EventBusChannel} control Объект, на чьё событие происходит подписка
    * @param {String} event Событие
    * @param {Function} handler Обработчик
    */
   subscribeOnceTo: function(control, event, handler) {
      this._subscribeTo(control, event, handler, true);
   },

   _subscribeTo: function(control, event, handler, once) {
      if (!control.isDestroyed() && !this.isDestroyed()) {
         if (typeof handler !== 'function'){
            throw new Error("Аргумент handler у метода subscribeTo должен быть функцией");
         }

         var sub, onceWrapper, contr;
         control[once ? 'once' : 'subscribe'](event, handler);

         if (once) {
            onceWrapper = function() {
               this._unsubscribeFrom(control, event, handler, onceWrapper);
            }.bind(this);

            this._subscriptions.push({
               handler: handler,
               control: control,
               event: event,
               onceWrapper: onceWrapper
            });

            control.once(event, onceWrapper);
         }
         else {
            sub = $ws.helpers.find(this._subscriptions, function (sub) {
               return sub.control === control && sub.handler === handler &&
                      sub.event   === event   && sub.onceWrapper === undefined;
            });

            if (!sub) {
               this._subscriptions.push({
                  handler: handler,
                  control: control,
                  event: event
               });
            }
         }

         contr = $ws.helpers.find(this._subDestroyControls, function(sub) {
            return sub.control === control;
         });

         if (!contr) {
            var onDestroy = function() {
               this.unsubscribeFrom(control);
            }.bind(this);
            this._subDestroyControls.push({control: control, handler: onDestroy});

            //тут я ожидаю, что отписка внутри notify('onDestroy') не испортит уже выполняющуюся цепочку onDestroy
            //(см. EventBusChannel.notify) - иначе пользовательские onDestroy, подписанные после служебного onDestroy,
            //не выполнятся, поскольку служебный onDestroy отписывает все мои обработчики всех событий этого контрола.
            control.subscribe('onDestroy', onDestroy);
         }
      }
   },

   /**
    * Отписка от события объекта, на которое была подписка методом subscribeTo.
    * @param {$ws.proto.Abstract|$ws.proto.Control|$ws.proto.EventBusChannel} [control] Объект, от чьего события происходит отписка.
    * Если не указан, то отписка пойдёт по всем подписанным контролам по параметрам event и handler.
    * @param {String} [event] Событие. Если не указано, то будет отписка от всех событий объекта, указанного в параметре control,
    * или всех подписанных объектов (если параметр control не передан)
    * Если при этом указан обработчик - аргумент handler,
    * то отписан от всех подписанных событий будет именно этот обработчик, а остальные, если они есть, останутся.
    * @param {Function} [handler] Обработчик. Если не указан, то будут отписаны все обработчики события,
    * указанного в аргументе event, или вообще все обработчики всех событий, если аргумент event не задан.
    */
   unsubscribeFrom: function(control, event, handler) {
      this._unsubscribeFrom(control, event, handler);
   },

   _unsubscribeFrom: function(control, event, handler, onceWrapper) {
      var self = this;

      function filterSubs(needUnsub) {
         return $ws.helpers.filter(self._subscriptions, function(sub) {
            var ok = (control === undefined || control === sub.control) &&
                     (event   === undefined || event   === sub.event)   &&
                     (handler === undefined || handler === sub.handler) &&
                     (onceWrapper === undefined || onceWrapper === sub.onceWrapper);

            return needUnsub ? ok : !ok;
         });
      }

      function filterControlDestroys(needUnsub) {
         return $ws.helpers.filter(self._subDestroyControls, function(controlSub) {
            var ok = !$ws.helpers.find(self._subscriptions, function (sub) {
               return sub.control === controlSub.control;
            });
            return needUnsub ? ok : !ok;
         });
      }

      var unsubs = filterSubs(true);

      this._subscriptions = filterSubs(false);

      //если _unsubscribeFrom вызывается из onceWrapper (см. subscribeTo+once), то источник - sub.control
      //уже сам отписал обработчики у себя, и приёмнику отписываться не надо (и нельзя, потому что тогда источник отпишет не once-обработчики с таким вот handler)
      if (!onceWrapper) {
         $ws.helpers.forEach(unsubs, function (sub) {
            if (!sub.control.isDestroyed()) {
               sub.control.unsubscribe(sub.event, sub.handler);
            }
         });
      }

      //оставляем те обработчики удаления контрола, для которых есть какие-то подписки на этот контрол
      var unsubControls = filterControlDestroys(true);
      this._subDestroyControls = filterControlDestroys(false);

      $ws.helpers.forEach(unsubControls, function(sub) {
         if (!sub.control.isDestroyed()) {
            sub.control.unsubscribe('onDestroy', sub.handler);
         }
      });
   },

   _getChannel: function() {
      if (!this._eventBusChannel) {
         this._eventBusChannel = $ws.single.EventBus.channel(this._options.eventBusId, {
            waitForPermit: true
         });
      }
      return this._eventBusChannel;
   },
   /**
    * <wiTag group="Управление">
    * Возвращает признак того, удалён объект или нет (отработала ли функция destroy).
    * Функция полезна в обработчиках асинхронных вызовов, обращающихся к объектам, которые могли быть удалены за время
    * асинхронного вызова.
    * @returns {Boolean} true - объект удалён, false - объект не удалён, функция {@link destroy} не отработала.
    * @example
    * <pre>
    *     var FloatArea = testFloatArea,
    *        bl = testBLogic;
    *     bl.addCallback(function() {
    *         if(!FloatArea.isDestroyed()) {
    *         //Если юзер не закрыл окошко, то грузим новый шаблон
    *            bodyArea.setTemplate('загрузили шаблон Б');
    *        }
    *     });
    * </pre>
    * @see destroy
    */
   isDestroyed: function() {
      return this._isDestroyed;
   },

   /**
    * <wiTag group="Управление" noShow>
    * Метод инициализации класса.
    * @see describe
    * @see destroy
    */
   init: function() {
      // В момент вызова init() события отложены
      // После отработки метода init конструирующая функция ($ws.core.extend) вызовет _initComplete,
      // а потом запустит отложенные события через _allowEvents()
      this._notify('onInit');
   },
   /**
    * Этот метод вызывается конструирующей функцией ($ws.core.extend) тогда, когда отработали init всех классов в цепочке наследования,
    * контрол совсем готов, его можно класть в ControlStorage, и запускать его отложенные события.
    *
    * @protected
    */
   _initComplete: function() {
   },

   _constructionDone: function() {
      this._notify('onInitComplete');
   },

   /**
    * <wiTag group="Управление" noShow>
    * Получить описание класса.
    * Удобно использовать для логгирования ошибок.
    * @returns {String} "Описание" класса.
    * @example
    * <pre>
    *    onDestroy: function(){
    *       $ws.single.ioc.resolve('ILogger').log('Error', 'Class ' + myClass.describe() + ' destroyed');
    *    }
    * </pre>
    * @see init
    * @see destroy
    */
   describe: function() {
      return 'Abstract';
   },
   /**
    * Декларирует наличие у объекта событий
    * События могут быть переданы в виде строки, в виде массива строк.
    */
   _publish : function(/*$event*/){
      for (var i = 0, li = arguments.length; i < li; i++){
         var event = arguments[i], handlers = this._handlers[event], j, lh;
         if (handlers){
            if (typeof handlers === 'function') {
               this._getChannel().subscribe(event, handlers, this);
               this._handlers[event] = null;
            }
            else {
               lh = handlers.length;
               if (lh) {
                  for (j = 0; j < lh; j++) {
                     this._getChannel().subscribe(event, handlers[j], this);
                  }
                  this._handlers[event].length = 0;
               }
            }
         }
      }
   },
   /**
    * Извещает всех подписантов события
    * Все аргументы после имени события будут переданы подписантам.
    * @param {string} event Имя события.
    * @param [arg1, [...]] Параметры, получаемые подписантами.
    * @returns {*} Результат выполнения цепочки.
    */
   _notify : function(event/*, payload*/){
      var channel = this._getChannel();
      var result = channel.notify.apply(channel, arguments),
          globalChannel = $ws.single.EventBus.globalChannel();

      globalChannel.notify.apply(globalChannel, arguments);
      return result;
   },

   /**
    * Включает отсылку событий.
    * Подробнее см. метод $ws.proto.EventBusChannel.allowEvents.
    */
   _allowEvents: function(){
      this._getChannel().allowEvents();
   },

   /**
    * Показывает, включена ли отсылка событий.
    * Подробнее см. метод $ws.proto.EventBusChannel.eventsAllowed.
    * @returns {boolean}
    */
   _eventsAllowed: function(){
      return this._getChannel().eventsAllowed();
   },

   /**
    * <wiTag group="Управление">
    * Выполнить обработчик события единожды.
    * @param {String} event Имя события, при котором следует выполнить обработчик.
    * @param {Function} handler Обработчик события.
    * @example
    * Отправить подписчикам первый DOM-элемент, над которым откроется Инфобокс.
    * <pre>
    *     $ws.single.Infobox.once('onShow', function() {
    *        this._notify('onFirstShow', this.getCurrentTarget());
    *     });
    * </pre>
    * @see unsubscribe
    * @see unbind
    * @see getEvents
    * @see hasEvent
    * @see getEventHandlers
    * @see hasEventHandlers
    */
   once : function(event, handler) {
      this._getChannel().once(event, handler, this);
   },
   /**
    * Добавить обработчик на событие контрола.
    * <wiTag group="Управление">
    * @param {String} event Имя события.
    * @param {Function} $handler Обработчик события.
    * @throws {Error} Выкидывает исключение при отсутствии события и передаче делегата не функции.
    * @return {$ws.proto.Abstract} Экземпляр класса.
    * @example
    * При клике на кнопку (btn) восстановить начальное состояние группы флагов (groupCheckbox).
    * <pre>
    *    btn.subscribe('onClick', function() {
    *       var record = groupCheckbox.getDefaultValue();
    *       groupCheckbox.setValue(record);
    *    });
    * </pre>
    * @see once
    * @see unsubscribe
    * @see unbind
    * @see getEvents
    * @see hasEvent
    * @see getEventHandlers
    * @see hasEventHandlers
    */
   subscribe : function(event, $handler){
      this._getChannel().subscribe(event, $handler, this);
      return this;
   },
   /**
    * <wiTag group="Управление">
    * Снять обработчик с указанного события.
    * @param {String} event Имя события.
    * @param {Function} handler Обработчик события.
    * @return {$ws.proto.Abstract} Экземпляр класса.
    * @example
    * Задать/снять обработчик клика по кнопке (btn) в зависимости от значения флага (fieldCheckbox).
    * <pre>
    *    var handler = function() {
    *       //некая функция
    *    };
    *    fieldCheckbox.subscribe('onChange', function(eventObject, value) {
    *       if (value) {
    *          btn.subscribe('onClick', handler);
    *       } else {
    *          btn.unsubscribe('onClick', handler);
    *       }
    *    });
    * </pre>
    * @see once
    * @see subscribe
    * @see unbind
    * @see getEvents
    * @see hasEvent
    * @see getEventHandlers
    * @see hasEventHandlers
    */
   unsubscribe: function(event, handler) {
      this._getChannel().unsubscribe(event, handler);
      return this;
   },
   /**
    *  <wiTag group="Управление">
    * Снять все обработчики с указанного события.
    * @param {String} event Имя события.
    * @return {$ws.proto.Abstract} Экземпляр класса.
    * @example
    * При клике на кнопку (btn) снять все обработчики c события onSome.
    * <pre>
    *    btn.subscribe('onClick', function() {
    *       this.getParent().unbind('onSome');
    *    });
    * </pre>
    * @see once
    * @see subscribe
    * @see unsubscribe
    * @see getEvents
    * @see hasEvent
    * @see getEventHandlers
    * @see hasEventHandlers
    */
   unbind: function(event) {
      this._getChannel().unbind(event);
      return this;
   },
   /**
    * <wiTag group="Управление">
    * Разрушить экземпляр класса.
    * @example
    * При клике на кнопку (btn) уничтожить один из контролов.
    * <pre>
    *    btn.subscribe('onClick', function()
    *       control.destroy();
    *    }):
    * </pre>
    * @see init
    * @see describe
    * @see isDestroyed
    */
   destroy: function() {
      if (this._eventBusChannel) {
         //Канал сам сделает notify('onDestroy')
         this._eventBusChannel.destroy();
      }

      this.unsubscribeFrom();//Отписываемся ото всего у всех, на кого подписались

      this._handlers = {};
      this._isDestroyed = true;
   },
   /**
    * <wiTag group="Управление">
    * Получить список событий контрола.
    * @return {Array} Массив, в котором каждый элемент - это имя события.
    * @example
    * Передать подписчикам список событий контрола.
    * <pre>
    *    control.subscribe('onReady', function() {
    *       var events = this.getEvents(),
    *           flag,
    *           eventName;
    *       $ws.helpers.forEach(events, function(element, index, array) {
    *          flag = element == eventName ? true : false;
    *       });
    *       if (!flag) {
    *          this.subscribe(eventName, function() {
    *             //какой-то функционал
    *          });
    *       }
    *    });
    * </pre>
    * @see once
    * @see subscribe
    * @see unsubscribe
    * @see unbind
    * @see hasEvent
    * @see getEventHandlers
    * @see hasEventHandlers
    */
   getEvents: function() {
      return this._getChannel().getEvents();
   },
   /**
    * <wiTag group="Управление">
    * Проверить наличие указанного события у контрола.
    * @param {String} name Имя события.
    * @return {Boolean} Признак: событие присутствует (true) или нет (false).
    * @example
    * Снять обработчики с события, если оно определено для контрола.
    * <pre>
    *    control.subscribe('onReady', function() {
    *       if (this.hasEvent('onSome')) {
    *          this.unbind('onSome');
    *       }
    *    });
    * </pre>
    * @see once
    * @see subscribe
    * @see unsubscribe
    * @see unbind
    * @see getEvents
    * @see getEventHandlers
    * @see hasEventHandlers
    */
   hasEvent : function(name){
      return this._getChannel().hasEvent(name);
   },
   /**
    * <wiTag group="Управление">
    * Проверить наличие обработчиков на указанное событие у контрола.
    * @param {String} name Имя события.
    * @return {Boolean} Признак: обработчики присутствуют (true) или нет (false).
    * @example
    * Если для контрола определены обработчики на указанное событие, снять их.
    * <pre>
    *    control.subscribe('onReady', function() {
    *       if (this.hasEventHandlers('onSome')) {
    *          this.unbind('onSome');
    *       }
    *    });
    * </pre>
    * @see once
    * @see subscribe
    * @see unsubscribe
    * @see unbind
    * @see hasEvent
    * @see getEvents
    * @see getEventHandlers
    */
   hasEventHandlers : function(name){
      return this._getChannel().hasEventHandlers(name);
   },
   /**
    * <wiTag group="Управление">
    * Получить обработчики указанного события у контрола.
    * @param {String} name Имя события.
    * @returns {Array} Массив, в котором каждый элемент - это обработчик указанного события.
    * @example
    * Передать подписчикам контрола обработчики события onSome.
    * @example
    * <pre>
    *    var handlers = object.getEventHandlers('onSomeEvent'),
    *        handler = function() {
    *           //do something
    *        };
    *    //проверим подписаны ли мы уже на это событие.
    *    //если нет, то подписываемся.
    *    if (Array.indexOf(handlers, handler) === -1) {
    *       object.subscribe('onSomeEvent', handler);
    *    }
    * </pre>
    * @see once
    * @see subscribe
    * @see unsubscribe
    * @see unbind
    * @see hasEvent
    * @see getEvents
    * @see hasEventHandlers
    */
   getEventHandlers : function(name){
      return this._getChannel().getEventHandlers(name);
   }
});

/**
 * Реализация класса Deferred
 * Абстрактное асинхронное событие, может произойти, может сгенерировать ошибку.
 * Подробное описание находится {@link http://wi.sbis.ru/dokuwiki/doku.php/api:deferred здесь}.
 * @class $ws.proto.Deferred
 * @apilevel 4
 */
$ws.proto.Deferred = (function(){
    /**
     * @alias $ws.proto.Deferred
     */
   function Deferred() {
      this._chained = false;
      this._chain = [];
      this._fired = -1;
      this._paused = 0;
      this._results = [ null, null ];
      this._running = false;
      this._logger = null;
   }

   Deferred.prototype._resback = function (res){
      this._fired = ((res instanceof Error) ? 1 : 0);
      this._results[this._fired] = res;
      this._fire();
   };

   Deferred.prototype._check = function (res, isError){
      if(isError === undefined)
         isError = false;
      if (this._fired != -1)
         throw new Error("Deferred is already fired with state '" + (this._fired == 1 ? "error" : "success") + "'");
      if (res instanceof $ws.proto.Deferred)
         throw new Error("Deferred instances can only be chained if they are the result of a callback");
      if(isError && !(res instanceof Error)) {
         res = new Error(res);
         // Исправляем поведение IE8. Error(1) == { number: 1 }, Error("1") == { number: 1 }, Error("x1") == { message: "x1" }
         // Если после создания ошибки в ней есть поле number, содержащее число, а в message - пусто,
         // скастуем к строке и запишем в message
         if(!isNaN(res.number) && !res.message)
            res.message = "" + res.number;
      }
      return res;
   };

   /**
    * Запускает на выполнение цепочку коллбэков.
    * @param [res] результат асинхронной операции, передаваемой в коллбэк.
    * @returns {$ws.proto.Deferred}
    */
   Deferred.prototype.callback = function (res){
      this._resback(this._check(res));
      return this;
   };

   /**
    * Запуск цепочки обработки err-бэков.
    * @param [res] результат асинхронной операции.
    * @returns {$ws.proto.Deferred}
    */
   Deferred.prototype.errback = function (res){
      this._resback(this._check(res, true));
      return this;
   };

   /**
    * Добавляет один коллбэк как на ошибку, так и на успех
    * @param {Function} fn общий коллбэк.
    * @returns {$ws.proto.Deferred}
    */
   Deferred.prototype.addBoth = function (fn){
      if (arguments.length != 1)
         throw new Error("No extra args supported");
      return this.addCallbacks(fn, fn);
   };

   /**
    * Добавляет колбэк на успех
    * @param {Function} fn коллбэк на успех.
    * @returns {$ws.proto.Deferred}
    */
   Deferred.prototype.addCallback = function (fn){
      if (this._fired <= 0){
         if (arguments.length != 1)
            throw new Error("No extra args supported");
         return this.addCallbacks(fn, null);
      }
      else
         return this;
   };

   /**
    * Добавляет колбэк на ошибку
    * @param {Function} fn коллбэк на ошибку.
    * @returns {$ws.proto.Deferred}
    */
   Deferred.prototype.addErrback = function (fn){
      if (arguments.length != 1)
         throw new Error("No extra args supported");
      return this.addCallbacks(null, fn);
   };

   /**
    * Добавляет два коллбэка, один на успешный результат, другой на ошибку
    * @param {Function} cb коллбэк на успешный результат.
    * @param {Function} eb коллбэк на ошибку.
    * @returns {$ws.proto.Deferred}
    */
   Deferred.prototype.addCallbacks = function (cb, eb){
      if (this._chained){
         throw new Error("Chained Deferreds can not be re-used");
      }
      if((cb !== null && typeof(cb) != 'function') || (eb !== null && typeof(eb) != 'function'))
         throw new Error("Both arguments required in addCallbacks");
      this._chain.push([cb, eb]);
      if (this._fired >= 0 && !this._running){
         // не запускаем выполнение цепочки при добавлении нового элемента, если цепочка уже выполняется
         this._fire();
      }
      return this;
   };

   /**
    * Вся логика обработки результата.
    * Вызов коллбэков-еррбэков, поддержка вложенного Deferred
    */
   Deferred.prototype._fire = function (){
      var chain = this._chain;
      var fired = this._fired;
      var res = this._results[fired];
      var self = this;
      var cb = null;
      while (chain.length > 0 && this._paused === 0){
         var pair = chain.shift();
         var f = pair[fired];
         if (f === null)
            continue;
         try{
            this._running = true; // Признак того, что Deferred сейчас выполняет цепочку
            res = f(res);
            fired = ((res instanceof Error) ? 1 : 0);
            if (res instanceof $ws.proto.Deferred){
               cb = function (res){
                  self._resback(res);
                  self._paused--;
                  if ((self._paused === 0) && (self._fired >= 0))
                     self._fire();
               };
               this._paused++;
            }
         } catch (err){
            fired = 1;
            if (!(err instanceof Error))
               err = new Error(err);
            res = err;
            $ws.single.ioc.resolve('ILogger').error("Deferred", "Callback function throwing an error: " + err.message, err);
         } finally {
            this._running = false;
         }
      }
      this._fired = fired;
      this._results[fired] = res;
      if (cb && this._paused){
         res.addBoth(cb);
         res._chained = true;
      }
   };
   /**
    * Объявляет данный текущий Deferred зависимым от другого.
    * Колбэк/Еррбэк текущего Deferred будет вызван при соотвествтующем событии в "мастер"-Deferred.
    *
    * @param {$ws.proto.Deferred} dDependency Deferred, от которого будет зависеть данный.
    * @returns {$ws.proto.Deferred}
    */
   Deferred.prototype.dependOn = function(dDependency){
      var self = this;
      dDependency.addCallbacks(function(v){
         self.callback(v);
         return v;
      }, function(e){
         self.errback(e);
         return e;
      });
      return this;
   };

   /**
    * Создаёт новый Deferred, зависимый от этого.
    * Колбэк/Еррбэк этого Deferred-а будут вызваны при соотвествтующем событии исходного.
    *
    * @returns {$ws.proto.Deferred}
    */
   Deferred.prototype.createDependent = function() {
      var dependent = new $ws.proto.Deferred();
      return dependent.dependOn(this);
   };

   /**
    * @returns {Boolean} Готов или нет этот экземпляр (стрельнул с каким-то результатом)
    */
   Deferred.prototype.isReady = function(){
      return this._fired != -1 && this._paused === 0;
   };

   /**
    * Показывает, не запрещено ли пользоваться методами, добавляющими обработчики: addCallbacks/addCallback/addErrback/addBoth.
    * Не влияет на возможность вызова методов callback/errback.
    * @return {Boolean} true: добавлять обработчики запрещено. false: добавлять обработчики можно.
    */
   Deferred.prototype.isCallbacksLocked = function() {
      return this._chained;
   };

   /**
    * @returns {Boolean} Завершился ли данный экземпляр ошибкой
    */
   Deferred.prototype.isSuccessful = function(){
      return this._fired === 0;
   };

   /**
    * Возвращает текущее значение Deferred.
    * @returns Текущее значение Deferred
    * @throws {Error} Когда значения еще нет.
    */
   Deferred.prototype.getResult = function() {
      if(this.isReady())
         return this._results[this._fired];
      else
         throw new Error("No result at this moment. Deferred is still not ready");
   };
    /**
     * Возвращает Deferred, который завершится успехом через указанное время.
     * @param {Number} delay Значение в миллисекундах.
     * @returns {$ws.proto.Deferred}
     * @example
     * <pre>
     *    //выполнит обработчик через 5 секунд
     *    var def = $ws.proto.Deferred.fromTimer(5000);
     *    def.addCallback(function(){
     *     //код обработчика
     *    });
     * </pre>
     */
   Deferred.fromTimer = function(delay) {
      var d = new $ws.proto.Deferred();
      setTimeout(d.callback.bind(d), delay);
      return d;
   };
    /**
     * Возвращает Deferred, завершившийся успехом.
     * @param {*} result Результат выполнения.
     * @returns {$ws.proto.Deferred}
     * @example
     * <pre>
     *    var def = $ws.proto.Deferred.success('bar');
     *    //выполнит обработчик и передаст в него результат.
     *    def.addCallback(function(res) {
     *       // Выведет в консоль 'bar'
     *       console.log(res);
     *    });
     * </pre>
     */
   Deferred.success = function(result) {
      return new $ws.proto.Deferred().callback(result);
   };
    /**
     * Возвращает Deferred, завершившийся ошибкой.
     * @param result - результат выполнения.
     * @returns {$ws.proto.Deferred}
     * @example
     * <pre>
     *    var def = $ws.proto.Deferred.fail('Bug');
     *    // Выполнит обработчик и передаст в него результат.
     *    def.addErrback(function(err) {
     *       console.log(err.message); // Выведет в консоль 'Bug'
     *    });
     * </pre>
     */
   Deferred.fail = function(result) {
      return new $ws.proto.Deferred().errback(new Error('' + result));
   };
    /**
     * Возвращает Deferred, который завершится успехом или ошибкой, сразу же как завершится успехом или ошибкой любой из переданных Deferred.
     * @param {Array} steps Набор из нескольких отложенных результатов.
     * @returns {$ws.proto.Deferred}
     * @example
     * <pre>
     * var query = (new $ws.proto.BLObject('Клиент')).call('Параметры');
     * // Если запрос к БЛ займёт более 10 секунд, то Deferred завершится успехом, но вернёт undefined в результате.
     * var def = $ws.proto.Deferred.nearestOf([$ws.proto.Deferred.fromTimer(10000), query]);
     * def.addCallback(function(res){
     *    if (res.from === 0) {
     *       // Обработка случая не завершённого запроса к БЛ, занимающего продолжительное время.
     *       $ws.helpers.alert('Ваш запрос обрабатывается слишком долго.');
     *    } else {
     *       var recordSet = res.data;
     *       // Логика обработки полученных данных.
     *    }
     * });
     * def.addErrback(function(res) {
     *   // В res.data придёт экземпляр ошибки, если один из запросов завершился ошибкой.
     * });
     * </pre>
     */
   Deferred.nearestOf = function(steps) {
      var dResult = new $ws.proto.Deferred();

      $ws.helpers.forEach(steps, function(step, key){
         step.addBoth(function(r){
            if (!dResult.isReady()) {
               if (r instanceof Error) {
                  var res = new Error();
                  res.from = key;
                  res.data = r;
                  dResult.errback(res);
               } else {
                  dResult.callback({
                     from: key,
                     data: r
                  });
               }
            }
            return r;
         });
      });

      if (steps.length === 0) {
         dResult.callback();
      }

      return dResult;
   };

   return Deferred;
   
})();



/**
 * Враппер для нескольких Deferred, работающих параллельно.
 * Условием успеха является успешное завершение всех экземпляров.
 *
 * Алгоритм работы:
 * 1. Создать экземпляр, опционально передать в конструктор массив Deferred.
 * 2. Добавить в набор другие Deferred через вызов .push().
 * 3. Получить результирующий Deferred через вызов .getResult(), подписаться на его события.
 * 4. Завершить создание набора через вызов done().
 *
 * <pre>
 *    var parallelDeferred = new $ws.proto.ParallelDeferred({steps: [deferred0, deferred1]});
 *    ...
 *    parallelDeferred.push(deferred2);
 *    ...
 *    parallelDeferred.done().getResult().addCallback(function(){
 *       alert('All done!');
 *    });
 * </pre>
 *
 * @class $ws.proto.ParallelDeferred
 * @apilevel 4.
 * @cfgOld {$ws.proto.Deferred[]} steps.
  */
$ws.proto.ParallelDeferred = $ws.core.extend({}, /** @lends $ws.proto.ParallelDeferred */{
   $protected: {
      _successResult: undefined,
      _ready: false,
      _stepsCount: 0,
      _stepsFinish: 0,
      _stepsSuccess: 0,
      _successHandler: null,
      _errorHandler: null,
      _dResult: null,
      _errors: [],
      _hasError: false,
      _results: {},

      _options : {
          /**
           * @cfg {boolean} Вызов всех обработчиков при первой ошибке, не дожидаясь конца.
           */
         stopOnFirstError : true
      }
   },
   /**
    * @param {Object} cfg
    * @param {$ws.proto.Deferred[]} cfg.steps
    */
   $constructor: function(cfg) {

      this._successHandler = (function(){
         var self = this;
         return function(res){
            if(!self._hasError){
               self._stepsFinish++;
               self._stepsSuccess++;
               self._check();
            }
            return res;
         }
      }).apply(this);

      this._errorHandler = (function(){
         var self = this;
         return function(res){
            if(self._fired === 1 || self._hasError) {
               return res;
            }
            if(self._options.stopOnFirstError) {
               self._hasError = true;
            }
            self._stepsFinish++;
            self._errors.push(res.message);
            self._check();
            return res;
         }
      }).apply(this);

      this._dResult = new $ws.proto.Deferred();

      if(cfg && cfg.steps) {
         $ws.helpers.forEach(cfg.steps, function(deferred, stepId){
            this.push(deferred, stepId);
         }, this);
      }
   },
   /**
    * Добавление Deferred в набор
    * @param {$ws.proto.Deferred} dOperation Асинхронная операция для добавления в набор.
    * @param {String|Number} [stepId]  Идентификатор шага. Результат шага с заданным идентификатором будет помещен в результат ParallelDeferred.
    * @returns {$ws.proto.ParallelDeferred}
    */
   push: function(dOperation, stepId) {
      if(this._ready)
         return this;
      if(dOperation instanceof $ws.proto.Deferred) {

         if (stepId === undefined) {
            stepId = this._stepsCount;
         }

         if (this._results.hasOwnProperty(stepId)) {
            throw new Error('Step with id <' + stepId + '> already exists in this ParallelDeferred');
         }

         this._stepsCount++;

         this._results[stepId] = undefined;
         var self = this;
         dOperation.addCallback(function(r) {
            self._results[stepId] = r;
            return r;
         });

         dOperation.addCallbacks(this._successHandler, this._errorHandler);
      }
      return this;
   },
   /**
    * Данная функция должна быть вызвана, когда закончено добавление всех элементов в набор.
    * ВНИМАНИЕ: При инициализации набора через конструктор done сам НЕ вызывается.
    *
    * @param {Object} [successResult] результат, который будет возвращен в случае успеха в общий колбэк
    * @returns {$ws.proto.ParallelDeferred}
    */
   done: function(successResult){
      this._ready = true;
      this._successResult = successResult;
      this._check();
      return this;
   },
   /**
    * Функция, выполняющая проверку, выполнен ли набор, и выполнен ли он успешно
    */
   _check: function(){
      if(!this._ready) // Пока добавление элементов не закончено - не вызывать результат
         return;
      if(this._stepsFinish == this._stepsCount || this._hasError) {
         if(this._stepsSuccess == this._stepsCount && !this._hasError)
            this._dResult.callback(this._successResult !== undefined ? this._successResult : this._results);
         else
            this._dResult.errback(this._errors.join('\n'));
      }
   },
   /**
    * Метод получения результирующего Deferred, который будет служить индикатором всего набора
    * Сам Deferred в случае успеха в качестве результата вернет successResult, если он был задан в методе done(),
    * либо объект с результатами Deferred, составляющих параллельное событие. В объекте в качестве идентификаторов
    * результатов событий будут использоваться stepId, переданные при соответствующих вызовах метода push(), либо порядковые индексы
    * шагов из опции steps
    * @returns {$ws.proto.Deferred}
    */
   getResult: function(){
      return this._dResult;
   },
   getStepsCount: function(){
      return this._stepsCount
   },
   getStepsDone: function(){
      return this._stepsFinish;
   },
   getStepsSuccess: function(){
      return this._stepsSuccess;
   }
});
/**
 * Цепочка кода указанной длины.
 * Код добавляется в произвольные места.
 * Выполняются только законченные от начала куски цепочки.
 *
 * @class $ws.proto.CodeChain
 * @apilevel 4
 */
$ws.proto.CodeChain = $ws.core.extend({}, /** @lends $ws.proto.CodeChain.prototype */{
   $protected: {
      _chain: [],
      _length: 0
   },
   /**
    * @param {Number} chainLen Длинна цепочки
    */
   $constructor: function(chainLen){
      this._length = chainLen;
      for (var i = 0; i < chainLen; i++)
         this._chain[i] = 0;
   },
   /**
    * Добавляет код в цепочку
    *
    * @param {Number} idx Позиция цепочки, куда следует добавить код.
    * @param {string} code Код для добавления.
    * @returns {Boolean} true, если цепочка полностью выполнилась, false в противном случае.
    */
   setCode: function(idx, code){
      if (idx >= this._length || idx < 0)
         throw new RangeError("Setting chain element above the range: Idx: " + idx + ", Len: " + this._length);
      if (this._chain[idx] !== 0)
         throw new Error("Setting chain element what is already processed! Erroneous usage detected! Idx: " + idx);
      this._chain[idx] = code;
      return this._check();
   },
   /**
    * Проверяет цепочку.
    * Заменяет успешно выполненный код пустой строкой.
    * @returns {Boolean} True - когда вся цепочка выполнена.
    */
   _check: function(){
      for (var i = 0, l = this._length; i < l; i++){
         if (typeof this._chain[i] == 'string'){
            if (this._chain[i] !== ''){
               try{
                  var block = BOOMR.plugins.WS.startBlock("eval");
                  eval(this._chain[i]);
                  block.close();
                  this._chain[i] = '';
               } catch(e){
                  throw new EvalError("Chain failed due to erroneous code: " + e.message);
               }
            }
         }
         else
            return false;
      }
      return true;
   }
});

/**
 * Асинхронный XHR Transport через Deferred
 * @class $ws.proto.XHRTransport
 * @apilevel 4
 * @extends $ws.proto.ITransport
 */
$ws.proto.XHRTransport = $ws.proto.ITransport.extend(/** @lends $ws.proto.XHRTransport.prototype */{
   $protected: {
      _options: {
          /**
           * @cfg {String} Метод запроса. POST или GET. По умолчанию = Get.
           */
         method: 'GET',
          /**
           * @cfg {String} Тип данных, который Вы ожидаете от сервера. По умолчанию text.
           */
         dataType: 'text',
          /**
           * @cfg {String} contentType Тип данных при отсылке данных на сервер. По умолчанию application/x-www-form-urlencoded.
           */
          contentType : 'application/x-www-form-urlencoded',
          /**
           * @cfg {String} url URL, по которому отправляется запрос.
           */
          url: ''
      },
      _xhr: undefined      //Последний запрос
   },
   $constructor: function(){
      if(this._options.url === '')
         throw new Error("Request with no URL is ambiguous");
   },
   /**
    * @param {String} data Данные для отправки
    * @param {Object} [headers] Заголовки
    * @return {$ws.proto.Deferred}
    */
   execute: function(data, headers){
      var
            block = this._boomrStartBlock(data),
            dResult = new $ws.proto.Deferred(),
            self = this;

      if (!this._validateCookies()) {
         dResult.errback(new Error('Ошибка авторизации. Текущая сессия принадлежит другому пользователю/клиенту'));
      } else {

         try {
            this._xhr = $.ajax({
               type: this._options.method,
               dataType: this._options.dataType,
               contentType: this._options.contentType,
               url: this._options.url,
               headers: headers || {},
               data: data,
               success: function(result) {
                  block.close();
                  self._validateCookies();
                  dResult.callback(result);
                  return result;
               },
               // null
               // "timeout"
               // "error"
               // "notmodified"
               // "parsererror"
               error: function(xhr, textStatus) {
                  block.close();
                  self._validateCookies();
                  var
                        humanReadableErrors = {
                           timeout: 'Таймаут запроса',
                           error: 'Неизвестная ошибка',
                           parsererror: 'Ошибка разбора документа',
                           abort: 'Запрос был прерван',
                           403: 'У вас недостаточно прав для выполнения данного действия.',
                           404: 'Документ не найден',
                           423: 'Действие заблокировано лицензией',
                           500: 'Внутренняя ошибка сервера',
                           502: 'Сервис недоступен. Повторите попытку позже.',
                           503: 'Сервис недоступен. Повторите попытку позже.',
                           504: 'Сервис недоступен. Повторите попытку позже.'
                        },
                        textError = ((xhr.status in humanReadableErrors) ? humanReadableErrors[xhr.status]
                                  : ((textStatus in humanReadableErrors) ? humanReadableErrors[textStatus]
                                  :  humanReadableErrors['error'])),
                        error;

                  // Запрос был отменен пользователем по esc
                  if( xhr.status === 0 && xhr.getAllResponseHeaders() === "" )
                     textError = 'Запрос был прерван пользователем';

                  error = new HTTPError(textError, xhr.status, self._options.url, xhr.responseText);

                  // Извещаем о HTTP-ошибке
                  $ws.single.EventBus.channel('errors').notify('onHTTPError', error);

                  //обрабатываем ситуацию истекшей сессии
                  if (xhr.status == "401"){

                     // Новый вариант рассылки ошибки о проблеме аутентификации
                     if ($ws.single.EventBus.channel('errors').notify('onAuthError') === true) {
                        return;
                     }

                     // Старый способ. Надо выпилить в 3.8
                     if (typeof $ws.core._authError == "function"){
                        $ws.core._authError();
                        return;
                     }
                  }

                  if (xhr.status == "403" || xhr.status == "423" ){
                     dResult.errback(error);
                     if(!error.processed){
                        $ws.core.alert(textError, "error");
                     }
                  }
                  else
                     dResult.errback(error);
               }
            });
         } catch(e) {
            dResult.errback("JavaScript exception while trying to execute request: " + e.message);
         }

      }

      return dResult;
   },
   /**
    * Прерывает загрузку
    */
   abort: function(){
      if(this._xhr){
         this._xhr.abort();
      }
   },
   /**
    * Проверка куки, если изменилась - кидаем ошибку авторизации
    * @returns {Boolean} true если с сессией все в порядке
    */
   _validateCookies : function(){
      var storedSID = $ws.single.GlobalContext.getValue('sid'), cookieSID;
      if ($ws._const.checkSessionCookie && 'jQuery' in window && 'cookie' in window.jQuery) {
         cookieSID = $.cookie('sid');
         // Если у нас сохранен ранее SID и если в куке тоже есть SID
         if (storedSID && cookieSID){
            var
               w = storedSID.split("-"),
               n = cookieSID.split("-");

            //если изменились пользователи или клиент, то покажем ошибку авторизации
            if(w[0] !== n[0] || w[1] !== n[1]) {
               // Новый способ извещения об ошибке аутентицикации
               $ws.single.EventBus.channel('errors').notify('onAuthError');

               // Старый способ. Удалить с 3.8
               if (typeof $ws.core._authError == "function") {
                  $ws.core._authError();
               }

               return false;
            }
         }
         else {
            // ... если SID ранее не сохранен - сохраним
            $ws.single.GlobalContext.setValue('sid', cookieSID);
         }
      }
      return true;
   },
   /**
    * Создает фрейм для статистики
    */
   _boomrStartBlock : function(data){
      var name = this._options.url;

      if (BOOMR.version){
         if (/.*\.dll$/.test(name)){
            var d = $.parseJSON(data);
            if (d && d.method){
               name = [
                  name,
                  d.method
               ].join("?");
            }
         }
      }

      return BOOMR.plugins.WS.startBlock(name);
   }
});
//TODO 3.7.0 переработать ContextObject - в идеале избавиться
/**
 * Объект контекста.
 * Содержит в себе ВСЕ данные контекста и умеет отличать, какие лежат в рекорде, а какие нет.
 * При изменении данных рекорд актуализируется.
 * Умеет отдавать рекорд целиком.
 *
 * @class $ws.proto.ContextObject
 */
$ws.proto.ContextObject = $ws.core.extend({}, /** @lends $ws.proto.ContextObject.prototype */{
   $protected: {
      _options: {
          /**
           * @cfg {$ws.proto.Record | Object} Объект с начальными данными. Может быть рекордом.
           */
         objectData: null
      },
      _record: null,
      _isEmpty: true,
      _contextObject: {}
   },
   $constructor : function(){
      this._contextObject = {};
      if(this._options.objectData){
         if(typeof(this._options.objectData) !== 'object')
            return;
         var isRecord = ('get' in this._options.objectData && 'hasColumn' in this._options.objectData),
             object = isRecord ? this._options.objectData.toObject() : this._options.objectData;

         if(isRecord)
            this._record = this._options.objectData;

         for(var i in object){//перелопачиваем объект переданный в конфигурации в свой формат
            if(object.hasOwnProperty(i)) {
               this._setContextObjectValueInner( i, object[i], isRecord );
               this._isEmpty = false;
            }
         }
      }
   },
   _setContextObjectValueInner: function(key, value, isRecord) {
      this._contextObject[key] =
         isRecord ?
            { isRecord : isRecord } :
            { value : value };
   },
   /**
    * Проверка на пустоту
    * @return {Boolean} пуст контекст или нет.
    */
   isEmpty : function(){
      return this._isEmpty;
   },
   /**
    * Получение целостного рекорда из контекста. Если контекст был построен не по рекорду, то вернет null
    * @return {$ws.proto.Record} Запись, по которой был построен, или null при отсутствии.
    */
   getRecord : function(){
      return this._record;
   },
   /**
    * Изменение записи в контексте. Удаляет все поля-записи и добавляет новые из переданной записи
    * @param {$ws.proto.Record} record
    */
   replaceRecord : function(record){
      var columns;
      if (!('get' in record && 'hasColumn' in record)) {
         return;
      }
      columns = record.getColumns();
      //Удалили предыдущие поля записи
      for (var i in this._contextObject) {
         if (this._contextObject.hasOwnProperty(i)) {
            if (this._contextObject[i].isRecord) {
               delete this._contextObject[i];
            }
         }
      }
      this._record = record;
      //Поставили новые поля
      for (var j = 0, len = columns.length; j < len; j++ ) {
         this._contextObject[columns[j]] = {
            value: record.get(columns[j]), // TODO: Имеет ли смысл эта строка, если все равно потом берем значение из _record???
            isRecord : true
         }
      }
   },
   toObject: function() {
      var r = {};
      for(var f in this._contextObject) {
         if(this._contextObject.hasOwnProperty(f))
          r[f] = this.get(f);
      }
      return r;
   },
   has: function(fieldName) {
      return fieldName in this._contextObject;
   },
   /**
    * Меняет значение поля
    * @param {String} fieldName имя поля.
    * @param value значение поля.
    */
   set : function(fieldName, value){
      var field = this._contextObject[fieldName],
         isRecord = field ? field['isRecord'] : false;
      this._setContextObjectValueInner(fieldName, value, isRecord);
      if(isRecord)   //Если в контексте рекорд с таким полем, то его тоже сетим
         this._record.set(fieldName, value);
      this._isEmpty = false;
   },
   /**
    * Получение значения поля
    * @param {String} fieldName имя поля.
    * @return value значение поля или undefined при его отсутствии.
    */
   get : function(fieldName){
      var field = this._contextObject[fieldName];
      if(field === undefined) {
         return undefined;
      }
      return field.isRecord ? this._record.get(fieldName) : field.value; 
   },
   /**
    * Удаляет поле из объекта контекста.
    * @param {String} fieldName имя поля, которое необходимо удалить.
    * @return {Boolean} result результат удаления, произошло оно или нет.
    */
   remove : function(fieldName){
      var result = false,
          isRecord,
          value,
          currentValue,
          length;
      if(this._contextObject[fieldName]){
         result = true;
         isRecord = this._contextObject[fieldName]['isRecord'];
         value = this.get(fieldName);
         if(isRecord) {
            if(value instanceof $ws.proto.Enum) {
               value.set(null);
               this.set(fieldName, null);
            } else if(this._record.getColumnType(fieldName) === 'Флаги') {
               currentValue = this._record.get(fieldName);
               value = [];
               length =  currentValue instanceof Array ? currentValue.length : currentValue.getColumns().length;
               for(var l = length; l > 0; --l) {
                  value.push(null);
               }
               this.set(fieldName, value);
            } else {
               this.set(fieldName, null);
            }
         } else
            this._contextObject[fieldName].value = undefined;
      }
      return result;
   }
});

/**
 * Контекст области.
 * Отвечает за управление данными в объекте.
 * Здесь логика наследования контекстов и проброса методов.
 *
 * @class $ws.proto.Context
 * @extends $ws.proto.Abstract
 */
$ws.proto.Context = $ws.proto.Abstract.extend(/** @lends $ws.proto.Context.prototype */{
   /**
    * @event onDataBind При изменении контекста
    * Событие, происходящее при полном изменения контекста, а не одного поля, например, при выполнении {@link setContextData}.
    * @param {$ws.proto.EventObject} eventObject Дескриптор события.
    */
   /**
    * @event onDataBind Событие, происходящее в момент изменения контекста
    * @param {Object} eventObject описание в классе $ws.proto.Abstract
    */
   /**
    * @event onFieldChange Событие, происходящее при смене значения поля текущего или вышестоящего контекста.
    * @param {Object} eventObject описание в классе $ws.proto.Abstract.
    * @param {String} fieldName Имя измененного поля.
    * @param {$ws.proto.Control} [initiator] Инициатор изменения контекста. Передается, если изменение вызвал какой-то контрол.
    * @param {*} value Значение поля.
    * @see setValue
    */
   $protected: {
      _options: {
          /**
           * @cfg {Boolean} Является ли данный контекст глобальным.
           * Глобальный контекст - это контекст верхнего уровня.
           */
         isGlobal: false,
         /**
          * @cfg {String} Ограничение на запись или чтения
          * Работа только с текущим контекстом, игнорируется previousContext
          * Если значение set, то запись происходит только в текущий контекст, чтение не ограничено
          * Если значение setget, то запись происходит только в текущий контекст, чтение только из текущего контекста
          */
         restriction: ''
      },
      _restrictionGet: false,
      _restrictionSet: false,
      _previousContext: null,
      _context: null,
      _linkedRecordFieldUpdateHandler: null,
      _parentContextUpdateHandler: null,
      _parentContextFieldUpdateHandler: null,
      _lockRecordNotification: false
   },
   $constructor: function() {
      var self = this;
      this._context = new $ws.proto.ContextObject();

      switch(this._options.restriction) {
         case 'setget':
            this._restrictionGet = true;
         // break; пропущен специально, так как ограничиваем и на set тоже
         case 'set':
            this._restrictionSet = true;
      }

      this._parentContextUpdateHandler = function() {
         if (this._restrictionGet) {
            return;
         }
         self._notify('onDataBind');
      };

      this._parentContextFieldUpdateHandler = function(event, field, value, initiator) {
         if (this._restrictionGet) {
            return;
         }
         if(self._context.get(field) === undefined) {
            // если у нас самих нет такого значения ...
            self._notify('onFieldChange', field, value, initiator); // ... известим ниже о смене выше
         }
      };

      this._linkedRecordFieldUpdateHandler = function(e, fields) {
         if (!self._lockRecordNotification && !self.isDestroyed()) {
            for (var i = 0; i < fields.length; ++i) {
               self._notify('onFieldChange', fields[i], self.getValue(fields[i]));
            }
         }
      };

      if(this._options.isGlobal === false) {
         this._previousContext = $ws.single.GlobalContext;
      }

      this._subscribeOnParentUpdates();

      this._publish('onDataBind', 'onFieldChange');
   },
   _subscribeOnParentUpdates: function() {
      if(this._previousContext) {
         this._previousContext.subscribe('onDataBind', this._parentContextUpdateHandler);
         this._previousContext.subscribe('onFieldChange', this._parentContextFieldUpdateHandler);
      }
   },
   _unsubscribeOnParentUpdates: function() {
      if(this._previousContext) {
         this._previousContext.unsubscribe('onDataBind', this._parentContextUpdateHandler);
         this._previousContext.unsubscribe('onFieldChange', this._parentContextFieldUpdateHandler);
      }
   },
   /**
    * Получить текущее ограничение контекста
    * @return {string}
    */
   getRestriction: function() {
      return this._options.restriction;
   },
   /**
    * Установить ограничение контекста
    * @param {String} restriction Ограничение на запись или чтения
    * Работа только с текущим контекстом, игнорируется previousContext
    * Если значение set, то запись происходит только в текущий контекст, чтение не ограничено
    * Если значение setget, то запись происходит только в текущий контекст, чтение только из текущего контекста
    */
   setRestriction: function(restriction) {
      this._options.restriction = restriction;
      switch(restriction) {
         case 'setget':
            this._restrictionGet = true;
         // break; пропущен специально, так как ограничиваем и на set тоже
         case 'set':
            this._restrictionSet = true;
            break;
         default:
            this._restrictionGet = false;
            this._restrictionSet = false;
      }
   },
   /**
    * Установить предыдущий контекст
    * @param {$ws.proto.Context} previous Контекст, который необходимо привязать предыдущим к текущему.
    * @return {$ws.proto.Context}  Текущий контекст.
    * @see getPrevious
    */
   setPrevious: function(previous){
      if (this.isGlobal()) {
         $ws.single.ioc.resolve('ILogger').error('GlobalContext', 'Attempt to set a previous context to a global context');
         return this;
      }

      if(previous !== null && previous instanceof $ws.proto.Context && previous !== this._previousContext) {
         this._unsubscribeOnParentUpdates();
         this._previousContext = previous;
         this._subscribeOnParentUpdates();
      }
      return this;
   },
   /**
    * Получить предыдущий контекст.
    * @return {$ws.proto.Context} Предыдущий контекст или null, если он отсутствует.
    * @see setPrevious
    */
   getPrevious: function(){
      return this._previousContext;
   },
   /**
    * Навешивает/снимает обработчики с _context._record. Вызывает callback(newData).
    * @param {Object|$ws.proto.Record} newData Новый контекст.
    * @param {Function} callback Функция для выполнения дополнительного кода
    * @private
    */
   _changeContextData: function(newData, callback) {
      if (this.isDestroyed()) {
         return;
      }
      var oldRecord = this.getRecord();
      if(oldRecord) {
         // Если у ContextObject есть record, значит мы уже были здесь и _linkedRecordFieldUpdateHandler установлен
         oldRecord.unsubscribe('onFieldChange', this._linkedRecordFieldUpdateHandler);
      }

      callback.apply(this, [newData]);

      if(newData instanceof $ws.proto.Record) {
         // context — это record
         // Подпишемся на onFieldChange у record'а чтобы пробрасывать событие себе (контексту)
         newData.subscribe('onFieldChange', this._linkedRecordFieldUpdateHandler);
      }

      this._notify('onDataBind');
   },
   /**
    * Изменить данные, хранимые контекстом.
    * Стирает всё, что было и записывает новые значения. В контексте будет только то, что передали в параметре context.
    * @param {Object|$ws.proto.Record} context Новый контекст.
    * @see replaceRecord
    * @see {@link $ws.proto.RecordSet#getContext getContext}
    */
   setContextData: function(context) {
      this._changeContextData(context, function(context) {
         this._context = new $ws.proto.ContextObject({objectData : context});
      });
   },
   /**
    * Смена записи в контексте.
    * Оставляет без изменения всё, кроме записи - её подменяет на новую.
    * @param {$ws.proto.Record} record Новая запись.
    * @see setContextData
    * @see {@link $ws.proto.RecordSet#getContext getContext}
    */
   replaceRecord: function(record) {
      this._changeContextData(record, function(record) {
         this._context.replaceRecord(record);
      });
   },
   /**
    * Проверить контекст на то, является он глобальным или нет.
    * @return {Boolean} Флаг глобальности.
    */
   isGlobal: function(){
      return this._options.isGlobal;
   },
   /**
    * Проверить пуст ли контекст
    * @return {Boolean} true - контекст пуст, false - контекст не пуст.
    * @see setValue
    * @see getValue
    */
   isEmpty: function(){
      return this.isDestroyed() ? true : this._context.isEmpty();
   },
   /**
    * Получить запись, по которой построен контекст
    * Если контекст построен без записи, вернет null.
    * @returns {$ws.proto.Record} Если в контекст положили запись, то возвращаем её.
    */
   getRecord: function() {
      return this.isDestroyed() ? undefined : this._context.getRecord();
   },
   /**
    * Получить значение поля из контекста
    * Если поле не найдено в текущем контексте, то ищется в предыдущем. И так, пока не найдётся.
    * @param {String} fieldName Имя поля, значение которого необходимо вернуть.
    * @param {Function} [func] Функция валидации значения, принимает один параметр - значение поля в контексте;
    * если возвращает TRUE, то значение ищется в предыдущем контексте, иначе должен возвращать значение поля.
    * @returns {String} Значение поля из контекста. Если такого поля нет, то вернёт undefined.
    * @see isEmpty
    * @see setValue
    */
   getValue: function(fieldName, func) {
      var retval = this.getValueSelf(fieldName);
      if (this._restrictionGet) {
         return retval;
      }
      return (typeof func === 'function' ? func(retval) : retval === undefined) ? this._getValueUp(fieldName, func) : retval;
   },
   /**
    * Получить значение поля из контекста
    * Отличается от {@link getValue} тем, что не ищет в "родительских" контекстах.
    * @param {String} fieldName Название поля.
    * @returns {*} Значение поля из контекста. Если такого поля нет, то вернёт undefined.
    */
   getValueSelf: function(fieldName) {
      return this.isDestroyed() ? undefined : this._context.get(fieldName);
   },
   /**
    * Получить оригинальный контекст, в котором непосредственно расположено поле.
    * Если такого поля во всех родительских контекстах нет, то вернёт undefined.
    * @param {String} fieldName Имя поля.
    * @param {Boolean} [setRestriction] - Учесть ограничение на set
    * @return {$ws.proto.Context|undefined} Объект контекста или undefined.
    */
   getFieldOrigin: function (fieldName, setRestriction) {
      var result = this.getValueSelf(fieldName);
      if (result === undefined && this._previousContext && !this._restrictionGet && !(setRestriction && this._restrictionSet)) {
         result = this._previousContext.getFieldOrigin(fieldName, setRestriction);
      } else if (result !== undefined) {
         result = this;
      }
      return result;
   },
   /**
    * Проверить, есть ли указанное поле в данном контексте
    * @param {String} fieldName Имя поля.
    * @returns {Boolean} true - указанное поле есть в данном контексте, false - нет.
    */
   hasField: function(fieldName) {
      return this.isDestroyed() ? false : this._context.has(fieldName);
   },
   /**
    * Получить оригинальный контекст, непосредственно в котором расположено поле.
    * Аналогично {@link getFieldOrigin}, но находит даже те поля, значения которых undefined.
    * Если контекст не найден, то вернет null.
    * @param {String} fieldName Имя поля.
    * @returns {$ws.proto.Context} Объект контекста.
    */
   getFieldOrigin2: function(fieldName) {
      var ctxToCheck = this;
      while (ctxToCheck && !ctxToCheck.hasField(fieldName)) {
         ctxToCheck =  this._restrictionGet ? null : ctxToCheck.getPrevious();
      }
      return ctxToCheck;
   },
   /**
    * Получить значение из родительского контекста
    * @param  fieldName Имя поля, значение которого необходимо вернуть.
    * @param {Function} [func] Функция валидации значения, принимает один параметр - значение поля в контексте;
    * если возвращает TRUE, то значение ищется в предыдущем контексте.
    * @return {*} Значение из контекста или undefined.
    */
   _getValueUp: function(fieldName, func){
      if(this._previousContext !== null && this._previousContext instanceof $ws.proto.Context)
         return this._previousContext.getValue(fieldName, func);
      else
         return undefined;
   },
   /**
    * Установка значения в контекст
    * @param {String|Object} fieldName Имя поля, в которое будет установлено значение. Можно передать объект.
    * Его ключи - поля, значения - соответственно значения контекста.
    * @param {*} [value] Значение, которое будет установлено.
    * @param {Boolean} [toSelf=false] Принудительная установка значения в текущий контекст.
    * - true - запишет значение в текущий контекст без поиска в родительских,
    * - false - сначала будет пытаться найти в родительских  контекстах поле с таким же именем и записать туда, если не
    * найдёт, то запишет в текущий.
    * Если желаемого значения нет ни в одном из контекстов выше, независимо от параметра toSelf запишет значение в
    * текущий контекст.
    * @param {$ws.proto.Control} [initiator] Инициатор изменения полей контекста
    * @example
    * 1. Зададим значение поля контекста:
    * <pre>
    *     //fieldName - необходимое имя поля
    *     control.getLinkedContext().setValue(linkedFieldName, control.getValue());
    * </pre>
    * 2. Одновременная установка нескольких полей контекста:
    * <pre>
    *     context.setValue({
    *        field1: 1,
    *        field2: 2
    *     });
    * </pre>
    */
   setValue: function(fieldName, value, toSelf, initiator) {
      var self = this;
      function setV(fieldName, val, toSelf, initiator) {
         // Выясним где ...
         var ctx = (!!toSelf) ? self : (self.getFieldOrigin(fieldName, true) || self);
         // и обновим значение
         ctx._updateValue(fieldName, val, initiator);
      }
      // А вдруг кто-то передал объект
      if (typeof(fieldName) == 'object') {
         $ws.helpers.forEach(fieldName, function(objValue, key) {
            // Смещаем параметры
            setV(key, objValue, self._restrictionSet || value, toSelf);
         });
      } else {
         setV(fieldName, value, self._restrictionSet || toSelf, initiator);
      }
   },
   _updateValue: function(fieldName, value, initiator) {
      var
            currentValue = this._context.get(fieldName),
            isEquals;

      if(currentValue && currentValue.equals)
         isEquals = currentValue.equals(value);
      else
         isEquals = (currentValue === value);

      if(!isEquals) { // Если значение отличается ...
         this._lockRecordNotification = true;
         try {
         this._context.set(fieldName, value); // ... обновим и ...
         } finally {
            this._lockRecordNotification = false;
         }
         this._notify('onFieldChange', fieldName, value, initiator); // ... известим
      }
   },
   /**
    * Удалить значения из контекста
    * @param {String} fieldName Имя поля, из которого удалять.
    * @param {Boolean} [toSelf=false]  Если false и не удалил в текущем, то пытается удалить в предыдущем.
    */
   removeValue: function(fieldName, toSelf){
      var result = this.isDestroyed() ? true : this._context.remove(fieldName);
      if (!result && !(this._restrictionSet || toSelf) && this._previousContext !== null && this._previousContext instanceof $ws.proto.Context) {
         return this._previousContext.removeValue(fieldName, toSelf);
      } else {
         return result;
      }
   },
   /**
    * Установка значения в себя, без проброса в родительский контекст
    * @param {String|Object} fieldName имя поля, в которое будет установлено значение или объект с данными для установки в контекст ({ имяПоля: значение })
    * @param [value] значение, которое будет установлено.
    * @param {$ws.proto.Control} [initiator] Инициатор изменения контекста.
    *
    * <pre>
    *    ctx.setValueSelf('field', 10, control);
    *    ctx.setValueSelf({
    *       field: 10
    *    }, control);
    * </pre>
    */
   setValueSelf: function(fieldName, value, initiator) {
      if (typeof fieldName == 'object') {
         this.setValue(fieldName, true, initiator);
      } else {
         this.setValue(fieldName, value, true, initiator);
      }
   },
   /**
    * Вставить в контекст объект как связанный
    * @param {$ws.proto.Record || Object} values Значения для вставки
    * @param {String} link Имя связи
    */
   insert: function(values, link){
      this._multiOperation(values, link, 'insert');
   },
   /**
    * Удалить из контекста объект по связи
    * @param {$ws.proto.Record | Object} values Значения для удаления
    * @param {String} link Имя связи
    */
   remove: function(values, link){
      this._multiOperation(values, link, 'remove');
   },
   /**
    * Метод работы со связанными объектами
    * @param {$ws.proto.Record | Object} values значения для вставки.
    * @param {String} link Имя связи.
    * @param {String} type  Тип действия 'insert' || 'remove'.
    */
   _multiOperation: function(values, link, type) {
      link = typeof link === 'string' ? link + '.' : '';
      if (values instanceof $ws.proto.Record) {
         values = values.toObject();
      }
      if (values instanceof Object) {
         for (var i in values){
            if(values.hasOwnProperty(i)) {
               if(type == 'remove')
                  this.removeValue(link + i, true);
               if(type == 'insert')
                  this.setValueSelf(link + i, values[i]);
            }
         }
      } else if(values === false || values === null || values === undefined) {
         // Вычищение связанных значений из контекста с попыткой понять, что же вычищать
         var ctx = this.getRecord() || this.toObject();
         for(var k in ctx){
            if(ctx.hasOwnProperty(k) && k.indexOf(link) === 0)
               this.removeValue(k, true);
         }
      }
      this._notify('onDataBind');
   },
   destroy: function() {
      if (this.isDestroyed()) {
         // Специально ничего не делаем, чтобы ловить ошибки с подменами контекста
      }

      this._unsubscribeOnParentUpdates();

      var record = this._context.getRecord();
      if (record) {
         record.unsubscribe('onFieldChange', this._linkedRecordFieldUpdateHandler);
      }

      //заменяем "пустым" объектом, чтобы не держать старый объект, и объекты, ссылки на которые в нём могут быть,
      //не зануляем, чтобы не ломать функциональность api после вызова destroy
      this._context = new $ws.proto.ContextObject();
      $ws.proto.Context.superclass.destroy.apply(this, arguments);
   },
   /**
    * Создать дочерний контекст
    * Создаёт новый контекст, зависимый от текущего.
    * @returns {$ws.proto.Context} Дочерний контекст
    */
   createDependent: function() {
      var
         result = new $ws.proto.Context();
      result.setPrevious(this);
      return result;
   },
   toObject: function(recursive) {
      var result = (this._context && this._context.toObject()) || {};

      if(recursive) {
         var parent = this.getPrevious();
         if(parent) {
            var parentObj = parent.toObject(true);
            for(var i in parentObj) {
               if(parentObj.hasOwnProperty(i) && !(i in result)) {
                  result[i] = parentObj[i];
               }
            }
         }
      }

      return result;
   }
});

/**
 * Глобальный контекст
 *
 * Это экземпляр класса {@link $ws.proto.Context}. Все методы смотрите у контекста.
 *
 * @class $ws.single.GlobalContext
 * @singleton
 */
$ws.single.GlobalContext = new $ws.proto.Context({ isGlobal: true });

/**
 * Диспетчер команд
 *
 * @class $ws.single.CommandDispatcher
 * @singleton
 */
$ws.single.CommandDispatcher = new ($ws.core.extend({}, /** @lends $ws.single.CommandDispatcher.prototype */{
   /**
    * Пример объявления команд: объявляются 2 команды: fill и clear. Команда fill принимает параметры.
    * Если команда возвращает true-value (что-то, что кастуется к булевскому true), то всплытие команды прекращается,
    * если false, то всплытие по цепочке хозяев продолжается.
    *
    * <pre>
    *    $ws.proto.FieldIntegerWithCommands = $ws.proto.FieldInteger.extend({
    *        $constructor : function() {
    *           $ws.single.CommandDispatcher.declareCommand(this, 'fill', this._fillCommand);
    *           $ws.single.CommandDispatcher.declareCommand(this, 'clear', this._clearCommand);
    *        },
    *
    *        _fillCommand: function(args) {
    *           var options = $.extend({
    *              'fillData': '12345'
    *           }, args);
    *           this.setValue(options['fillData']);
    *           return false; // чтобы продолжить всплытие команды
    *        },
    *        _clearCommand: function() {
    *           this.setValue('');
    *           return true;
    *        }
    *     });
    * </pre>
    * @param {$ws.proto.Control} control Контрол, регистрирующий команду
    * @param {string} commandName Имя команды
    * @param {Function} commandHandler Обработчик команды. На данном контроле для данной команды может быть зарегистрирован только один обработчик
    */
   declareCommand: function(control, commandName, commandHandler){
      var commandStorage;
      if (control && $ws.proto.Control && control instanceof $ws.proto.Control) {
         commandStorage = control.getUserData('commandStorage') || {};
         commandStorage[commandName] = commandHandler.bind(control);
         control.setUserData('commandStorage', commandStorage);
      }
   },
   /**
    * Удаление всех команд для объекта. Должно ОБЯЗАТЕЛЬНО выполняться для удаляемых объектов (вызываться в деструкторах, например).
    * @param object
    */
   deleteCommandsForObject: function(object) {
      if (object && $ws.proto.Control && object instanceof $ws.proto.Control) {
         object.setUserData('commandStorage');
      }
   },
   /**
    * Отправка команды.
    * Команда отправляется либо объекту хозяину (см. {@link $ws.proto.Control#owner}),
    * либо по цепочке родителей контрола (см. {@link $ws.proto.Control#parent}) до первого обработчика, вернувшего true-value.
    * Если обработчик возвращает false - всплытие продолжается к родителю.
    * @param {*} [arg1, ...] Аргументы, которые будут переданы в команду.
    * @example
    * <pre>
    *    hdl = {
    *        sendCommand1: function(e){
    *           $ws.single.CommandDispatcher.sendCommand(this, 'fill', {'fillData': '+7 (4855) 25245'});
    *        },
    *        sendCommand2: function(e){
    *           $ws.single.CommandDispatcher.sendCommand(this, 'clear');
    *        },
    *        sendCommand3: function () {
    *           dialogRecord.sendCommand('save', readyDeferred, true);
    *           readyDeferred.addCallBacks(
    *              function () {
    *                 $ws.core.alert("Сохранено успешно.");
    *              },
    *              function () {
    *                 $ws.core.alert("Ошибка при сохранении.");
    *              }
    *          );
    *        }
    *    };
    * </pre>
    * @param {$ws.proto.Control} eventSender Контрол, отправивший команду
    * @param {String} commandName Имя команды
    *
    * @return {*} Возвращает результат обработчика команды или true, если было вызвано несколько обработчиков; или false, если ни один обработчик не был вызван.
    */
   sendCommand: function(eventSender, commandName){
      var payload = Array.prototype.slice.call(arguments, 2),
          commandDestination,
          commandHandler,
          result,
          owner;
      if (eventSender) {
         commandHandler = this._getCommand(eventSender, commandName);
         if (commandHandler !== null) {
            result = commandHandler.apply(eventSender, payload);
            if (result) {
               return result;
            }
         }
         if (eventSender.getOwner && (owner = eventSender.getOwner()) !== null) {
            commandDestination = owner;
            commandHandler = this._getCommand(commandDestination, commandName);
            if (commandHandler !== null) {
               return commandHandler.apply(commandDestination, payload) || true;
            }
         }
         var flag = false;
         commandDestination = eventSender;
         while ((commandDestination = commandDestination.getParent()) !== null) {
            commandHandler = this._getCommand(commandDestination, commandName);
            if (commandHandler !== null) {
               flag = true;
               result = commandHandler.apply(commandDestination, payload);
               if (result) {
                  return result;
               }
            }
         }
         return flag;
      } else
         return false;
   },

   /**
    * Получает команду из хэша команд
    * @param {$ws.proto.Control} owner Элемент, для которого запрашивается обработчик команды.
    * @param {String} commandName Имя команды.
    * @return {Function} Возвращает обработчик команды или null, если передаваемый элемент не декларировал обработку данной команды.
    */
   _getCommand: function(owner, commandName){
      if (owner && $ws.proto.Control && owner instanceof $ws.proto.Control) {
         var commandStorage = owner.getUserData('commandStorage');
         if (commandStorage) {
            return commandStorage[commandName] || null;
         }
      }
      return null;
   }
}))();

/**
 * Реализация объекта "Перечисляемое".
 * Хранит набор доступных значений.
 * Несмотря на то, что в Object ключ - строка, если текущий индекс null, он возвращается как null, а не как "null".
 *
 * @class $ws.proto.Enum
 * @name $ws.proto.Enum
 */
$ws.proto.Enum = (function(){

   var toS = Object.prototype.toString;

   var SUPPORTED = {
      'boolean': 1,
      'string': 1,
      'number': 1
   };

   function strToHash(str) {
      str = str + '';
      return $ws.helpers.reduce(str.split(''), function(hash, c) {
         return hash + 31 * c.charCodeAt(0);
      }, 17);
   }

   function Enum(cfg) {

      this._curValIndex = undefined;
      this._availableValues  = {};
      this._hashCode = 0;
      this._fallbackVal = undefined;
      this._initialValue = undefined;

      var
         avValues = cfg.availableValues,
         curValue = cfg.currentValue,
         iKey;

      curValue = (curValue === null || curValue === 'null') ? 'null' : parseInt(curValue, 10);

      if(toS.call(avValues) == '[object Object]' && avValues){
         for(var i in avValues){
            if(avValues.hasOwnProperty(i)) {
               var v = avValues[i];
               if (v === null || (typeof v) in SUPPORTED) {
                  iKey = (i === null || i === 'null') ? 'null' : parseInt(i, 10);
                  if(this._fallbackVal === undefined) {
                     this._fallbackVal = iKey;
                  }
                  if (curValue === iKey) {
                     this._curValIndex = iKey;
                  }
                  this._availableValues[i] = avValues[i];
               }
            }
         }
      } else {
         throw new Error ('Class Enum. Option availableValues must be set to object');
      }
      if(this._curValIndex === undefined) {
         if(this._fallbackVal === undefined)
            throw new Error ('Class Enum. No values to build');
         else
            this._curValIndex = iKey;
      }
      this._initialValue = this._curValIndex;
   }

   Enum.prototype.valueOf = function(){
      return this.getCurrentValue();
   };

   /**
    * Получить индекс текущего значения.
    * @return {*} "Индекс" текущего значения перечисляемого.
    * @example
    * При клике на кнопку (btn) вернуть к начальному состоянию группу радиокнопок (fieldRadio).
    * <pre>
    *    btn.subscribe('onClick', function() {
    *       var index = fieldRadio.getDefaultValue().getCurrentValue();
    *       fieldRadio.setValueByIndex(index);
    *    });
    * </pre>
    */
   Enum.prototype.getCurrentValue = function() {
      return this._curValIndex == "null" ? null : this._curValIndex;
   };

   /**
    * Получить доступные значения Enum.
    * @return {Object} Hash-map доступных значений для данного перечисляемого.
    *
    */
   Enum.prototype.getValues = function() {
      return this._availableValues;
   };

   /**
    * Установить текущее значение перечисляемого
    * @param index индекс нового текущего значения
    * @throws {Error} в случае, если указанный индекс отсутствует в текущем Enum'е
    */
   Enum.prototype.set = function(index){
      // null преобразовываем к строке 'null'
      index = (index === null) ? 'null' : index;
      if(index in this._availableValues) {
         this._hashCode = 0;
         this._curValIndex = index;
      }
      else {
         // Попытались сбросить Enum, но null не допускается.
         if(index === 'null')
            this.set(this._initialValue);
         else // Что-то иное
            throw new Error('Class Enum. Unsupported index: ' + index);
      }
   };

   /**
    * Возвращает представление Enum в виде объекта.
    * Можно использовать для создания клона Enum.
    * <pre>
    *    var enumClone = new $ws.proto.Enum(original.toObject());
    * </pre>
    * @returns {Object} Представление в виде объекта
    */
   Enum.prototype.toObject = function() {
      return {
         availableValues: this.getValues(),
         currentValue: this.getCurrentValue()
      }
   };

   Enum.prototype.hashCode = function() {
      if(this._hashCode === 0) {
         this._hashCode = 17 + 31 * Object.keys(this._availableValues).length;
         $ws.helpers.forEach(this._availableValues, function(val, key){
            var v = parseInt(key, 10);
            this._hashCode += 31 * ((isNaN(v) ? -1 : v) + strToHash(val));
         }, this);
      }
      return this._hashCode;
   };

   /**
    * Проверяет данный объект на совпадение с другим.
    * Проверяется как текущее выставленное значение, так и набор допустимых.
    *
    * @param obj Объект, с которым сравниваем.
    * @return {Boolean} Совпадает или нет.
    */
   Enum.prototype.equals = function(obj) {
      return obj instanceof $ws.proto.Enum &&                  // this is an enum
         this.hashCode() == obj.hashCode() &&              // it stores same values
         this.getCurrentValue() == obj.getCurrentValue();  // current value is the same
   };

   Enum.prototype.rollback = function(val){
      this.set(val);
   };

   /**
    * Получить текущее значение Enum.
    * @returns {string} Возвращает строковое значение Enum.
    * @example
    * <pre>
    *     var value = myEnum.toString();
    * </pre>
    */
   Enum.prototype.toString = function() {
      return "" + this._availableValues[this._curValIndex];
   };

   /**
    * Клонирует текущий объект
    * @return {$ws.proto.Enum}
    */
   Enum.prototype.clone = function(){
      return new Enum({
         currentValue: this.getCurrentValue(),
         availableValues: this.getValues()
      });
   };


   return Enum;

})();

/**
 * @class $ws.single.MicroSession
 * @singleton
 */
$ws.single.MicroSession = /** @lends $ws.single.MicroSession */{
   _available : true,
   _ms : {},
   _msid : null,
   _storage : null,
   _sessionsLimit : 5,
   _storageChangeHandler: function(e) {
      if (!e) {
         e = window.event;
      }
      if ('key' in e) {
         if (e.key == this._msid && e.newValue === null) {
            try {
               localStorage.setItem(this._msid, JSON.stringify(this._ms));
            } catch (e) {
               // ignore
            }
         }
      } else {
         if (!localStorage.getItem(this._msid)) {
            try {
               localStorage.setItem(this._msid, JSON.stringify(this._ms));
            } catch (e) {
               // ignore
            }
         }
      }
   },
   init : function(){
      var self = this;

      this._prepareStorage();

      if (!this._available) {
         return;
      }

      this._msid = this.getId();
      this._ms = this._get(this._msid);

      if (this._ms){
         try {
            this._ms = $.parseJSON(this._ms);
         } catch (e) {
            throw new Error("microsession : parse json error");
         }
      } else{
         var
            prevSessionId = this._get("ws-msid"),
            prevSession = prevSessionId ? this._get(prevSessionId) : false;

         this._ms = {};
         if (prevSession){
            prevSession = $.parseJSON(prevSession);
            $.extend(true, this._ms, prevSession);
         }
      }

      this._ms.sid = $.cookie('sid');

      this._prepareHash(this._msid);
      this._set("ws-msid", "");
      this._set(this._msid, JSON.stringify(this._ms));

      this._garbageCollector();

      if (window.addEventListener) {
         window.addEventListener("storage", this._storageChangeHandler.bind(this), false);
      } else {
         if ($ws._const.browser.isIE8) {
            document.attachEvent("onstorage", this._storageChangeHandler.bind(this));
         } else {
            window.attachEvent("onstorage", this._storageChangeHandler.bind(this));
         }
      };

      $(window).unload(function(){
         self._set("ws-msid", self._msid);
      });

      (function(open){
         window.open = function(){
            self._set("ws-msid", self._msid);
            var res;
            switch (arguments.length){
               case 1:
                  res = open(arguments[0]);
                  break;
               case 2:
                  res = open(arguments[0], arguments[1]);
                  break;
               case 3:
                  res = open(arguments[0], arguments[1], arguments[2]);
                  break;
            }
            return res;
         }
      })(window.open);
   },
   /**
    * Подготавливает хранилище
    * @private
    */
   _prepareStorage : function(){
      if("localStorage" in window && window.localStorage !== null){
         //use localStorage
         this._storage = window.localStorage;
      } else{
         this._available = false;
      }
   },
   /**
    * Записывает идентификатор сессии в адресную строку
    * @param {String} id идентификатор сессии
    * @private
    */
   _prepareHash : function(id){
      $ws.single.HashManager.set("msid", id, true);
   },
   /**
    * Возвращает значение непосредственно из localStorage
    * @param {String} key - ключ.
    * @return {*}
    * @private
    */
   _get : function(key){
      var result;
      result = this._storage.getItem(key);
      result = result === "undefined" ? undefined : result;
      return result ? result.toString() : undefined;
   },
   /**
    * Записывает значение непосредственно в localStorage
    * @param {String} key - ключ.
    * @param {String} value - значение.
    * @private
    */
   _set : function(key, value){
      try {
         this._storage.setItem(key, value);
      } catch (e) {
         // ignore
      }
   },
   /**
    * Сборщик мусора, не позволяет накапливаться сессиям. Держит _sessionsLimit сессий
    * @private
    */
   _garbageCollector : function(){
      var keys = [],
          sid = $.cookie('sid'),
          ms, i, l, len;

      //collect session keys
      for (i in this._storage){
         if (/s\d+/.exec(i))
            keys.push(parseInt(i.substr(1), 10));
      }

      //sort
      keys.sort();
      
      //remove old keys
      while (keys.length > this._sessionsLimit){
         try {
            this._storage.removeItem('s' + keys[0]);
         } catch (e) {
            // ignore
         }
         keys.shift();
      }

      // actualize sid
      for (i = 0, len = keys.length; i < len - 1; ++i) {
         ms = $.parseJSON(this._get('s' + keys[i]));
         // ms может быть null
         if (!sid || (ms && (!ms.hasOwnProperty('sid') || (sid !== ms.sid)))) {
            this._storage.removeItem('s' + keys[i]);
         }
      }
   },
   /**
    * Очищает ВСЁ хранилище
    */
   _clear : function(){
      this._storage.clear();
   },
   clearCurrentSession : function(){
      if (this._available){
         this._ms = {};
         this._set(this._msid, "{}");
      }
      else
         return false;
   },
   /**
    * Проверяет является ли сессия пустой
    * @return {Boolean}
    */
   isEmpty : function(){
      return Object.isEmpty(this.toObject());
   },
   /**
    * Возвращает если уже есть, иначе генерирует идентификатор текущей сессии
    * @return {String} идентификатор сессии.
    * @private
    */
   getId : function(){
      if (this._available)
         return $ws.single.HashManager.get("msid") || ["s", ("" + new Date().getTime())].join("");
      else
         return false;
   },
   /**
    * Устанавливает значение
    * @param {String} key - ключ.
    * @param {String} value - значение.
    */
   set : function(key, value){
      if (this._available){
         this._ms[key] = value;
         this._set(this._msid, JSON.stringify(this._ms));
      }
      else
         return false;
   },
   /**
    * Возвращает значение
    * @param {String} key - ключ.
    * @return {*}
    */
   get : function(key){
      if (this._available)
         return this._ms[key];
      else
         return false;
   },
   /**
    * Устанавливает значение постоянно. Не зависит от текущей микросессии.
    * Сделано оберткой, может понадобиться еще доработать.
    * @param {String} key - ключ.
    * @param {String} value - значение.
    */
   setPermanently : function(key, value){
      this._set(key, value);
   },
   /**
    * Возвращает значение из постоянного хранилища
    * @param {String} key - ключ.
    * @return {*}
    */
   getPermanently : function(key){
      return this._get( key );
   },
   /**
    * Удаляет значение из сессии по ключу
    * @param {String} key - ключ.
    */
   remove : function(key){
      if (this._available){
         delete this._ms[key];
         this._set(this._msid, JSON.stringify(this._ms));
      }
      else
         return false;
   },
   /**
    * Возвращает текущую сессию в виде объекта
    * @return {*}
    */
   toObject : function(){
      return this._ms;
   }
};

/**
 * Менеджер окон
 *
 * @singleton
 * @class $ws.single.WindowManager
 * @extends $ws.proto.Abstract
 */
$ws.single.WindowManager = new ($ws.proto.Abstract.extend(/** @lends $ws.single.WindowManager.prototype */{
   /**
    * @event onAreaFocus Переход фокуса в какую-то область
    * @param {$ws.proto.EventObject} eventObject Дескриптор события
    * @param {$ws.proto.AreaAbstract} area Область, в которую перешёл фокус
    */
   _windows : [],
   _tabEventEnable: true,
   _focusIn: undefined,
   _focusOut: undefined,
   _focusControlled: false,
   _acquireIndex: 1000,
   _acquiredIndexes: [],
   _modalIndexes: [],
   _visibleIndexes: [],
   _windowsStack: [],
   _currentVisibleIndicator: null,
   /**
    * Поднять окно в стеке.
    * Поднимает окно вверх в стеке окон если это возможно.
    * В случае индикатора пытается поднять его именно туда, куда нужно (сложная логика).
    * Возвращает успешность подняние.
    * @param {$ws.proto.Window} window
    * @returns {Boolean} Успешность/доступность поднятия.
    */
   pushUp: function(window) {
      var
         movable = window.isMovableToTop(),
         found = false,
         i,
         item,
         stack = [];
      if( movable === true ) {
         // Обычное поведение, просто пушим окно наверх.
         this.popBack(window);
         this._windowsStack.push({
            visible: function(){
               return window.isVisible();
            },
            window:  window
         });
         return true;
      } else if( movable === null ) {
         // Нужно пропушить индикатор, над которым есть скрытые индикаторы — пропушим их все сразу.
         for(i = this._windowsStack.length - 1; i >= 0 && !found; --i) {
            item = this._windowsStack[i];
            if(!found && item.window._isIndicator) {
               stack.push(item);
               found = item.window === window;
               this._windowsStack.splice(i,1);
            }
         }
         for(i = stack.length - 1; i >= 0; --i) {
            this._windowsStack.push(stack[i]);
         }
         return true;
      } else if ( movable === false ) {
         // Либо не нужно пушить,
         if(!window._isIndicator) {
            return false;
         }
         //    либо нужно пушить индикатор, над которым есть видимые индикаторы.
         i = 0;
         while(i < this._windowsStack.length && found !== null) {
            item = this._windowsStack[i];
            if( found === false ) {
               found = item.window === window;
            }
            if( found === true && item.window._isIndicator ) {
               if(item.window !== window && item.visible()) {
                  found = null;
                  Array.prototype.splice.apply(this._windowsStack, [i,0].concat(stack));
               } else {
                  stack.push(this._windowsStack.splice(i,1)[0]);
                  i--;
               }
            }
            i++;
         }
      }
      return false;
   },
   /**
    * Удалить окно из стека
    * Удаляет окно из стека без всяких проверок.
    * @param {$ws.proto.Window} window
    */
   popBack: function(window) {
      this._windowsStack = $ws.helpers.filter(this._windowsStack, function(item){
         return item.window !== window;
      });
   },
   /**
    * Убрать окно из стека.
    * Пытается удалить окно из стека и показать следующее видимое окно и рассчитать положение следующего видимого индикатора.
    * @param {$ws.proto.Window} window
    */
   popAndShowNext: function(window) {
      if(!window._isIndicator) {
         this.popBack(window);
      }
      var
         windowVisible = false,
         stack = this._windowsStack;
      // возможно стоит добавить проверку, что скрыли верхнее окно? но вроде бы и так хуже не станет
      for(var i = stack.length - 1; i >= 0; i--) {
         var stackItem = stack[i];
         if(stackItem.window._isIndicator && stackItem.window._isIndicatorVisible) {
            // Нашли индикатор (который сейчас был скрыт). Покажем его.
            if(stackItem.window !== window) { // ... кроме случая, когда его же только что и скрыли
               if(!windowVisible) {
                  // Должны показать индикатор с оверлеем поверх всего.
                  if(stackItem.window._myIndicator) {
                     // sbisdoc://1+ОшРазраб+27.02.14+84600+2DBDF88C-35F7-4D89-A64B-3FFA3E7584F+
                     stackItem.window._myIndicator.show();
                  }
               } else if(this._pendingIndicator === stackItem.window._myIndicator) {
                  // Пытаемся показать индикатор, который покажем поверх всего чуть позже,
                  //    ... поэтому здесь и сейчас ничего не будем с ним делать.
               }
               else {
                  // У нас есть окна над индикатором. Покажем индикатор с оверлеем под окнами.
                  stackItem.window.show(true);
                  this.setCurrentVisibleIndicator(stackItem.window._myIndicator);
                  stackItem.window._myIndicator._isVisible = true;
               }
            }
            return;
         } else if(stackItem.visible()) {
            // Нашли окно. Оно уже видмо. Ничего не неужно делать. Запомним это.
            windowVisible = true;
            // Если скрывали не индикатор, то ничего делать больше не нужно.
            if(!window._isIndicator) {
               break;
            }
         }
      }
   },
   /**
    * Получить стек окон
    * @returns {Array}
    */
   getStack: function() {
      return this._windowsStack;
   },
   /**
    * Получить текущий видимый индикатор
    * @returns {null|$ws.proto.LoadingIndicator}
    */
   getCurrentVisibleIndicator: function() {
      return this._currentVisibleIndicator;
   },
   /**
    * Установить текущий видимый индикатор
    * @param {null|$ws.proto.LoadingIndicator} indicator
    */
   setCurrentVisibleIndicator: function(indicator) {
      this._currentVisibleIndicator = indicator;
   },
   acquireZIndex: function(isModal) {
      this._acquireIndex += 10;
      var index = this._acquireIndex;
      this._acquiredIndexes.push(index);
      if(isModal)
         this._modalIndexes.push(index);
      return index;
   },
   setVisible: function(index) {
      if(Array.indexOf(this._visibleIndexes, index) == -1) {
         this._visibleIndexes.push(index);
      }
   },
   setHidden: function(index) {
      var pos = Array.indexOf(this._visibleIndexes, index);
      if(pos >= 0) {
         this._visibleIndexes.splice(pos, 1);
      }
   },
   releaseZIndex: function(index) {
      $ws.helpers.forEach(['acquired', 'visible', 'modal'], function(name) {
         var arr = this['_' + name + 'Indexes'],
             pos = Array.indexOf(arr, index);
         if(pos >= 0) {
            arr.splice(pos, 1);
         }
      }.bind(this));

      this._acquireIndex = Math.max.apply(Math, [1000].concat(this._acquiredIndexes));
   },
   getMaxVisibleZIndex: function() {
      var r = 0;
      $ws.helpers.forEach(this._visibleIndexes, function(n){
         if(n > r && Array.indexOf(this._modalIndexes, n) != -1)
            r = n;
      }, this);
      return r;
   },
   /**
    * Инициализирует менеджер
    */
   init: function(){
      this._publish('onAreaFocus');
   },
   /**
    * Инициализация, требующая jQuery
    */
   postInit: function() {
      $(function(){
         this._createFirstElementToFocus();
         this._createLastElementToFocus();
      }.bind(this));
   },
   /**
    * Находит окно, у котрого нужно активировать первый/последний контрол
    * @return {$ws.proto.AreaAbstract|undefined}
    */
   _findActiveWindow: function(){
      var activeWindow = $ws.single.WindowManager.getActiveWindow();
      if(activeWindow){
         activeWindow = activeWindow.findParent(function(area){
            return $ws.proto.FloatArea && area instanceof $ws.proto.FloatArea;
         }) || activeWindow.getTopParent();
         return activeWindow;
      }
      return undefined;
   },
   /**
    * Создаёт первый элемент для фокуса
    * @private
    */
   _createFirstElementToFocus: function(){
      if(this._focusIn){
         this._focusIn.remove();
      }
      var self = this,
         moveFocus = function(){
            if(!self._focusControlled){
               var activeWindow = self._findActiveWindow();
               if(activeWindow){
                  activeWindow.activateFirstControl();
               }
            }
         };
      this._focusIn = $('<a class="ws-focus-in" tabindex="0"></a>').prependTo('body')
         .bind('focusin', moveFocus);
   },
   /**
    * Создаёт последний элемент для фокуса
    * @private
    */
   _createLastElementToFocus: function(){
      if(this._focusOut){
         this._focusOut.remove();
      }
      var self = this;
      this._focusOut = $('<a class="ws-focus-out" tabindex="0"></a>').appendTo('body')
         .bind('focusin', function(){
            if(!self._focusControlled){
               var activeWindow = self._findActiveWindow();
               if(activeWindow){
                  activeWindow.activateLastControl();
               }
            }
         });
   },
   /**
    * Переносит фокус на первый элемент
    */
   focusToFirstElement: function(){
      if(this._focusIn){
         this._focusControlled = true;
         this._focusIn.focus();
         this._focusControlled = false;
      }
   },
   /**
    * Переносит фокус на последний элемент
    */
   focusToLastElement: function(){
      if(this._focusOut){
         this._focusControlled = true;
         $('body').append(this._focusOut);
         this._focusOut.focus();
         this._focusControlled = false;
      }
   },

   _findWindowIndex: function(window) {
      var i, windows = this._windows, ln = windows.length;
      for (i = 0; i !== ln; i++) {
         if (windows[i] === window)
            return i;
      }
      return -1;
   },

   _checkRegisterBatchUpdaterActions: function() {
      //Функция выполняется только один раз
      this._checkRegisterBatchUpdaterActions = function() {};

      var self = this;
      //Активирует последний активный контрол с последнего активного окна
      $ws.single.ControlBatchUpdater.registerDelayedAction('WindowManager.activateControl', function() {
         var nextWindow = self.getLastActiveWindow();
         if (nextWindow){
            nextWindow.onBringToFront();
         }
      }, 'FocusActions');
   },

   /**
    * @param {$ws.proto.AreaAbstract} window
    */
   addWindow : function(window){
      if (this._findWindowIndex(window) === -1) {
         var self = this;

         this._checkRegisterBatchUpdaterActions();
         this._windows.push(window);

          if($ws.helpers.instanceOfModule(window, 'SBIS3.CORE.AreaAbstract')){
            window.subscribe("onActivate", function(){ self.onActivateWindow(this); });
         }
      }
   },

   /**
    * Удаляет окно из менеджера
    * @param {$ws.proto.AreaAbstract} window Окно, которое необходимо удалить
    */
   removeWindow: function(window){
      if (this._activeWindow === window) {
         this._activeWindow = null;
      }

      this.deactivateWindow(window, function(idx) {
         if (idx !== -1) {
            this._windows.splice(idx, 1);
         }
      }.bind(this));
   },

   /**
    * Общая служебная функция-обвязка для различных способов деактивации окна. Используется при удалении окна в деструкторе и вызове removeWindow,
    * а также при нестандартном скрытии окна в плавающей панели, например.
    * @param window Окно, которое будет деактивироваться.
    * @param deactivateFn Пользовательская функция деактивации. В неё передаётся индекс этого окна в менеджере окон. Если окно уже удалено из менеджера, передастся -1.
    */
   deactivateWindow: function(window, deactivateFn) {
      var idx = this._findWindowIndex(window),
         activeControl,
         activeIsChildOrSelf;
      if (idx !== -1) {
         activeControl = this.getLastActiveWindow();
         while (activeControl && activeControl !== window) {
            activeControl = activeControl.getParent();
         }

         deactivateFn(idx);

         //Если удаляется активное окно (область), или окно с дочерним окном, которое является активным,
         //то нужно, удалив это окно, активировать предыдущее активное, иначе ничего делать не надо,
         //потому что окно, создавшись, могло не захватывать активность и фокус (пример - плав. панель с опцией catchFocus = false)
         if (activeControl === window) {
            $ws.single.ControlBatchUpdater.runBatchedDelayedAction('WindowManager.activateControl');
         }
      } else  {
         deactivateFn(-1);
      }
   },

   /**
    * Обработчик события активации окна
    * @param window
    */
   onActivateWindow : function(window) {
      this._activeWindow = window;
      if(window){
         window.setActivationIndex(this.getMaxActivisionIndex() + 1);
         this._notify('onAreaFocus', window);
      }
   },
   /**
    * Получить ссылку на ws Объект активного кона
    */
   getActiveWindow : function() {
      return this._activeWindow;
   },

   disableTabEvent: function(){
      this._tabEventEnable = false;
   },
   enableTabEvent: function(){
      this._tabEventEnable = true;
   },
   getTabEvent: function(){
      return this._tabEventEnable;
   },
   /**
    * Получить отображаемое окно с максимальным z-index
    * @param {Function} [filterFunc] функция-фильтр, указывающая, учитывать ли окно в поиске
    */
   getMaxZWindow : function(filterFunc) {
      var maxZ = -1, maxWindow, i, zIndex,
         windows = this._windows, ln = windows.length, win;
      for(i = 0; i !== ln; i++) {
         win = windows[i];
         if ((!filterFunc || filterFunc(win)) && win.isShow()) {
            zIndex = win.getZIndex();
            if (zIndex > maxZ) {
               maxZ = zIndex;
               maxWindow = win;
            }
         }
      }
      return maxWindow;
   },
   /**
    * Получить отображаемое _модальное_ окно с максимальным z-index среди модальных
    */
   getMaxZModalWindow : function() {
      return this.getMaxZWindow(function(win) { return win.isModal(); });
   },
   /**
    * Возвращает максимальный z-index из всех окон
    * @return {Number}
    */
   getMaxZIndex: function(){
      var maxWindow = this.getMaxZWindow();
      return maxWindow && maxWindow.getZIndex() || 1000;
   },
   /**
    * Возвращает, может ли область получить фокус с учётом родителей
    * @private
    */
   _isWindowAcceptFocus: function(window){
      var parent = window;
      while(parent){
         if(!parent.canAcceptFocus()){
            return false;
         }
         parent = parent.getParent();
      }
      return true;
   },
   /**
    * Возвращает последнее активное окно
    * @return {$ws.proto.AreaAbstract}
    */
   getLastActiveWindow: function(){
      var max = -1, i, idx, win,
         window = undefined, windows = this._windows, ln = windows.length;
      for(i = 0; i !== ln; i++){
         win = windows[i];
         idx = win.getActivationIndex();
         if(idx > max && this._isWindowAcceptFocus(win)){
            max = idx;
            window = win;
         }
      }
      return window;
   },
   /**
    * Возвращает индекс последнего активного окна
    * @return {$ws.proto.AreaAbstract}
    */
   getMaxActivisionIndex: function(){
      var maxWindow = this.getLastActiveWindow();
      return maxWindow && maxWindow.getActivationIndex() || 0;
   },
   /**
    * Выключает последний активный контрол
    * @param {$ws.proto.Control} control Контрол, на который перешёл фокус
    */
   disableLastActiveControl: function(control){
      var window = this._activeWindow;
      if(window){
         var prevActive = window.getActiveChildControl();
         if(prevActive && prevActive.getParent() === window){
            prevActive.setActive(false, undefined, undefined, control);
         }
      }
   }
}))();

/**
 * Инструмент управления location.hash
 * @singleton
 * @class $ws.single.HashManager
  */
$ws.single.HashManager = new ($ws.proto.Abstract.extend(/** @lends $ws.single.HashManager.prototype */{
   /**
    * @event onChange Событие, происходящее при изменении хэша
    * @param {Object} eventObject Дескриптор события
    */
   $constructor: function(){
      if (window){
         var self = this;
         this._replace = true;
         this._publish('onChange');

         window.onhashchange = function(){
            self._notify('onChange');
         };
      }
   },
   _getLocWithoutHash : function(){
      var
         loc = window.location.toString(),
         hPos = loc.indexOf('#');
      if(hPos !== -1)
         loc = loc.substring(0, hPos);
      return loc;
   },
   /**
    * Возвращает параметр из хэша
    * @param {String} name имя параметра.
    * @return {*}
    */
   get : function(name){
      var result = "";
      if (window){
         var
            hash = decodeURI(window.location.hash),
            reg = new RegExp("(?:#|&)" + name + "=(?:[^&]+$|[^&]+(?=&))", "");
         result = hash.match(reg);
      }
      return result ? (result[0].replace(/^./,"").replace(name + "=", "")).replace(/:a:/g, "&") : undefined;
   },
   /**
    * Устанавливает значение в хэш
    * @param {String} name имя параметра.
    * @param {String} value.
    * @param {Boolean} [replace] Установить без добавления записи в историю.
    */
   set : function(name, value, replace, forceReplace){
      if (window && name){
         if (value === undefined || !String.trim("" + value)) {
            this.remove(name, replace);
         } else {
            var
               v = (value + "").replace(/&/g, ":a:"),
               hash = decodeURI(window.location.hash),
               reg = new RegExp(name + "=[^&]+$|" + name + "=[^&]+(?=&)", ""),
               param = [name, v].join("="),
               hashValue;

            if (hash.length)
               hashValue = hash.match(reg) ? hash.replace(reg, param) : [hash, param].join("&");
            else
               hashValue = param;

            if(hashValue.indexOf('#') === 0)
               hashValue = hashValue.substring(1);

            this.setHash(hashValue, replace, forceReplace);
         }
      }
   },
   setHash: function(hashValue, replace, forceReplace){
      var sLoc = this._getLocWithoutHash();
      if(forceReplace || this._replace){
         window.location.replace(sLoc + '#' + hashValue);
      } else {
         window.location = sLoc + '#' + hashValue;
      }
      !forceReplace && (this._replace = replace);
   },
   /**
    * Записывает текущее состояние в историю браузера
    */
   pushState: function(){
      this._replace = false;
      this.set('ws-dummy', '1');
      this._replace = true;
      this.remove('ws-dummy', true);
      $ws.single.NavigationController.saveAllStates();
   },
   remove: function(name, replace){
      if (window){
         var
            hash = decodeURI(window.location.hash),
            reg = new RegExp("&?" + name + "=[^&]+$|" + name + "=[^&]+&", "g"),
            sLoc = this._getLocWithoutHash();

         if(hash.indexOf('#') === 0)
            hash = hash.substring(1);

         if(this._replace){
            window.location.replace(sLoc + "#" + hash.replace(reg, ""));
         } else {
            window.location = sLoc + "#" + hash.replace(reg, "");
         }
         this._replace = replace;
      }
   }
}))();

/**
 * приводит объект Date() к виду, необходимому для передачи в SQL
 * @param {Boolean|Object} [mode] необходимость выводить время.
 *    undefined   - Сериализуется как Дата.
 *    true        - Сериализуется как Дата и время.
 *    false       - Сериализуется как Время.
 *    null        - выбрать тип автоматически (см. setSQLSerializationMode).
 * @returns {String}
 */
Date.prototype.toSQL = function(mode){

   if(mode === Date.SQL_SERIALIZE_MODE_AUTO)
      mode = this._serializeMode;

   var
      year = this.getFullYear(),
      month = this.getMonth() + 1,
      day = this.getDate(),
      hours = this.getHours(),
      minutes = this.getMinutes(),
      seconds = this.getSeconds(),
      milliseconds = this.getMilliseconds(),
      offsetNum = this.getTimezoneOffset(),
      //offset = ['+', 0, ':', 0],
      offset = ['+', 0],
      someDig = function(num, dig) { // функция для форматирования чисел с нужным количеством цифр/ведущих нулей
         if(dig === undefined || dig < 2) {
            dig = 2;
         }
         var
            dec = num % 10;
         num -= dec;
         num /= 10;
         return (dig == 2 ? '' + num : someDig(num, dig-1)) + dec;
      },
      data = '';
   if(mode !== Date.SQL_SERIALIZE_MODE_TIME)
      data = year + '-' + someDig(month) + '-' + someDig(day);
   if(mode !== Date.SQL_SERIALIZE_MODE_DATE){
      if(mode === Date.SQL_SERIALIZE_MODE_DATETIME)
         data += ' ';
      data += someDig(hours) + ':' + someDig(minutes) + ':' + someDig(seconds);
      if(milliseconds) // выводим милисекунды, если они заданы
         data += '.' + someDig(milliseconds, 3);
      if(offsetNum > 0) // добавляем указание часового пояса локали
         offset[0] = '-';
      else
         offsetNum = -offsetNum;
      //offset[3] = offsetNum % 60;
      offsetNum -= offsetNum % 60;
      offset[1] = offsetNum / 60;
      offset[1] = someDig(offset[1]);
      //offset[3] = someDig(offset[3]);
      data += offset.join('');
   }
   return data;
};
/**
 * Метод сравнения дат. Если даты равны, вернёт true, иначе - false
 * @param {Date} d Другая дата.
 * @return {Boolean}
 */
Date.prototype.equals = function(d){
   var res = false;
   if (d instanceof Date)
      res = this.getTime() == d.getTime();
   return res;
};

Date.SQL_SERIALIZE_MODE_DATE = undefined;
Date.SQL_SERIALIZE_MODE_DATETIME = true;
Date.SQL_SERIALIZE_MODE_TIME = false;
Date.SQL_SERIALIZE_MODE_AUTO = null;

/**
 * @param {boolean} mode режим сериализации текущего инстанса даты в SQL-формат по умолчанию
 *    undefined - Сериализуется как Дата.
 *    true - Сериализуется как Дата и время.
 *    false - Сериализуется как Время.
 */
Date.prototype.setSQLSerializationMode = function(mode) {
   this._serializeMode = mode;
};

Date.prototype.getSQLSerializationMode = function() {
   return this._serializeMode;
};

$ws._const.Date = {
   days: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
   daysSmall: ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'],
   longDays: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
   months: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
   monthsSmall: ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'],
   monthsBig: ['ЯНВ', 'ФЕВ', 'МАР', 'АПР', 'МАЙ', 'ИЮН', 'ИЮЛ', 'АВГ', 'СЕН', 'ОКТ', 'НОЯ', 'ДЕК'],
   longMonths: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
   longMonthsSmall: ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'],
   monthsWithDays: ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']
};

/**
 * Откатывает дату
 * @param {Number} timeValue Число, равное количеству миллисекунд,
 * прошедших с полуночи 1 января 1970 года по универсальному времени
 */
Date.prototype.rollback = function(timeValue){
   this.setTime(timeValue);
};

/**
 * Метод форматирования даты.
 * Во многом похож на аналог из пхп.
 * <a href="http://php.net/manual/ru/function.strftime.php">http://php.net/manual/ru/function.strftime.php</a>
 * 
 * Отображение года:
 * <ul>
 *    <li>'%y': Двухзначный порядковый номер года;</li>
 *    <li>'%Y': Четырехзначный номер года;</li>
 *    <li>'%C': Двухзначный порядковый номер столетия (год, делённый на 100, усечённый до целого);</li>
 *    <li>'%g': <b>См. пример 2!</b> Двухзначный номер года в соответствии со стандартом ISO-8601:1988 (см. %V);</li>
 *    <li>'%G': <b>См. пример 2!</b> Полная четырёхзначная версия %g.</li>
 * </ul>
 * Отображение месяца:   
 * <ul>
 *    <li>'%b': Аббревиатура названия месяца (Янв);</li>
 *    <li>'%v': Аббревиатура названия месяца со строчной буквы (янв);</li>
 *    <li>'%B': Полное название месяца (Январь);</li>
 *    <li>'%f': Полное название месяца со строчной буквы (январь);</li>
 *    <li>'%q': Имя месяца с маленькой буквы в родительном падеже (января);</li>
 *    <li>'%m': Двухзначный порядковый номер месяца (01, 02, ...).</li>
 * </ul>
 * Отображение дня:
 * <ul>
 *    <li>'%d': Двухзначное представление дня месяца (с ведущими нулями) (01, 02, ...);</li>
 *    <li>'%e': День месяца, с ведущим пробелом, если он состоит из одной цифры. ( 1,  2, ...);</li>
 *    <li>'%j': Порядковый номер в году, 3 цифры с ведущими нулями;</li>
 *    <li>'%u': Порядковый номер дня недели согласно стандарту ISO-8601.</li>
 * </ul>
 * Отображение недели и дня недели:
 * <ul>
 *    <li>'%a': Сокращённое название дня недели (Пн, Вт, ...);</li>
 *    <li>'%A': Полное название дня недели (Понедельник, ...);</li>
 *    <li>'%w': Порядковый номер дня недели (0 - воскресенье, 1 - понедельник, ...);</li>
 *    <li>'%U': Порядковый номер недели в указанном году, начиная с первого воскресенья в качестве первой недели;</li>
 *    <li>'%W': Порядковый номер недели в указанном году, начиная с первого понедельника в качестве первой недели;</li>
 *    <li>'%V': <b>См. пример 2!</b> Порядковый номер недели в указанном году в соответствии со стандартом ISO-8601:1988.</li>
 * </ul>
 * Отображение времени:
 * <ul>
 *    <li>'%R': Аналогично '%H:%M' (21:17);</li>
 *    <li>'%T': Аналогично '%H:%M:%S' (21:17:56);</li>
 *    <li>'%H': Двухзначный номер часа в 24-часовом формате;</li>
 *    <li>'%I': Двухзначный номер часа в 12-часовом формате;</li>
 *    <li>'%l': Час в 12-часовом формате, с пробелом перед одиночной цифрой;</li>
 *    <li>'%p': 'AM' или 'PM' в верхнем регистре, в зависимости от указанного времени;</li>
 *    <li>'%P': 'am' или 'pm' в зависимости от указанного времени;</li>
 *    <li>'%M': Двухзначный номер минуты;</li>
 *    <li>'%S': Двухзначный номер секунды;</li>
 *    <li>'%z': Смещение временной зоны относительно UTC либо аббревиатура;</li>
 *    <li>'%Z': Смещение временной зоны/аббревиатура, НЕ выдаваемая опцией %z.</li>
 * </ul>
 * Прочее:
 * <ul>
 *    <li>'%Q': квартал (I, II, ...);</li>
 *    <li>'%s': Метка времени Эпохи Unix;</li>
 *    <li>'%%': Символ процента ("%").</li>
 * </ul>
 * 
 * @example
 * 1. Пример вывода даты. 
 * <pre>
 *    var date = new Date();
 *    
 *    date.strftime('Сегодня %e %q %Y года.');
 *    // > "Сегодня 16 апреля 2014 года."
 *    
 *    date.setMonth(date.getMonth()+1);
 *    date.setDate(0);
 *    date.strftime('Последний день текущего месяца будет %e %q %Y года.');
 *    // > "Последний день текущего месяца будет 30 апреля 2014 года."
 * </pre>
 * 2. Про %V, %g и %G. 
 * По стандарту ISO-8601:1988 счет недель начинается с той, которая содержит минимум 4 дня текущего года.
 * Неделя начинается с понедельника, даже если он выпал на предыдущий год.
 * <pre>
 *    var date = new Date(2013,11,30);
 *    
 *    date.toString();
 *    // > "Mon Dec 30 2013 00:00:00 GMT+0400 (Московское время (зима))"
 *    
 *    date.strftime('Дата %d %q %Y года по ISO-8601:1988 выпадает на %V неделю %G года (%G-%V).');
 *    // > "Дата 30 декабря 2013 года по ISO-8601:1988 выпадает на 01 неделю 2014 года (2014-01)."
 * </pre>
 * @param {String} format Формат вывода
 * @returns {String} Возвращает дату в выбранном формате.
 */
Date.prototype.strftime = function() {
   function _xPad(x, pad, r) {
      if(typeof r === 'undefined'){
         r = 10;
      }
      for(; parseInt(x, 10) < r && r > 1; r /= 10){
         x = ('' + pad) + x;
      }
      return '' + x;
   }

   var _formats = {
      a: function (d) {
         return $ws._const.Date.days[d.getDay()];
      },
      A: function (d) {
         return $ws._const.Date.longDays[d.getDay()];
      },
      b: function (d) {
         return $ws._const.Date.months[d.getMonth()];
      },
      B: function (d) {
         return $ws._const.Date.longMonths[d.getMonth()];
      },
      q: function (d) {
         return $ws._const.Date.monthsWithDays[d.getMonth()];
      },
      f: function (d) {
         return $ws._const.Date.longMonthsSmall[d.getMonth()];
      },
      C: function (d) {
         return _xPad(parseInt(d.getFullYear() / 100, 10), 0);
      },
      d: ['getDate', '0'],
      e: ['getDate', ' '],
      g: function (d) {
         return _xPad(parseInt(_formats.G(d) % 100, 10), 0);
      },
      G: function (d) {
         var y = d.getFullYear();
         var V = parseInt(_formats.V(d), 10);
         var W = parseInt(_formats.W(d), 10);

         if (W > V) {
            y++;
         } else if (W === 0 && V >= 52) {
            y--;
         }

         return y;
      },
      H: ['getHours', '0'],
      I: function (d) {
         var I = d.getHours() % 12;
         return _xPad(I === 0 ? 12 : I, 0);
      },
      j: function (d) {
         var ms = d - new Date('' + d.getFullYear() + '/1/1 GMT');
         ms += d.getTimezoneOffset() * 60000; // Line differs from Yahoo implementation which would be equivalent to replacing it here with:
         // ms = new Date('' + d.getFullYear() + '/' + (d.getMonth()+1) + '/' + d.getDate() + ' GMT') - ms;
         var doy = parseInt(ms / 60000 / 60 / 24, 10) + 1;
         return _xPad(doy, 0, 100);
      },
      k: ['getHours', '0'],
      // not in PHP, but implemented here (as in Yahoo)
      l: function (d) {
         var l = d.getHours() % 12;
         return _xPad(l === 0 ? 12 : l, ' ');
      },
      m: function (d) {
         return _xPad(d.getMonth() + 1, 0);
      },
      M: ['getMinutes', '0'],
      p: function (d) {
         return ['AM', 'PM'][d.getHours() >= 12 ? 1 : 0];
      },
      P: function (d) {
         return ['am', 'pm'][d.getHours() >= 12 ? 1 : 0];
      },
      Q: function (d) {
         return ['I','II','III','IV'][parseInt(d.getMonth() / 3, 10)];
      },
      s: function (d) { // Yahoo uses return parseInt(d.getTime()/1000, 10);
         return Date.parse(d) / 1000;
      },
      S: ['getSeconds', '0'],
      u: function (d) {
         var dow = d.getDay();
         return ((dow === 0) ? 7 : dow);
      },
      U: function (d) {
         var doy = parseInt(_formats.j(d), 10);
         var rdow = 6 - d.getDay();
         var woy = parseInt((doy + rdow) / 7, 10);
         return _xPad(woy, 0);
      },
      V: function (d) {
         var woy = parseInt(_formats.W(d), 10);
         var dow1_1 = (new Date('' + d.getFullYear() + '/1/1')).getDay();
         // First week is 01 and not 00 as in the case of %U and %W,
         // so we add 1 to the final result except if day 1 of the year
         // is a Monday (then %W returns 01).
         // We also need to subtract 1 if the day 1 of the year is
         // Friday-Sunday, so the resulting equation becomes:
         var idow = woy + (dow1_1 > 4 || dow1_1 <= 1 ? 0 : 1);
         if (idow === 53 && (new Date('' + d.getFullYear() + '/12/31')).getDay() < 4) {
            idow = 1;
         } else if (idow === 0) {
            idow = _formats.V(new Date('' + (d.getFullYear() - 1) + '/12/31'));
         }
         return _xPad(idow, 0);
      },
      w: 'getDay',
      W: function (d) {
         var doy = parseInt(_formats.j(d), 10);
         var rdow = 7 - _formats.u(d);
         var woy = parseInt((doy + rdow) / 7, 10);
         return _xPad(woy, 0, 10);
      },
      y: function (d) {
         return _xPad(d.getFullYear() % 100, 0);
      },
      Y: 'getFullYear',
      z: function (d) {
         var o = d.getTimezoneOffset();
         var H = _xPad(parseInt(Math.abs(o / 60), 10), 0);
         var M = _xPad(o % 60, 0);
         return (o > 0 ? '-' : '+') + H + M;
      },
      Z: function (d) {
         return d.toString().replace(/^.*\(([^)]+)\)$/, '$1');
      },
      '%': function (d) {
         return '%';
      }
   };

   var _aggregates = {
      c: '%a %d %b %Y %r %Z',
      D: '%d/%m/%y',
      F: '%y-%m-%d',
      h: '%b',
      n: '\n',
      r: '%I:%M:%S %p',
      R: '%H:%M',
      t: '\t',
      T: '%H:%M:%S',
      x: '%d/%m/%Y',
      X: '%r'
   };

   return function(format){
      var self = this;

      // First replace aggregates (run in a loop because an agg may be made up of other aggs)
      while (format.match(/%[cDFhnrRtTxX]/)) {
         format = format.replace(/%([cDFhnrRtTxX])/g, function (m0, m1) {
            return _aggregates[m1];
         });
      }

      // Now replace formats - we need a closure so that the date object gets passed through
      return format.replace(/%([aAbBCdefgGHIjklmMpPsqQSuUVwWyYzZ%])/g, function (m0, m1) {
         var f = _formats[m1];
         if (typeof f === 'string') {
            return self[f]();
         } else if (typeof f === 'function') {
            return f(self);
         } else if (typeof f === 'object' && typeof(f[0]) === 'string') {
            return _xPad(self[f[0]](), f[1]);
         } else { // Shouldn't reach here
            return m1;
         }
      });
   }
}();

/**
 * Пытается разобрать дату из БД в объект Date
 * @param {String} date_time.
 * @returns {Date}.
 */
Date.fromSQL = function(date_time) {
   var
      dateSep = date_time.indexOf("-"),
      timeSep = date_time.indexOf(":"),
      millisecSep = date_time.indexOf("."),
      tz = date_time.match(/([0-9]{2}:[0-9]{2}:[0-9]{2}(?:\.[0-9]{1,9})?)([+-])([0-9]{2})[:-]*([0-9]{2})*$/),
      tzSep = tz && tz.index + tz[1].length || -1,
      timeOffset = tz && ((tz[2]+"1")*(tz[3]*60 + (tz[4]*1||0))) || $ws._const.moscowTimeOffset,
      retval = new Date(),
      ms = null,
      msStr, y, m, d;

   retval.setHours( 0, 0, 0, 0 );

   if(timeSep === -1 && dateSep === -1)
      return retval;

   if(millisecSep !== -1){
      msStr = date_time.substr(millisecSep+1, (tzSep == -1 ? date_time.length : tzSep) - (millisecSep + 1));
      if(msStr.length > 3) {
         msStr = msStr.substr(0,3);
      }
      ms = parseInt(msStr, 10);
      if(msStr.length < 3)
         ms *= (msStr.length === 2 ? 10 : 100);
   }

   if( dateSep !== -1 ) {
      y = parseInt(date_time.substr(dateSep-4,4), 10);
      m = parseInt(date_time.substr(dateSep+1,2), 10) - 1;
      d = parseInt(date_time.substr(dateSep+4,2), 10);

      if ($ws._const.compatibility.dateBug && m === 0 && d == 1) {
         retval.setHours(1);
      }

      retval.setFullYear(y, m, d);
   }

   if(timeSep !== -1) {
      retval.setHours(
         parseInt(date_time.substr(timeSep-2,2), 10),
         parseInt(date_time.substr(timeSep+1,2), 10),
         parseInt(date_time.substr(timeSep+4,2), 10),
         ms);
      // Приводим время к местному из Московского если дата передана с сервера со временем
      retval.setMinutes(retval.getMinutes() - timeOffset - retval.getTimezoneOffset());
   }

   return retval;
};

/**
 * Отменяет перевод времени, производимый в функции fromSQL.
 * Изменяет пришедшую дату.
 * @returns {Date} Возвращает текущую уже изменённую дату.
 */
Date.prototype.toServerTime = function() {
   // Приводим время к местному из Московского
   this.setMinutes(this.getMinutes() + this.getTimezoneOffset() + $ws._const.moscowTimeOffset );
   return this;
};

/**
 * Установить дату на последний день месяца
 * @param {Number} [month] Номер месяца 0 - 11, последний день которого нужен.
 * Если не указан берется из даты.
 * @returns {Date}
 */
Date.prototype.setLastMonthDay = function( month ){
   month = month === undefined ? this.getMonth() : parseInt( month, 10 );
   this.setDate(1);
   this.setMonth(month + 1);
   this.setDate(0);
   return this;
};



Object.isEmpty = function(obj) {
   if(typeof(obj) !== 'object' || obj === null)
      return false;

   if(obj instanceof Object) {
      for(var i in obj)
         return false;
   }

   return true;
};

Object.isValid = function(obj) {
   return obj !== null && !(obj instanceof Date) && typeof(obj) == 'object' && !Object.isEmpty(obj);
};

/**
 * Возвращает ключи и значения объекта в отсортированном виде.
 * Сортирует либо по ключам, либо по значениям. Зависит от параметра sortByValues.
 *
 * @param {Object} obj объект
 * @param {Boolean} [sortByValues] Сортировать по занчениям (true) или по ключам (false).
 * @returns {Object} Объект с ключами. keys - ключи, values - значения.
 */
Object.sortedPairs = function(obj, sortByValues) {
   var
         keys = Object.keys(obj),
         values = [],
         tempValue,
         comparator = function(a, b) {
            var aFloat = parseFloat(a),
                bFloat = parseFloat(b),
                aNumeric = aFloat + '' === a,
                bNumeric = bFloat + '' === b;
            if (aNumeric && bNumeric) {
                return aFloat > bFloat ? 1 : aFloat < bFloat ? -1 : 0;
            } else if (aNumeric && !bNumeric) {
                return 1;
            } else if (!aNumeric && bNumeric) {
                return -1;
            }
            return a > b ? 1 : a < b ? -1 : 0;
         };

   sortByValues = sortByValues || false;

   for(var i = 0, l = keys.length; i<l; i++) {
      values.push(obj[keys[i]]);
   }

   for (i = values.length - 2; i >= 0; i--) {
      for (var j = 0; j <= i; j++) {
         var what = sortByValues ? values : keys;
         var ret = comparator(what[j + 1], what[j]);
         if (ret < 0) {
             tempValue = values[j];
             values[j] = values[j + 1];
             values[j + 1] = tempValue;

             tempValue = keys[j];
             keys[j] = keys[j + 1];
             keys[j + 1] = tempValue;
         }
      }
   }
   return { keys: keys, values: values };
};

if(Object.keys === undefined) {
   /**
    * Возвращает ключи объекта
    * @param {Object} obj
    * @return {Array}
    */
   Object.keys = function(obj) {
      var rv = [];
      for(var k in obj) {
         if(obj.hasOwnProperty(k))
            rv.push(k);
      }
      return rv;
   }
}

/**
 * Привязывает фукнцию к заданному контексту и аргументам
 * (Почти) Аналог Function.bind из ES5.
 * @param {*} ctx Привязанный контекст исполнения.
 * @param {*} [arg...] Аргумент...
 * @returns {Function}
 *
 * @see https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Function/bind
 *
 * <pre>
 *   function sum(a, b, c) {
 *     return a + b + c;
 *   }
 *   var sum10 = sum.bind(undefined, 10);
 *   alert(sum(20, 1)); // 31, == sum.apply(undefined, [ 10, 20, 1 ]);
 *
 *   function getA() {
 *      alert(this.a);
 *   }
 *   var a10 = getA.bind({ a: 10 });
 *   a10(); // 10, == getA.apply({ a : 10 }, []);
 * </pre>
 */
if (!Function.prototype.bind) {
   (function() {
      var funcSlice = Array.prototype.slice,
          funcPush = Array.prototype.push;
      Function.prototype.bind = function(ctx) {
         var f = this, args = arguments;
         if (args.length > 1) {
            return function () {
               var selfArgs = funcSlice.call(args, 1);
               if (selfArgs.concat) {
                  selfArgs = selfArgs.concat(funcSlice.call(arguments));
               } else {
                  funcPush.apply(selfArgs, funcSlice.call(arguments));
               }
               return f.apply(ctx, selfArgs);
            }
         } else {
            return function () {
               return f.apply(ctx, arguments);
            }
         }
      };
   })();
}

Function.prototype.debounce = function (delay, first) {
   var f = this, timer;
   return function () {
      if (first && !timer)
         f.apply(this, arguments);
      if (timer)
         clearTimeout(timer);
      var argsToCallWith = Array.prototype.slice.call(arguments);
      argsToCallWith.unshift(this);
      // f.bind(this, arg1, arg2, arg3, ...);
      timer = setTimeout(f.bind.apply(f, argsToCallWith), delay);
   };
};

Function.prototype.throttle = function (delay, last) {
   var f = this, next = f, state = 1;
   return function () {
      if (state) {
         next.apply(this, arguments);
         state = 0;
         setTimeout(function () {
            state = 1;
         }, delay);
      }
      else
         next = f.bind(this, arguments);
   }
};

Function.prototype.callAround = function(fn){
   if(fn){
      var f = this;
      return function(){
         Array.prototype.unshift.call(arguments, f);
         return fn.apply(this, arguments);
      }
   } else
      return this;
};

Function.prototype.once = function() {
   var
      original = this,
      called = false,
      result;
   return function() {
      if (!called) {
         result = original.apply(this, arguments);
         called = true;
      } else {
         original = null;
      }
      return result;
   }
};
/**
 * Метод обертки функции. Вызовет перед доопределяемой функцией переданную.
 * Если переданная функция вернула результат, добавит его последним аргументом
 * @param fn Функция, которую нужно позвать до исходной
 * @returns {Function} Доопределенная функция
 * <pre>
 *    var func = function(){
 *          alert(arguments[1]); //выведет false, если доопределить
 *       },
 *        beforeFunc = function(){
 *           if(arguments[1] === true)
 *             arguments[1] === false;
 *        },
 *        newFunc = func.callBefore(beforeFunc);
 * </pre>
 */
Function.prototype.callBefore = function(fn){
   if(fn){
      var f = this;
      return function(){
         var res = fn.apply(this, arguments);
         if(res !== undefined)
            Array.prototype.push.call(arguments, res);
         return f.apply(this, arguments);
      }
   } else
      return this;
};

Function.prototype.callBeforeWithCondition = function(fn, condition) {
   if (fn) {
      return this.callBefore(function() {
         if (condition && condition.apply(this, [])) {
            return fn.apply(this, arguments);
         }
      });
   } else {
      return this;
   }
};

Function.prototype.callNext = function(fn){
   var f = this;
   return function(){
      var res = f.apply(this, arguments),
         sourceResult = res;
      if(fn){
         Array.prototype.push.call(arguments, res);
         res = fn.apply(this, arguments);
      }
      return res === undefined ? sourceResult : res;
   }
};

Function.prototype.callNextWithCondition = function(fn, condition){
   if(fn)
      return this.callNext(function(){
         if(condition && condition.apply(this, [])){
            return fn.apply(this, arguments);
         }
      });
   else
      return this;
};

Function.prototype.callIf = function(condition){
   var f = this;
   return function() {
     if(condition && condition.apply(this, [])){
        return f.apply(this, arguments);
     }
   };
};

if(String.prototype.trim === undefined) {
   String.prototype.trim = function() {
      return this.replace(/^\s+|\s+$/g, '');
   };
}

String.prototype.beginsWith = function(s) {
   s = ('' + s);
   return this.substr(0, s.length) === s;
}

String.prototype.ucFirst = function() {
   return this.substr(0, 1).toUpperCase() + this.substr(1);
}


if(String.trim === undefined) {
   String.trim = function(str) {
      return str.trim();
   };
}

if(!Object.create) {
   Object.create = (function(){
      function F(){}

      return function(o){
         if (arguments.length != 1) {
            throw new Error('Object.create implementation only accepts one parameter.');
         }
         F.prototype = o;
         return new F()
      }
   })()
}

/**
 * Получить копию массива.
 * Создает копию не только основного массива как делает slice,
 * но также создает копию внутренних массивов
 * @returns {Array} массив, копию которого нужно получить
 */
Array.clone = function(array){
   var copy = array.slice(),
       obj = {};
   for(var i = 0, l = copy.length; i < l; i++ ){
      if(copy[i]) {
         if(Object.prototype.toString.call(copy[i]) == "[object Array]") {
            copy[i] = Array.clone(copy[i]);
         } else if (Object.prototype.toString.call(copy[i]) == "[object Object]"){
            obj = copy[i] = $ws.core.merge({}, copy[i]);
            for(var j in obj){
               if(obj.hasOwnProperty(j) && Object.prototype.toString.call(obj[j]) == "[object Array]"){
                  obj[j] = Array.clone(obj[j]);
               }
            }
         }
      }
   }
   return copy;
};
Array.isArray = function(arg) {
   return Object.prototype.toString.call(arg) === '[object Array]';
};

Array.indexOf = function(arr, e /*, from */) {

   if(!(arr instanceof Array))
      throw new TypeError("Incorrect type of the first arguments. Array expected");

   if([].indexOf)
      return arr.indexOf(e, arguments[2]);

   var len = arr.length;
   var from = Number(arguments[2]) || 0;
   from = (from < 0) ? Math.ceil(from) : Math.floor(from);
   if (from < 0)
      from += len;
   for(; from < len; from++) {
      if(arr[from] === e)
         return from;
   }
   return -1;
};

Array.remove = function(arr, index, count) {
   var resCount = count ? count : 1;
   if (!(arr instanceof Array))
      throw new TypeError("Incorrect type of the first arguments. Array expected");
   return arr.splice(index, resCount);
};

Array.insert = function(arr, index) {
   if (!(arr instanceof Array))
      throw new TypeError("Incorrect type of the first arguments. Array expected");
   if (typeof(index) == 'undefined') {
      throw new TypeError("Index must be defined");
   }
   var curIndex = index;
   for (var i = 2; i <= arguments.length; i++) {
      if (arguments.hasOwnProperty(i)) {
         arr.splice(curIndex++, 0, arguments[i]);
      }
   }
   return [];
};

/**
 * Конструктор класса TransportError
 * @param {String} message - текст ошибки.
 * @param {String} [httpError] - код HTTP ошибки.
 * @param {Number} [code] - код ошибки бизнес-логики.
 * @param {String} [methodName] - имя вызванного метода бизнес-логики.
 * @param {String} [details] - детальное описание ошибки.
 * @param {String} [url] - адрес, который загружался.
 * @param {String} [errType] - Тип ошибки.
 * @param {String} [addinfo] - Доп информация.
 *
 * @constructor
 * @class TransportError
 * @extends HTTPError
 */
function TransportError(message, httpError, code, methodName, details, url, classid, errType, addinfo){
   this.message = message;
   this.httpError = httpError === undefined ? "" : httpError;
   this.code = code || 0;
   this.name = 'Transport error';
   this.methodName = methodName || "";
   this.details = details || "";
   this.url = url || '';
   this.classid = classid || '';
   this.errType = errType || 'error';
   this.addinfo = addinfo || '';
}

/**
 * HTTP-ошибка
 *
 * @param message Человекопонятное сообщение об ошибке.
 * @param httpError HTTP-код ошибки.
 * @param url Адрес.
 * @param payload.
 *
 * @constructor
 * @class HTTPError
 * @extends Error
 */
function HTTPError(message, httpError, url, payload) {
   this.message = message || '';
   this.name = 'HTTP error';
   this.httpError = httpError === undefined ? '' : httpError;
   this.url = url || '';
   this.payload = payload || '';
   this.processed = false;
}

/**
 * Наследуем HTTPError от Error
 */
$ws.core.classicExtend(HTTPError, Error);
/**
 * Наследуем TransportError от HTTPError
 */
$ws.core.classicExtend(TransportError, HTTPError);
/**
 * Переопределяем метод toString
 */
TransportError.prototype.toString = function(){
   return [this.name, ': ', this.message, '; method: ', this.methodName, '; code: ', this.code,'; httpError: ', this.httpError, '; details: ', this.details].join('');
};

HTTPError.prototype.toString = function(){
   return [this.name, ': ', this.message, '; httpError: ', this.httpError, '; url: ', this.url].join('');
};

$ws._const.key = {
   left: 37,
   up: 38,
   right: 39,
   down: 40,
   insert: 45,
   del: 46,
   space: 32,
   backspace: 8,
   minus: 109,
   plus: 107,
   enter: 13,
   esc: 27,
   f1: 112,
   f3: 114,
   f4: 115,
   f5: 116,
   f7: 118,
   f12: 123,
   meta: 157,
   underscore: 95,
   pageUp: 33,
   pageDown: 34,
   end: 35,
   home: 36,
   tab: 9,
   ctrl: 17,
   b: 66,
   h: 72,
   v: 86,
   y: 89,
   q: 81,
   p: 80,
   m: 77,
   n: 78,
   o: 79
};

$ws._const.modifiers = {
   nothing: 0,
   shift: 2,
   control: 4,
   alt: 8
};

$ws._const.operaKeys = {
   43: 'plus',
   45: 'minus'
};

$ws.context = {};

/**
 * @class $ws.single.base64
 * @singleton
 */
$ws.single.base64 = /** @lends $ws.single.base64.prototype */{
   _keyStr : 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
   utf8 : 'UTF-8',
   win1251 : 'WINDOWS-1251',
   auto : 'AUTO',
   noConvert: 'NOCONVERT',

   /**
    * Метод, кодирующий переданные данные в base64
    * @param {String} input.
    * @param {String} [format="UTF-8"] кодировка, в которую будет переведен текст.
    * Возможные значения: UTF-8|WINDOWS-1251|AUTO|NOCONVERT
    * @returns {String} данные в base64.
    */
   encode: function(input, format) {
      var output;
      format = !format || typeof format !== 'string'? this.utf8 : format.toUpperCase();
      if (format === this.utf8) {
         input = $ws.single.iconv.unicode2utf(input);
      } else if (format === this.win1251) {
         input = $ws.single.iconv.unicode2win(input);
      } else if (format === this.auto) {
         input = $ws.single.iconv.autoDetect(input, true);
      } else if (format === this.noConvert) {
         // ничего не делаем
      } else {
         input = encodeURIComponent(input);
      }

      if (typeof btoa !== 'function' || format === this.noConvert) {
         output = this._encode(input);
      } else {
         output = btoa(input);
      }

      return output;
   },

   /**
    * Декодирует данные из base64
    * @param {String} input.
    * @param {String} [format="UTF-8"] кодировка, из которой будет переведен текст.
    * Возможные значения: UTF-8|WINDOWS-1251|AUTO|NOCONVERT
    * @returns {String} Декодированные данные.
    */
   decode: function(input, format) {
      var output;

      input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

      if (typeof atob !== 'function') {
         output = this._decode(input);
      } else {
         output = atob(input);
      }

      // Попытка определить кодировку, медленно
      format = !format || typeof format !== 'string'? this.utf8 : format.toUpperCase();
      if (format === this.utf8) {
         output = $ws.single.iconv.utf2unicode(output);
      } else if (format === this.win1251) {
         output = $ws.single.iconv.win2unicode(output);
      } else if (format === this.auto) {
         output = $ws.single.iconv.autoDetect(output);
      } else if (format === this.noConvert) {
         // ничего не делаем
      } else {
         output = decodeURIComponent(output);
      }

      return output;
   },

   /**
    * Кодирование в base64 средствами JS
    * @param {String} input
    * @returns {String}
    * @private
    */
   _encode: function(input) {
      var output = "",
          i = 0,
          chr1, chr2, chr3,
          enc1, enc2, enc3, enc4;

      while (i < input.length) {
         chr1 = input.charCodeAt(i++);
         chr2 = input.charCodeAt(i++);
         chr3 = input.charCodeAt(i++);

         enc1 = chr1 >> 2;
         enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
         enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
         enc4 = chr3 & 63;

         if (isNaN(chr2)) {
            enc3 = enc4 = 64;
         } else if (isNaN(chr3)) {
            enc4 = 64;
         }

         output = output +
                  this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
                  this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
      }

      return output;
   },

   /**
    * Декодирование из base64 средствами JS
    * @param input
    * @returns {String}
    * @private
    */
   _decode: function(input) {
      var output = '',
          i = 0,
          chr1, chr2, chr3,
          enc1, enc2, enc3, enc4;

      while (i < input.length) {
         enc1 = this._keyStr.indexOf(input.charAt(i++));
         enc2 = this._keyStr.indexOf(input.charAt(i++));
         enc3 = this._keyStr.indexOf(input.charAt(i++));
         enc4 = this._keyStr.indexOf(input.charAt(i++));

         chr1 = (enc1 << 2) | (enc2 >> 4);
         chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
         chr3 = ((enc3 & 3) << 6) | enc4;

         output = output + String.fromCharCode(chr1);

         if (enc3 != 64) {
            output = output + String.fromCharCode(chr2);
         }
         if (enc4 != 64) {
            output = output + String.fromCharCode(chr3);
         }
      }
      return output;
   }
};

/**
 * @class $ws.single.iconv
 * @singleton
 */
$ws.single.iconv = /** @lends $ws.single.iconv.prototype */{
   _CP1251ToUnicode: {
      128:1026 , 129:1027, 130:8218, 131:1107, 132:8222, 133:8230, 134:8224, 135:8225,
      136:8364 , 137:8240, 138:1033, 139:8249, 140:1034, 141:1036, 142:1035, 143:1039,
      144:1106 , 145:8216, 146:8217, 147:8220, 148:8221, 149:8226, 150:8211, 151:8212,
      152:65533, 153:8482, 154:1113, 155:8250, 156:1114, 157:1116, 158:1115, 159:1119,
      160:160  , 161:1038, 162:1118, 163:1032, 164:164 , 165:1168, 166:166 , 167:167 ,
      168:1025 , 169:169 , 170:1028, 171:171 , 172:172 , 173:173 , 174:174 , 175:1031,
      176:176  , 177:177 , 178:1030, 179:1110, 180:1169, 181:181 , 182:182 , 183:183 ,
      184:1105 , 185:8470, 186:1108, 187:187 , 188:1112, 189:1029, 190:1109, 191:1111
   },
   _UnicodeToCP1251: {
      1026:128 , 1027:129, 8218:130, 1107:131, 8222:132, 8230:133, 8224:134, 8225:135,
      8364:136 , 8240:137, 1033:138, 8249:139, 1034:140, 1036:141, 1035:142, 1039:143,
      1106:144 , 8216:145, 8217:146, 8220:147, 8221:148, 8226:149, 8211:150, 8212:151,
      65533:152, 8482:153, 1113:154, 8250:155, 1114:156, 1116:157, 1115:158, 1119:159,
      160:160  , 1038:161, 1118:162, 1032:163, 164:164 , 1168:165, 166:166 , 167:167 ,
      1025:168 , 169:169 , 1028:170, 171:171 , 172:172 , 173:173 , 174:174 , 1031:175,
      176:176  , 177:177 , 1030:178, 1110:179, 1169:180, 181:181 , 182:182 , 183:183 ,
      1105:184 , 8470:185, 1108:186, 187:187 , 1112:188, 1029:189, 1109:190, 1111:191
   },

   /**
    * Конвертирует данные из unicode в win1251
    * @param {String} input Строка в кодировке Unicode (16-bit).
    * @returns {String} Строка в кодировке win1251.
    */
   unicode2win: function(input) {
      var output = "";
      for (var i = 0; i < input.length; i++) {
         var ord = input.charCodeAt(i);
         if (ord < 128) {
            output += String.fromCharCode(ord);
         } else if (ord >= 0x410 && ord <= 0x44f) {
            output += String.fromCharCode( ord - 848 );
         } else if (ord in this._UnicodeToCP1251) {
            output += String.fromCharCode(this._UnicodeToCP1251[ord]);
         } else {
            output = "";
         }
      }

      return output;
   },

   /**
    * Конвертирует данные из win1251 в unicode
    * @param {String} input Строка в кодировке win1251.
    * @returns {String} Строка в кодировке Unicode (16-bit).
    */
   win2unicode: function(input){
      var output = "";
      for (var i = 0; i < input.length; i++) {
         var ord = input.charCodeAt(i);
         if (ord < 128) {
            output += String.fromCharCode(ord);
         } else if (ord >= 192 && ord <= 255) {
            output +=  String.fromCharCode( ord + 848 );
         } else if (ord in this._CP1251ToUnicode) {
            output += String.fromCharCode(this._CP1251ToUnicode[ord]);
         } else {
            output = "";
         }
      }

      return output;
   },

   /**
    * Конвертирует данные из unicode в UTF-8
    * @param {String} input Строка в кодировке Unicode (16-bit).
    * @returns {String} Строка в кодировке UTF-8.
    * @link http://en.wikipedia.org/wiki/UTF-8#Codepage_layout
    * @link http://phpjs.org/functions/utf8_encode/
    * @link http://www.2ality.com/2013/09/javascript-unicode.html
    * @description
    * При кодировании нужно учесть, что UTF-8 однобайтная кодировка,
    * где символы из большого диапазона представлены последовательностью байт.
    * [0x0000–0x007f]: 0xxxxxxx (7 bits, один байт)
    * [0x0080–0x07FF]: 110xxxxx, 10xxxxxx (5+6 bits = 11 bits, 2-х байтная последовательность)
    * [0x0800–0xFFFF]: 1110xxxx, 10xxxxxx, 10xxxxxx (4+6+6 bits = 16 bits, 3-х байтная последовательность)
    * [0x10000–0x10FFFF]: 11110xxx, 10xxxxxx, 10xxxxxx, 10xxxxxx (3+6+6+6 bits = 21 bits, 4-х байтная последовательность)
    * [0x10FFFF-0x1FFFFF]: Неавилдные символы для UTF-8
    */
   unicode2utf: function(input) {
      var output = "";
      //input = input.replace(/\r\n/g,"\n");
      for (var n = 0; n < input.length; n++) {
         var c1 = input.charCodeAt(n);
         if (c1 < 0x80) {
            output += String.fromCharCode(c1);
         } else if(c1 <= 0x7FF) {
            output += String.fromCharCode((c1 >> 6) | 0xC0);
            output += String.fromCharCode((c1 & 0x3F) | 0x80);
         } else if(c1 <= 0xFFFF) {
            output += String.fromCharCode((c1 >> 12) | 0xE0);
            output += String.fromCharCode(((c1 >> 6) & 0x3F) | 0x80);
            output += String.fromCharCode((c1 & 0x3F) | 0x80);
         } else if (c1 <= 0x10FFFF) {
            // surrogate pairs
            if ((c1 & 0xFC00) != 0xD800) {
               throw new RangeError('Unmatched tail surrogate at ' + n);
            }
            var c2 = input.charCodeAt(++n);
            if ((c2 & 0xFC00) != 0xDC00) {
               throw new RangeError('Unmatched lead surrogate at ' + (n - 1));
            }
            c1 = ((c1 & 0x3FF) << 10) + (c2 & 0x3FF) + 0x10000;
            output += String.fromCharCode((c1 >> 18) | 0xF0);
            output += String.fromCharCode(((c1 >> 12) & 0x3F) | 0x80);
            output += String.fromCharCode(((c1 >> 6) & 0x3F) | 0x80);
            output += String.fromCharCode((c1 & 0x3F) | 0x80);
         } else {
            throw Error('Invalid Unicode code point');
         }
      }

      return output;
   },

   /**
    * Конвертирует данные из UTF-8 в unicode
    * @param {String} input Строка в кодировке UTF-8.
    * @returns {String} Строка в кодировке Unicode (16-bit).
    * @link http://en.wikipedia.org/wiki/UTF-8#Codepage_layout
    * @link http://phpjs.org/functions/utf8_decode/
    * @description
    * По стандартам UTF-8 не требует BOM. Его мы вырежем.
    *
    * При декодировании нужно учесть, что UTF-8 однобайтная кодировка,
    * где символы из большого диапазона представлены последовательностью байт.
    * [0x00-0x7F] - ASCII.
    * [0x80-0xBF] - Байты продолжения последовательности. Могут быть только 2, 3, 4 байтами.
    * [0xC0-0xC1] - Невалидные коды.
    * [0xC2-0xDF] - Начало 2-х байтной последовательности. Второй байт должен жыть байтом продолжением.
    * [0xE0-0xEF] - Начало 3-х байтной последовательности. Второй и третий байт должен жыть байтом продолжением.
    * [0xF0-0xF4] - Начало 4-х байтной последовательности. Второй и третий и четвертый байт должен жыть байтом продолжением.
    * [0xF5-0xFF] - Невалидные коды. Так как в юникодые это коды больше U+10FFFF
    */
   utf2unicode: function(input) {
      var output = "",
          i = 0, c1 = 0, c2 = 0, c3 = 0, c4 = 0;

      /* remove BOM */
      if (input.substr(0,3) === 'ï»¿') {
         input = input.substr(3);
      }

      function sequenceError(index, symbol) {
         throw Error('Invalid continuation byte at ' + symbol + ' (index: ' + index + ')');
      }

      while (i < input.length) {
         c1 = input.charCodeAt(i);
         if (c1 < 0x80) {
            output += String.fromCharCode(c1);
            i += 1;
         } else if (c1 < 0xC2) { // continuation or overlong 2-byte sequence
            throw Error('Invalid UTF-8 detected');
         } else if (c1 < 0xE0) { // 2-byte sequence
            c2 = input.charCodeAt(i+1);
            if ((c2 & 0xC0) != 0x80) sequenceError(i+1, c2);

            output += String.fromCharCode(((c1 & 0x1F) << 6) | (c2 & 0x3F));
            i += 2;
         } else if (c1 < 0xF0) { // 3-byte sequence
            c2 = input.charCodeAt(i + 1);
            if ((c2 & 0xC0) != 0x80) sequenceError(i + 1, c2);
            if (c1 == 0xE0 && c2 < 0xA0) sequenceError(i + 1, c2); // overlong

            c3 = input.charCodeAt(i + 2);
            if ((c3 & 0xC0) != 0x80) sequenceError(i + 2, c3);

            output += String.fromCharCode(((c1 & 0x0F) << 12) | ((c2 & 0x3F) << 6) | (c3 & 0x3F));
            i += 3;
         } else if (c1 < 0xF5) { // 4-byte sequence
            c2 = input.charCodeAt(i + 1);
            if ((c2 & 0xC0) != 0x80) sequenceError(i + 1, c2);
            if (c1 == 0xF0 && c2 < 0x90) sequenceError(i + 1, c2); // overlong
            if (c1 == 0xF4 && c2 >= 0x90) sequenceError(i + 1, c2);  // > U+10FFFF

            c3 = input.charCodeAt(i + 2);
            if ((c3 & 0xC0) != 0x80) sequenceError(i + 2, c3);

            c4 = input.charCodeAt(i + 3);
            if ((c4 & 0xC0) != 0x80) sequenceError(i + 3, c4);

            c1 = ((c1 & 0x07) << 18) | ((c2 & 0x3F) << 12) | ((c3 & 0x3F) << 6) | (c4 & 0x3F);
            c1 -= 0x10000;
            output += String.fromCharCode(0xD800 | ((c1 >> 10) & 0x3FF));
            output += String.fromCharCode(0xDC00 | (c1 & 0x3FF));
            i += 4;
         } else { // > U+10FFFF
            throw Error('Invalid UTF-8 detected');
         }
      }

      return output;
   },

   /**
    * Попытаемся сами определить кодировку
    * @param {String} input - входная строка в неизвестной кодировке
    * @param {Boolean} [encode] - перекодировать. По умолчанию пытаемся в UTF-8. Если не получилось в windows-1251
    * @returns {String}
    */
   autoDetect: function(input, encode) {
      var output;
      if (encode) {
         try {
            output = $ws.single.iconv.unicode2utf(input);
         } catch(e) {
            output = $ws.single.iconv.unicode2win(input);
         }
      } else {
         try {
            var deltaUtf, deltaWin, // Погрешность
                j, charCode;

            output = $ws.single.iconv.utf2unicode(input);
            // Сначала пытаемся узнать не UTF-8 ли у нас
            for (deltaUtf = 0, j = 0; j < output.length; j++) {
               charCode = output.charCodeAt(j);
               // Русские символы в UNICODE
               if (charCode >= 0x410 && charCode <= 0x44F) {
                  deltaUtf++;
               }
            }

            // Вполне возможно что строка в UTF-8, но нет кириллицы,
            // но все равно проверим, может есть символы из диаппазона 192-255 кодовой таблицы windows-1251
            for (deltaWin = 0, j = 0; j < input.length; j++) {
               charCode = input.charCodeAt(j);
               // Русские символы в windows-1251
               if (charCode > 0xC0 && charCode < 0xFF) {
                  deltaWin++;
               }
            }

            // если дельта cp1251 больше, предположим, что строка в windows-1251
            output = deltaUtf >= deltaWin ? output : $ws.single.iconv.win2unicode(input);
         } catch(e) {
            // Если не смогли декодировать из UTF-8, предположим, что это windows-1251
            output = $ws.single.iconv.win2unicode(input);
         }
      }
      return output;
   }
};

/**
 * Абстрактный класс работы с конфигурации
 * @class $ws.proto.AbstractConfig
 * @extends $ws.proto.Abstract
 * @control
 */
$ws.proto.AbstractConfig = $ws.proto.Abstract.extend(/** @lends $ws.proto.AbstractConfig.prototype */{
   /**
    * @event onChange Событие, возникающее при изменении параметра
    * @param {Object} eventObject описание в классе $ws.proto.Abstract.
    * @param {String} name Название параметра.
    * @param {String} value Значение параметра.
    */
   $protected: {
       _blo: null
   },
   $constructor : function(){
      this._publish('onChange');
   },

   /**
    * Возвращает имя объекта, ответственного за хранение параметров
    * Должен быть переопределен в дочерних классах.
    */
   _getObjectName: function() {
      throw new Error('AbstractConfig:_getObjectName must be implemented in child classes');
   },

   _getBLObject: function() {
      var
            rv = new $ws.proto.Deferred(),
            self = this;
      if(this._blo === null) {
         return rv.dependOn($ws.core.attachComponent('Source').addCallback(function(){
            self._blo = new $ws.proto.BLObject(self._getObjectName());
            return self._blo;
         }));
      } else
         rv.callback(this._blo);
      return rv;
   },

   /**
    * Обработка полученного параметра
    * @param {String} name ключ.
    * @param {String} value значение.
    * @private
    */
   _processingParam : function(operation, name, value){
      switch (operation){
         case 'update' :
            $ws.single.GlobalContext.setValue(name, value);
            break;
         case 'delete' :
            $ws.single.GlobalContext.removeValue(name);
            break;
      }
      this._notify('onChange', name, value);
   },

   /**
    * Возвращает значение данного параметра
    * @param {String} key Название параметра.
    * @return {$ws.proto.Deferred}
    */
   getParam : function (key) {
      var self = this;
      return this._getBLObject().addCallback(function(blo){
         return blo.call('ПолучитьЗначение', { 'Путь': key }, $ws.proto.BLObject.RETURN_TYPE_ASIS).addCallback(function(v){
            self._processingParam('update', key, v);
            return v;
         });
      })
   },

   /**
    * Возвращает все параметры с их значениями
    * В виде набора записей. В каждой записи два поля: Название и Значение.
    * @return {$ws.proto.Deferred}
    */
   getParams : function () {
      var self = this;
      return this._getBLObject().addCallback(function(blo){
         return blo.call('ПолучитьПараметры', {}, $ws.proto.BLObject.RETURN_TYPE_RECORDSET).addCallback(function(rs){
            var r;
            rs.rewind();
            while((r = rs.next()) !== false) {
               self._processingParam('update', r.get('Название'), r.get('Значение'));
            }
            return rs;
         })
      });
   },

   /**
    * Вставляет параметр со значением
    * @param {String} key Название параметра.
    * @param {String} value Значение параметра.
    * @return {$ws.proto.Deferred}
    */
   setParam: function (key, value) {
      this._processingParam('update', key, value);
      return this._getBLObject().addCallback(function(blo){
         return blo.call(
               'ВставитьЗначение', {
                  'Путь': key,
                  'ЗначениеПараметра': value
               }, $ws.proto.BLObject.RETURN_TYPE_ASIS);
      });
   },

   /***
    * Удаляет параметр
    * @param {String} key Название параметра.
    * @return {$ws.proto.Deferred}
    */
   removeParam: function (key) {
      this._processingParam('delete', key);
      return this._getBLObject().addCallback(function(blo){
         return blo.call('УдалитьПараметр', {
            'Путь': key
         }, $ws.proto.BLObject.RETURN_TYPE_ASIS);
      });
   }
});

/**
 * Класс для взаимодействия с параметрами глобальной конфигурации Клиента
 * В качестве основного хранилища выступает бизнес-логика.
 * Все операции отражаются на глобальном контексте.
 *
 * @author darbinyanad
 * @class $ws.single.ClientsGlobalConfig
 * @extends $ws.proto.AbstractConfig
 * @singleton
 */
$ws.single.ClientsGlobalConfig = new ($ws.proto.AbstractConfig.extend({
   _getObjectName: function() {
      return 'ГлобальныеПараметрыКлиента';
   }
}))();


/**
 * Класс для взаимодействия с параметрами пользовательской конфигурации
 * В качестве основного хранилища выступает бизнес-логика.
 * Все операции отражаются на глобальном контексте.
 *
 * @author darbinyanad
 * @class $ws.single.UserConfig
 * @extends $ws.proto.AbstractConfig
 * @singleton
 */
$ws.single.UserConfig = new ($ws.proto.AbstractConfig.extend({
   _getObjectName: function() {
      return 'ПользовательскиеПараметры';
   },
   _processingParam: function(type, name, value){
      switch (type){
         case 'update':
            $ws.single.MicroSession.set(name, value);
            $ws.single.MicroSession.set('userParamsDefined', true);
            break;
         case 'delete':
            $ws.single.MicroSession.remove(name);
            break;
      }
      $ws.proto.AbstractConfig.prototype._processingParam.apply(this, arguments);
   },
   /**
    * Возвращает значение данного параметра
    * @param {String} key Название параметра.
    * @return {$ws.proto.Deferred}
    */
   getParam : function (key) {
      var self = this;
      return this._getBLObject().addCallback(function(blo){
         return blo.call('ПолучитьЗначение', { 'Путь': key }, $ws.proto.BLObject.RETURN_TYPE_ASIS).addCallback(function(v){
            self._processingParam('update', key, v);
            return v;
         });
      })
   },
   /**
    * Возвращает список значений параметра
    * Список значений возвращается в виде массива строк
    * @param {String} key Название параметра.
    * @return {$ws.proto.Deferred}
    */
   getParamValues: function(key){
      var self = this;
      return this._getBLObject().addCallback(function(blo){
         return blo.call('ПолучитьСписокЗначений', { 'Путь': key }, $ws.proto.BLObject.RETURN_TYPE_ASIS).addCallback(function(v){
            self._processingParam('update', key, v);
            return v;
         });
      });
   },
   /**
    * Вставляет новое значение параметра
    * @param {String} key Название параметра.
    * @param {String} value Значение параметра.
    * @param {Number} [maxCount] Максимальное количество значений параметра. По умолчанию 10.
    * @return {$ws.proto.Deferred}
    */
   setParamValue: function (key, value, maxCount) {
      this._processingParam('update', key, value);
      return this._getBLObject().addCallback(function(blo){
         return blo.call(
               'ДобавитьЗначение', {
                  'Путь': key,
                  'Значение': value,
                  'МаксимальноеКоличество': maxCount || 10
               }, $ws.proto.BLObject.RETURN_TYPE_ASIS);
      });
   }
}))();

/**
 * "Направленный" хэш-мэп.
 * Перебор всегда идет в порядке добавления элементов.
 * Отслеживает конкурентные модификации (попытки изменения при переборе).
 *
 * @class $ws.proto.OrderedHashMap
 * @author Oleg Elifantiev
 */
$ws.proto.OrderedHashMap = (function() {

   'use strict';

   function OrderedHashMap() {
      this._keys = [];
      this._values = [];
      this._reading = false;
      this._helperHash = {};
   };

   /**
    * Добавляет элемент с указанным ключем
    *
    * @param key ключ. Принудительно преобразуется в строку.
    * @param value значение.
    * @returns {Boolean} Добавлен ли элемент.
    */
   OrderedHashMap.prototype.put = function(key, value) {
      this._checkConcurent();
      key = key + '';
      if(!this.contains(key)) {
         this._keys.push(key);
         this._values.push(value);
         this._helperHash[key] = null;
         return true;
      }
      return false;
   };

   /**
    * Вставляет элемент после указанного. Если не указан after, то будет вставлено в конец
    * @param {String|Number} key Ключ.
    * @param {*} value Значение.
    * @param {String|Number} [after] После какого элемента вставлять.
    * @return {Boolean} Удалось ли вставить.
    */
   OrderedHashMap.prototype.insert = function(key, value, after){
      this._checkConcurent();
      key = key + '';
      if(!this.contains(key)){
         var index;
         if(after !== undefined){
            after = after + '';
            if(!this.contains(after)){
               return false;
            }
            index = Array.indexOf(this._keys, after) + 1;
         }
         else{
            index = 0;
         }
         this._keys.splice(index, 0, key);
         this._values.splice(index, 0, value);
         this._helperHash[key] = null;
         return true;
      }
      return false;
   };

   /**
    * Возвращает элемент по ключу
    *
    * @param {String} key Запрашиваемый ключ.
    * @returns {*} Элемент с указанным ключем или undefined.
    */
   OrderedHashMap.prototype.get = function(key) {
      var idx = this._getKeyIndex(key);
      return idx == -1 ? undefined : this._values[idx];
   };

   /**
    * Удаляем элемент по ключу
    * @param {String} key ключ.
    * @returns {Boolean} Удален ли элемент.
    */
   OrderedHashMap.prototype.remove = function(key) {
      this._checkConcurent();
      var idx = this._getKeyIndex(key);
      if(idx !== -1) {
         this._keys.splice(idx, 1);
         this._values.splice(idx, 1);
         this._helperHash[key] = undefined;
         return true;
      }
      return false;
   };

   /**
    * Удаляет несколько ключей
    * @param {Array} keys ключи, которые нужно удалить.
    * @returns {Boolean} true, если все ключи были удалены.
    */
   OrderedHashMap.prototype.removeAll = function(keys) {
      if(keys instanceof Array) {
         var r = true;
         for(var i = 0, l = keys.length; i < l; i++) {
            r &= this.remove(keys[i]);
         }
         return !!r;
      }
      return false;
   };

   /**
    * Перебирает элементы
    * @param {Function} f Функция, выполняемая для каждого элемента.
    * this - хэш-мэп, первый аргумент - ключ, второй - значение.
    * Для остановки перебора вернуть false из функции.
    */
   OrderedHashMap.prototype.each = function(f) {
      this._reading = true;
      try {
         for (var i = 0, l = this._keys.length; i < l; i++) {
            if (f.apply(this, [ this._keys[i], this._values[i] ]) === false)
               break;
         }
      } finally {
         this._reading = false;
      }
   };

   /**
    * Удаляет все значения
    */
   OrderedHashMap.prototype.clear = function() {
      this._checkConcurent();
      this._keys = [];
      this._values = [];
      this._helperHash = {};
   };

   /**
    * Деструктор
    */
   OrderedHashMap.prototype.destroy = function() {
      this._keys = null;
      this._values = null;
      this._helperHash = null;
   };

   /**
    * Проверяет, существует ли такой ключ
    * @param {String} key Ключ.
    * @returns {Boolean} Найден ли ключ.
    */
   OrderedHashMap.prototype.contains = function(key){
      return this._helperHash[key] !== undefined;
   };

   OrderedHashMap.prototype._checkConcurent = function() {
      if(this._reading)
         throw new ReferenceError("Конкурентная модификация объекта. Попытка изменения при переборе");
   };

   OrderedHashMap.prototype._getKeyIndex = function(key) {
      return Array.indexOf(this._keys, key + "");
   };

   return OrderedHashMap;

})();

/**
 * i18n поддержка интернационализации
 * @class i18n
 * @singleton
 */
$ws.single.i18n = {
   /**
    * Инициализация синглтона
    */
   init: function() {
      // Теперь определим текущий язык
      this._currentLang = this.detectLanguage();
      if (this._currentLang && typeof document !== 'undefined') {
         $.cookie('lang', this._currentLang, {path: '/'});
      }

      var global = (function(){ return this || (0,eval)('this'); }());
      global.rk = $ws.single.i18n.rk.bind( $ws.single.i18n );
   },

   detectLanguage: function() {
      if (typeof window === 'undefined') {
         // Мы на препроцессоре, язык попробуем определить из куки
         return (process && process.domain && process.domain.req && process.domain.req.cookies && process.domain.req.cookies.lang) || '';
      }

      var hostname = location.hostname,
          domain = hostname.substring(hostname.lastIndexOf('.') + 1, hostname.length).toUpperCase(),
          avLang = this.getAvailableLang(),
          detectedLng, parts;

      // get from cookie
      detectedLng = $.cookie('lang') || '';

      // get from qs
      if (!detectedLng) {
         detectedLng = $ws.single.GlobalContext.getValue('lang');
      }

      // get from navigator
      if (!detectedLng) {
         detectedLng = navigator.language || navigator.userLanguage;
         // Здесь надо проверить, если формат ru-RU, то совпадает ли страна с доменом
         if (detectedLng.indexOf('-') > -1) {
            parts = detectedLng.split('-');
            if (domain.length == 2 && parts[1] !== domain) {
               detectedLng = parts[0] + '-' + domain;
            }
         }
      }

      if (detectedLng) {
         if (detectedLng.indexOf('-') > -1) {
            parts = detectedLng.split('-');
            detectedLng = parts[0].toLowerCase() + '-' + parts[1].toUpperCase();
         } else if (domain.length == 2) {
            // Вряд ли домен верхнего уровня какой то страны будет больше 2 букв
            detectedLng = detectedLng.toLowerCase() + '-' + domain.toUpperCase();
         }
      }

      // Если уже ничто не помогло, Возьмем первый язык из доступных
      if (!detectedLng || detectedLng.length !== 5 || !avLang[detectedLng]) {
         detectedLng = Object.keys(avLang).length ? Object.keys(avLang)[0] : '';
      }

      return detectedLng;
   },

   /**
    * Возвращает текущий выбранный язык
    * В двухсимвольном виде (EN, RU, DE и т.п.).
    * @returns {string}
    */
   getLang: function(){
      return this._currentLang;
   },

   /**
    * Возвращает список доступных языков, на которые переведена платформа
    * @returns {Object}
    */
   getAvailableLang: function(){
      return $ws._const.availableLanguage;
   },

   /**
    * Проверяет, имеется ли язык в доступных
    * @param {String} language Двухбуквенное название языка.
    * @returns {boolean}
    */
   hasLang: function(language) {
      return language in $ws._const.availableLanguage;
   },

   /**
    * Устанавливает язык, на который будут переводиться значения
    * @param {String} language Двухбуквенное название языка.
    * @returns {boolean}
    */
   setLang: function(language) {
      var changeLang = false;
      if (language && typeof(language) === 'string' && /..-../.test(language) && language !== this._currentLang) {
         var parts = language.split('-');
         this._currentLang = parts[0].toLowerCase() + '-' + parts[1].toUpperCase();
         changeLang = true;
      }

      if (!language) {
         this._currentLang = '';
         changeLang = true;
      }

      if (changeLang && typeof window !== 'undefined') {
         $.cookie('lang', this._currentLang, {path: '/'});
      }

      return changeLang;
   },

   /**
    * Возвращает переведенное значение из словаря по ключу.
    * Если значения нет, возвращается сам ключ.
    * @param {String} key
    * @param {String} ctx
    * @returns {string}
    */
   rk: function(key, ctx) {
      if (typeof window == 'undefined') {
         this.setLang(this.detectLanguage());
      }
      var index = key.indexOf(this._separator);
      if (index > -1) {
         ctx = key.substr(0, index);
         key = key.substr(index + this._separator.length);
      }

      if (this._dict[this._currentLang]) {
         var trans_key = this._dict[this._currentLang][ctx ? '' + ctx + this._separator +  key : '' + key];
         if (trans_key) {
            return trans_key.replace(/</g,'&lt;').replace(/>/g,'&gt;'); // Простое экранирование
         }
      }

      return key;
   },
   /**
    * Проверят наличие словаря по его имени
    * @param {String} dictName.
    * @returns {boolean}
    */
   hasDict: function(dictName) {
      return this._dictNames[this._currentLang] ? dictName in this._dictNames[this._currentLang] : false;
   },

   /**
    * Вставляет новый словарь
    * @param {Object} dict.
    * @param {String} name.
    * @parma {String} [lang=this.getLang()]
    */
   setDict: function(dict, name, lang){
      lang = lang || this.getLang();
      if (lang && !this.hasDict(name)) {
         if (name) {
            this._dictNames[lang] = this._dictNames[lang] || {};
            this._dictNames[lang][name] = true;
         }

         this._dict[lang] = $ws.core.merge(this._dict[lang] || {}, dict);
      }
   },

   /** Разделитель между контекстом и ключом */
   _separator: '@@',
   /** Текущий язык */
   _currentLang: '',
   /** Все загруженные словари, где ключ - слово на языке оригинала */
   _dict: {},
   /** Все загруженные словари, где ключ - имя словаря */
   _dictNames: {}
};

(function() {

   "use strict";

   var
      global = (function(){ return this || (0,eval)('this'); }()),
      _loading = {},
      // во время тестов тестовые модули без инициализации(!) загружаются в этот хеш-меп,
      // чтобы в последствии была возможность инициализировать модуль
      // с заранее подготовленными mock объектами из списка imports
      _test_module_map = {};

   function _construct(name, namespace, imports, constructor) {
      var nsComp = namespace.split('.');
      var root = global;
      var fullName = [namespace, name].join(".");
      for(var i = 0, l = nsComp.length; i < l; i++) {
         var current = nsComp[i];
         if(!root[current])
            root[current] = {};
         root = root[current];
      }

      root[name] = constructor.apply(global, imports);
      (_loading[fullName] = _loading[fullName] || new $ws.proto.Deferred()).callback();
   }

   function _getMod(name) {
      var root = global;
      var nComp = name.split('.');
      for(var i = 0, l = nComp.length; i < l; i++) {
         if(!root[nComp[i]])
            return false;
         root = root[nComp[i]];
      }
      return root;
   }

   function _require(mods){
      var
         pdR = new $ws.proto.ParallelDeferred(),
         result = [];
      if(!(mods instanceof Array))
         mods = [ mods ];
      $ws.helpers.forEach(mods, function(m, i){
         var _m = _getMod(m);
         if(_m)
            result[i] = _m;
         else
            (function(i){
               var url = "";
               // Для начала надо проверить модуль внешний или нет
               if( $ws._const.jsModules[m] )
                  url = $ws._const.resourceRoot + $ws._const.jsModules[m];
               else if( $ws._const.jsCoreModules[m] )
                  url = $ws._const.jsCoreModules[m];

               if(!url)
                  throw new Error("Неизвестный модуль " + m);

               if(!_loading[m]) {
                  _loading[m] = new $ws.proto.Deferred();
                  $ws.core.attach( url );
               }

               _loading[m].addCallback(function(){
                  result[i] = _getMod(m);
               });

               pdR.push(_loading[m]);
            })(i);
      });
      return pdR.done(result).getResult();
   }

   /*
    * Интерфейс загрузкчика модулей
    * Есть 2 реализации интерфейса: $ws.proto.DeclareModule для загрузки модулей в run-time
    * и $ws.proto.TestDeclareModule для тестирования модулей.
    * Оформлен в формате $ws.proto... для совместимости с $ws.single.ioc.
    * Рекомендуется использовать упрощенный вариант загрузчика модулей: $ws.declareModule
    */
   $ws.proto.IDeclareModule = $ws.core.extend({}, {
         declare: function(config, constructor){
            throw new Error("IDeclareModule::declare method is not implemented");
         }
      });

   /**
    *  Реализация интерфейса $ws.proto.IDeclareModule для загрузки модулей в run-time
    */
   $ws.proto.DeclareModule = $ws.core.extend($ws.proto.IDeclareModule, {
      declare: function(config, constructor){
         var fullPath = [config.namespace, config.name].join(".");
         if(!config)
            throw new Error("Не задана конфигурация модуля");
         if(!config.name)
            throw new Error("На задано имя модуля");
         if(!config.namespace)
            throw new Error("Не задано пространство имен модуля");

         if(!_getMod(fullPath)){
            _require(config.imports || []).addCallback(function(imports){
               if (!_getMod(fullPath)){
                  _construct(config.name, config.namespace, imports, constructor);
               }
            });
         }
      }
   });

   /**
    * Реализация интерфейса $ws.proto.IDeclareModule для тестирования модулей
    * Во время загрузки модуля не инициализирует его, а просто запоминает в хранилище модулей;
    * это нужно для того, чтобы в момент инициализации для тестирования можно было заменить любой модуль
    * из раздела imports на свой mock объект.
    * Иерархия вложенности imports не имеет значения.
    * Например,
    * var mock = {
    *    "SBIS3.CORE.submodule" : {
    *        func : function(){return 0}
    *    }
    * };
    * var module = $ws.testModule("SBIS3.CORE.module", mock);
    */

   $ws.proto.TestDeclareModule = $ws.core.extend($ws.proto.IDeclareModule, {
      declare: function (config, constructor) {
         var module_name = [config.namespace, config.name].join('.');
         _test_module_map[module_name] = {
            config: config,
            constructor: constructor
         };
      }
   });

   /**
    * Инициализирует модуль по имени с mock-объектами импорта для тестирования.
    * Mock-объекты могут отсутствовать, в таком случае подгрузятся настоящие модули, перечисленные в разделе imports.
    * Если mocks содержит в себе объект test, то test будет передан последним параметром конструктора модуля.
    * Объект test предназначен для тестирования приватных переменных путем организации замыкания в функциях test.
    * Например.
    * Объявление модуля:
    * $ws.declareModule({
    *    namespace: "SBIS3.MODULE",
    *    name: "A",
    *    imports: [] //test не нужно указывать в imports
    * }, function (test) {
    *    var _a = {};
    *    if(test) {
    *      test.getA = function(){
    *         return _a;
    *      }
    *    }
    *    return {...}
    * });
    *
    * Инициализация модуля для тестов
    * var test = {},
    *     mock = {
    *        test : test
    *     };
    * test_module = $ws.testModule("SBIS3.MODULE.A", mock);
    *
    * Тогда в тесте можно будет использовать такой код
    * assertEquals(test.getA(), testA);
    *
    */
   $ws.testModule = function (module_name, mocks) {
      var
         global = (function () {
            return this || (0, eval)('this');
         }());

      function _construct(module, test) {
         var imports = [];
         for (var i in module.config.imports) {
            var name = module.config.imports[i];
            imports.push(mocks && mocks[name] || _construct(_test_module_map[name]));
         }
         //test должен быть последним в списке параметров конструктора
         if (test)
            imports.push(test);
         return module.constructor.apply(global, imports);
      }

      return _construct(_test_module_map[module_name], mocks.test);
   };

   /*$ws.requireModule = _require;*/
/*   $ws.declareModule = function(config, constructor) {
      return $ws.single.ioc.resolve('IDeclareModule').declare(config, constructor);
   };*/

   $ws.requireModule = function(mods){
      mods = mods instanceof Array ? mods : [mods];
      var modules = [];
      $ws.helpers.forEach(mods, function(mod){
         modules.push("js!" + mod);
      });
      return $ws.require(modules);
   };
   $ws.declareModule = function(config, constructor){
      var imports = [];
      $ws.helpers.forEach(config.imports || [], function(mod){
         imports.push("js!" + mod);
      });
      define("js!" + [config.namespace, config.name].join('.'), imports, constructor);
   };
   $ws.require = function(mods){
      var
            dReady = new $ws.proto.Deferred(),
            nameArray,
            moduleName,
            glob,
            args;
      mods = mods instanceof Array ? mods : [mods];
      global.requirejs(mods,
            function(){
               args = arguments;
               $ws.helpers.forEach(mods, function(mod, index){
                  glob = global;
                  nameArray = /[^!]*$/.exec(mod)[0].split(".");
                  moduleName = nameArray.pop();
                  $ws.helpers.forEach(nameArray, function(elem){
                     glob = glob[elem] = glob[elem] || {};
                  });
                  glob[moduleName] = args[index];
               });
               dReady.callback(arguments);
            },
            function(err){
               dReady.errback(err);
            });
      return dReady;
   };
}());

/**
 *
 * @class $ws.single.DependencyResolver
 * @singleton
 */
$ws.single.DependencyResolver = {
   _store: {},
   _parents: {},
   /**
    * Метод регистрации зависимостей
    * @param {String} control Имя класса контрола, для которого регистрируются зависимости.
    * @param {Array|Function} dependency Зависимости в виде массива или функции, которая возвращает массив.
    * @param {String} parentsControl Список родителей контрола для вызова резолверов родителей.
    */
   register: function(control, dependency, parentsControl) {
      this._store[control] = dependency;
      this._parents[control] = parentsControl;
   },
   /**
    *
    * @param {String} control Имя класса, для которого требуется выяснить зависимости.
    * @param {Object} [config] Конфиг контрола.
    * @return {Array} Массив зависимостей.
    */
   resolve: function(control, config) {
      var
            result = [],
            components = control.split('/' ),
            parents = this._parents[control] ? this._parents[control].split('/') : [];
      while(components.length) {
         this._addDependency(result, components.join('/'), config, true);
         components.pop();
      }

      while(parents.length) {
         this._addDependency(result, parents.pop(), config, true);
      }
      return result.sort();
   },
   /**
    * Добавляет зависимость в массив store, если ее там еще нет.
    * Вычисляет дополнительные зависимости по данным, зарегистрированным через register.
    *
    * @param {Array} store
    * @param {String} dependency
    * @param {Object} [config]
    * @param {Boolean} [excludeSelf] исключает сам переданный класс из результата, по умолчанию == false.
    * @private
    */
   _addDependency: function (store, dependency, config, excludeSelf) {
      var self = this;
      dependency = $ws.single.ClassMapper.getClassMapping(dependency);
      if(Array.indexOf(store, dependency) == -1) {
         if(!excludeSelf)
            store.push(dependency);
         if(this._store[dependency]) {
            var resolved = typeof this._store[dependency] == 'function' ? this._store[dependency](config) : this._store[dependency];
            if(resolved && resolved instanceof Array)
               $ws.helpers.forEach(resolved, function(dep){
                  self._addDependency(store, dep);
               });
         }
      }
   }
};

/**
 * @singleton
 * @class $ws.single.Indicator
 */
$ws.single.Indicator = /** @lends $ws.single.Indicator.prototype */{
   _container: undefined,
   _ready: false,
   _dReady: undefined,
   _init: function(cfg){
      var self = this;
      if(!cfg)
         cfg = {};
      cfg.handlers = {
         'onReady': function(){
            self._ready = true;
         }
      };
      if(!this._dReady){
         this._dReady = $ws.core.attachInstance('SBIS3.CORE.LoadingIndicator',cfg).addCallback(function(inst){
            self._container = inst;
            return inst;
         });
      }
      return this._dReady;
   },
   /**
    * Показывает индикатор
    * @returns {Object} возвращает самого себя.
    */
   show: function(){
      if(!this._ready){
         this._init().addCallback(function(inst){
            inst.show();
            return inst;
         });
      }
      else
         this._container.show();
      return this;
   },
   /**
    * Устанавливает сообщение и показывает индикатор, если он скрыт
    * @param {String} message - сообщение.
    * @returns {Object} возвращает самого себя.
    */
   setMessage: function(message){
      if(!this._ready){
         this._init().addCallback(function(inst){
            inst.setMessage(message);
            inst.subscribe('onReady', function(){
               this.setMessage(message);
            });
            return inst;
         });
      }
      else{
         this._container.setMessage(message);
         this._container.show();
      }
      return this;
   },
   /**
    * Скрывет индикатор
    * @returns {Object} возвращает самого себя.
    */
   hide: function(){
      if(this._ready)
         this._container.hide();
      else{
         this._init().addCallback(function(inst){
            inst.hide();
            return inst;
         });
      }
      return this;
   },
   /**
    * Переключает вид индикатора: true - индикатор с прогрессбаром, false - без него
    * @param {Boolean} state.
    * @returns {Object} возвращает самого себя.
    */
   progressBar: function(state){
      var self = this;
      if(!this._ready){
         this.destroy();
         this._init({progressBar: state});
      }
      else{
         if(!(this._container._myProgressBar && state)){
            this.destroy();
            this._init({progressBar: state});
         }
      }
      return self;
   },
   /**
    * Устанавливает прогресс идкатора в режиме прогрессбара
    * Предварительно нужно переключить вид индикатора $ws.single.Indicatior.progressBar(true).
    * @param {Number} progress - количество процентов.
    * @returns {Object} возвращает самого себя.
    */
   setProgress: function(progress){
      if(!this._ready)
         this._init().addCallback(function(inst){
            inst.setProgress(progress);
            inst.subscribe('onReady', function(){
               this.setProgress(progress);
            });
            return inst;
         });
      else
         this._container.setProgress(progress);
      return this;
   },
   /**
    * Уничтожает индикатор
    * @returns {Object} возвращает самого себя.
    */
   destroy: function(){
      if(this._ready){
         this._container.destroy();
      }
      else{
         this._init().addCallback(function(inst){
            inst.destroy();
            return inst;
         });
      }
      this._container = undefined;
      this._ready = false;
      this._dReady = undefined;
      return this;
   }
};

/**
 * Код конфигурирования ядра и запуска загрузки минимально необходимого набора компонентов
 *
 * ВНИМАНИЕ!!!
 * Пожалуйста, не добавляйте ничего после него. Все классы и т.п. должны быть выше этих строк.
 */
(function() {

   "use strict";

   var global = (function(){ return this || (1,eval)('this') }());

   var bindings = $ws.core.merge({
      ITransport: 'XHRTransport',
      IXMLDocument: 'ClientXMLDocument',
      IBLObject: 'ClientBLObject',
      IEnum: 'ClientEnum',
      IAttachLoader: {
         name: 'WindowAttachLoader',
         single: true
      },
      ILogger: {
         name: 'ConsoleLogger',
         single: true
      },
      IDeclareModule: {
         name: 'DeclareModule',
         single: true
      }
   }, global.wsBindings || {}, { rec: false });

   $ws.helpers.forEach(bindings, function(target, iface){
      var single = false;
      if(target.single) {
         target = target.name;
         single = true;
      }
      if(single) {
         $ws.single.ioc.bindSingle(iface, target);
      } else {
         $ws.single.ioc.bind(iface, target);
      }
   });

   $ws.single.ClassMapper.setClassMapping({
      'Control/FieldImageGallery':        'Control/ImageGallery',
      'Control/Field:FieldImage':         'Control/FieldImage',
      'Control/Field:FieldDropdown':      'Control/FieldDropdown',
      'Control/Field:FieldCheckbox':      'Control/FieldCheckbox',
      'Control/Field:FieldRadio':         'Control/FieldRadio',
      'Control/Field:FieldNumeric':       'Control/FieldNumeric',
      'Control/Field:FieldInteger':       'Control/FieldInteger',
      'Control/Field:FieldMoney':         'Control/FieldMoney',
      'Control/Field:FieldLabel':         'Control/FieldLabel',
      'Control/Field:FieldFormatAbstract':'Control/FieldMask',
      'Control/Field:FieldMask':          'Control/FieldMask',
      'Control/Field:FieldDate':          'Control/FieldDate',
      'Control/Field:FieldLinkNew':       'Control/FieldLink',
      'Control/Field:FieldMonth':         'Control/FieldMonth',
      'Control/Field:FieldButton':        'Control/Button',
      'Control/Field:FileScaner':         'Control/FileScaner',
      'Control/Field:FileBrowse':         'Control/FileBrowse',
      'Control/Field:FieldDatePicker':    'Control/FieldDatePicker',
      'Control/Area:ToolBar':             'Control/ToolBar',
      'Control/Area:GroupCheckBox':       'Control/GroupCheckBox',
      'Control/Area:Tabs':                'Control/Tabs',
      'Control/Area:HTMLView':            'Control/HTMLView',
      'Control/Area:FiltersArea':         'Control/FiltersArea',
      'Control/Area:FiltersDialog':       'Control/FiltersDialog',
      'Control/Area:FiltersWindow':       'Control/FiltersWindow',
      'Control/DataView/TableView':       'Control/TableView',
      'Control/DataViewAbstract/TableView/TreeView':       'Control/TreeView'
   });

// Old style configuration scheme...
   if('WSRootPath' in global)
      $ws._const.wsRoot = global.WSRootPath;
   if('ResourcePath' in global)
      $ws._const.resourceRoot = global.ResourcePath;
   if('ServicesPath' in global)
      $ws._const.defaultServiceUrl = global.ServicesPath;
   if('WSTheme' in global)
      $ws._const.theme = global.WSTheme;

   // New style configration scheme
   $ws.core.merge($ws._const, global.wsConfig || {}, { rec: false });

   global.TransportError = TransportError;
   global.HTTPError = HTTPError;
}());

(function(){

   if (typeof window !== 'undefined') {
      var
         TICKER_INTERVAL_SLOW = 1260,
         TICKER_INTERVAL = 420,
         TICKER_INTERVAL_FAST = 21;

      var
         ticker = $ws.single.EventBus.channel('ticker'),
         timerSlow, timer, timerFast;

      timerSlow = setInterval(function(){
         ticker.notify('onTickSlow')
      }, TICKER_INTERVAL_SLOW);

      timer = setInterval(function(){
         ticker.notify('onTick')
      }, TICKER_INTERVAL);

      timerFast = setInterval(function(){
         ticker.notify('onTickFast')
      }, TICKER_INTERVAL_FAST);
   }

})();

$ws.core.ready = new $ws.proto.Deferred().callback();
if(window){

   $ws.core.ready.addCallback(function(){
      Error.stackTraceLimit && (Error.stackTraceLimit = 40);
      var dResult = new $ws.proto.Deferred();
      if(!('jQuery' in window && 'proxy' in jQuery && parseFloat(window.jQuery.fn.jquery) >= 1.6)) // Check for jQ 1.6+
         dResult.dependOn($ws.core.attach("ext/jquery-min.js"));
      else
         dResult.callback();
      return dResult;
   }).addCallback(function() {
      if(!$ws._const.nostyle) {
         return $ws.core.attach("css/core.css").addErrback(function() {
            $ws.single.ioc.resolve('ILogger').log("Core", "Core style loading failed");
            return "";
         });
      }
   }).addCallback(function(){

      // При выгрузке документа заблокируем все сообщения пользователю
      $(window).unload(function(){
         $ws.helpers._messageBox = $ws.core.alert = $ws.helpers.question = function() {
            return $ws.proto.Deferred.success();
         };
      });

      $(document).bind('mousemove keyup', function(){
         BOOMR.plugins.WS.logUserActivity();
      }.throttle(5000));

      /**
       * Поддержка css3-transform в разных браузерах через .css
       */
      (function( $ ) {
            if ($ws._const.compatibility.cssTransformProperty !== 'transform') {
               $.cssHooks["transform"] = {
                  get: function(elem) {
                     return $.css(elem, $ws._const.compatibility.cssTransformProperty);
                  },
                  set: function(elem, value) {
                     elem.style[$ws._const.compatibility.cssTransformProperty] = value;
                  }
               };
            }
      })( jQuery );

      $ws._const.$win = $(window);
      $ws._const.$doc = $(document);
      var d = new $ws.proto.ParallelDeferred();
      if(!('cookie' in jQuery))
         d.push($ws.core.attach('ext/jquery-cookie-min.js'));
      if($ws._const.theme !== '' && !$ws._const.nostyle)
         d.push($ws.core.attach('css/themes/' + $ws._const.theme + '.css').addErrback(function(){
            $ws.single.ioc.resolve('ILogger').log("Core", "Theme '" + $ws._const.theme + "' is not found. Continue with default.");
            return "";
         }));

      return d.done().getResult();
   }).addCallback(function(){
      if(window.contents && !Object.isEmpty(window.contents)) {
         $ws.core.loadContents(window.contents, false, {
            resources: $ws._const.resourceRoot
         });
      }
   }).addCallback(function(){
      // Вычитка параметров из адресной строки в глобальный контекст
      var args = location.search;
      if(args.indexOf('?') === 0) {
         var argsArr = args.substr(1).split('&');
         for(var i = 0, l = argsArr.length; i < l; i++) {
            // Шилов Д.А. не будем сплитить, надо найти только первый символ =
            var index = argsArr[i].indexOf( '=' );
            $ws.single.GlobalContext.setValue(decodeURIComponent(argsArr[i].substring(0, index)), decodeURIComponent(argsArr[i].substring(index+1)));
         }
      }
   }).addCallback(function(){
      $(document).ready( function applySpecificCssClasses() {
         var
            body = $('body'),
            classes = [];
         if ($ws._const.browser.isIE) {
            classes.push('ws-is-ie');
         }
         if($ws._const.browser.isIE8) {
            classes.push('ws-is-ie8');
         }
         if($ws._const.browser.isIE9) {
            classes.push('ws-is-ie9');
         }
         if($ws._const.browser.isIE10) {
            classes.push('ws-is-ie10');
         }
         if($ws._const.browser.firefox) {
            classes.push('ws-is-firefox');
         }
         if($ws._const.browser.chrome) {
            classes.push('ws-is-chrome');
         }
         if ($ws._const.browser.isMobileAndroid) {
            classes.push('ws-is-mobile-android');
         }
         if ($ws._const.browser.isMobileSafari) {
            classes.push('ws-is-mobile-safari');
            if (($ws._const.browser.IOSVersion || 0) < 8) {
               classes.push('ws-is-mobile-safari-ios-below-8');
            }
         }
         if(classes.length) {
            body.addClass(classes.join(' '));
         }

         $ws._const.$body = body;
      });
   }).addCallback(function(){
      // Инициализация интернационализации
      $ws.single.i18n.init();
      // Инициализация микросессий
      if (window) {
         if ($ws._const.browser.isIE) {
            var def = new $ws.proto.Deferred();
            /**
             * В IE, если страница отдалась с кодом не 200 (в нашем случае это 401 когда доступ запрещен)
             * работа с локейшеном, даже если меняется только hash? (например .replace(...)) приводит к перезагрузке страницы.
             * В результате получается бесконечный релоад.
             * Если отложить работу с локейшеном - проблема пропадает.
             * Спасибо вам, авторы IE.
             */
            setTimeout(function(){
               $ws.single.MicroSession.init();
               def.callback();
            }, 0);
            return def;
         } else {
            $ws.single.MicroSession.init();
         }
      }
   }).addCallback(function(){

      // Инициализация HashManager
      if (window){
         var
            pU = $ws.single.MicroSession.get("previousUrl"),
            helper = $ws.single.MicroSession.get("previousUrlHelper");

         if (pU != window.location.toString())
            $ws.single.MicroSession.set("previousUrlHelper", pU);
         else
            pU = helper;

         window.previousPageURL = pU;

         $ws.single.MicroSession.set("previousUrl", window.location.toString());

         $ws.single.HashManager.subscribe('onChange', function(){
            $ws.single.MicroSession.set("previousUrl", window.location.toString());
         });
         $ws.single.WindowManager.postInit();
      }

      // Вычитка глобальных и пользовательских параметров в глобальный контекст
      var pd = new $ws.proto.ParallelDeferred();

      if($ws._const.userConfigSupport){
         if (!$ws.single.MicroSession.get("userParamsDefined")){
            pd.push($ws.single.UserConfig.getParams());
         }
         else{
            var s = $ws.single.MicroSession.toObject();
            for (var i in s){
               if (s.hasOwnProperty(i))
                  $ws.single.GlobalContext.setValue(i, s[i]);
            }
         }
      }

      if($ws._const.globalConfigSupport) {
         pd.push($ws.single.ClientsGlobalConfig.getParams());
      }

      return pd.done().getResult().addErrback(function(e){
         //проверим ошибку на корректность
         if(e instanceof HTTPError && e.httpError !== 0){
            $ws.single.ioc.resolve('ILogger').error("Ошибка при загрузке параметров", e.message, e);
         }
         // Очищаем ошибку чтобы не ломать старт ядра
         return '';
      });
   });
}
/**
 * Это должна быть ПОСЛЕДНЯЯ строка в этом файле. Не добавляйте ничего ниже.
 * Просто для того, чтобы было легко найти код конфигурации ядра.
 */
