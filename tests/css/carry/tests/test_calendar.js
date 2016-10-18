gemini.suite('SBIS3.CONTROLS.Calendar Carry', function () {

    gemini.suite('base', function (test) {

        test.setUrl('/regression_calendar_carry.html').setCaptureElements('.capture')

            .before(function (actions) {
                
				this.calendar = '[name="Calendar 1"]';
				this.input = '[sbisname="TextBox 1"] input';
                this.active = '.controls-Calendar__tableBodyElement__active';
                this.day_17 = '[data-day="17"]';
                this.fog = '.controls-Calendar__tableHead .controls-Calendar__tableElementFog:nth-child(1)';
				
				actions.waitForElementToShow(this.calendar, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })

            .capture('hovered_active', function (actions) {
                actions.mouseMove(this.active);
            })

            .capture('hovered_day', function (actions) {
                actions.mouseMove(this.day_17);
            })

            .capture('hovered_fog', function (actions) {
                actions.mouseMove(this.fog);
            })
    });
});