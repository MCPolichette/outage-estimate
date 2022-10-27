
function generatePDF() {
    console.log("Make a PDF")
    // Choose the element id which you want to export.
    var element = document.getElementById('report_pdf');
    element.style.cssText += ''
    // element.style.width = '1200px';
    // element.style.height = '800px';
    var opt = {
        margin: 0.25,
        filename: ('Outage Estimate - ' + merchant.name + " - " + merchant.id),
        image: { type: 'jpeg', quality: 1 },
        html2canvas: { scale: 4 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait', precision: '12' }
    };
    // choose the element and pass it to html2pdf() function and call the save() on it to save as pdf.
    html2pdf().set(opt).from(element).save();
};
function buildBatchSales() {
    const rows = [
        ['Affiliate Data', 'Transaction ID', 'Product ID/SKU', 'Sale Item Amount', 'Sale Item Quantity'],
    ];
    let today = (new Date())
    affarr.forEach(affiliate => {
        let newArr = [affiliate.Website_Id, ('outage_estimate_' + today + "_" + affiliate.Affiliate_Id), '', Number(affiliate.salesAverage.toFixed(2)), '']
        rows.push(newArr);
    })

    let csvContent = "data:text/csv;charset=utf-8,";
    rows.forEach(function (rowArray) {
        let row = rowArray.join(",");
        csvContent += row + "\r\n";
    });
    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", ("Batch-Sales-Document for " + merchant.name + "_" + outage.dates));
    document.body.appendChild(link); // Required for FF
    link.click(); // This will download the data file named ("Batch_Sales_"+merchant.name+"_"+outage.dates).
}
