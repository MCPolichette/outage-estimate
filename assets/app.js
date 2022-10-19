// BASE FUNCTIONS (!? Move to their own JS file?)
function hide(arr) {
    //Reveals a hidden HTML element.
    arr.forEach(id => {
        let element = document.getElementById(id);
        element.hidden = true
    })
};
function unhide(arr) {
    //Reveals a hidden HTML element.
    arr.forEach(id => {
        let element = document.getElementById(id);
        if (element.hidden) {
            element.removeAttribute('hidden');
        };
    });
};
function password_check() {
    API_KEY = document.getElementById('password_input').value
    switch (API_KEY.length) {
        case 32:
            window.localStorage.setItem('test', API_KEY);
            unhide(['post_password_display']);
            hide(['title']);
            document.getElementById('first_display').remove();
            break
        default:
            alert("NOPE")
            break
    };
};
function use_local_storage() {
    let x = window.localStorage.test;
    document.getElementById('password_input').value = x;
    console.log(x);
};
function updateByID(id, text) {
    document.getElementById(id).innerHTML = text
};
function DateToString(date) {
    let options = {
        // weekday: "short", //to display the full name of the day, you can use short to indicate an abbreviation of the day
        day: "numeric",
        month: "long", //to display the full name of the month
        year: "numeric"
    };
    var sDay = date.toLocaleDateString("en-US", options);
    return sDay
};

//==================================================================================================================
// STEPS:
function first_step_report() {
    update_base_data();
    run_report({
        startDate: outage.date_start,
        endDate: outage.date_end,
        report_id: 15
    }) //Performance Summary for Outage report.
};
function second_report() {
    update_base_data();
    let start = baseline.date_start
    let end = baseline.date_end
    switch (document.getElementById('chooseSuggestedBaseline').checked) {
        case true:
            start = baseline.date_start
            end = baseline.date_end
            break
        case false:
            start = document.getElementById('baselineStartDate').value
            end = document.getElementById('baselineEndDate').value
            break
    }
    run_report({
        startDate: start,
        endDate: end,
        report_id: 1
    }) //Performance Summary for Outage report.

}
function update_base_data() {
    //Updates these values every time.. just in case someone is tweaking the parameters.
    outage.date_start = document.getElementById("outageStartDate").value;
    outage.date_end = document.getElementById("outageEndDate").value;
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
}

function show_new_baseline() {
    document.getElementById('newBaseLineSelection').classList.remove("collapse")
    document.getElementById('chooseNewBaseLine').checked = true
};

