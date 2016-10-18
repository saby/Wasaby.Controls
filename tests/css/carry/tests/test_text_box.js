gemini.suite('SBIS3.CONTROLS.TextBox Carry', function () {

    gemini.suite('base', function (test) {

        test.setUrl('/regression_text_box_carry.html').setCaptureElements('.capture')

            .before(function (actions) {
                
				this.tb = '[sbisname="TextBox 1"]';
				this.text_inpit = '.controls-TextBox__fieldWrapper > input';
                this.box = '[sbisname="TextBox 1"]';
                this.focus_input = '[name="TextBox 2"] input';
				
                actions.waitForElementToShow(this.tb, 40000);
				actions.waitForElementToShow(this.focus_input, 5000);
            })

            .capture('plain', function (actions) {
                actions.click(this.focus_input);
            })

            .capture('with_text', function (actions) {
                actions.sendKeys(this.text_inpit, 'tensor');
                actions.click(this.focus_input);
            })
			
			.capture('disabled', function (actions) {
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('TextBox 1').setEnabled(false);
                });
            })
			
			.capture('validation_error', function (actions) {
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('TextBox 1').setEnabled(true);
					window.$ws.single.ControlStorage.getByName('TextBox 1').markControl();
                });
            })
    });

    gemini.suite('with_placeholder', function (test) {

        test.setUrl('/regression_text_box_carry_2.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.tb = '[sbisname="TextBox 1"]';
				this.text_inpit = '.controls-TextBox__fieldWrapper > input';
                this.box = '[sbisname="TextBox 1"]';
                this.focus_input = '[name="TextBox 2"] input';
				
                actions.waitForElementToShow(this.tb, 40000);
				actions.waitForElementToShow(this.focus_input, 5000);
            })

            .capture('plain', function (actions) {
                actions.click(this.focus_input);
            })
    });

    gemini.suite('text_transform_uppercase', function (test) {

        test.setUrl('/regression_text_box_carry_4.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.tb = '[sbisname="TextBox 1"]';
				this.text_inpit = '.controls-TextBox__fieldWrapper > input';
                this.box = '[sbisname="TextBox 1"]';
                this.focus_input = '[name="TextBox 2"] input';
				
                actions.waitForElementToShow(this.tb, 40000);
				actions.waitForElementToShow(this.focus_input, 5000);
				
                actions.waitForElementToShow(this.tb, 40000);
				actions.waitForElementToShow(this.focus_input, 5000);
            })

            .capture('plain', function (actions) {
                actions.click(this.focus_input);
            })
    });
});