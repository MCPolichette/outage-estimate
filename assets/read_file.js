function read_file(input) {
	let fileName = fileCheck(input).replace(/ *\([^)]*\) */g, "");
	let id = input.id;
	let file = input.files[0];
	let fileReader = new FileReader();
	let allLines = [];
	fileReader.readAsText(file);
	fileReader.onload = function () {
		var text = fileReader.result;
		var allLines = text.split("\n");
		var topRow = allLines[0].split(",");
		let valuesRegExp = /(?:\"([^\"]*(?:\"\"[^\"]*)*)\")|([^\",]+)/g;
		let elements = [];
		console.log("TOPROW- " + topRow[1]);
		if (topRow[1] == "First Name") {
			//THIS IS AN AFFILIATE REPORT FOR Commission RATE
			if (affiliates == []) {
				alert(
					"YOU MUST UPLOAD THE PERFORMANCE SUMMARY BY AFFILIATE FIRST"
				);
			} else {
				secondButtonBoolean = true;
				console.log("TRUE!? " + secondButtonBoolean);
				for (i = 1; i < allLines.length; i++) {
					let thisRow = allLines[i].split(",");
					affiliates.forEach((affiliate) => {
						if (affiliate.Affiliate_Id === thisRow[0]) {
							let cr =
								Number(
									Number(
										thisRow[8].replaceAll("%", "")
									).toFixed(2)
								) / 100;
							affiliate.commissionRate = cr;
						} else {
						}
					});
				}
				btn2();
				console.log("Affiliates Updated");
				console.log(affiliates);
				successify("affiliateFormFile");
				merchant.affDoc = fileName;
			}
			document.getElementById("affiliateReportFileName").innerHTML =
				fileName;
		} else {
			console.log("unidentified report");
		}
	};
}
