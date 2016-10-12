gemini.suite('SBIS3.CONTROLS.ButtonGroup Carry', function () {

    gemini.suite('horizontal', function (test) {

        test.setUrl('/regression_button_group_carry.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.button = '[name="Button 1"]';
                this.input = '[sbisname="TextBox 1"] input';
				
                actions.waitForElementToShow(this.button, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })
    });

    gemini.suite('vertical', function (test) {

        test.setUrl('/regression_button_group_carry_2.html').setCaptureElements('.capture')

            .before(function (actions) {
                
				this.button = '[name="Button 1"]';
                this.input = '[sbisname="TextBox 1"] input';
				
                actions.waitForElementToShow(this.button, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })
    });
});