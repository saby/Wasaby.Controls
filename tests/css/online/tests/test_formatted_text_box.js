var gemini = require('gemini');

gemini.suite('SBIS3.CONTROLS.FormattedTextBox Online', function () {

    gemini.suite('copy_paste', function (test) {

        test.setUrl('/regression_formatted_text_box_online.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="FormattedTextBox 1"]', 40000);
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
				this.field = find('[name="FormattedTextBox 1"] .controls-FormattedTextBox__field');
            })

            .capture('with_text', function (actions) {
				actions.sendKeys(this.field, gemini.HOME);
				actions.wait(100);
				actions.sendKeys(this.field, 'tensor');
				actions.wait(100);
				actions.sendKeys(this.field, gemini.TAB);
			})
			
			.capture('cut_text', function (actions) {
				actions.click(this.field);
				actions.sendKeys(this.field, gemini.END);
				actions.wait(100);
				actions.sendKeys(this.field, gemini.CONTROL+gemini.SHIFT+gemini.HOME);
				actions.wait(100);
				actions.sendKeys(this.field, gemini.CONTROL+gemini.INSERT);
				actions.wait(100);
				actions.sendKeys(this.field, gemini.DELETE);
				actions.wait(100);
				actions.sendKeys(this.field, gemini.TAB);
			})
			
			.capture('paste_text', function (actions) {
				actions.click(this.field);
				actions.sendKeys(this.field, gemini.HOME);
				actions.wait(100);
				actions.sendKeys(this.field, gemini.SHIFT+gemini.INSERT);
				actions.wait(100);
				actions.sendKeys(this.field, gemini.TAB);
			})
    });

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