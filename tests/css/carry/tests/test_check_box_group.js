gemini.suite('SBIS3.CONTROLS.CheckBoxGroup Carry', function () {

    gemini.suite('horizontal', function (test) {

        test.setUrl('/regression_check_box_group_carry.html').setCaptureElements('.capture')

            .before(function (actions) {
                
				this.cbg = '[name="CheckBoxGroup 1"]';
				this.input = '[sbisname="TextBox 1"] input';
                
				actions.waitForElementToShow(this.cbg, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })
    });

    gemini.suite('vertical', function (test) {

        test.setUrl('/regression_check_box_group_carry_2.html').setCaptureElements('.capture')

            .before(function (actions) {
                
				this.cbg = '[name="CheckBoxGroup 1"]';
				this.input = '[sbisname="TextBox 1"] input';
                
				actions.waitForElementToShow(this.cbg, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })
    });
});