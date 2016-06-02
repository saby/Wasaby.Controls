var gemini = require('gemini');

gemini.suite('SBIS3.CONTROLS.Calendar Online', function () {

    gemini.suite('base', function (test) {

        test.setUrl('/regression_calendar_online.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="Calendar 1"]', 40000);
                this.active = find('.controls-Calendar__tableBodyElement__active');
                this.day_17 = find('[data-day="17"]');
                this.fog = find('.controls-Calendar__tableHead .controls-Calendar__tableElementFog:nth-child(1)');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
				this.input = find('[sbisname="TextBox 1"] input')
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