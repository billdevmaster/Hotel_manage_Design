(function($) {

	"use strict";


	$(document).ready(function () {
    function c(passed_month, passed_year, calNum) {
        var calendar = calNum == 0 ? calendars.cal1 : calendars.cal2;
        makeWeek(calendar.weekline);
        calendar.datesBody.empty();
        var calMonthArray = makeMonthArray(passed_month, passed_year);
        var r = 1;
        var u = false;
        while (!u) {
            if (daysArray[r] == calMonthArray[0].weekday) {
                u = true
            } else {
                calendar.datesBody.append('<div class="blank"></div>');
                r++;
            }
        }
        for (var cell = 0; cell < 42 - r; cell++) { // 42 date-cells in calendar
            if (cell >= calMonthArray.length) {
                calendar.datesBody.append('<div class="blank"></div>');
            } else {
                var shownDate = calMonthArray[cell].day;
                var iter_date = new Date(passed_year, passed_month, shownDate);
                
                if (
                (
                (shownDate != today.getDate() && passed_month == today.getMonth()) || passed_month != today.getMonth()) && iter_date < today) {
                    var m = '<div class="past-date">';
                } else {
                    var m = checkToday(iter_date) ? '<div class="today">' : "<div>";
                }

                if (shownDate == selectedDate.date && passed_month == selectedDate.month && passed_year == selectedDate.year) {
                    var m = '<div class="selected">';
                }
                calendar.datesBody.append(m + shownDate + "</div>");
            }
        }

        var color = "#444444";
        calendar.calHeader.find("h2").text(i[passed_month] + " " + passed_year);
        calendar.weekline.find("div").css("color", color);
        calendar.datesBody.find(".today").css("color", "#00bdaa");

        // find elements (dates) to be clicked on each time
        // the calendar is generated
        var clicked = false;
        selectDates(selected);

        clickedElement = calendar.datesBody.find('div');
        clickedElement.on("click", function () {
            clicked = $(this);
            calendar.datesBody.find('div').removeClass("selected");
            var whichCalendar = calendar.name;
            const clickedInfo = getClickedInfo(clicked, calendar);
            console.log(clickedInfo)
            selectedDate = clickedInfo;
            clicked.addClass("selected");
            // firstClick = true;
            // secondClick = true;
            // console.log(firstClick)
            // if (firstClick && secondClick) {
            //     console.log("first")
            //     thirdClicked = getClickedInfo(clicked, calendar);
            //     var firstClickDateObj = new Date(firstClicked.year,
            //     firstClicked.month,
            //     firstClicked.date);
            //     var secondClickDateObj = new Date(secondClicked.year,
            //     secondClicked.month,
            //     secondClicked.date);
            //     var thirdClickDateObj = new Date(thirdClicked.year,
            //     thirdClicked.month,
            //     thirdClicked.date);
            //     if (secondClickDateObj > thirdClickDateObj && thirdClickDateObj > firstClickDateObj) {
            //         secondClicked = thirdClicked;
            //         // then choose dates again from the start :)
            //         bothCals.find(".calendar_content").find("div").each(function () {
            //             $(this).removeClass("selected");
            //         });
            //         selected = {};
            //         selected[firstClicked.year] = {};
            //         selected[firstClicked.year][firstClicked.month] = [firstClicked.date];
            //         selected = addChosenDates(firstClicked, secondClicked, selected);
            //     } else { // reset clicks
            //         selected = {};
            //         firstClicked = [];
            //         secondClicked = [];
            //         firstClick = false;
            //         secondClick = false;
            //         bothCals.find(".calendar_content").find("div").each(function () {
            //             $(this).removeClass("selected");
            //         });
            //     }
            // }
            // if (!firstClick) {
            //     console.log("second")
            //     firstClick = true;
            //     firstClicked = getClickedInfo(clicked, calendar);
            //     selected[firstClicked.year] = {};
            //     selected[firstClicked.year][firstClicked.month] = [firstClicked.date];
            // } else {
            //     console.log("third")
            //     secondClick = true;
            //     secondClicked = getClickedInfo(clicked, calendar);

            //     // what if second clicked date is before the first clicked?
            //     var firstClickDateObj = new Date(firstClicked.year,
            //     firstClicked.month,
            //     firstClicked.date);
            //     var secondClickDateObj = new Date(secondClicked.year,
            //     secondClicked.month,
            //     secondClicked.date);

            //     if (firstClickDateObj > secondClickDateObj) {

            //         var cachedClickedInfo = secondClicked;
            //         secondClicked = firstClicked;
            //         firstClicked = cachedClickedInfo;
            //         selected = {};
            //         selected[firstClicked.year] = {};
            //         selected[firstClicked.year][firstClicked.month] = [firstClicked.date];

            //     } else if (firstClickDateObj.getTime() == secondClickDateObj.getTime()) {
            //         selected = {};
            //         firstClicked = [];
            //         secondClicked = [];
            //         firstClick = false;
            //         secondClick = false;
            //         $(this).removeClass("selected");
            //     }


            //     // add between dates to [selected]
            //     selected = addChosenDates(firstClicked, secondClicked, selected);
            // }
            // selectDates(selected);
        });

       
    }
        
    

    function selectDates(selected) {
			if (!$.isEmptyObject(selected)) {
				var dateElements1 = datesBody1.find('div');
				var dateElements2 = datesBody2.find('div');

				function highlightDates(passed_year, passed_month, dateElements) {
					if (passed_year in selected && passed_month in selected[passed_year]) {
						var daysToCompare = selected[passed_year][passed_month];
						for (var d in daysToCompare) {
							dateElements.each(function (index) {
								if (parseInt($(this).text()) == daysToCompare[d]) {
									$(this).addClass('selected');
								}
							});
						}
					}
				}

				highlightDates(year, month, dateElements1);
				highlightDates(nextYear, nextMonth, dateElements2);
			}
    }

    function makeMonthArray(passed_month, passed_year) { // creates Array specifying dates and weekdays
        var e = [];
        for (var r = 1; r < getDaysInMonth(passed_year, passed_month) + 1; r++) {
            e.push({
                day: r,
                // Later refactor -- weekday needed only for first week
                weekday: daysArray[getWeekdayNum(passed_year, passed_month, r)]
            });
        }
        return e;
    }

    function makeWeek(week) {
        week.empty();
        for (var e = 0; e < 7; e++) {
            week.append("<div>" + daysArray[e].substring(0, 3) + "</div>")
        }
    }

    function getDaysInMonth(currentYear, currentMon) {
        return (new Date(currentYear, currentMon + 1, 0)).getDate();
    }

    function getWeekdayNum(e, t, n) {
        return (new Date(e, t, n)).getDay();
    }

    function checkToday(e) {
        var todayDate = today.getFullYear() + '/' + (today.getMonth() + 1) + '/' + today.getDate();
        var checkingDate = e.getFullYear() + '/' + (e.getMonth() + 1) + '/' + e.getDate();
        return todayDate == checkingDate;

    }

    function getAdjacentMonth(curr_month, curr_year, direction) {
        var theNextMonth;
        var theNextYear;
        if (direction == "next") {
            theNextMonth = (curr_month + 1) % 12;
            theNextYear = (curr_month == 11) ? curr_year + 1 : curr_year;
        } else {
            theNextMonth = (curr_month == 0) ? 11 : curr_month - 1;
            theNextYear = (curr_month == 0) ? curr_year - 1 : curr_year;
        }
        return [theNextMonth, theNextYear];
    }

    function b() {
        today = new Date;
        year = today.getFullYear();
        month = today.getMonth();
        var nextDates = getAdjacentMonth(month, year, "next");
        nextMonth = nextDates[0];
        nextYear = nextDates[1];
    }

    var e = 480;

    var today;
    var year,
    month,
    nextMonth,
    nextYear;

    var r = [];
    var i = [
        "January",
        "Feburary",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"];
    var daysArray = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
    ];

    var cal1 = $("#calendar_first");
    var calHeader1 = cal1.find(".calendar_header");
    var weekline1 = cal1.find(".calendar_weekdays");
    var datesBody1 = cal1.find(".calendar_content");

    var cal2 = $("#calendar_second");
    var calHeader2 = cal2.find(".calendar_header");
    var weekline2 = cal2.find(".calendar_weekdays");
    var datesBody2 = cal2.find(".calendar_content");

    var bothCals = $(".calendar");

    var switchButton = bothCals.find(".calendar_header").find('.switch-month');
    var HeaderTitle = bothCals.find(".calendar_header").find('h2');

    var calendars = {
        "cal1": {
            "name": "first",
                "calHeader": calHeader1,
                "weekline": weekline1,
                "datesBody": datesBody1
        },
            "cal2": {
            "name": "second",
                "calHeader": calHeader2,
                "weekline": weekline2,
                "datesBody": datesBody2
        }
    }


    var clickedElement;
    var firstClicked,
    secondClicked,
    thirdClicked;
    var firstClick = false;
    var secondClick = false;
    var selected = {};
    var selectedDate = {date: new Date().getDate(), month: new Date().getMonth(), year: new Date().getFullYear()};

    b();
    c(month, year, 0);
    c(nextMonth, nextYear, 1);
    if (window.matchMedia("(max-width: 767px)").matches) { 
        weekline1.addClass("none");
        datesBody1.addClass("none");
        HeaderTitle.text(selectedDate.date + " " + HeaderTitle.text())
    }
        switchButton.on("click", function () {
            var clicked = $(this);
        if (window.matchMedia("(max-width: 767px)").matches && weekline1.hasClass("none")) { 
            const date = new Date(selectedDate.year + "-" + (selectedDate.month + 1) + "-" + selectedDate.date);
            var nextDate = new Date(date);
            if (clicked.attr("class").indexOf("left") != -1) { 
                nextDate.setDate(date.getDate() - 1);
            } else {
                nextDate.setDate(date.getDate() + 1);
            }
            selectedDate = {
                date: nextDate.getDate(),
                month: nextDate.getMonth(),
                year: nextDate.getFullYear(),
            }
            c(selectedDate.month, selectedDate.year, 0);
            HeaderTitle.text(selectedDate.date + " " + i[selectedDate.month] + " " + selectedDate.year);
        } else {
            var generateCalendars = function (e) {
                var nextDatesFirst = getAdjacentMonth(month, year, e);
                var nextDatesSecond = getAdjacentMonth(nextMonth, nextYear, e);
                month = nextDatesFirst[0];
                year = nextDatesFirst[1];
                nextMonth = nextDatesSecond[0];
                nextYear = nextDatesSecond[1];
    
                c(month, year, 0);
                c(nextMonth, nextYear, 1);
            };
            if (clicked.attr("class").indexOf("left") != -1) {
                generateCalendars("previous");
            } else {
                generateCalendars("next");
            }
            clickedElement = bothCals.find(".calendar_content").find("div");
        }
    });
        
    HeaderTitle.on("click", function () {
        // mobile case
        if (window.matchMedia("(max-width: 767px)").matches) {
            console.log(weekline1.hasClass("none"))
            if (weekline1.hasClass("none")) {
                weekline1.removeClass("none")
                datesBody1.removeClass("none")
                var arr = HeaderTitle.text().split(" ");

                HeaderTitle.text(i[selectedDate.month] + " " + selectedDate.year)
            } else {
                weekline1.addClass("none")
                datesBody1.addClass("none")
                var arr = HeaderTitle.text().split(" ");
                c(selectedDate.month, selectedDate.year, 0);
                HeaderTitle.text(selectedDate.date + " " + i[selectedDate.month] + " " + selectedDate.year)
                // HeaderTitle.text(selectedDate.date + " " + HeaderTitle.text())
                // console.log(HeaderTitle.text())
            }
        }
    })


    //  Click picking stuff
    function getClickedInfo(element, calendar) {
        var clickedInfo = {};
        var clickedCalendar,
        clickedMonth,
        clickedYear;
        clickedCalendar = calendar.name;
        clickedMonth = clickedCalendar == "first" ? month : nextMonth;
        clickedYear = clickedCalendar == "first" ? year : nextYear;
        clickedInfo = {
            "calNum": clickedCalendar,
                "date": parseInt(element.text()),
                "month": clickedMonth,
                "year": clickedYear
        }
        return clickedInfo;
    }


    // Finding between dates MADNESS. Needs refactoring and smartening up :)
    function addChosenDates(firstClicked, secondClicked, selected) {
        if (secondClicked.date > firstClicked.date || secondClicked.month > firstClicked.month || secondClicked.year > firstClicked.year) {

            var added_year = secondClicked.year;
            var added_month = secondClicked.month;
            var added_date = secondClicked.date;

            if (added_year > firstClicked.year) {
                // first add all dates from all months of Second-Clicked-Year
                selected[added_year] = {};
                selected[added_year][added_month] = [];
                for (var i = 1;
                i <= secondClicked.date;
                i++) {
                    selected[added_year][added_month].push(i);
                }

                added_month = added_month - 1;
                while (added_month >= 0) {
                    selected[added_year][added_month] = [];
                    for (var i = 1;
                    i <= getDaysInMonth(added_year, added_month);
                    i++) {
                        selected[added_year][added_month].push(i);
                    }
                    added_month = added_month - 1;
                }

                added_year = added_year - 1;
                added_month = 11; // reset month to Dec because we decreased year
                added_date = getDaysInMonth(added_year, added_month); // reset date as well

                // Now add all dates from all months of inbetween years
                while (added_year > firstClicked.year) {
                    selected[added_year] = {};
                    for (var i = 0; i < 12; i++) {
                        selected[added_year][i] = [];
                        for (var d = 1; d <= getDaysInMonth(added_year, i); d++) {
                            selected[added_year][i].push(d);
                        }
                    }
                    added_year = added_year - 1;
                }
            }

            if (added_month > firstClicked.month) {
                if (firstClicked.year == secondClicked.year) {
                    selected[added_year][added_month] = [];
                    for (var i = 1;
                    i <= secondClicked.date;
                    i++) {
                        selected[added_year][added_month].push(i);
                    }
                    added_month = added_month - 1;
                }
                while (added_month > firstClicked.month) {
                    selected[added_year][added_month] = [];
                    for (var i = 1;
                    i <= getDaysInMonth(added_year, added_month);
                    i++) {
                        selected[added_year][added_month].push(i);
                    }
                    added_month = added_month - 1;
                }
                added_date = getDaysInMonth(added_year, added_month);
            }

            for (var i = firstClicked.date + 1;
            i <= added_date;
            i++) {
                selected[added_year][added_month].push(i);
            }
        }
        return selected;
    }
});


})(jQuery);
