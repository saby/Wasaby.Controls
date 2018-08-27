define('Controls/Printer/PrintDialog', [
   'Core/Control',
   'Core/constants',
   'Core/SessionStorage',
   'tmpl!Controls/Printer/PrintDialog',
   'css!Controls/Printer/PrintDialog'
], function(
   Control,
   constants,
   SessionStorage,
   template
) {
   'use strict';

   var _private = {
      createHeadContent: function() {
         return Object.keys(HEAD_CONTENT).reduce(function(result, key) {
            return result + HEAD_CONTENT[key];
         }, '');
      },

      createFontsLinks: function() {
         var path;
         return constants.tensorFontsUrl.reduce(function(result, url) {
            path = url;
            if (constants.buildnumber) {
               path = path.replace(/\.css$/, '.v' + constants.buildnumber + '.css');
            }
            return result + '<link rel="stylesheet" href="' + constants.resourceRoot + path + '">';
         }, '');
      }
   };

   var HEAD_CONTENT = {
      'X-UA-Compatible': '<meta http-equiv="X-UA-Compatible" content="IE=edge">',
      charset: '<meta charset="utf-8" />',
      style: '<style>body { margin: 0; overflow: hidden; } </style>',
      fonts: _private.createFontsLinks(),
      tableStyle: '<style>*{font-family: Tahoma;font-size: 11px;}.ws-register-table { width: 100%;  border-collapse: collapse;   line-height: 15px;min-width: 430px;}.ws-register-table th{color: #999999;font-weight: normal;text-align: left;}.ws-register-table th,.ws-register-table td {padding: 1px 5px;}.ws-register-table tbody tr {border-top: 1px solid #F5F5F5;}.ws-register-table tbody {border-bottom: 1px solid #EAEAEA;border-top: 1px solid #EAEAEA;}.ws-register-table tbody tr:first-child{border-top-style: none;}.ws-register-table td.ws-register-folder {font-weight: bold;}.ws-register-table thead {display: table-header-group}.ws-register-table tfoot {display: table-row-group}.ws-register-table tr {page-break-inside: avoid}</style>'
   };

   /**
    *
    *
    * @class Controls/Printer/PrintDialog
    * @extends Core/Control
    * @control
    * @author Зайцев А.С.
    * @public
    */

   var PrintDialog = Control.extend(/** @lends Controls/Printer/PrintDialog */{
      _template: template,
      _hideDialog: false,

      _beforeMount: function() {
         var autoTestsConfig = SessionStorage.get('autoTestConfig');
         this._hideDialog = constants.browser.chrome && !(autoTestsConfig && autoTestsConfig.showPrintReportForTests);
      },

      _afterMount: function() {
         var head;
         this._children.iframe.contentDocument.write(this._options.printTemplate({
            items: this._options.data
         }));
         head = this._children.iframe.contentDocument.querySelector('head');
         head.insertAdjacentHTML('beforeend', _private.createHeadContent());

         if (this._hideDialog) {
            this._onPrintClick();
         } else {
            this._children.iframe.style.height = this._children.iframe.contentDocument.body.scrollHeight + 'px';
         }
      },

      _onPrintClick: function() {
         var
            doc = this._children.iframe.contentDocument,
            win = this._children.iframe.contentWindow,
            self = this;

         if (constants.browser.isIE) {
            doc.execCommand('print');
         } else {
            if (this._hideDialog) {
               win.addEventListener('afterprint', function() {
                  self._notify('close', [], {bubbling: true});
               });
            }
            win.print();
         }
      }
   });

   return PrintDialog;
});
