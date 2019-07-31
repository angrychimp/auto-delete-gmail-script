/*
  Provide a list of labels to purge, along with retention period (in days)
  You may use asterisk (*) as a globbing char to match labels (e.g. matching
  all nested labels under a common parent)
*/

var LABELS_TO_DELETE = {
  "Label*": 30,
  "Label/SubLabel": 7,
  "Label/KeepLonger": 90,
  "AnotherLabel": 14
};


/******************************************/
/*** DO NOT MODIFY CODE BELOW THIS LINE ***/
/******************************************/

/* Internals: functions provided to perform all the heavy work */

var DELETE_RULES = {};
function Initialize() {
  DELETE_RULES = buildRules()
  return;
}

function Install() {
  /* Run uninstall first to avoid overlap */
  Uninstall()
  
  /* Initial trigger to start delete 2 min from now */
  ScriptApp.newTrigger("Run")
           .timeBased()
           .at(new Date((new Date()).getTime() + 1000*60*2))
           .create();
  
  /* Scheduled trigger to purge mail daily */
  ScriptApp.newTrigger("Run")
           .timeBased()
           .atHour(1)
           .everyDays(1)
           .create();

}

function Uninstall() {
  
  var triggers = ScriptApp.getProjectTriggers();
  for (var i=0; i<triggers.length; i++) {
    ScriptApp.deleteTrigger(triggers[i]);
  }
  
}


function buildRules() {
  var keys = Object.keys(LABELS_TO_DELETE);
  var rules = {};
  var exacts = {};
  var globs = {};
  var patterns = {};
  for (var i = 0; i < keys.length; i++) {
    if (keys[i].indexOf('*') > -1) {
      globs[keys[i].replace('*','')] = LABELS_TO_DELETE[keys[i]];
      patterns[keys[i].replace('*','')] = new RegExp(keys[i].replace('*','.*'));
    } else {
      exacts[keys[i]] = LABELS_TO_DELETE[keys[i]];
    }
  }
  var labels = GmailApp.getUserLabels();
  for (var i = 0; i < labels.length; i++) {
    var label = labels[i].getName()
    if (label in exacts) {
      rules[label] = exacts[label]
    }
    else {
      for (var j in patterns) {
        if (patterns[j].exec(label)) {
          rules[label] = globs[j]
          break
        }
      }
    }
  }
  return rules
}

function Run() {
  console.info("[" + (new Date()) + "] Running delete")
  Initialize()
  var anotherPass = false;
  for (var label in DELETE_RULES) {
    var age = new Date();
    age.setDate(age.getDate() - DELETE_RULES[label]);
    var purgeDate = Utilities.formatDate(age, Session.getTimeZone(), "yyyy-MM-dd");
    var search = "label:(" + label + ") before:" + purgeDate;
    var total = 0;
    try {
      // Search for mail, but limit to 1000 at a time
      var threads = GmailApp.search(search, 0, 500);
      for (var i=0; i<threads.length; i++) {
        var messages = GmailApp.getMessagesForThread(threads[i]);
        for (var j=0; j<messages.length; j++) {
          var email = messages[j];       
          if (email.getDate() < age) {
            email.moveToTrash();
            total += 1;
          }
        }
      }
      console.info(" [" + label + ":" + DELETE_RULES[label] + "] Trashed: " + total)
      if (!anotherPass) {
        threads = GmailApp.search(search, 0, 1);
        // Arbitrary threshold; for some reason a repeat search always turns up a few results
        if (threads.length > 5) {
          // If we have more than 5 messages remaining, schedule another pass
          anotherPass = true
        }
      }
    } catch (e) { console.debug(" [" + label + ":" + DELETE_RULES[label] + "] Error: " + e) }
  }
  
  if (anotherPass) {
    // Schedule another run for 2 minutes from now
    ScriptApp.newTrigger("Run")
           .timeBased()
           .at(new Date((new Date()).getTime() + 1000*60*2))
           .create();
  }
}