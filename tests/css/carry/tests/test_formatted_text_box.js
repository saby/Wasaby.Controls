gemini.suite('SBIS3.CONTROLS.FormattedTextBox Carry', function () {

    gemini.suite('copy_paste', function (test) {

        test.setUrl('/regression_formatted_text_box_carry.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.ftb = '[sbisname="FormattedTextBox 1"]';
                this.input = '[sbisname="TextBox 1"] input';
				this.field = '[name="FormattedTextBox 1"] .controls-FormattedTextBox__field';
				
                actions.waitForElementToShow(this.ftb, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('with_text', function (actions) {
				actions.sendKeys(this.field, gemini.HOME);
				actions.sendKeys(this.field, 'tensor');
				actions.sendKeys(this.field, gemini.TAB);
			})
			
			.capture('cut_text', function (actions) {
				actions.click(this.field);
				actions.sendKeys(this.field, gemini.END);
				actions.sendKeys(this.field, gemini.CONTROL+gemini.SHIFT+gemini.HOME);
				actions.sendKeys(this.field, gemini.CONTROL+gemini.INSERT);
				actions.sendKeys(this.field, gemini.DELETE);
				actions.sendKeys(this.field, gemini.TAB);
			})
			
			.capture('paste_text', function (actions) {
				actions.click(this.field);
				actions.sendKeys(this.field, gemini.HOME);
				actions.sendKeys(this.field, gemini.SHIFT+gemini.INSERT);
				actions.sendKeys(this.field, gemini.TAB);
			})
    });

	gemini.suite('base', function (test) {

        test.setUrl('/regression_formatted_text_box_carry.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.ftb = '[sbisname="FormattedTextBox 1"]';
                this.input = '[sbisname="TextBox 1"] input';
				
                actions.waitForElementToShow(this.ftb, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('plain', function (actions) {
				actions.click(this.input);
			})
			
			.capture('disabled', function (actions) {
				actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('FormattedTextBox 1').setEnabled(false);
                });
			})
			
			.capture('validation_error', function (actions) {
				actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('FormattedTextBox 1').setEnabled(true);
					window.$ws.single.ControlStorage.getByName('FormattedTextBox 1').markControl();
                });
			})
    });
});