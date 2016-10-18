var gemini = require('gemini');

gemini.suite('SBIS3.CONTROLS.CheckBox Online', function () {

    gemini.suite('base', function (test) {

        test.setUrl('/regression_check_box_online.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="CheckBox 1"]', 40000);
                this.box = find('[name="CheckBox 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.box);
            })

            .capture('checked', function (actions) {
                actions.click(this.box);
            })
    });

    gemini.suite('disabled_base', function (test) {

        test.setUrl('/regression_check_box_online.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="CheckBox 1"]', 40000);
                this.box = find('[name="CheckBox 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('CheckBox 1').setEnabled(false);
                });
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.box);
            })

            .capture('checked', function (actions) {
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('CheckBox 1').setEnabled(true);
                });
                actions.click(this.box);
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('CheckBox 1').setEnabled(false);
                });
            })
    });

    gemini.suite('three_state', function (test) {

        test.setUrl('/regression_check_box_online_2.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="CheckBox 1"]', 40000);
                this.box = find('[name="CheckBox 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.box);
            })

            .capture('checked', function (actions) {
                actions.click(this.box);
            })

            .capture('checked_null', function (actions) {
                actions.click(this.box);
            })
    });

    gemini.suite('disabled_three_state', function (test) {

        test.setUrl('/regression_check_box_online_2.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="CheckBox 1"]', 40000);
                this.box = find('[name="CheckBox 1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('CheckBox 1').setEnabled(false);
                });
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.box);
            })

            .capture('checked', function (actions) {
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('CheckBox 1').setEnabled(true);
                });
                actions.click(this.box);
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('CheckBox 1').setEnabled(false);
                });
            })

            .capture('checked_null', function (actions) {
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('CheckBox 1').setEnabled(true);
                });
                actions.click(this.box);
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('CheckBox 1').setEnabled(false);
                });
            })
    });
});