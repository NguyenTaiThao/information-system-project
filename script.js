var imported = document.createElement('script');
imported.src = 'LunarSolarConverter.js';
document.head.appendChild(imported);

const date_picker_element = document.querySelector('.date-picker');
const selected_date_element = document.querySelector('.date-picker .selected-date');
const dates_element = document.querySelector('.date-picker .dates');
const mth_element = document.querySelector('.date-picker .dates .month .mth');
const next_mth_element = document.querySelector('.date-picker .dates .month .next-mth');
const prev_mth_element = document.querySelector('.date-picker .dates .month .prev-mth');
const days_element = document.querySelector('.date-picker .dates .days');
const body_element = document.querySelector("body");
const price_element = document.querySelector(".third-div .total-price");
const lunar_element = document.querySelector(".lunar-div .lunar-cal");

const months = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];

let date = new Date();
let day = date.getDate();
let month = date.getMonth();
let year = date.getFullYear();

let selectedDate = date;
let selectedDay = day;
let selectedMonth = month;
let selectedYear = year;

mth_element.textContent = months[month] + ' năm ' + year;

selected_date_element.textContent = formatDate(date);
selected_date_element.dataset.value = selectedDate;

populateDates();


// EVENT LISTENERS
date_picker_element.addEventListener('click', toggleDatePicker);
body_element.addEventListener('click', toggleOutside)
next_mth_element.addEventListener('click', goToNextMonth);
prev_mth_element.addEventListener('click', goToPrevMonth);

// FUNCTIONS
function toggleDatePicker(e) {
	if (!checkEventPathForClass(e.path, 'dates')) {
		dates_element.classList.toggle('active');
	}
}

function toggleOutside(e) {
	var isClickOutside = !(e.target === date_picker_element) &&
		!date_picker_element.contains(e.target);

	if (isClickOutside) {
		dates_element.classList.remove('active');
	}
}

function goToNextMonth(e) {
	month++;
	if (month > 11) {
		month = 0;
		year++;
	}
	mth_element.textContent = months[month] + ' năm ' + year;
	populateDates();
}

function goToPrevMonth(e) {
	month--;
	if (month < 0) {
		month = 11;
		year--;
	}
	mth_element.textContent = months[month] + ' năm ' + year;
	populateDates();
}

function populateDates(e) {
	days_element.innerHTML = '';
	let amount_days = 31;

	if (month == 1) {
		amount_days = 28;
	}

	for (let i = 0; i < amount_days; i++) {
		const day_element = document.createElement('div');
		day_element.classList.add('day');
		day_element.textContent = i + 1;

		if (selectedDay == (i + 1) && selectedYear == year && selectedMonth == month) {
			day_element.classList.add('selected');
		}

		day_element.addEventListener('click', function () {
			selectedDate = new Date(year + '-' + (month + 1) + '-' + (i + 1));
			selectedDay = (i + 1);
			selectedMonth = month;
			selectedYear = year;

			selected_date_element.textContent = formatDate(selectedDate);
			selected_date_element.dataset.value = selectedDate;

			convertLunar(selectedDay, selectedMonth, selectedYear);
			populateDates();
		});
		days_element.appendChild(day_element);
		window.setTimeout(() => convertLunar(selectedDay, selectedMonth, selectedYear), 100);
	}
}

// HELPER FUNCTIONS
function convertLunar(selectedDay, selectedMonth, selectedYear) {
	var converter = new LunarSolarConverter();
	var solar = new Solar();
	solar.solarYear = selectedYear;
	solar.solarMonth = selectedMonth + 1;
	solar.solarDay = selectedDay;
	var lunar = converter.SolarToLunar(solar);
	var lunarText = lunar.lunarDay + "-" + lunar.lunarMonth + "-" + lunar.lunarYear
	lunar_element.textContent = lunarText;
}

function checkEventPathForClass(path, selector) {
	for (let i = 0; i < path.length; i++) {
		if (path[i].classList && path[i].classList.contains(selector)) {
			return true;
		}
	}

	return false;
}
function formatDate(d) {
	let day = d.getDate();
	if (day < 10) {
		day = '0' + day;
	}

	let month = d.getMonth() + 1;
	if (month < 10) {
		month = '0' + month;
	}

	let year = d.getFullYear();

	return day + ' / ' + month + ' / ' + year;
}

// dropdown select
document.querySelector('.custom-select-wrapper').addEventListener('click', function () {
	this.querySelector('.custom-select').classList.toggle('open');
})

for (const option of document.querySelectorAll(".custom-option")) {
	option.addEventListener('click', function () {
		if (!this.classList.contains('selected')) {
			this.classList.add('selected');
		} else {
			if (!this.classList.contains("default")) {
				this.classList.remove('selected');
			} else {
				alert("Món Buffet này là bắt buộc");
				return
			}
		}
		var total = 0, count = 0;
		for (const option of document.querySelectorAll(".custom-option")) {
			if (option.classList.contains("selected")) {
				total += parseInt(option.getAttribute('data-value'));
				count++;

			}
		}
		this.closest('.custom-select').querySelector('.custom-select__trigger span').textContent = "CHỌN MÓN - đã chọn " + count;
		price_element.textContent = total;
	})
}

window.addEventListener('click', function (e) {
	const select = document.querySelector('.custom-select')
	if (!select.contains(e.target)) {
		select.classList.remove('open');
	}
});
