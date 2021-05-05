/**
 * Date convert for specific Gmail message.
 
 */

 function convert(str) {
  var date = new Date(str),
  mnth = ("0" + (date.getMonth()+1)).slice(-2),
  day  = ("0" + date.getDate()).slice(-2);
  return [ date.getFullYear(), mnth, day ].join("/");
}


/**
 * Callback for rendering the card for a specific Gmail message.
 * @param {Object} e The event object.
 * @return {CardService.Card} The card to show to the user.
 */
 

function onGmailMessage(e) {
//Logger.log(e);return 
var authtoken = userProperties.getProperty('authtoken');
if ( authtoken == null) {
    return loginScreen();
  
  
}else{
        // Get the ID of the message the user has open.
  var messageId = e.gmail.messageId;
  
  var thId = e.gmail.threadId.split(':')[1];
  //var userEmail= Session.getActiveUser().getEmail();

  var accessToken = e.gmail.accessToken;
  GmailApp.setCurrentMessageAccessToken(accessToken);
  var expenseDetailObj={};
  // Get the details from msg.
  var msgs = GmailApp.getMessageById(messageId);
  var dt= msgs.getDate();
  expenseDetailObj['dt'] = convert(new Date(dt));
  var senderStr = msgs.getFrom();
  var senderArr = senderStr.match("<(.*)>");
  if(!!senderArr){
  var sender=senderArr[1];  
  }else{
    var sender='';  
  }
  
  expenseDetailObj['sender'] = sender;
  var body = msgs.getBody();
  expenseDetailObj['body'] = body;
  
  var subject = msgs.getThread().getFirstMessageSubject();
  
  // Remove labels and prefixes.
  subject = subject
      .replace(/^([rR][eE]|[fF][wW][dD])\:\s*/, '')
      .replace(/^\[.*?\]\s*/, '');

  // If neccessary, truncate the subject to fit in the image.
  subject = truncate(subject);
  expenseDetailObj['subject'] = subject;
  
  var fileDetails=[];
  var attachments = msgs.getAttachments({includeInlineImages:true,includeAttachments:true});
                 
  for (var k = 0; k < attachments.length; k++) {
    var contentType = attachments[k].getContentType();
    var content=attachments[k].getAs(contentType);
      //Logger.log('Message "%s" contains the attachment "%s" (%s bytes)',
               //  msgs.getSubject(), attachments[k].getName(), attachments[k].getSize());return
    fileDetails.push(content);
          
    }

  expenseDetailObj['fileDetails'] = fileDetails;
  //Logger.log(expenseDetailObj); return
   var expeseResult= getSingleExpenseDetail(thId);
    
    if(expeseResult.Expense!=undefined && typeof(expeseResult.Expense)!='undefined'){
    
      expeseResult['Expense']['dt']=expenseDetailObj['dt'];
    
      return showExpenseOption(expeseResult);
    }else{
      return createMessageCard(expenseDetailObj,'');
    }
  

  }
}


