(function($) {
    'use strict';

    $ws.core.withComponents('Source').addCallback(function() {
        $(document).ready(function() {
            initButtons();
            initSwitchers();
            initMenus();
            initInputFields();
            loadTheme();
            subscribeApplyBtn();
        });
    });
    class LessManager {

        constructor(name, rawdata) {
            let lessStoragedata = rawdata.split('\n').filter(n => !!n && !~n.indexOf('//'));

            lessStoragedata = lessStoragedata.map(function(rule) {
                let [title, value] = rule.split(':');
                if (!title || !value) return {
                    title: null,
                    value: null
                }
                title = title.trim().replace('@', '');
                value = value.trim().replace(';', '');
                return {
                    title: title,
                    value: value
                }
            });
            this.lessdata = lessStoragedata;

        }
        getPropValue(prop) {
            return this.lessdata.filter(rule => {
                return rule.title === prop
            })[0].value
        }
        setPropValue(prop, value) {
            this.lessdata = this.lessdata.map(rule => {
                if (rule.title === prop) {
                    rule.value = value;
                    rule.changed = true;
                }
                return rule;

            });
        }
        commit($css) {
            let reqData = {};
            let changedRules = this.lessdata.filter(rule => {
                return rule.changed
            });
            changedRules.forEach(rule => {
                reqData[rule.title] = rule.value;
            })
            callSmth('apply-theme', {
                "themeName": 'online',
                "rules": reqData
            }).then(function() {
                $css.appendTo('head');
                $('#apply').removeAttr('disabled')

            })
        }

    }
    let lessManager = null;

    function subscribeApplyBtn() {
        let $applyBtn = $('#apply');

        $applyBtn.on('click', function(e) {
            let $themeCSS = $('#controls-theme');
            $themeCSS.remove();
            // протекция от повторного нажатия
            $(this).attr('disabled', 'disabled')

            let $inputs = $('#sidemenu').find('input');

            $inputs.each(function(idx, input) {
                lessManager.setPropValue($(input).attr('id'), $(input).val())
            });

            lessManager.commit($themeCSS);
        })
    }


    function callSmth(path, params) {
        var data = new FormData();
        data.append("json", JSON.stringify(params));

        let fetchPromise = new Promise((resolve, reject) => {
            fetch(path, {
                method: "POST",
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'x-www-form-urlencoded'
                },
                body: JSON.stringify(params)
            }).then(function resolvejson(response) {
                resolve(response.text());
            })
        });
        return fetchPromise;
    }

    function loadTheme() {
        callSmth('get-theme', {
            "name": 'online'
        }).then(function(data) {
            lessManager = new LessManager('online', data);

        }).then(setInitialValues)
    };

    function setInitialValues() {
        let lessdata = lessManager.lessdata;
        lessdata.forEach(function(rule) {
            $(`#${rule.title}`).attr('value', rule.value)
        })
    }

    function initButtons() {
        require([
            'js!SBIS3.CONTROLS.Link',
            'js!SBIS3.CONTROLS.Button',
            'js!SBIS3.CONTROLS.ToggleButton',
            'js!SBIS3.CONTROLS.IconButton',
            'js!SBIS3.CONTROLS.TabButton',
            'js!SBIS3.CONTROLS.TabButtons'
        ], function(
            Link,
            Button,
            ToggleButton,
            IconButton,
            TabButton,
            TabButtons
        ) {
            var items = [{
                id: 1,
                title: 'First'
            }, {
                id: 2,
                title: 'Second'
            }, {
                id: 3,
                title: 'Third'
            }];

            new Link({
                element: 'link',
                caption: 'Link',
                link: 'http://wi.sbis.ru',
                inNewTab: true,
                icon: 'sprite:icon-24 icon-Attach icon-primary action-hover'
            });

            new Button({
                element: 'normalDefaultButton',
                caption: 'Кнопка'
            });

            new Button({
                element: 'normalDisabledDefaultButton',
                caption: 'Кнопка',
                enabled: false
            });

            // new ToggleButton({
            //     element: 'normalDefaultToggleButton',
            //     caption: 'Default toggle button'
            // });

            new Button({
                element: 'normalEllipsisDefaultButton',
                caption: 'Кнопка'
            });

            new Button({
                element: 'normalMultilineDefaultButton',
                caption: 'Кнопка with long text'
            });

            new Button({
                element: 'normalMultilineDefaultButton16',
                caption: 'Кнопка with long text',
                icon: 'sprite:icon-16 icon-Alert icon-primary'
            });

            new Button({
                element: 'normalDefaultButton16',
                caption: 'Кнопка 16x16',
                icon: 'sprite:icon-16 icon-Alert icon-primary'
            });

            new Button({
                element: 'normalDefaultButton24',
                caption: 'Кнопка 24x24',
                icon: 'sprite:icon-24 icon-Alert icon-primary'
            });

            new Button({
                element: 'bigDefaultButton',
                caption: 'Кнопка'
            });

            new Button({
                element: 'bigDisabledDefaultButton',
                caption: 'Кнопка',
                enabled: false
            });

            // new ToggleButton({
            //     element: 'bigDefaultToggleButton',
            //     caption: 'Default toggle button'
            // });

            // new ToggleButton({
            //     element: 'bigToggleButton16',
            //     caption: 'Toggle button icon 16',
            //     icon: 'sprite:icon-16 icon-Alert icon-primary',
            //     primary: true
            // });

            // new ToggleButton({
            //     element: 'bigToggleButton24',
            //     caption: 'Toggle button icon 24',
            //     icon: 'sprite:icon-24 icon-Alert icon-primary'
            // });

            new Button({
                element: 'bigEllipsisDefaultButton',
                caption: 'Кнопка'
            });

            new Button({
                element: 'bigDefaultButton16',
                caption: 'Кнопка 16x16',
                icon: 'sprite:icon-16 icon-Alert icon-primary'
            });

            new Button({
                element: 'bigDefaultButton24',
                caption: 'Кнопка 24x24',
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

            // new ToggleButton({
            //     element: 'normalPrimaryToggleButton',
            //     caption: 'Primary toggle button',
            //     primary: true
            // });

            // new ToggleButton({
            //     element: 'normalTogglePrimaryButton16',
            //     caption: 'Primary toggle button icon 16',
            //     primary: true,
            //     icon: 'sprite:icon-16 icon-Alert icon-attention'
            // });

            // new ToggleButton({
            //     element: 'normalTogglePrimaryButton24',
            //     caption: 'Primary toggle button icon 24',
            //     primary: true,
            //     icon: 'sprite:icon-24 icon-Alert icon-attention'
            // });

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

            // new ToggleButton({
            //     element: 'bigPrimaryToggleButton',
            //     caption: 'Primary toggle button',
            //     primary: true
            // });

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

            new IconButton({
                element: 'iconButton',
                icon: 'sprite:icon-24 icon-AddButton icon-primary action-hover'
            });

            // new TabButton({
            //     element: 'tabButton1',
            //     caption: 'Tab button'
            // });

            // new TabButton({
            //     element: 'tabButton2',
            //     caption: 'Disabled tab button',
            //     enabled: false
            // });

            // new TabButton({
            //     element: 'tabButton3',
            //     caption: 'Disabled checked tab button',
            //     enabled: false,
            //     checked: true
            // });

            // new TabButtons({
            //     element: 'tabButtons',
            //     items: items,
            //     selectedItem: 1
            // });
        });
    }

    function initSwitchers() {
        require([
            'js!SBIS3.CONTROLS.CheckBox',
            'js!SBIS3.CONTROLS.CheckBoxGroup',
            'js!SBIS3.CONTROLS.RadioButton',
            'js!SBIS3.CONTROLS.RadioGroup',
            'js!SBIS3.CONTROLS.Switcher',
            'js!SBIS3.CONTROLS.SwitcherDouble',
            'js!SBIS3.Engine.SwitcherDoubleOnline'
        ], function(
            CheckBox,
            CheckBoxGroup,
            RadioButton,
            RadioGroup,
            Switcher,
            SwitcherDouble,
            SwitcherDoubleOnline
        ) {
            var items = [{
                id: 1,
                title: 'First'
            }, {
                id: 2,
                title: 'Second'
            }, {
                id: 3,
                title: 'Third'
            }];

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

            new CheckBoxGroup({
                element: 'checkBoxGroup1',
                items: items,
                displayField: 'title'
            });

            new CheckBoxGroup({
                element: 'checkBoxGroup2',
                items: items,
                displayField: 'title'
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

            new RadioGroup({
                element: 'radioGroup1',
                items: items,
                selectedItem: 1,
                displayField: 'title'
            });

            new RadioGroup({
                element: 'radioGroup2',
                items: items,
                selectedItem: 1,
                displayField: 'title'
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
            var items = [{
                id: 1,
                title: 'Title 1',
                icon: 'sprite:icon-16 icon-Successful icon-done'
            }, {
                id: 2,
                title: 'Title 2',
                icon: 'sprite:icon-16 icon-Successful icon-error'
            }, {
                id: 3,
                title: 'Title 3',
                icon: 'sprite:icon-16 icon-Successful icon-done'
            }, {
                id: 4,
                title: 'Title 4',
                icon: 'sprite:icon-16 icon-Successful icon-done',
                par: 2
            }, {
                id: 5,
                title: 'Title 5',
                icon: 'sprite:icon-16 icon-Phone icon-done',
                par: 4
            }, {
                id: 6,
                title: 'Title 6',
                icon: 'sprite:icon-16 icon-Successful icon-done',
                par: 4
            }, {
                id: 7,
                title: 'Title 7',
                icon: 'sprite:icon-16 icon-Successful icon-done',
                par: 2
            }, {
                id: 8,
                title: 'Title 8',
                icon: 'sprite:icon-16 icon-Successful icon-done',
                par: 2
            }, {
                id: 9,
                title: 'Длинный-длинный пункт меню, самый длинный',
                icon: 'sprite:icon-16 icon-Successful icon-done'
            }, {
                id: 10,
                title: 'Петр',
                icon: 'sprite:icon-16 icon-Successful icon-done'
            }, {
                id: 11,
                title: 'Трактор',
                icon: 'sprite:icon-16 icon-Successful icon-done'
            }];

            new Button({
                element: 'menuButton1',
                caption: 'Menu',
                handlers: {
                    onActivated: function() {
                        menuCtx.show();
                    }
                }
            });

            var menuCtx = new ContextMenu({
                element: 'menu',
                items: items,
                target: $('#menuButton1'),
                corner: 'br',
                hierField: 'par',
                verticalAlign: {
                    side: 'top',
                    offset: 3
                },
                horizontalAlign: {
                    side: 'right',
                    offset: 0
                },
                closeByExternalClick: true,
                closeButton: true
            });

            new Menu({
                element: 'menuBar',
                items: items,
                hierField: 'par',
                firstLevelDirection: 'right'
            });

            new MenuItem({
                element: 'menuItem',
                caption: 'Menu item'
            });

            new MenuButton({
                element: 'menuButton2',
                items: items,
                hierField: 'par',
                caption: 'Dropdown menu'
            });

            new MenuButton({
                element: 'menuButton3',
                primary: true,
                items: items,
                hierField: 'par',
                caption: 'Primary dropdown menu'
            });

            new MenuButton({
                element: 'menuButton4',
                items: items,
                hierField: 'par',
                caption: 'Disabled dropdown menu',
                enabled: false
            });

            new MenuButton({
                element: 'menuButtonFixedWidthIcon',
                primary: true,
                items: items,
                hierField: 'par',
                caption: 'Primary dropdown menu with long text',
                icon: 'sprite:icon-16 icon-Alert icon-primary'
            });

            new MenuButton({
                element: 'menuButtonFixedWidth',
                primary: true,
                items: items,
                hierField: 'par',
                caption: 'Primary dropdown menu with long text'
            });

            var menuButtonWithClose = new MenuButton({
                element: 'menuButtonWithClose',
                primary: true,
                items: items,
                hierField: 'par',
                caption: 'Primary dropdown menu with close button'
            });

            new MenuLink({
                caption: 'Menu link',
                element: 'menuLink',
                items: items,
                hierField: 'par'
            });

            new MenuLink({
                caption: 'Menu link fixed width long text',
                element: 'menuLinkFixedWidth',
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
            'js!SBIS3.CONTROLS.MonthPicker',
            'js!SBIS3.CONTROLS.NumberTextBox',
            'js!SBIS3.CONTROLS.ComboBox',
            'js!SBIS3.CONTROLS.SearchForm',
            'js!SBIS3.CONTROLS.Demo.MySearchForm',
            'js!SBIS3.CONTROLS.TextArea',
            'js!SBIS3.CORE.AreaAbstract',
            'js!SBIS3.CONTROLS.EditAtPlace',
            'js!SBIS3.CONTROLS.EditAtPlaceGroup'
        ], function(
            TextBox,
            PasswordTextBox,
            FormattedTextBox,
            DatePicker,
            MonthPicker,
            NumberTextBox,
            ComboBox,
            SearchForm,
            MySearchForm,
            TextArea,
            AreaAbstract,
            EditAtPlace,
            EditAtPlaceGroup
        ) {
            new TextBox({
                element: 'textBox1',
                placeholder: 'This is textbox'
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
                enabled: false
            });

            new DatePicker({
                element: 'formattedTextBox1',
                text: '15:00:00',
                mask: 'HH:II:SS'
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

            new DatePicker({
                element: 'datePickerISO',
                mask: 'DD.MM.YYYY',
                date: '2015-03-09T21:00:00.000+03:00'
            });

            new MonthPicker({
                element: 'monthPickerISO',
                date: '2015-03-09'
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

            new NumberTextBox({
                element: 'numberTextBox4',
                text: '123',
                enabled: false,
                enableArrows: true
            });

            var comboItems = [{
                key: 1,
                title: 'First'
            }, {
                key: 2,
                title: 'Second'
            }, {
                key: 3,
                title: 'Third'
            }];

            new ComboBox({
                element: 'comboBox1',
                editable: false,
                items: comboItems,
                placeholder: 'Вводи годноту'
            });

            new ComboBox({
                element: 'comboBox2',
                editable: true,
                items: comboItems,
                placeholder: 'Вводи годноту'

            });

            new ComboBox({
                element: 'comboBox3',
                editable: false,
                items: comboItems,
                enabled: false
            });

            new SearchForm({
                element: 'searchForm',
                placeholder: "Введите что-нибудь"
            });

            new MySearchForm({
                element: 'searchForm2'
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

     
    });

}


})(jQuery);