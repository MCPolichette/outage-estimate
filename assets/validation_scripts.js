// VALIDATION FUNCTIONS
function validateFirstStep() {
	validationCheck(
		[
			"outageStartDate",
			"outageEndDate",
			"merchantId",
			"networkCommission",
			"affiliateCount",
		],
		"firstSubmit",
		"firstStepComplete"
	);
}
function validateSecondStep() {
	let date_check = document.getElementById("chooseNewBaseLine").checked;
	if (date_check) {
		baseline.date_start =
			document.getElementById("baselineStartDate").value;
		baseline.date_end = document.getElementById("baselineEndDate").value;
		baseline.date_start_display = new Date(baseline.date_start);
		baseline.date_start_display.setDate(
			baseline.date_start_display.getDate()
		);
		baseline.date_end_display = new Date(baseline.date_end);
		baseline.date_end_display.setDate(baseline.date_end_display.getDate());
		console.log(baseline);
	}
	console.log("custom dates", date_check);
	let commission_check = document.querySelector(
		'input[name="AffCommission"]:checked'
	);
	console.log(commission_check.value);
	if (commission_check)
		switch (commission_check.value) {
			case "universal_rate":
				softValidationCheck(
					["universal_affiliate_commission"],
					"secondSubmit",
					"SecondStepComplete"
				);
				merchant.universal_commission =
					Number(
						document.getElementById(
							"universal_affiliate_commission"
						).value
					) / 100;
				if (merchant.universal_commission) {
					outage.commission_rates = merchant.universal_commission;
					document.getElementById("r_ac_commission").innerHTML =
						merchant.universal_commission;
					affiliates.forEach((affiliate) => {
						console.log(merchant.universal_commission);
						affiliate.commissionRate =
							merchant.universal_commission;
					});
					console.log(affiliates);
					console.log(merchant);
				}
				break;
			case "individual_rate":
				softValidationCheck(
					["affiliateFormFile"],
					"secondSubmit",
					"SecondStepComplete"
				);
				break;
		}
	else {
		console.log("NULL");
		alert(
			"please set Affiliate Commission, or upload Affiliate Commission Rates"
		);
	}
}
function validationCheck(arr, btn_id, new_button) {
	let arrCheck = 0;
	arr.forEach((id) => {
		if (document.getElementById(id).value) {
			successify(id);
		} else {
			document.getElementById(id).classList.add("alert-danger");
			arrCheck = 1;
			let btn = document.getElementById(new_button);
			console.log(btn);
		}
	});
	console.log("Zero is good ==> " + arrCheck);
	if (arrCheck) {
		alert(
			"Not all fields were populated correctly.  \n Please go back and try again"
		);
		btn.classList.remove("disabled");
	} else {
		let btn = document.getElementById(new_button);
		btn.classList.remove("collapse");
		document.getElementById(btn_id).innerHTML = "Click to Update";
		first_step_report();
		btn.classList.remove("disabled");
	}
}

//Lazy Solution to the EXTRA API call issue above.  I'll fix this if I OVERHAUL this report in the future
function softValidationCheck(arr, btn_id, new_button) {
	let arrCheck = 0;
	arr.forEach((id) => {
		if (document.getElementById(id).value) {
			successify(id);
		} else {
			document.getElementById(id).classList.add("alert-danger");
			arrCheck = 1;
			let btn = document.getElementById(new_button);
			console.log(btn);
		}
	});
	console.log("Zero is good ==> " + arrCheck);
	if (arrCheck) {
		alert(
			"Not all fields were populated correctly.  \n Please go back and try again"
		);
		btn.classList.remove("disabled");
	} else {
		let btn = document.getElementById(new_button);
		btn.classList.remove("collapse");
		document.getElementById(btn_id).innerHTML = "Click to Update";
		btn.classList.remove("disabled");
	}
}
