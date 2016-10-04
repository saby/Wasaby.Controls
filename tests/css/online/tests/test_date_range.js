gemini.suite('SBIS3.CONTROLS.DateRange Online', function () {

    gemini.suite('base', function (test) {

        test.setUrl('/regression_date_range_online.html').setCaptureElements('html')

            .before(function (actions) {

				this.dr = '[sbisname="DateRange 1"]';
                this.input = '[name="TextBox 1"] input';
				this.open_chooser = '[name="DateRange__Button"]';
				this.quarter = '[sbisname="QuarterRangeBtn0"]';
				this.halfyear = '[sbisname="HalfyearRangeBtn0"]';
				this.nextyear = '[sbisname="NextYearButton"]';
				this.prevyear = '[sbisname="PrevYearButton"]';
				this.chooseyear = '[sbisname="ToggleChooseYearButton"]';
				this.first = '.controls-DateRangeBigChoose__yearsRange .controls-DateRangeBigChoose__years-yearsRange-btn:nth-child(1)';
				this.third = '.controls-DateRangeBigChoose__yearsRange .controls-DateRangeBigChoose__years-yearsRange-btn:nth-child(3)';
				this.current = '[sbisname="CurrentYearButton"]';
				this.second = '.controls-DateRangeBigChoose__months-month .controls-DateRangeBigChoose-MonthView:nth-child(2) .controls-MonthView__caption-text';
				this.seven = '.controls-DateRangeBigChoose__months-month .controls-DateRangeBigChoose-MonthView:nth-child(7) .controls-MonthView__caption-text';
				this.month = '.controls-DateRangeBigChoose__months-month .controls-DateRangeBigChoose-MonthView:nth-child(1) .controls-MonthView__tableBody';
				this.november = '[sbisname="MonthRangeBtn10"]';
				this.calendar = '[sbisname="BackToYearButton"]';
				this.apply = '[sbisname="ApplyButton"]';
				this.close = '[sbisname="CloseButton"]';
				this.icon = '.controls-DateRangeBigChoose__homeBtn';
				this.m3 = '.controls-RangeSelectable__item.controls-DateRangeBigChoose-MonthView:nth-child(3)';
				this.m6 = '.controls-RangeSelectable__item.controls-DateRangeBigChoose-MonthView:nth-child(6)';
				this.m9 = '.controls-RangeSelectable__item.controls-DateRangeBigChoose-MonthView:nth-child(9)';
				this.m12 = '.controls-RangeSelectable__item.controls-DateRangeBigChoose-MonthView:nth-child(12)';
				this.a1 = '.controls-DateRangeBigChoose__yearsRange .controls-DateRangeBigChoose__years-yearsRange-btn:nth-child(1)';
				this.a3 = '.controls-DateRangeBigChoose__yearsRange .controls-DateRangeBigChoose__years-yearsRange-btn:nth-child(3)';
				this.a5 = '.controls-DateRangeBigChoose__yearsRange .controls-DateRangeBigChoose__years-yearsRange-btn:nth-child(5)';
				
				actions.waitForElementToShow(this.dr, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })

            .capture('opened_chooser', function (actions) {
                actions.click(this.open_chooser);
				actions.waitForElementToShow(this.m3, 5000);
				actions.waitForElementToShow(this.m6, 5000);
				actions.waitForElementToShow(this.m9, 5000);
				actions.waitForElementToShow(this.m12, 5000);
				actions.waitForElementToShow(this.apply, 5000);
				actions.waitForElementToShow(this.close, 5000);
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
				actions.waitForElementToShow(this.a1, 5000);
				actions.waitForElementToShow(this.a3, 5000);
				actions.waitForElementToShow(this.a5, 5000);
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
				actions.mouseMove(this.nextyear);
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