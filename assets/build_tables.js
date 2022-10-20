function build2columns(table, row, col1, col2) {
    var row = table.insertRow(row);
    var cell1 = row.insertCell(0).innerHTML = col1;
    var cell2 = row.insertCell(1).innerHTML = col2;
};
function buildMerchantTable() {
    var table = document.getElementById("merchantTable");
    document.getElementById('r_merchant_name').innerHTML = merchant.name;
    document.getElementById('r_merchant_id').innerHTML = merchant.id;
    document.getElementById('r_date').innerHTML = todays_date;
    document.getElementById('r_nc_commission').innerHTML = merchant.nc_display;
    document.getElementById('r_ac_commission').innerHTML = outage.commission_rates;
    document.getElementById('r_estimated_ac').innerHTML = toUSD(totals.estimatedComm);
    document.getElementById('r_estimated_nc').innerHTML = toUSD(totals.networkComm);
    document.getElementById('r_estimated_total').innerHTML = toUSD(totals.networkComm + totals.estimatedComm);

};
function buildOutageTable() {
    var table = document.getElementById("outageTable");
    table.innerHTML = '';
    table.style.textAlign = 'right'
    build2columns(table, 0, "Baseline Dates :", (DateToString(baseline.date_start_display) + " to " + DateToString(baseline.date_end_display)));
    build2columns(table, 1, "Sales :", (toUSD(baseline.sales_amount)));
    build2columns(table, 2, "Number of Sales :", baseline.sales_count);
    build2columns(table, 3, "Clickthroughs :", (baseline.clicks))
    build2columns(table, 4, "Conversion Rate :", ((baseline.conversion_rate * 100).toFixed(2) + " %"))
    build2columns(table, 5, "AOV :", (toUSD(baseline.aov)))
    build2columns(table, 6, "", "")
    build2columns(table, 7, "Outage Dates :", (DateToString(outage.date_start_display) + " to " + DateToString(outage.date_end_display)));
    build2columns(table, 8, "Clicks :", outage.total_clicks);
    build2columns(table, 9, "Estimated Sales:", (toUSD(outage.estimated_sales)));
    build2columns(table, 10, "Tracked Sales :", (toUSD(outage.total_sales)));
    build2columns(table, 11, "Discrepency :", (toUSD(outage.discrepency)));
    build2columns(table, 12, "Adjusted Discrepency :", (toUSD(outage.adjusted_discrepency)));
    //specific styling in the build
    table.rows[6].cells[0].classList.add("border-0");
    table.rows[6].cells[1].classList.add("border-0");
    table.rows[0].cells[0].classList.add("table-primary");
    table.rows[0].cells[1].classList.add("table-primary");
    table.rows[7].cells[0].classList.add("table-primary");
    table.rows[7].cells[1].classList.add("table-primary");
};
function buildAffiliateTable() {
    var table = document.getElementById('affTable');
    if (table.innerHTML) { table.innerHTML = '' };
    document.getElementById("secondSubmit").innerHTML = "Click to Update Table";
    document.getElementById('makePDF').classList.remove('collapse');
    document.getElementById('makeBatchSalesDoc').classList.remove('collapse');
    var tableHead = document.createElement('thead');
    var tr = document.createElement('tr');
    var arrheader = ['Affiliate ID', 'Affiliate Name', 'Click Throughs', 'Tracked Sales during the outage', 'Estimated Sales by AOV, and Conversion', 'Percentage based on Clicks', 'Estimated Sales by Click Percentage', 'Average of Two Sales Figures', 'Estimated Affiliate Commission', 'Estimated Network Commission'];
    affarr = affiliates.slice(0, (merchant.affiliate_count));
    totals = {
        clicks: 0,
        estimatedSalesbyAOV: 0,
        estimatedSalesByClick: 0,
        avgOfTwo: 0,
        estimatedComm: 0,
        networkComm: 0,
        commission_rates: []
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
    totals.percent_of_total_clicks = (((totals.clicks / outage.total_clicks) * 100).toFixed(2) + "%");
    tableHead.classList.add('table-primary', 'vertical-align')
    tableHead.style.textAlign = 'center';
    table.appendChild(tableHead);
    tableHead.appendChild(tr)
    console.log(affarr)
    for (var i = 0; i < affarr.length; i++) {
        let this_affiliate = [];
        affarr[i].estimatedAOV = (baseline.conversion_rate * baseline.aov * affarr[i].clicks);
        if (affarr[i].commissionRate) {
            totals.commission_rates.push(affarr[i].commissionRate)
        }
        else {
            console.log(i)
            affarr[i].commissionRate = .01
            console.log(affarr[i].Affiliate + " Does not have a commission rate")
        };
        let percentageBasedOnClicks = Number((affarr[i].clicks / totals.clicks).toFixed(4));
        let estimatedSalesBasedOnPercent = Number((percentageBasedOnClicks * outage.discrepency).toFixed(2));
        affarr[i].salesAverage = (affarr[i].estimatedAOV + estimatedSalesBasedOnPercent) / 2;
        let estimatedCommission = Number((affarr[i].salesAverage * affarr[i].commissionRate).toFixed(2))
        let estimatedNC = (affarr[i].salesAverage) * merchant.nc;
        if (document.getElementById("percentOfAffCom").checked) {
            estimatedNC = (estimatedCommission * merchant.nc)
        };
        totals.estimatedSalesbyAOV = totals.estimatedSalesbyAOV + affarr[i].estimatedAOV;
        totals.estimatedSalesByClick = totals.estimatedSalesByClick + estimatedSalesBasedOnPercent;
        totals.avgOfTwo = totals.avgOfTwo + affarr[i].salesAverage;
        outage.adjusted_discrepency = totals.avgOfTwo;
        totals.estimatedComm = totals.estimatedComm + estimatedCommission;
        totals.networkComm = totals.networkComm + estimatedNC;
        this_affiliate.push(affarr[i].Affiliate_Id);
        this_affiliate.push(affarr[i].Affiliate);
        this_affiliate.push(affarr[i].Click_Throughs);
        this_affiliate.push(affarr[i].Sales);
        this_affiliate.push(toUSD(affarr[i].estimatedAOV));
        this_affiliate.push((percentageBasedOnClicks * 100).toFixed(2) + "%");
        this_affiliate.push(toUSD(estimatedSalesBasedOnPercent));
        this_affiliate.push(toUSD(affarr[i].salesAverage));
        this_affiliate.push(toUSD(estimatedCommission));
        this_affiliate.push(toUSD(estimatedNC));

        let tr = document.createElement('tr');
        for (l = 0; l < this_affiliate.length; l++) {
            let td = document.createElement('td');
            let text = document.createTextNode(this_affiliate[l]);
            td.appendChild(text);
            tr.appendChild(td)
        }
        table.appendChild(tr);
    };
    let smallest_commission_rate = (findMin(totals.commission_rates, totals.commission_rates.length))
    let largest_commission_rate = (findMax(totals.commission_rates, totals.commission_rates.length))
    if (smallest_commission_rate === largest_commission_rate) {
        outage.commission_rates = (smallest_commission_rate + "%")
    }
    else {
        outage.commission_rates = (smallest_commission_rate + "% - " + largest_commission_rate + "%")
    }
    let footer = document.createElement('tfoot');
    let tf1 = document.createElement('tr');
    let c1 = document.createElement('td');
    let c2 = document.createElement('td');
    let c3 = document.createElement('td');
    let c4 = document.createElement('td');
    let c5 = document.createElement('td');
    let c6 = document.createElement('td');
    let c7 = document.createElement('td');
    let t1 = document.createTextNode('Totals from the top ' + merchant.affiliate_count + ' Affiliates');
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
}