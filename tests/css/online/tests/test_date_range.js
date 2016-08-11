var gemini = require('gemini');

gemini.suite('SBIS3.CONTROLS.DateRange Online', function () {

    gemini.suite('base', function (test) {

        test.setUrl('/regression_date_range_online.html').setCaptureElements('html')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="DateRange 1"]', 40000);
				actions.waitForElementToShow('[name="DateRange__Button"]', 40000);
				this.open_chooser = find('[name="DateRange__Button"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
				this.quarter = find('[sbisname="QuarterRangeBtn0"]');
				this.halfyear = find('[sbisname="HalfyearRangeBtn0"]');
				this.nextyear = find('[sbisname="NextYearButton"]');
				this.prevyear = find('[sbisname="PrevYearButton"]');
				this.chooseyear = find('[sbisname="ToggleChooseYearButton"]');
				this.first = find('.controls-DateRangeBigChoose__yearsRange .controls-DateRangeBigChoose__years-yearsRange-btn:nth-child(1)');
				this.third = find('.controls-DateRangeBigChoose__yearsRange .controls-DateRangeBigChoose__years-yearsRange-btn:nth-child(3)');
				this.current = find('[sbisname="CurrentYearButton"]');
				this.second = find('.controls-DateRangeBigChoose__months-month .controls-DateRangeBigChoose-MonthView:nth-child(2) .controls-MonthView__caption-text')
				this.seven = find('.controls-DateRangeBigChoose__months-month .controls-DateRangeBigChoose-MonthView:nth-child(7) .controls-MonthView__caption-text')
				this.month = find('.controls-DateRangeBigChoose__months-month .controls-DateRangeBigChoose-MonthView:nth-child(1) .controls-MonthView__tableBody')
				this.november = find('[sbisname="MonthRangeBtn10"]');
				this.calendar = find('[sbisname="BackToYearButton"]');
				this.apply = find('[sbisname="ApplyButton"]');
				this.close = find('[sbisname="CloseButton"]');
				this.icon = find('[sbisname="IconButton"]');
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })

            .capture('opened_chooser', function (actions) {
                actions.click(this.open_chooser);
				actions.waitForElementToShow('.controls-RangeSelectable__item.controls-DateRangeBigChoose-MonthView:nth-child(3)', 1000);
				actions.waitForElementToShow('.controls-RangeSelectable__item.controls-DateRangeBigChoose-MonthView:nth-child(6)', 1000);
				actions.waitForElementToShow('.controls-RangeSelectable__item.controls-DateRangeBigChoose-MonthView:nth-child(9)', 1000);
				actions.waitForElementToShow('.controls-RangeSelectable__item.controls-DateRangeBigChoose-MonthView:nth-child(12)', 1000);
				actions.waitForElementToShow('[sbisname="ApplyButton"]', 1000);
				actions.waitForElementToShow('[sbisname="CloseButton"]', 1000);
            })
			
			.capture('hovered_quarter', function (actions) {
                actions.mouseMove(this.quarter);
            })
			
			.capture('selected_quarter', function (actions) {
                actions.click(this.quarter);
            })
			
			.capture('hovered_halfyear', function (actions) {
                actions.mouseMove(this.halfyear);
            })
			
			.capture('selected_halfyear', function (actions) {
                actions.click(this.halfyear);
            })
			
			.capture('hovered_nextyear', function (actions) {
                actions.mouseMove(this.nextyear);
            })
			
			.capture('hovered_prevyear', function (actions) {
                actions.mouseMove(this.prevyear);
            })
			
			.capture('hovered_chooseyear', function (actions) {
                actions.mouseMove(this.chooseyear);
            })
			
			.capture('opened_chooseyear', function (actions) {
                actions.click(this.chooseyear);
				actions.waitForElementToShow('.controls-DateRangeBigChoose__yearsRange .controls-DateRangeBigChoose__years-yearsRange-btn:nth-child(1)', 1000);
				actions.waitForElementToShow('.controls-DateRangeBigChoose__yearsRange .controls-DateRangeBigChoose__years-yearsRange-btn:nth-child(3)', 1000);
				actions.waitForElementToShow('.controls-DateRangeBigChoose__yearsRange .controls-DateRangeBigChoose__years-yearsRange-btn:nth-child(5)', 1000);
            })
			
			.capture('hovered_first_year', function (actions) {
                actions.mouseMove(this.first);
            })
			
			.capture('selected_first_year', function (actions) {
                actions.click(this.first);
            })
			
			.capture('hovered_third_year', function (actions) {
                actions.mouseMove(this.third);
            })
			
			.capture('selected_third_year', function (actions) {
                actions.click(this.third);
            })
			
			.capture('hovered_current_year', function (actions) {
                actions.click(this.current);
            })
			
			.capture('hovered_second_month', function (actions) {
                actions.mouseMove(this.second);
            })
			
			.capture('selected_second_month', function (actions) {
                actions.click(this.second);
            })
			
			.capture('hovered_seven_month', function (actions) {
                actions.mouseMove(this.seven);
            })
			
			.capture('selected_seven_month', function (actions) {
                actions.click(this.seven);
            })
			
			.capture('opened_month_picker', function (actions) {
                actions.click(this.month);
				actions.wait(500);
				actions.mouseMove(this.november);
            })
			
			.capture('selected_november', function (actions) {
				actions.click(this.november);
            })
			
			.capture('hovered_calendar', function (actions) {
                actions.mouseMove(this.calendar);
            })
			
			.capture('hovered_close', function (actions) {
                actions.mouseMove(this.close);
            })
			
			.capture('hovered_apply', function (actions) {
                actions.mouseMove(this.apply);
            })
			
						
			.capture('hovered_icon', function (actions) {
                actions.mouseMove(this.icon);
            })
			
			.capture('choosed_range', function (actions) {
                actions.click(this.apply);
				actions.mouseMove(this.input);
            })			
    });
});