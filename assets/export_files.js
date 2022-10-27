
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

    //Create PDf from HTML...

    // var HTML_Width = $('#report_pdf').width();
    // var HTML_Height = $('#report_pdf').height();
    // var top_left_margin = 15;
    // var PDF_Width = HTML_Width + (top_left_margin * 2);
    // var PDF_Height = (PDF_Width * 1.5) + (top_left_margin * 2);
    // var canvas_image_width = HTML_Width;
    // var canvas_image_height = HTML_Height;

    // var totalPDFPages = Math.ceil(HTML_Height / PDF_Height) - 1;

    // html2canvas($('#report_pdf')[0]).then(function (canvas) {
    //     var imgData = canvas.toDataURL("image/jpeg", 1.0);
    //     var pdf = new jsPDF('p', 'pt', [PDF_Width, PDF_Height]);
    //     pdf.addImage(imgData, 'JPG', top_left_margin, top_left_margin, canvas_image_width, canvas_image_height);
    //     for (var i = 1; i <= totalPDFPages; i++) {
    //         pdf.addPage(PDF_Width, PDF_Height);
    //         pdf.addImage(imgData, 'JPG', top_left_margin, -(PDF_Height * i) + (top_left_margin * 4), canvas_image_width, canvas_image_height);
    //     }
    //     pdf.save("Your_PDF_Name.pdf");
    //     $('#report_pdf').hide();
    // });

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
