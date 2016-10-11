gemini.suite('SBIS3.CONTROLS.PasswordTextBox Presto', function () {

    gemini.suite('base', function (test) {

        test.setUrl('/regression_password_text_box_presto.html').setCaptureElements('.capture')

            .before(function (actions) {
                
				this.ptb = '[name="PasswordTextBox 1"]';
				this.input = '[name="PasswordTextBox 1"] .controls-TextBox__field';
                this.focus_input = '[sbisname="TextBox 1"] input';
				
                actions.waitForElementToShow(this.ptb, 40000);
				actions.waitForElementToShow(this.focus_input, 5000);
            })

            .capture('plain', function (actions) {
                actions.click(this.focus_input);
            })

            .capture('with_text', function (actions) {
                actions.sendKeys(this.input, 'test');
				actions.click(this.focus_input);
            })
			
			.capture('disabled', function (actions) {
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('PasswordTextBox 1').setEnabled(false);
                });
				actions.click(this.focus_input);
            })
			
			.capture('validation_error', function (actions) {
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('PasswordTextBox 1').setEnabled(true);
					window.$ws.single.ControlStorage.getByName('PasswordTextBox 1').markControl();
                });
            })
    });
});