function runReport(report_id) {
    outage.date_start = document.getElementById("outageStartDate").value;
    outage.date_end = document.getElementById("outageEndDate").value;
    startDate = outage.date_start;
    endDate = outage.date_end;
    switch (report_id) {
        case 1:
            if (baseline.date_start) {
                startDate = baseline.date_start
                endDate = baseline.date_end
            }
            else { alert("No Baseline Dates exist \n This error should never apear.") }
            let x = document.getElementById('chooseSuggestedBaseline').checked
            switch (document.getElementById('chooseSuggestedBaseline').checked) {
                case true:
                    startDate = baseline.date_start
                    endDate = baseline.date_end
                    break
                case false:
                    startDate = document.getElementById('baselineStartDate').value
                    endDate = document.getElementById('baselineEndDate').value
                    break
            }
            break
        case 15:
            startDate = outage.date_start
            endDate = outage.date_end
            break
    };
    console.log(startDate, endDate)
    merchant.name = document.getElementById('merchantName').value;
    merchant.id = document.getElementById('merchantId').value;
    merchant.affiliate_count = Number(document.getElementById('affiliateCount').value);
    merchant.network_commission = (document.getElementById("networkCommission").value)
    if (document.getElementById("percentOfSale").checked) {
        console.log("Chosen the Default Percent of Sale");
        merchant.nc_display = merchant.network_commission + "% of Sale"
    };
    if (document.getElementById("percentOfAffCom").checked) {
        console.log("Chosen the Percent of Affiliate's Commission");
        merchant.nc_display = merchant.network_commission + "% of Affiliate Commission"
    };
    merchant.nc = (Number(merchant.network_commission / 100));
    fetch('https://classic.avantlink.com/api.php?module=AdminReport&auth_key=' + API_KEY + '&merchant_id=' + merchant.id + '&merchant_parent_id=0&affiliate_id=0&website_id=0&date_begin=' + startDate + '&date_end=' + endDate + '&affiliate_group_id=0&report_id=' + report_id + '&output=xml')
        .then(response => response.text())
        .then(str =>
            xmlDoc = new window.DOMParser().parseFromString(str, "text/xml"))
        .then(data =>
            // console.log(data)
            reportStep2(data, report_id)
        );
};