var gemini = require('gemini');

gemini.suite('SBIS3.CONTROLS.TextArea Online', function () {

    gemini.suite('base', function (test) {

        test.setUrl('/regression_text_area_online.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="TextArea 1"]', 40000);
                this.input = find('.controls-TextArea__inputField');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.focus_input = find('[sbisname="TextBox 1"] input');
            })

            .capture('plain', function (actions) {
                actions.click(this.focus_input);
            })

            .capture('with_text', function (actions) {
                actions.sendKeys(this.input, 'TextArea Test');
				actions.click(this.focus_input);
            })
    });

    gemini.suite('disabled_base', function (test) {

        test.setUrl('/regression_text_area_online.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="TextArea 1"]', 40000);
                this.input = find('.controls-TextArea__inputField');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.focus_input = find('[sbisname="TextBox 1"] input');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('TextArea 1').setEnabled(false);
                });
            })

            .capture('plain', function (actions) {
                actions.click(this.focus_input);
            })

            .capture('with_text', function (actions) {
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('TextArea 1').setEnabled(true);
                });
                actions.sendKeys(this.input, 'TextArea Test');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('TextArea 1').setEnabled(false);
                });
            })
    });

    gemini.suite('validation_error', function (test) {

        test.setUrl('/regression_text_area_online.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="TextArea 1"]', 40000);
                this.input = find('.controls-TextArea__inputField');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.focus_input = find('[sbisname="TextBox 1"] input');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('TextArea 1').markControl();
                });
            })

            .capture('plain', function (actions) {
                actions.click(this.focus_input);
            })

            .capture('with_text', function (actions) {
                actions.sendKeys(this.input, 'TextArea Test');
				actions.click(this.focus_input);
            })
    });

    gemini.suite('with_autoheight', function (test) {

        test.setUrl('/regression_text_area_online_2.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="TextArea 1"]', 40000);
                this.input = find('.controls-TextArea__inputField');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.focus_input = find('[sbisname="TextBox 1"] input');
            })

            .capture('plain', function (actions) {
                actions.click(this.focus_input);
            })

            .capture('with_text', function (actions) {
                actions.sendKeys(this.input, 'TextArea Test');
				actions.click(this.focus_input);
            })
    });
});