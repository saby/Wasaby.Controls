var gemini = require('gemini');

gemini.suite('SBIS3.CONTROLS.DatePicker Online', function () {

    gemini.suite('base', function (test) {

        test.setUrl('/regression_date_picker_online.html').setCaptureElements('html')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="DatePicker 1"]', 40000);
                this.picker = find('[name="DatePicker 1"]');
                this.icon = find('[sbisname="CalendarButton"] .icon-Calendar2')
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
				this.input = find('[sbisname="TextBox 1"] input')
				actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('DatePicker 1').setDate('1991-02-19');
                });
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.picker);
            })

            .capture('hovered_icon', function (actions) {
                actions.mouseMove(this.icon);
            })

            .capture('opened_icon', function (actions) {
                actions.click(this.icon);
				actions.waitForElementToShow('[sbisname="PrevYearButton"]', 1000);
				actions.waitForElementToShow('[sbisname="NextYearButton"]', 1000);
				actions.mouseMove(this.input);
            })
    });

    gemini.suite('without_calendar_icon', function (test) {

        test.setUrl('/regression_date_picker_online_2.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="DatePicker 1"]', 40000);
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
				this.input = find('[sbisname="TextBox 1"] input')
				actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('DatePicker 1').setDate('1991-02-19');
                });
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })
    });

    gemini.suite('disabled_base', function (test) {

        test.setUrl('/regression_date_picker_online.html').setCaptureElements('html')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="DatePicker 1"]', 40000);
                this.picker = find('[name="DatePicker 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
				this.input = find('[sbisname="TextBox 1"] input')
                actions.executeJS(function (window) {
					window.$ws.single.ControlStorage.getByName('DatePicker 1').setDate('1991-02-19');
                    window.$ws.single.ControlStorage.getByName('DatePicker 1').setEnabled(false);
                });
            })

            .capture('plain')
    });

    gemini.suite('validation_error', function (test) {

        test.setUrl('/regression_date_picker_online.html').setCaptureElements('html')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="DatePicker 1"]', 40000);
                this.picker = find('[name="DatePicker 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
				this.input = find('[sbisname="TextBox 1"] input')
				actions.click(this.input);
                actions.executeJS(function (window) {
					window.$ws.single.ControlStorage.getByName('DatePicker 1').setDate('1991-02-19');
                    window.$ws.single.ControlStorage.getByName('DatePicker 1').markControl();
                });
            })

            .capture('plain', function (actions) {
                actions.mouseMove(this.input);
            })
    });
});