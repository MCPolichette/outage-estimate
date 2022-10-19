function run_report(report) {
    startDate = report.startDate;
    endDate = report.endDate;
    report_id = report.report_id;

    fetch('https://classic.avantlink.com/api.php?module=AdminReport&auth_key=' + API_KEY + '&merchant_id=' + merchant.id + '&merchant_parent_id=0&affiliate_id=0&website_id=0&date_begin=' + startDate + '&date_end=' + endDate + '&affiliate_group_id=0&report_id=' + report_id + '&output=xml')
        .then(response => response.text())
        .then(str =>
            xmlDoc = new window.DOMParser().parseFromString(str, "text/xml"))
        .then(data =>
            // console.log(data)
            reportStep2(data, report_id)
        );
};

function reportStep2(xml, report_id) {
    switch (report_id) {
        case 15: //Performance Summary by Affiliate for selected dates
            affiliates = [];
            xmlDoc = xml.getElementsByTagName('Table1')
            for (let i = 0; i < xmlDoc.length; i++) {
                affiliates.push({
                    Affiliate: xmlDoc[i].getElementsByTagName('Affiliate')[0].childNodes[0].nodeValue,
                    Click_Throughs: xmlDoc[i].getElementsByTagName('Click_Throughs')[0].childNodes[0].nodeValue,
                    Affiliate_Id: xmlDoc[i].getElementsByTagName('Affiliate_Id')[0].childNodes[0].nodeValue,
                    Number_of_Sales: xmlDoc[i].getElementsByTagName('Number_of_Sales')[0].childNodes[0].nodeValue,
                    Sales: xmlDoc[i].getElementsByTagName('Sales')[0].childNodes[0].nodeValue,
                    Conversion_Rate: xmlDoc[i].getElementsByTagName('Conversion_Rate')[0].childNodes[0].nodeValue,
                });
            }
            for (let i = 0; i < affiliates.length; i++) {
                affiliates[i].clicks = Number(affiliates[i].Click_Throughs.replaceAll(',', ''));
                affiliates[i].sales_amount = Number(affiliates[i].Sales.replaceAll(',', '').replaceAll('\$', ''));
                affiliates[i].sales_count = Number(affiliates[i].Number_of_Sales.replaceAll(',', ''));
                outage.total_sales = outage.total_sales + affiliates[i].sales_amount;
                outage.total_sales_count = outage.total_sales_count + affiliates[i].sales_count;
                outage.total_clicks = outage.total_clicks + affiliates[i].clicks;
                // outage.average_sales_total = outage.total_sales / affiliates.length
            };
            affiliates.sort((a, b) => b.clicks - a.clicks);
            // outage.conversion_rate = Number((outage.total_sales_count / outage.total_clicks)); //.toFixed(6) !?
            outage.aov = Number((outage.total_sales / outage.total_sales_count).toFixed(2));
            outage.total_sales = Number(outage.total_sales.toFixed(2));
            outage.date_start_display = new Date(outage.date_start);
            outage.date_end_display = new Date(outage.date_end);
            baseline.date_start_display = new Date(outage.date_start);
            baseline.date_start_display.setDate(baseline.date_start_display.getDate() - 21);
            baseline.date_end_display = new Date(outage.date_start);
            baseline.date_end_display.setDate(baseline.date_end_display.getDate() - 1);
            baseline.date_start = baseline.date_start_display.toISOString().split('T')[0]
            baseline.date_end = baseline.date_end_display.toISOString().split('T')[0]
            document.getElementById("baselineStartDate").value = baseline.date_start
            document.getElementById("baselineEndDate").value = baseline.date_end
            //Displaying the suggested BaseLine.
            updateByID('baselineDates', ((DateToString(baseline.date_start_display)) + " to " + (DateToString(baseline.date_end_display))));
            successify("baselineDates");
            document.getElementById('secondSubmit').classList.remove("disabled")
            buildMerchantTable();
            buildOutageTable();
            console.log(merchant);
            console.log(outage);
            console.log(baseline);
            console.log(affiliates);
            break
        case 1: //Performance Summary for outage period
            console.log(xml)
            xmlDoc = xml.getElementsByTagName('Table1')
            baseline.sales_count = Number((xmlDoc[0].getElementsByTagName('Number_of_Sales')[0].childNodes[0].nodeValue).replaceAll(',', ''))
            baseline.sales_amount = Number((xmlDoc[0].getElementsByTagName('Sales')[0].childNodes[0].nodeValue).replaceAll('\$', '').replaceAll(',', ''))
            baseline.clicks = Number((xmlDoc[0].getElementsByTagName('Click_Throughs')[0].childNodes[0].nodeValue).replaceAll(',', ''))
            baseline.conversion_rate = ((Number((xmlDoc[0].getElementsByTagName('Conversion_Rate')[0].childNodes[0].nodeValue).replaceAll('\%', ''))) / 100).toFixed(6)
            baseline.conversion_rate = Number(baseline.conversion_rate)
            baseline.aov = Number((xmlDoc[0].getElementsByTagName('Average_Sale_Amount')[0].childNodes[0].nodeValue).replaceAll('\$', '').replaceAll(',', ''))
            buildAllTables();
            break
    };
};