gemini.suite('SBIS3.CONTROLS.DatePicker Carry', function () {

    gemini.suite('base', function (test) {

        test.setUrl('/regression_date_picker_carry.html').setCaptureElements('html')

            .before(function (actions) {

				this.dp = '[sbisname="DatePicker 1"]';
                this.input = '[name="TextBox 1"] input';
				this.icon = '[sbisname="CalendarButton"].icon-Calendar2';
				this.next = '[sbisname="NextYearButton"]';
				this.prev = '[sbisname="PrevYearButton"]';
				
				actions.waitForElementToShow(this.dp, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('plain', function (actions) {
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('DatePicker 1').setDate('1991-02-19');
                });
				actions.click(this.input);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.dp);
            })

            .capture('hovered_icon', function (actions) {
                actions.mouseMove(this.icon);
            })

            .capture('opened_icon', function (actions) {
                actions.click(this.icon);
				actions.waitForElementToShow(this.prev, 5000);
				actions.waitForElementToShow(this.next, 5000);
				actions.mouseMove(this.input);
            })
			
			.capture('disabled', function (actions) {
                actions.click(this.input);
				actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('DatePicker 1').setEnabled(false);
                });
            })            
			
			.capture('validation_error', function (actions) {
                actions.executeJS(function (window) {
					window.$ws.single.ControlStorage.getByName('DatePicker 1').setEnabled(true);
                    window.$ws.single.ControlStorage.getByName('DatePicker 1').markControl();
                });
            })
    });

    gemini.suite('without_calendar_icon', function (test) {

        test.setUrl('/regression_date_picker_carry_2.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.dp = '[sbisname="DatePicker 1"]';
                this.input = '[name="TextBox 1"] input';
				
				actions.waitForElementToShow(this.dp, 40000);
				actions.waitForElementToShow(this.input, 5000)
            })

            .capture('plain', function (actions) {
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('DatePicker 1').setDate('1991-02-19');
                });
				actions.click(this.input);
            })
    });
});