function buildAllTables() {
    outage.estimated_total = (baseline.aov * outage.total_clicks);
    outage.estimated_sales = Number((outage.estimated_total * baseline.conversion_rate).toFixed(2));
    outage.discrepency = Number((outage.estimated_sales - outage.total_sales).toFixed(2))
    outage.adjusted_discrepency = Number((outage.average_sales_total - outage.discrepency).toFixed(2));
    console.log(merchant);
    console.log(outage);
    console.log(baseline);
    console.log(affiliates);
    buildBaseLineTable();
    buildMerchantTable();
    buildAffiliateTable();
};
function successify(id) {
    document.getElementById(id).classList.remove("alert-danger");
    document.getElementById(id).classList.add("alert-success")
};
function toUSD(dollarInt) {
    var formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });
    dollarUSD = formatter.format(dollarInt);
    return dollarUSD
};
function fileCheck(myFile) {
    var file = myFile.files[0];
    var filename = file.name;
    filename.split('\-')
    console.log("FILENAME, ", filename);
    return filename;
};
function btn2() {
    if (baseline.salesTotal && secondButtonBoolean) {
        document.getElementById('secondSubmit').classList.remove("disabled")
    };
};
function build2columns(table, row, col1, col2) {
    var row = table.insertRow(row);
    var cell1 = row.insertCell(0).innerHTML = col1;
    var cell2 = row.insertCell(1).innerHTML = col2;
    cell1.width = '30%'
};
function buildMerchantTable() {
    var table = document.getElementById("merchantTable");
    table.innerHTML = ''
    build2columns(table, 0, "Merchant:", merchant.name);
    build2columns(table, 1, "Merchant ID :", merchant.id);
    build2columns(table, 2, "Network Commission:", (merchant.nc_display));
};
function buildOutageTable(o, t) {
    var table = document.getElementById("outageTable");
    table.innerHTML = '';
    table.style.textAlign = 'right'
    var row = table.insertRow(0);
    var cell1 = row.insertCell(0).innerHTML = "Outage Dates :";
    var cell2 = row.insertCell(1).innerHTML = (DateToString(outage.date_start_display) + " to " + DateToString(outage.date_end_display));
    build2columns(table, 1, "Clicks :", outage.total_clicks);
    build2columns(table, 2, "Estimated Sales:", (toUSD(outage.estimated_sales)));
    build2columns(table, 3, "Tracked Sales :", (toUSD(outage.total_sales)));
    build2columns(table, 4, "Discrepency :", (toUSD(outage.discrepency)));
    build2columns(table, 5, "Adjusted Discrepency :", (toUSD(t)));
};
function buildBaseLineTable(data) {
    var table = document.getElementById("baselineTable");
    table.innerHTML = ''
    table.style.textAlign = 'right'
    var row = table.insertRow(0);
    var cell1 = row.insertCell(0).innerHTML = "Baseline Dates :";
    var cell2 = row.insertCell(1).innerHTML = (DateToString(baseline.date_start_display) + " to " + DateToString(baseline.date_end_display));
    cell2.id = 'centeredDate'
    var row = table.insertRow(1);
    var cell3 = row.insertCell(0).innerHTML = "Sales :";
    var cell4 = row.insertCell(1).innerHTML = (toUSD(baseline.sales_amount));
    var row = table.insertRow(2);
    var cell5 = row.insertCell(0).innerHTML = "Number of Sales :";
    var cell6 = row.insertCell(1).innerHTML = (baseline.sales_count);
    var row = table.insertRow(3);
    var cell1 = row.insertCell(0).innerHTML = "Clickthroughs :";
    var cell2 = row.insertCell(1).innerHTML = (baseline.clicks);
    var row = table.insertRow(4);
    var cell3 = row.insertCell(0).innerHTML = "Conversion Rate :";
    var cell4 = row.insertCell(1).innerHTML = ((baseline.conversion_rate * 100).toFixed(2) + " %");
    var row = table.insertRow(5);
    var cell5 = row.insertCell(0).innerHTML = "AOV :";
    var cell6 = row.insertCell(1).innerHTML = (toUSD(baseline.aov));
};
function buildAffiliateTable() {
    var atable = document.getElementById("affTable");
    if (atable.innerHTML) { atable.innerHTML = '' };
    document.getElementById("secondSubmit").innerHTML = "Click to Update Table"
    document.getElementById('makePDF').classList.remove('collapse')
    document.getElementById('makeBatchSalesDoc').classList.remove('collapse')
    var table = document.getElementById('affTable');
    var tableHead = document.createElement('thead');
    var tr = document.createElement('tr');
    var arrheader = ['Affiliate ID', 'Affiliate Name', 'Click Throughs', 'Tracked Sales during the outage', 'Estimated Sales by AOV, and Conversion', 'Percentage based on Clicks', 'Estimated Sales by Click Percentage', 'Average of Two Sales Figures', 'Estimated Affiliate Commission', 'Estimated Network Commission'];
    affarr = affiliates.slice(0, (merchant.affiliate_count));
    var totals = {
        clicks: 0,
        estimatedSalesbyAOV: 0,
        estimatedSalesByClick: 0,
        avgOfTwo: 0,
        estimatedComm: 0,
        networkComm: 0
    };
    for (var k = 0; k < affarr.length; k++) {
        totals.clicks = (totals.clicks + (affarr[k].clicks))
    };
    console.log("TOTAL CLICKS + " + totals.clicks)
    for (var j = 0; j < arrheader.length; j++) {
        var th = document.createElement('th'); //column
        var text = document.createTextNode(arrheader[j]); //cell
        th.appendChild(text);
        tr.appendChild(th);
    };
    tableHead.classList.add('table-primary', 'vertical-align')
    tableHead.style.textAlign = 'center';
    table.appendChild(tableHead);
    tableHead.appendChild(tr)
    console.log(affarr)
    for (var i = 0; i < affarr.length; i++) {
        affarr[i].estimatedAOV = (baseline.conversion_rate * baseline.aov * affarr[i].clicks);
        if (affarr[i].commissionRate) { }
        else {
            console.log(i)
            affarr[i].commissionRate = .01
            console.log(affarr[i].Affiliate + " Does not have a commission rate")
        }
        let percentageBasedOnClicks = Number((affarr[i].clicks / totals.clicks).toFixed(4));
        let estimatedSalesBasedOnPercent = Number((percentageBasedOnClicks * outage.discrepency).toFixed(2));
        affarr[i].salesAverage = (affarr[i].estimatedAOV + estimatedSalesBasedOnPercent) / 2;
        let estimatedCommission = Number((affarr[i].salesAverage * affarr[i].commissionRate).toFixed(2))
        let estimatedNC = (affarr[i].salesAverage) * merchant.nc;
        if (document.getElementById("percentOfAffCom").checked) {
            estimatedNC = (estimatedCommission * merchant.nc)
        };
        // outage.avgTotal = (outage.avgTotal + affarr[i].salesAverage) //!? is this redudant with totals.avgOfTwo?
        totals.estimatedSalesbyAOV = totals.estimatedSalesbyAOV + affarr[i].estimatedAOV;
        totals.estimatedSalesByClick = totals.estimatedSalesByClick + estimatedSalesBasedOnPercent;
        totals.avgOfTwo = totals.avgOfTwo + affarr[i].salesAverage;
        totals.estimatedComm = totals.estimatedComm + estimatedCommission;
        totals.networkComm = totals.networkComm + estimatedNC;
        let tr = document.createElement('tr');
        let td1 = document.createElement('td');
        let td2 = document.createElement('td');
        let td3 = document.createElement('td');
        let td4 = document.createElement('td');
        let td5 = document.createElement('td');
        let td6 = document.createElement('td');
        let td7 = document.createElement('td');
        let td8 = document.createElement('td');
        let td9 = document.createElement('td');
        let td10 = document.createElement('td');
        td2.style.textAlign = 'center';
        let text1 = document.createTextNode(affarr[i].Affiliate_Id);
        let text2 = document.createTextNode(affarr[i].Affiliate);
        let text3 = document.createTextNode(affarr[i].Click_Throughs);
        let text4 = document.createTextNode(affarr[i].Sales);
        let text5 = document.createTextNode(toUSD(affarr[i].estimatedAOV));
        let text6 = document.createTextNode((percentageBasedOnClicks * 100).toFixed(2) + "%");
        let text7 = document.createTextNode(toUSD(estimatedSalesBasedOnPercent));
        let text8 = document.createTextNode(toUSD(affarr[i].salesAverage));
        let text9 = document.createTextNode(toUSD(estimatedCommission));
        let text10 = document.createTextNode(toUSD(estimatedNC));
        td1.appendChild(text1);
        td2.appendChild(text2);
        td3.appendChild(text3);
        td4.appendChild(text4);
        td5.appendChild(text5);
        td6.appendChild(text6);
        td7.appendChild(text7);
        td8.appendChild(text8);
        td9.appendChild(text9);
        td10.appendChild(text10);
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
        tr.appendChild(td5);
        tr.appendChild(td6);
        tr.appendChild(td7);
        tr.appendChild(td8);
        tr.appendChild(td9);
        tr.appendChild(td10);
        table.appendChild(tr);
    };
    let footer = document.createElement('tfoot');
    let tf1 = document.createElement('tr');
    let c1 = document.createElement('td');
    let c2 = document.createElement('td');
    let c3 = document.createElement('td');
    let c4 = document.createElement('td');
    let c5 = document.createElement('td');
    let c6 = document.createElement('td');
    let c7 = document.createElement('td');
    let t1 = document.createTextNode('Totals from the top ' + merchant.affiliateCount + ' Affiliates');
    c1.scope = 'row';
    c1.colSpan = '2';
    c3.colSpan = '2';
    c4.colSpan = '2';
    footer.classList.add('table-secondary')
    let t2 = document.createTextNode(totals.clicks);
    let t3 = document.createTextNode(toUSD(totals.estimatedSalesbyAOV));
    let t4 = document.createTextNode(toUSD(totals.estimatedSalesByClick));
    let t5 = document.createTextNode(toUSD(totals.avgOfTwo));
    let t6 = document.createTextNode(toUSD(totals.estimatedComm));
    let t7 = document.createTextNode(toUSD(totals.networkComm));
    c1.appendChild(t1);
    c2.appendChild(t2);
    c3.appendChild(t3);
    c4.appendChild(t4);
    c5.appendChild(t5);
    c6.appendChild(t6);
    c7.appendChild(t7);
    tf1.appendChild(c1);
    tf1.appendChild(c2);
    tf1.appendChild(c3);
    tf1.appendChild(c4);
    tf1.appendChild(c5);
    tf1.appendChild(c6);
    tf1.appendChild(c7);
    footer.appendChild(tf1);
    table.appendChild(footer);
    console.log(outage);
    buildOutageTable(outage, totals.avgOfTwo);
    buildBaseLineTable(baseline);
}