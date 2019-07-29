# auto-delete-gmail-script
A Google Apps Script to purge Gmail messages by label

# HOW TO
1. Download the App Script (`AutoDeleteGmailByLabel.gs`) to your Google Drive folder. It
can go anywhere, but for simplicity's sake it can often be easiest just to put it
in the top level.

2. After you've downloaded the script, open the [Google Drive web UI](https://drive.google.com) and
double click on the script file to open it in the Apps Script editor.

3. Edit the `LABELS_TO_DELETE` list. You can use an asterisk (*) to match simple patterns for labels,
and values for each entry should be the retention period in days. For example, to purge all
messages for all labels nested under "Archive" after 30 days, but keep messages under "Archive/Keep"
for up to 1 year, use the following example config:
```
var LABELS_TO_DELETE = {
  "Archive/*": 30,
  "Archive/Keep": 365
};
```
(Note that the above will _not_ purge anything with just the "Archive" label, but it will specifically
look for anything _nested_ under "Archive".)

4. After adjusting the configuration, from the menu bar select "Run" -> "Run Function" -> "Install".
This will schedule an initial run for the cleanup script 2 minutes from execution time, as well as
schedule a daily execution bewteen 1:00-2:00 AM in your local timezone.

# TROUBLESHOOTING
From the script editor, you can select "View" -> "Executions" to see a list of executed scripts and
any related logs. If you encounter any issues feel free to message me on Twitter [@angrychimp](https://twitter.com/angrychimp)
or via Keybase (https://keybase.io/angrychimp).