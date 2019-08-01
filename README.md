# auto-delete-gmail-script
A Google Apps Script to purge Gmail messages by label

# HOW TO
1. Go to https://script.google.com (make sure your profile is correct for personal or work email)

2. Click the *New Script* button in the upper left.

3. Copy and paste the code from [AutoDeleteGmailByLabel.gs](https://raw.githubusercontent.com/angrychimp/auto-delete-gmail-script/master/AutoDeleteGmailByLabel.gs)
into the new `Code.gs` editor provided for you. Then press `Ctrl+S` (or `Cmd+S`) to save.

4. For the "Project Name" enter "Auto-Delete-Gmail-by-Label". (This will create a `gscript` document in your Google Drive root folder.)

5. Edit the `LABELS_TO_DELETE` list. You can use an asterisk (*) to match simple patterns for labels,
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

Once you've adjusted your label rules save the script.

6. After adjusting the configuration, from the menu bar select "Run" -> "Run Function" -> "Install".
This will schedule an initial run for the cleanup script 2 minutes from execution time, as well as
schedule a daily execution bewteen 1:00-2:00 AM in your local timezone.

# TROUBLESHOOTING
From the script editor, you can select "View" -> "Executions" to see a list of executed scripts and
any related logs. If you encounter any issues feel free to message me on Twitter [@angrychimp](https://twitter.com/angrychimp)
or via Keybase (https://keybase.io/angrychimp).