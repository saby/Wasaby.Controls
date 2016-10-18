var gemini = require('gemini');

gemini.suite('SBIS3.CONTROLS.RadioGroup Online', function () {

    gemini.suite('base', function (test) {

        test.setUrl('/regression_radio_group_online.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="RadioGroup 1"]', 40000);
                this.radio_1 = find('[data-id="1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
            })

            .capture('plain', function (actions) {
                actions.mouseMove(this.input);
				actions.click(this.input);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.radio_1);
            })

            .capture('checked', function (actions) {
                actions.click(this.radio_1);
            })
    });

    gemini.suite('primary', function (test) {

        test.setUrl('/regression_radio_group_online_3.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="RadioGroup 1"]', 40000);
                this.radio_1 = find('[data-id="1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
            })

            .capture('plain', function (actions) {
                actions.mouseMove(this.input);
				actions.click(this.input);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.radio_1);
            })

            .capture('checked', function (actions) {
                actions.click(this.radio_1);
            })
    });

    gemini.suite('disabled_base', function (test) {

        test.setUrl('/regression_radio_group_online.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="RadioGroup 1"]', 40000);
                this.radio_1 = find('[data-id="1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('RadioGroup 1').setEnabled(false);
                });
            })

            .capture('plain', function (actions) {
                actions.mouseMove(this.input);
				actions.click(this.input);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.radio_1);
            })

            .capture('checked_and_disabled', function (actions) {
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('RadioGroup 1').setEnabled(true);
                });
                actions.click(this.radio_1);
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('RadioGroup 1').setEnabled(false);
                });
            })
    });

    gemini.suite('vertical', function (test) {

        test.setUrl('/regression_radio_group_online_2.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="RadioGroup 1"]', 40000);
                this.radio_1 = find('[data-id="1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
            })

            .capture('plain', function (actions) {
                actions.mouseMove(this.input);
				actions.click(this.input);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.radio_1);
            })

            .capture('checked', function (actions) {
                actions.click(this.radio_1);
            })
    });

    gemini.suite('primary_vertical', function (test) {

        test.setUrl('/regression_radio_group_online_4.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="RadioGroup 1"]', 40000);
                this.radio_1 = find('[data-id="1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
            })

            .capture('plain', function (actions) {
                actions.mouseMove(this.input);
				actions.click(this.input);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.radio_1);
            })

            .capture('checked', function (actions) {
                actions.click(this.radio_1);
            })
    });
});