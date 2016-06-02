var gemini = require('gemini');

gemini.suite('SBIS3.CONTROLS.FormattedTextBox Online', function () {

    gemini.suite('base', function (test) {

        test.setUrl('/regression_formatted_text_box_online.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="FormattedTextBox 1"]', 40000);
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
            })

            .capture('plain', function (actions) {
				actions.click(this.input);
			})
    });
	
	gemini.suite('disabled_base', function (test) {

        test.setUrl('/regression_formatted_text_box_online.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="FormattedTextBox 1"]', 40000);
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
				actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('FormattedTextBox 1').setEnabled(false);
                });
            })

            .capture('plain', function (actions) {
				actions.click(this.input);
			})
    });

    gemini.suite('validation_error', function (test) {

        test.setUrl('/regression_formatted_text_box_online.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="FormattedTextBox 1"]', 40000);
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
				actions.click(this.input);
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('FormattedTextBox 1').markControl();
                });
            })

            .capture('plain', function (actions) {
				actions.mouseMove(this.input);
			})
    });
});