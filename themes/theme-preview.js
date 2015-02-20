(function($) {
   'use strict';

   $ws.core.withComponents('Source').addCallback(function() {
      $(document).ready(function() {
         initButtons();
         initSwitchers();
         initMenus();
         initInputFields();
         initThemeSelector();
         initBackButton();
      });
   });

   function initButtons() {
      require([
         'js!SBIS3.CONTROLS.Link',
         'js!SBIS3.CONTROLS.Button',
         'js!SBIS3.CONTROLS.ToggleButton',
         'js!SBIS3.CONTROLS.IconButton',
         'js!SBIS3.CONTROLS.TabButton'
      ], function(
         Link,
         Button,
         ToggleButton,
         IconButton,
         TabButton
      ) {
         new Link({
            element: 'link',
            caption: 'Link',
            link: 'http://wi.sbis.ru',
            inNewTab: true,
            icon: 'sprite:icon-24 icon-Attach icon-primary action-hover'
         });

         new Button({
            element: 'normalDefaultButton',
            caption: 'Default button'
         });

         new Button({
            element: 'normalDisabledDefaultButton',
            caption: 'Default button',
            enabled: false
         });

         new ToggleButton({
            element: 'normalDefaultToggleButton',
            caption: 'Default toggle button'
         });

         new Button({
            element: 'normalEllipsisDefaultButton',
            caption: 'Default button'
         });

         new Button({
            element: 'normalDefaultButton16',
            caption: 'Default button 16x16',
            icon: 'sprite:icon-16 icon-Alert icon-primary'
         });

         new Button({
            element: 'normalDefaultButton24',
            caption: 'Default button 24x24',
            icon: 'sprite:icon-24 icon-Alert icon-primary'
         });

         new Button({
            element: 'bigDefaultButton',
            caption: 'Default button'
         });

         new Button({
            element: 'bigDisabledDefaultButton',
            caption: 'Default button',
            enabled: false
         });

         new ToggleButton({
            element: 'bigDefaultToggleButton',
            caption: 'Default toggle button'
         });

         new Button({
            element: 'bigEllipsisDefaultButton',
            caption: 'Default button'
         });

         new Button({
            element: 'bigDefaultButton16',
            caption: 'Default button 16x16',
            icon: 'sprite:icon-16 icon-Alert icon-primary'
         });

         new Button({
            element: 'bigDefaultButton24',
            caption: 'Default button 24x24',
            icon: 'sprite:icon-24 icon-Alert icon-primary'
         });

         new Button({
            element: 'normalPrimaryButton',
            caption: 'Primary button',
            primary: true
         });

         new Button({
            element: 'normalDisabledPrimaryButton',
            caption: 'Primary button',
            primary: true,
            enabled: false
         });

         new ToggleButton({
            element: 'normalPrimaryToggleButton',
            caption: 'Primary toggle button',
            primary: true
         });

         new Button({
            element: 'normalEllipsisPrimaryButton',
            caption: 'Primary button',
            primary: true
         });

         new Button({
            element: 'normalPrimaryButton16',
            caption: 'Primary button 16x16',
            primary: true,
            icon: 'sprite:icon-16 icon-Alert icon-attention'
         });

         new Button({
            element: 'normalPrimaryButton24',
            caption: 'Primary button 24x24',
            primary: true,
            icon: 'sprite:icon-24 icon-Alert icon-attention'
         });

         new Button({
            element: 'bigPrimaryButton',
            caption: 'Primary button',
            primary: true
         });

         new Button({
            element: 'bigDisabledPrimaryButton',
            caption: 'Primary button',
            primary: true,
            enabled: false
         });

         new ToggleButton({
            element: 'bigPrimaryToggleButton',
            caption: 'Primary toggle button',
            primary: true
         });

         new Button({
            element: 'bigEllipsisPrimaryButton',
            caption: 'Primary button',
            primary: true
         });

         new Button({
            element: 'bigPrimaryButton16',
            caption: 'Primary button 16x16',
            primary: true,
            icon: 'sprite:icon-16 icon-Alert icon-attention'
         });

         new Button({
            element: 'bigPrimaryButton24',
            caption: 'Primary button 24x24',
            primary: true,
            icon: 'sprite:icon-24 icon-Alert icon-attention'
         });

         new Button({
            element: 'lightDefaultButton',
            caption: 'Light default button'
         });

         new Button({
            element: 'lightDisabledDefaultButton',
            caption: 'Light default button',
            enabled: false
         });

         new Button({
            element: 'lightEllipsisDefaultButton',
            caption: 'Light default button'
         });

         new Button({
            element: 'lightDefaultButton16',
            caption: 'Light default button 16x16',
            icon: 'sprite:icon-16 icon-Alert icon-primary'
         });

         new Button({
            element: 'lightPrimaryButton',
            caption: 'Light primary button',
            primary: true
         });

         new Button({
            element: 'lightDisabledPrimaryButton',
            caption: 'Light primary button',
            primary: true,
            enabled: false
         });

         new Button({
            element: 'lightEllipsisPrimaryButton',
            caption: 'Light primary button',
            primary: true
         });

         new Button({
            element: 'lightPrimaryButton16',
            caption: 'Light primary button 16x16',
            primary: true,
            icon: 'sprite:icon-16 icon-Alert icon-primary'
         });

         new IconButton({
            element: 'iconButton1',
            icon: 'sprite:icon-24 icon-AddButton icon-primary action-hover'
         });

         new IconButton({
            element: 'iconButton2',
            icon: 'sprite:icon-24 icon-AddButton icon-primary action-hover'
         });

         new TabButton({
            element: 'tabButton',
            caption: 'Tab button'
         });
      });
   }

   function initSwitchers() {
      require([
         'js!SBIS3.CONTROLS.CheckBox',
         'js!SBIS3.CONTROLS.RadioButton',
         'js!SBIS3.CONTROLS.Switcher',
         'js!SBIS3.Engine.SwitcherDoubleOnline'
      ], function(
         CheckBox,
         RadioButton,
         Switcher,
         SwitcherDoubleOnline
      ) {
         new CheckBox({
            element: 'checkBox1',
            caption: 'Checkbox',
            checked: false
         });

         new CheckBox({
            element: 'checkBox2',
            caption: 'Checkbox three state',
            checked: false,
            threeState: true
         });

         new CheckBox({
            element: 'checkBox3',
            caption: 'Checkbox disabled',
            enabled: false
         });

         new CheckBox({
            element: 'checkBox4',
            caption: 'Checkbox disabled checked',
            enabled: false,
            checked: true
         });

         new CheckBox({
            element: 'checkBox5',
            caption: 'Checkbox disabled third state checked',
            enabled: false,
            checked: null
         });

         new RadioButton({
            element: 'radioButton1',
            caption: 'Radio'
         });

         new RadioButton({
            element: 'radioButton2',
            caption: 'Radio disabled',
            enabled: false
         });

         new RadioButton({
            element: 'radioButton3',
            caption: 'Radio disabled checked',
            checked: true,
            enabled: false
         });

         new Switcher({
            element: 'switcher11',
            caption: 'Switcher',
            stateOn: 'On',
            stateOff: 'Off'
         });

         new Switcher({
            element: 'switcher12',
            caption: 'Switcher',
            stateOn: 'On',
            stateOff: 'Off',
            enabled: false
         });

         new Switcher({
            element: 'switcher13',
            caption: 'Switcher',
            stateOn: 'On',
            stateOff: 'Off',
            state: 'on',
            enabled: false
         });

         new SwitcherDoubleOnline({
            element: 'switcher21',
            caption: 'Double online switcher',
            stateOn: 'On',
            stateOff: 'Off'
         });

         new SwitcherDoubleOnline({
            element: 'switcher22',
            caption: 'Double online switcher',
            stateOn: 'On',
            stateOff: 'Off',
            enabled: false
         });

         new SwitcherDoubleOnline({
            element: 'switcher23',
            caption: 'Double online switcher',
            stateOn: 'On',
            stateOff: 'Off',
            enabled: false,
            state: 'on'
         });

         new SwitcherDoubleOnline({
            element: 'switcher31',
            caption: 'Double online vertical switcher',
            stateOn: 'On',
            stateOff: 'Off',
            disposition: 'vertical'
         });

         new SwitcherDoubleOnline({
            element: 'switcher32',
            caption: 'Double online vertical switcher',
            stateOn: 'On',
            stateOff: 'Off',
            disposition: 'vertical',
            enabled: false
         });

         new SwitcherDoubleOnline({
            element: 'switcher33',
            caption: 'Double online vertical switcher',
            stateOn: 'On',
            stateOff: 'Off',
            disposition: 'vertical',
            enabled: false,
            state: 'on'
         });
      });
   }

   function initMenus() {
      require([
         'js!SBIS3.CONTROLS.ContextMenu',
         'js!SBIS3.CONTROLS.Menu',
         'js!SBIS3.CONTROLS.MenuItem',
         'js!SBIS3.CONTROLS.Button',
         'js!SBIS3.CONTROLS.MenuButton',
         'js!SBIS3.CONTROLS.MenuLink',
         'js!SBIS3.CONTROLS.MenuIcon'
      ], function(
         ContextMenu,
         Menu,
         MenuItem,
         Button,
         MenuButton,
         MenuLink,
         MenuIcon
      ) {
         var items = [
            {
               id : 1,
               title : 'Title 1',
               icon : 'sprite:icon-16 icon-Successful icon-done'
            },
            {
               id : 2,
               title : 'Title 2',
               icon: 'sprite:icon-16 icon-Successful icon-error'
            },
            {
               id : 3,
               title : 'Title 3',
               icon: 'sprite:icon-16 icon-Successful icon-done'
            },
            {
               id : 4,
               title : 'Title 4',
               icon : 'sprite:icon-16 icon-Successful icon-done',
               par : 2
            },
            {
               id : 5,
               title : 'Title 5',
               icon : 'sprite:icon-16 icon-Phone icon-done',
               par : 4
            },
            {
               id : 6,
               title : 'Title 6',
               icon : 'sprite:icon-16 icon-Successful icon-done',
               par : 4
            },
            {
               id : 7,
               title : 'Title 7',
               icon : 'sprite:icon-16 icon-Successful icon-done',
               par : 2
            },
            {
               id : 8,
               title : 'Title 8',
               icon : 'sprite:icon-16 icon-Successful icon-done',
               par : 2
            },
            {
               id : 9,
               title : 'Поросенок',
               icon : 'sprite:icon-16 icon-Successful icon-done'
            },
            {
               id : 10,
               title : 'Петр',
               icon : 'sprite:icon-16 icon-Successful icon-done'
            },
            {
               id : 11,
               title : 'Трактор',
               icon : 'sprite:icon-16 icon-Successful icon-done'
            }
         ];

         new Button({
            element: 'menuButton',
            caption: 'Menu',
            handlers : {
               onActivated : function() {
                  menuCtx.show();
               }
            }
         });

         var menuCtx = new ContextMenu({
            element: 'menu',
            items: items,
            target : $('#menuButton'),
            corner : 'br',
            hierField: 'par',
            verticalAlign: {
               side: 'top',
               offset: 3
            },
            horizontalAlign: {
               side: 'right',
               offset: 0
            },
            closeByExternalClick: true
         });

         new Menu({
            element: 'menuBar',
            items: items,
            hierField : 'par',
            firstLevelDirection : 'right'
         });

         new MenuItem({
            element: 'menuItem',
            caption: 'Menu item'
         });

         new MenuButton({
            element: 'menuDropdownButton',
            items: items,
            hierField: 'par',
            caption: 'Dropdown menu'
         });

         new MenuButton({
            element: 'menuDropdownButtonPrimary',
            primary: true,
            items: items,
            hierField: 'par',
            caption: 'Primary dropdown menu'
         });

         new MenuLink({
            caption: 'Menu link',
            element: 'menuLink',
            items: items,
            hierField: 'par'
         });

         new MenuIcon({
            element: 'menuIcon',
            icon: 'sprite:icon-24 icon-ThumbUp icon-primary action-hover',
            items: items,
            hierField: 'par'
         });
      });
   }

   function initInputFields() {
      require([
         'js!SBIS3.CONTROLS.TextBox',
         'js!SBIS3.CONTROLS.PasswordTextBox',
         'js!SBIS3.CONTROLS.FormattedTextBox',
         'js!SBIS3.CONTROLS.DatePicker',
         'js!SBIS3.CONTROLS.NumberTextBox',
         'js!SBIS3.CONTROLS.ComboBox',
         'js!SBIS3.CONTROLS.TextArea',
         'js!SBIS3.CORE.AreaAbstract',
         'js!SBIS3.CONTROLS.EditAtPlace',
         'js!SBIS3.CONTROLS.EditAtPlaceGroup'
      ], function(
         TextBox,
         PasswordTextBox,
         FormattedTextBox,
         DatePicker,
         NumberTextBox,
         ComboBox,
         TextArea,
         AreaAbstract,
         EditAtPlace,
         EditAtPlaceGroup
      ) {
         new TextBox({
            element: 'textBox1',
            placeholder: 'This is textbox',
            handlers: {
               'onTextChange': function(e, val) {
                  console.log(val)
               }
            }
         });

         new TextBox({
            element: 'textBox2',
            placeholder: 'This is disabled textbox',
            enabled: false
         });

         new PasswordTextBox({
            element: 'passwordTextBox1',
            placeholder: 'This is password textbox',
            text: 'Password'
         });

         new PasswordTextBox({
            element: 'passwordTextBox2',
            placeholder: 'This is password textbox',
            text: 'Password',
            checked: false
         });

         new FormattedTextBox({
            element: 'formattedTextBox1',
            text: '15:00:00',
            mask: 'dd:dd:dd'
         });

         new FormattedTextBox({
            element: 'formattedTextBox2',
            text: '15:00:00',
            mask: 'dd:dd:dd',
            enabled: false
         });

         new DatePicker({
            element: 'formattedTextBox3'
         });

         new DatePicker({
            element: 'formattedTextBox4',
            enabled: false
         });

         new NumberTextBox({
            element: 'numberTextBox1',
            text: '123'
         });

         new NumberTextBox({
            element: 'numberTextBox2',
            text: '123',
            enableArrows: true
         });

         new NumberTextBox({
            element: 'numberTextBox3',
            text: '123',
            enabled: false
         });

         var comboItems = [
            {
               key : 1,
               title: 'Первый'
            },
            {
               key : 2,
               title: 'Второй'
            },
            {
               key: 3,
               title: 'Третий'
            }
         ];

         new ComboBox({
            element: 'comboBox1',
            editable: false,
            items: comboItems
         });

         new ComboBox({
            element: 'comboBox2',
            editable: true,
            items: comboItems
         });

         new TextArea({
            element: 'textArea1',
            text: 'This is text area',
            minLinesCount: 7
         });

         new TextArea({
            element: 'textArea2',
            text: 'This is disabled text area',
            minLinesCount: 7,
            enabled: false
         });

         var editAtPlaceAreas = [];
         for (var i = 0; i < 5; i += 1) {
            editAtPlaceAreas.push(new AreaAbstract({
               element: 'editAtPlaceArea' + (i + 1),
               isRelativeTemplate: true
            }));
         }

         new EditAtPlace({
            parent: editAtPlaceAreas[0],
            context: editAtPlaceAreas[0].getLinkedContext(),
            element: 'editAtPlace1'
         });

         new EditAtPlace({
            parent: editAtPlaceAreas[1],
            context: editAtPlaceAreas[1].getLinkedContext(),
            element: 'editAtPlace2',
            editInPopup: true
         });

         new EditAtPlace({
            parent: editAtPlaceAreas[2],
            context: editAtPlaceAreas[2].getLinkedContext(),
            element: 'editAtPlace3',
            editorTpl: '<component data-component="SBIS3.CONTROLS.TextArea"><options name="autoResize"><option name="state">true</option></options></component>',
            multiline: true
         });

         new EditAtPlace({
            parent: editAtPlaceAreas[3],
            context: editAtPlaceAreas[3].getLinkedContext(),
            element: 'editAtPlace4',
            editorTpl: '<component data-component="SBIS3.CONTROLS.TextArea"><options name="autoResize"><option name="state">true</option></options></component>',
            multiline: true,
            editInPopup: true
         });

         new EditAtPlace({
            parent: editAtPlaceAreas[4],
            context: editAtPlaceAreas[4].getLinkedContext(),
            element: 'editAtPlace5',
            enabled: false
         });

         editAtPlaceAreas[0].getLinkedContext().setValue('field1', 'Edit at place');
         editAtPlaceAreas[1].getLinkedContext().setValue('field2', 'Edit at place in popup');
         editAtPlaceAreas[2].getLinkedContext().setValue('field3', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vel tincidunt magna, iaculis accumsan mi. Cras lorem arcu, bibendum sed augue eget, dictum posuere ante. Aenean at cursus nunc. Etiam.');
         editAtPlaceAreas[3].getLinkedContext().setValue('field4', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vel tincidunt magna, iaculis accumsan mi. Cras lorem arcu, bibendum sed augue eget, dictum posuere ante. Aenean at cursus nunc. Etiam.');
         editAtPlaceAreas[4].getLinkedContext().setValue('field5', 'Disabled edit at place');


         var editAtPlaceGroupArea = new AreaAbstract({
            element: 'editAtPlaceGroupArea',
            isRelativeTemplate: true
         });

         var editAtPlaceGroup = new EditAtPlaceGroup({
            parent: editAtPlaceGroupArea,
            context: editAtPlaceGroupArea.getLinkedContext(),
            element: "editAtPlaceGroup",
            displayAsEditor: false,
            editInPopup: true,
            template: '\
            <div class="inline-group">\
               <div>\
                  Edit at place\
                  <component data-component="SBIS3.CONTROLS.EditAtPlace" data-bind="{Text: field1}" style="width: 85px">\
                     <option name="editorTpl">\
                        <component data-component="SBIS3.CONTROLS.TextBox" data-bind="{Text: field1}">\
                           <option name="maxLength">13</option>\
                        </component>\
                     </option>\
                  </component>\
                  Group\
                  <component data-component="SBIS3.CONTROLS.EditAtPlace" data-bind="{Text: field2}" style="width: 80px">\
                     <option name="editorTpl">\
                        <component data-component="SBIS3.CONTROLS.TextBox" data-bind="{Text: field2}">\
                        </component>\
                     </option>\
                  </component>\
               </div>\
            </div>'
         });

         editAtPlaceGroupArea.getLinkedContext().setValue('field1', '7703585780');
         editAtPlaceGroupArea.getLinkedContext().setValue('field2', '997150001');
      });
   }

   function initThemeSelector() {
      var themes =[{
         key: 'genie-new',
         title: 'Genie new'
      }, {
         key: 'default',
         title: 'Default'
      }, {
         key: 'online',
         title: 'Online'
      }, {
         key: 'genie',
         title: 'Genie'
      }, {
         key: 'presto',
         title: 'Presto'
      }];

      require([
         'js!SBIS3.CONTROLS.ComboBox'
      ], function(ComboBox) {
         new ComboBox({
            element: 'themeSelector',
            items: themes,
            editable: false,
            selectedItem: 'genie-new',
            handlers: {
               onSelectedItemChange: function(e, themeName) {
                  var that = this;
                  var url = themeName + '/' + themeName + '.css';
                  $.ajax({
                     url: url,
                     beforeSend: function() {
                        that.setEnabled(false);
                     }
                  }).then(function(data) {
                     var themeCssLink = $('head').find('link.theme-css');
                     if (themeCssLink.length === 0) {
                        themeCssLink = $('<link />')
                           .attr('rel', 'stylesheet')
                           .attr('type', 'text/css')
                           .attr('href', url)
                           .addClass('theme-css');
                        themeCssLink.appendTo($('head'));
                     }
                     else {
                        themeCssLink.attr('href', url);
                     }
                  }).always(function() {
                     that.setEnabled(true);
                  });
               }
            }
         });
      });
   }

   function initBackButton() {
      require(['js!SBIS3.CONTROLS.Link'], function(Link) {
         new Link({
            element: 'back',
            caption: 'Назад',
            href: '../../',
            icon: 'sprite:icon-16 icon-DayBackward icon-primary'
         });
      });
   }
})(jQuery);