// BASE FUNCTIONS (!? Move to their own JS file?)
function hide(arr) {
	//Reveals a hidden HTML element.
	arr.forEach((id) => {
		let element = document.getElementById(id);
		element.hidden = true;
	});
}
function unhide(arr) {
	//Reveals a hidden HTML element.
	arr.forEach((id) => {
		let element = document.getElementById(id);
		if (element.hidden) {
			element.removeAttribute("hidden");
		}
	});
}
// Function to find the minimum value
function findMin(arr, n) {
	let min = arr[0];
	for (let i = 1; i < n; i++) {
		min = Math.min(min, arr[i]); // Function to get minimum element
	}
	return min;
}
// Function to find the maximum value
function findMax(arr, n) {
	let max = arr[0];
	for (let i = 1; i < n; i++) {
		max = Math.max(max, arr[i]); // Function to get maximum element
	}
	return max;
}
function btn2() {
	if (baseline.salesTotal && secondButtonBoolean) {
		document.getElementById("secondSubmit").classList.remove("disabled");
	}
}
function password_check() {
	API_KEY = document.getElementById("password_input").value;
	switch (API_KEY.length) {
		case 32:
			window.localStorage.setItem("test", API_KEY);
			unhide(["outage-accordian"]);
			hide(["title"]);
			document.getElementById("first_display").remove();
			break;
		default:
			alert("This key is an unacceptable value");
			break;
	}
}
function use_local_storage() {
	let x = window.localStorage.test;
	document.getElementById("password_input").value = x;
	console.log("used local storage to populate API key");
}
function updateByID(id, text) {
	document.getElementById(id).innerHTML = text;
}
function DateToString(date) {
	let options = {
		// weekday: "short", //to display the full name of the day, you can use short to indicate an abbreviation of the day
		day: "numeric",
		month: "long", //to display the full name of the month
		year: "numeric",
	};
	var sDay = date.toLocaleDateString("en-US", options);
	return sDay;
}

//============================================================================
// STEPS:
function first_step_report() {
	console.log("First Step");
	update_base_data();
	todays_date = DateToString(new Date());
	baseline.date_start_display = new Date(outage.date_start);

	baseline.date_start_display.setDate(
		baseline.date_start_display.getDate() - 20
	);
	baseline.date_end_display = new Date(outage.date_start);
	baseline.date_end_display.setDate(baseline.date_end_display.getDate() - 1);

	// Format the dates to "YYYY-MM-DD"
	function formatDateToYYYYMMDD(date) {
		let year = date.getFullYear();
		let month = (date.getMonth() + 1).toString().padStart(2, "0");
		let day = date.getDate().toString().padStart(2, "0");
		return `${year}-${month}-${day}`;
	}

	baseline.date_start = formatDateToYYYYMMDD(baseline.date_start_display);
	baseline.date_end = formatDateToYYYYMMDD(baseline.date_end_display);
	console.log(baseline);
	document.getElementById("baselineStartDate").value = baseline.date_start;
	document.getElementById("baselineEndDate").value = baseline.date_end;
	// Displaying the suggested BaseLine.
	updateByID(
		"baselineDates",
		DateToString(baseline.date_start_display) +
			" to " +
			DateToString(baseline.date_end_display)
	);
	successify("baselineDates");
	run_report({
		startDate: outage.date_start,
		endDate: outage.date_end,
		report_id: 15,
	}); // Performance Summary for Outage report.
}
function second_report() {
	update_base_data();
	let start = baseline.date_start;
	let end = baseline.date_end;
	switch (document.getElementById("chooseSuggestedBaseline").checked) {
		case true:
			start = baseline.date_start;
			end = baseline.date_end;
			break;
		case false:
			start = document.getElementById("baselineStartDate").value;
			end = document.getElementById("baselineEndDate").value;
			break;
	}
	document.getElementById("SecondStepComplete").classList.add("disabled");
	run_report({
		startDate: start,
		endDate: end,
		report_id: 1,
	}); //Performance Summary for Outage report. ==> Builds all Tables
}
function update_base_data() {
	//Updates these values every time.. just in case someone is tweaking the parameters.
	outage.date_start = document.getElementById("outageStartDate").value;
	outage.date_end = document.getElementById("outageEndDate").value;
	outage.date_start_display = new Date(outage.date_start.replace(/-/g, "/"));
	outage.date_end_display = new Date(outage.date_end.replace(/-/g, "/"));
	merchant.id = document.getElementById("merchantId").value;
	merchant.affiliate_count = Number(
		document.getElementById("affiliateCount").value
	);
	merchant.network_commission =
		document.getElementById("networkCommission").value;
	if (document.getElementById("percentOfSale").checked) {
		console.log("Chosen the Default Percent of Sale");
		merchant.nc_display = merchant.network_commission + "% of Sale";
	}
	if (document.getElementById("percentOfAffCom").checked) {
		console.log("Chosen the Percent of Affiliate's Commission");
		merchant.nc_display =
			merchant.network_commission + "% of Affiliate Commission";
	}
	merchant.nc = Number(merchant.network_commission / 100);
}

function show_new_baseline() {
	document
		.getElementById("newBaseLineSelection")
		.classList.remove("collapse");
	document.getElementById("chooseNewBaseLine").checked = true;
}

function buildAllTables() {
	buildAffiliateTable();
	buildMerchantTable();
	buildOutageTable();
}
function successify(id) {
	document.getElementById(id).classList.remove("alert-danger");
	document.getElementById(id).classList.add("alert-success");
}
function toUSD(dollarInt) {
	var formatter = new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
	});
	dollarUSD = formatter.format(dollarInt);
	return dollarUSD;
}
function fileCheck(myFile) {
	var file = myFile.files[0];
	var filename = file.name;
	filename.split("-");
	console.log("FILENAME, ", filename);
	return filename;
}
