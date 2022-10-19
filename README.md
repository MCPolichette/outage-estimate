# outage_estimate

##  Project Description
In cases where a merchant's tracking is lost.  This Estimate compares the outage period with a statistically similar "baseline" period from the past. Per-affiliate sale estimations calculated based on affiliate clickthroughs: est. total program sales times affiliate clicks / overall clicks; affiliate clicks times program's baseline AOV and conversion rate; and the average of the two methods. Any actual sales during the outage period are removed from the calculations.

This Web-App uses API calls to run these reports, compares the two, and generates a report for Merchants to review.

This project has two specific goals:
- Create a better Outage Estimate Tool, thats more efficient and accurate than the current Excel spreadsheet process.
- Excercise skills in Bootstrap, file management, building and displaying tables, and trying out new processes, such as exporting data to PDF and CSV files.

Originally I built this project to run as a single HTML file, which would be shared (OutageEst_Concept_v2).  However, as the logic grew, and minor updates became more frequent I am using Github to manage and host the file for others to use.

### NOTES
For this project to work, you will need to provide your own API key on the index.html page.

### Considerations:
- Running an Performance Summary by Affiliate Website report, to determine how each website performed during the outage.  (this will also assist in building the Outage Batch Sale Document)
- Creating logic around the Baseline Conversion rates.  As many Affiliates perform differently, and granting commission just based on click performance may not be the best metric.
- Remove the sales from the Affiliate that earned it, as opposed to the current 'remove off the top' model.
