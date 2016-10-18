gemini.suite('SBIS3.CONTROLS.RadioGroup Carry', function () {

    gemini.suite('base', function (test) {

        test.setUrl('/regression_radio_group_carry.html').setCaptureElements('.capture')

            .before(function (actions) {
                
				this.rg = '[name="RadioGroup 1"]';
				this.radio_1 = '[data-id="1"]';
                this.input = '[sbisname="TextBox 1"] input';
                
				actions.waitForElementToShow(this.rg, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('checked', function (actions) {
				actions.click(this.input);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.radio_1);
            })
			
			.capture('disabled_and_checked', function (actions) {
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('RadioGroup 1').setEnabled(false);
                });
            })
			
			.capture('disabled_and_hovered', function (actions) {
                actions.mouseMove(this.radio_1);
            })
    });

    gemini.suite('primary', function (test) {

        test.setUrl('/regression_radio_group_carry_3.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.rg = '[name="RadioGroup 1"]';
				this.radio_1 = '[data-id="1"]';
                this.input = '[sbisname="TextBox 1"] input';
                
				actions.waitForElementToShow(this.rg, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('checked', function (actions) {
                actions.mouseMove(this.input);
				actions.click(this.input);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.radio_1);
            })

			.capture('disabled_and_checked', function (actions) {
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('RadioGroup 1').setEnabled(false);
                });
            })
			
			.capture('disabled_and_hovered', function (actions) {
                actions.mouseMove(this.radio_1);
            })
    });

    gemini.suite('vertical', function (test) {

        test.setUrl('/regression_radio_group_carry_2.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.rg = '[name="RadioGroup 1"]';
                this.input = '[sbisname="TextBox 1"] input';
                
				actions.waitForElementToShow(this.rg, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('plain', function (actions) {
				actions.click(this.input);
            })
    });

    gemini.suite('primary_vertical', function (test) {

        test.setUrl('/regression_radio_group_carry_4.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.rg = '[name="RadioGroup 1"]';
                this.input = '[sbisname="TextBox 1"] input';
                
				actions.waitForElementToShow(this.rg, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('plain', function (actions) {
				actions.click(this.input);
            })
    });
});