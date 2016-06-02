var gemini = require('gemini');

gemini.suite('SBIS3.CONTROLS.PasswordTextBox Online', function () {

    gemini.suite('base', function (test) {

        test.setUrl('/regression_password_text_box_online.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="PasswordTextBox 1"]', 40000);
                this.input = find('[name="PasswordTextBox 1"] .controls-TextBox__field');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.focus_input = find('[sbisname="TextBox 1"] input');
            })

            .capture('plain', function (actions) {
                actions.click(this.focus_input);
            })

            .capture('with_text', function (actions) {
                actions.sendKeys(this.input, 'test');
				actions.click(this.focus_input);
            })
    });

    gemini.suite('validation_error', function (test) {

        test.setUrl('/regression_password_text_box_online.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="PasswordTextBox 1"]', 40000);
                actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.focus_input = find('[sbisname="TextBox 1"] input');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('PasswordTextBox 1').markControl();
                });
            })

            .capture('plain', function (actions) {
                actions.click(this.focus_input);
            })
    });
});