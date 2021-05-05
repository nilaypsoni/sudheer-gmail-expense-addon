
/**
 * do logout function
 * @return {CardService.Card} The card to show to the user.
 */
function logoutAddon(){
  var userProperties = PropertiesService.getUserProperties();
  userProperties.deleteAllProperties();
//     var card = loginScreen();
//   var navigation = CardService.newNavigation().popToRoot()
//      .updateCard(card);
//      var actionResponse = CardService.newActionResponseBuilder()
//      .setNavigation(navigation);
//      return actionResponse.build();
return loginScreen();

}


/**
 * check login function
 * @return {CardService.Card} The card to show to the user.
 */

function chekLogin(){

 var data = userProperties.getProperties();
 
 var authtoken = userProperties.getProperty('authtoken');   
 var profileid = userProperties.getProperty('profileid');   
 var corporateid = userProperties.getProperty('corporateid');   
 var billableArr = userProperties.getProperty('billableArr');   
 var reportsArr = userProperties.getProperty('reportsArr');   
 var categoryArr = userProperties.getProperty('categoryArr');   
 
  //Logger.log(authtoken);return
 var newProperties = {authtoken: authtoken, profileid: profileid, corporateid: corporateid, billableArr: billableArr, reportsArr: reportsArr, categoryArr: categoryArr};
 return newProperties;
}

/**
 * get expense reports function
 * @return {CardService.Card} The card to show to the user.
 */
 function getBillable(){
 var uiSettings = chekLogin();
   //Logger.log(uiSettings);
 var authToken = uiSettings.authtoken;
 var profileid = uiSettings.profileid;   
 var corporateid = uiSettings.corporateid;   
  var option = {
        'method' : 'get',
        'contentType': 'application/json',
    }

    var url = "https://app.tripgain.com/servicedispatch.jsp?authtoken="+authToken+"&opid=TG-EXPENSE&corporateid="+corporateid+"&action=getbillablecustomers";
    var response = UrlFetchApp.fetch(url, option).getContentText();
    
    var responseData= JSON.parse(response)
    //Logger.log(responseData);return
    var billableCustomer = responseData.list[0].BillableCustomer;
   
   return billableCustomer;
 }
 

/**
 * get expense reports function
 * @return {CardService.Card} The card to show to the user.
 */
 function getReports(){
 var uiSettings = chekLogin();
 var authToken = uiSettings.authtoken;
 var profileid = uiSettings.profileid;   
 var corporateid = uiSettings.corporateid;   
 
  var option = {
        'method' : 'get',
        'contentType': 'application/json',
    }

    var url = "https://app.tripgain.com/servicedispatch.jsp?opid=TG-EXPENSE&authtoken="+authToken+"&action=viewreportsprofilecorpstatus&corporateid="+corporateid+"&opid=TG-EXPENSE&profileid="+profileid+"&status=all"
    var response = UrlFetchApp.fetch(url, option).getContentText()
    
    var responseData = JSON.parse(response)
    var reports_arr = responseData.list[0].ExpenseReport || [];
   var reports=getAllPendingReports(reports_arr);
   return reports;
 }
 
 
 
/**
 * filter all pending reports  function
 * @return {CardService.Card} The card to show to the user.
 */
 
 function getAllPendingReports(reports_arr){
  var newReportsArr=[];
  for (var i = 0; i < reports_arr.length; i++) {
    var status = reports_arr[i]['status'];
    if (status=="pending") {
      newReportsArr.push(reports_arr[i])
    }
 
 }
 return newReportsArr;
 }
 
/**
 * get expense categories function
 * @return {CardService.Card} The card to show to the user.
 */


 function getCategory(){
 var uiSettings = chekLogin();
 var authToken = uiSettings.authtoken;
 var profileid = uiSettings.profileid;   
 var corporateid = uiSettings.corporateid;   
 
  var option = {
        'method' : 'get',
        'contentType': 'application/json',
    }

    var url = "https://app.tripgain.com/servicedispatch.jsp?opid=TG-EXPENSE&authtoken="+authToken+"&action=viewcategories&corporateid="+corporateid+"&opid=TG-EXPENSE";
    var response = UrlFetchApp.fetch(url, option).getContentText()
    
    var responseData= JSON.parse(response);
   
    var category_arr=responseData.list[0].Category || []
   
   return category_arr;
 }
   
 /**
 * ecncode email body to base64 string for emailparse api
 * @return {CardService.Card} The card to show to the user.
 */


 function base64Encode(str) {
    var CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    var encodedContent = '';
    var i = 0;
    var len = str.length;
    var c1, c2, c3;

    while (i < len) {
      c1 = str.charCodeAt(i++) & 0xff;

      if (i === len) {
        encodedContent += CHARS.charAt(c1 >> 2);
        encodedContent += CHARS.charAt((c1 & 0x3) << 4);
        encodedContent += '==';

        break;
      }

      c2 = str.charCodeAt(i++);

      if (i == len) {
        encodedContent += CHARS.charAt(c1 >> 2);
        encodedContent += CHARS.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
        encodedContent += CHARS.charAt((c2 & 0xF) << 2);
        encodedContent += '=';

        break;
      }

      c3 = str.charCodeAt(i++);

      encodedContent += CHARS.charAt(c1 >> 2);
      encodedContent += CHARS.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
      encodedContent += CHARS.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
      encodedContent += CHARS.charAt(c3 & 0x3F);
    }

    return encodeURIComponent(encodedContent);
  }
  
  
 /**
 * emailparse api function
 * @return {CardService.Card} The card to show to the user.
 */
 
 function getParseEmailBody(expenseDetailObj){
 var emailcontent = base64Encode(expenseDetailObj.body);
 var payload = "fromemail="+expenseDetailObj.sender+"&emaildate="+expenseDetailObj.dt+"&subject="+expenseDetailObj.subject+"&emailcontent="+emailcontent;
   
  const options = {
    method: 'POST',
    followRedirects: true,
    muteHttpExceptions: true,
    payload: payload,
  }; 

    var url = "https://pdfsumo.com/mailparser/api";
    
  const response = UrlFetchApp.fetch(url, options);
  if (response.getResponseCode() == 200) {
     
     var responseData= JSON.parse(response);
   
     var data = responseData|| []
     return data; 
  }
   
 }
 
 
 /**
 * upload attachment function
 * @return {CardService.Card} The card to show to the user.
 */
 
  function  uploadSingleReceipt(attachmentFile,expenseid,expenseName,reportId){
 var uiSettings = chekLogin();
 var authToken = uiSettings.authtoken;
 var profileid = uiSettings.profileid;   
 var corporateid = uiSettings.corporateid;   
 
      var formData = {
      'fullpath': attachmentFile,
      'profileid': profileid,
      'authtoken': authToken,
      'corporateid':corporateid,
      'receiptname':expenseName,
      'reportid':reportId,
      'expenseid':''
    };
   
  const options = {
    method: 'POST',
    followRedirects: true,
    muteHttpExceptions: true,
    payload: formData,
  }; 

    var url = "https://app.tripgain.com/expenseupload.jsp";
    
    const response = UrlFetchApp.fetch(url, options);
    if (response.getResponseCode() == 200) {
     
    var responseData= JSON.parse(response);
    //Logger.log(responseData);return
    
    var data = responseData|| []
    return data; 
  }
  
  }
 
 /**
 * upload html body of gmail api function
 * @return {CardService.Card} The card to show to the user.
 */
 
 function uploadHtmlEmailBody(expenseDetailObj,reportId){
 var uiSettings = chekLogin();
 var authToken = uiSettings.authtoken;
 var profileid = uiSettings.profileid;   
 var corporateid = uiSettings.corporateid;   
 
      var encodedBody = Utilities.base64Encode(expenseDetailObj.body);
      var file = Utilities.newBlob(expenseDetailObj.body, 'text/html', 'email.html');
      var pdf  = file.getAs('application/pdf');
      
      var blobData = Utilities.newBlob(encodedBody, 'image/jpeg', 'emailBody.jpeg');
      
      var formData = {
      'fullpath': pdf,
      'profileid': profileid,
      'authtoken': authToken,
      'corporateid':corporateid,
      'receiptname':'emailBody',
      'reportid':reportId,
      'expenseid':''
    };
   
  const options = {
    method: 'POST',
    followRedirects: true,
    muteHttpExceptions: true,
    payload: formData,
  }; 

    var url = "https://app.tripgain.com/expenseupload.jsp";
    
    const response = UrlFetchApp.fetch(url, options);
    if (response.getResponseCode() == 200) {
     
    var responseData= JSON.parse(response);
    //Logger.log(responseData);return
    
    var data = responseData|| []
    return data; 
  }
   
 }
 
 
 /**
 * Add expense or create new expense api function
 * @return {CardService.Card} The card to show to the user.
 */
 
 
 function actionAddExpense(expense_obj,ResultReceipt){
 var uiSettings = chekLogin();
 var authToken = uiSettings.authtoken;
 var profileid = uiSettings.profileid;   
 var corporateid = uiSettings.corporateid;   
 
   var expenseDetailObj = expense_obj.detail_expense_obj;
       //Logger.log(expenseDetailObj);return
   var formData = {
    "action": "addexpense",
    "corporateid": corporateid,
    "authtoken": authToken,
    "jsondata": "{\"Expense\":{\"source\":\"gmail-chrome-ext\",\"reftxid\":\""+expenseDetailObj.reftxid+"\",\"isbillable\":\""+expenseDetailObj.isBillable+"\",\"isreimbursable\":\""+expenseDetailObj.Reimbursable+"\",\"receipturl\":\""+ResultReceipt+"\",\"reportid\":\""+expenseDetailObj.Report+"\",\"category\":\""+expenseDetailObj.category+"\",\"merchant_name\":\""+expenseDetailObj.Merchant+"\",\"total_amount\":\""+parseFloat(expenseDetailObj.amount)+"\",\"expense_date\":\""+expenseDetailObj.mailDate+"\",\"comment\":\"Testing\",\"currency\":\""+expenseDetailObj.currency+"\",\"billing_type\":\"true\",\"tags\":\"\",\"expense_name\":\""+expenseDetailObj.Merchant+"\",\"isdistance\":\"false\",\"istime\":\"false\",\"isregular\":\"true\",\"total_distance\":0,\"distance_unit\":\"\",\"total_hours\":0,\"hour_rate\":0,\"distance_rate\":0,\"status\":\"pending\",\"issplit\":\"false\",\"profileid\":\""+profileid+"\",\"corporateid\":\""+corporateid+"\",\"customerid\":\""+expenseDetailObj.billable+"\",\"projectid\":\"\",\"costcenterid\":\"\",\"departmentid\":\"\",\"addedon\":\"\",\"syncedtoerp\":\"false\",\"erpip\":\"\"}}",
    "opid": "TG-EXPENSE",
    "profileid": profileid,
    "resultformat": "JSON",
    "status": "pending"
  }

  const options = {
          method: 'POST',
          payload: formData,
      }; 

  var url = "https://app.tripgain.com/servicedispatch.jsp";
    
  const response = UrlFetchApp.fetch(url, options);
  if (response.getResponseCode() == 200) {
     
     var responseData= JSON.parse(response);
    
     var data = responseData|| [];
     
     return data; 
  }
   
 }
 
 /**
 * get alredy fyled expense api function
 * @return {CardService.Card} The card to show to the user.
 */
 
 function getSingleExpenseDetail(currThreadid){
 var uiSettings = chekLogin();
 var authToken = uiSettings.authtoken;
 var profileid = uiSettings.profileid;   
 var corporateid = uiSettings.corporateid;   
 
   var option = {
        'method' : 'get',
        'contentType': 'application/json',
    }

    var url = "https://app.tripgain.com/servicedispatch.jsp?authtoken="+authToken+"&opid=TG-EXPENSE&reftxid="+currThreadid+"&action=viewexpensedetailsforreftxid";
    var response = UrlFetchApp.fetch(url, option).getContentText()
    
    var responseData= JSON.parse(response);
    
    var exp_data=responseData || []
   
   return exp_data;
   
 }
 
 
 /**
 * show edit screen function
 * @return {CardService.Card} The card to show to the user.
 */
 
 function showEditExpenseOption(res,reportid){
   var uiSettings = chekLogin();
    if (typeof(res)!='undefined'&& typeof(res)=='object') {
      
      return showExpenseOption(res,reportid);
    }else{
      var reftxid=res;
      var expeseResult= getSingleExpenseDetail(reftxid);
      var ExpenseDetail=expeseResult;
      return showExpenseOption(ExpenseDetail,reportid);
      
    }
  
 }
 
/**
 * edit expense api function
 * @return {CardService.Card} The card to show to the user.
 */
 
 function actionEditExpense(expenseDetailObj){
  var uiSettings = chekLogin();
  var authToken = uiSettings.authtoken;
  var profileid = uiSettings.profileid;   
  var corporateid = uiSettings.corporateid; 
 
  var expenseDetailObj = expenseDetailObj;
  //Logger.log(expenseDetailObj);return;
  //var formattedDate = Utilities.formatDate(new Date(expenseDetailObj.mailDate), "yyyy-MM-dd'T'HH:mm:ss.SSSZ");
   var formattedDate = cache.get('expenseDate');

   
   var formData = {
 
    "opid": "TG-EXPENSE",
    "authtoken": authToken,
    "action": "editexpense",
    "corporateid": corporateid,
    "jsondata": "{\"Expense\":{\"source\":\"gmail-chrome-ext\",\"reftxid\":\""+expenseDetailObj.reftxid+"\",\"expenseid\":\""+parseInt(expenseDetailObj.expenseid)+"\",\"expense_name\":\""+expenseDetailObj.Merchant+"\",\"reportid\":\""
    +expenseDetailObj.Report+"\",\"merchant_name\":\""+expenseDetailObj.Merchant+"\",\"expense_date\":\""+expenseDetailObj.mailDate+"\",\"total_amount\":\""+parseFloat(expenseDetailObj.amount)+"\",\"currency\":\""+expenseDetailObj.currency+"\",\"billing_type\":\"true\",\"category\":\""+expenseDetailObj.category+"\",\"tags\":\"\",\"comment\":\"Testing\",\"isdistance\":\"false\",\"istime\":\"false\",\"isregular\":\"true\",\"total_distance\":0,\"distance_unit\":\"\",\"total_hours\":0,\"hour_rate\":0,\"distance_rate\":0,\"status\":\"pending\",\"issplit\":\"false\",\"profileid\":\""+profileid+"\",\"corporateid\":\""+corporateid+"\",\"customerid\":\""+parseInt(expenseDetailObj.billable)+"\",\"projectid\":\"\",\"costcenterid\":\"\",\"departmentid\":\"\",\"addedon\":\"\",\"syncedtoerp\":\"false\",\"erpip\":\"\",\"isbillable\":\""+expenseDetailObj.isBillable+"\",\"isreimbursable\":\""+expenseDetailObj.Reimbursable+"\"}}",
    "profileid": profileid

  }
  
  // Logger.log(formData);return

  const options = {
          method: 'POST',
          
          payload: formData,
      }; 

  var url = "https://app.tripgain.com/servicedispatch.jsp";
    
  const response = UrlFetchApp.fetch(url, options);
  if (response.getResponseCode() == 200) {
     
     var responseData= JSON.parse(response);
    
     var data = responseData|| [];
     //Logger.log(data);return
     
     return data; 
  }
   
 } 
 
 function onSubmitViewApp(e){
    
  }


/**
 * get customer id of expense function
 * @return {CardService.Card} The card to show to the user.
 */
 
function getBillableId(compnyName){
   var billableArr = getBillable();
   var isFound=false;
   var customerId='';
  for (var i = 0; i < billableArr.length; i++) {
    var companyname = billableArr[i]['companyname'];
    var cId = billableArr[i]['customerid'];
    if (companyname==compnyName) {
      isFound=true;      
      customerId=cId;
      //Logger.log("compnyName1=="+compnyName +" compnyName2=="+companyname+ " customerId=== "+customerId);
      break;
    }
  }

  return customerId;

} 

/**
 * get report id of expense function
 * @return {CardService.Card} The card to show to the user.
 */

 
function getReportId(reportName){
  var isFound=false;
  var reportId='';
  var reportsArr = getReports();
  for (var i = 0; i < reportsArr.length; i++) {
      var report_name = reportsArr[i]['report_name'];
      var reportid = reportsArr[i]['reportid'];
    if (report_name==reportName) {
    //Logger.log("REPORT NAME1=="+report_name +" REPORT NAME2=="+reportName+ " reportid=== "+reportid);
      isFound=true;      
      reportId=reportid;
      break;
    }
  }

  return reportId;

} 



 /**
 * get name from id report and customer
 * @return {CardService.Card} The card to show to the user.
 */
 
function getCustomerCompanyName(customerId,billable_arr) {
  var isFound=false;
  var companyName='';
 
  for (var i = 0; i < billable_arr.length; i++) {
      var companyname = billable_arr[i]['companyname'];
      var customerid = billable_arr[i]['customerid'];
    if (customerId==customerid) {
      isFound=true;      
      companyName=companyname;
      Logger.log("CUSTOMER ID 1=="+customerId +" CUSTOMER ID2=="+customerId+ " CUSTOMER NAME=== "+companyName);
      break;
    }
  }

  return companyName;
 
 
 }
 
function getReportName(reportId,reportsArr){
  var isFound=false;
  var reportName='';
 
  for (var i = 0; i < reportsArr.length; i++) {
      var report_name = reportsArr[i]['report_name'];
      var reportid = reportsArr[i]['reportid'];
    if (reportid==reportId) {
      isFound=true;      
      reportName=report_name;
      //Logger.log("REPORT ID 1=="+reportId +" REPORT ID2=="+reportid+ " REPORT NAME=== "+reportName);
      break;
    }
  }

  return report_name;

} 

 /**
 * redirect to login screen
 * @return {CardService.Card} The card to show to the user.
 */
function onclickLoginbtn(){

   return makeLOgin();
  
}

function getTIMESTAMP(dd) {
  var date = new Date(dd);
  var year = date.getFullYear();
  var month = ("0" + (date.getMonth() + 1)).substr(-2);
  var day = ("0" + date.getDate()).substr(-2);
  var hour = ("0" + date.getHours()).substr(-2);
  var minutes = ("0" + date.getMinutes()).substr(-2);
  var seconds = ("0" + date.getSeconds()).substr(-2);

  return year + "-" + month + "-" + day;
}
 /**
 * add or edit form onsubmit function
 * @return {CardService.Card} The card to show to the user.
 */
 
 function onSubmit(event) {
  var uiSettings = chekLogin();
  var authToken = uiSettings.authtoken;
  var profileid = uiSettings.profileid;   
  var corporateid = uiSettings.corporateid; 
  var formattedDate = Utilities.formatDate(new Date(event.formInput.mailDate.msSinceEpoch), "GMT", "yyyy-MM-dd");
  
  //Logger.log(getTIMESTAMP(new Date(event.formInput.mailDate.msSinceEpoch)));return
  
//  if (!event.formInputs || !event.formInputs.currencyChoice || !event.formInputs.amount) {
//    var notification = CardService.newNotification()
//    .setText("Enter required (*) details first!!.");
//    return CardService.newActionResponseBuilder()
//    .setNotification(notification)
//    .build();
//  }
    var expenseDetailObj =  JSON.parse(event.parameters.expenseDetailObj);
    
   if (!event.formInputs || !event.formInputs.currencyChoice || !event.formInputs.amount) {
     if(expenseDetailObj.action !='edit'){
     var validationArr=[];
     var formInputs={amount:event.formInput.amount,date:event.formInput.mailDate,purpose:event.formInput.purpose};
     if(!event.formInputs.amount){
     var obj={'key':'amount'}
     validationArr.push(obj)
     }
     
     if(!event.formInputs.mailDate){
     var obj={'key':'date'}
     validationArr.push(obj)
     }
     
     if(!event.formInputs.purpose ){
     var obj={'key':'purpose'}
     validationArr.push(obj)
     }
     
     return createMessageCard(expenseDetailObj,'error',validationArr,formInputs);
    
      }

    }else{
    
    var expense_obj= {};
    var thId= event.gmail.threadId.split(':')[1];
    var Reimbursable_switch = event.formInputs.Reimbursable_switch ? true : false;  
    var isBillable_switch = event.formInputs.isBillable_switch ? true : false;  
    var reportName= event.formInputs.reportChoice;
    var bilChoice= event.formInputs.bilChoice;
    //Logger.log("bilChoice=="+bilChoice);
    var reportId=getReportId(reportName);
    var bilId=getBillableId(bilChoice);
    
    var detail_expense_obj = {
        amount : event.formInputs.amount,
        currency : event.formInputs.currencyChoice,
        purpose : event.formInputs.purpose,
        Merchant : event.formInputs.merchant,
        mailDate : formattedDate,
        category : event.formInputs.catChoice,
        Report : reportId,
        billable : bilId,
        Reimbursable : Reimbursable_switch,
        isBillable : isBillable_switch,
        reftxid : thId
      }; 
      //Logger.log(detail_expense_obj);return
      var expenseDetailObj =  JSON.parse(event.parameters.expenseDetailObj);
      
      if(expenseDetailObj.action=='edit'){
      
      detail_expense_obj['expenseid']=expenseDetailObj.expenseid;
      var editExpense = actionEditExpense(detail_expense_obj);
      
      }else{
      
      var emailBase64 = Utilities.base64Encode(expenseDetailObj.body);
      expense_obj.expenseDetailObj = expenseDetailObj;
      expense_obj.emailBase64 = emailBase64;
      expense_obj.detail_expense_obj = detail_expense_obj;
      
      //Logger.log(expense_obj);return
      
      var fileDetails=[];
      var accessToken = event.gmail.accessToken;
      GmailApp.setCurrentMessageAccessToken(accessToken);
      var messageId = event.gmail.messageId;
      var msgs = GmailApp.getMessageById(messageId);
      var attachments = msgs.getAttachments({includeInlineImages:true,includeAttachments:true});
      var ResultReceiptres = uploadHtmlEmailBody(expenseDetailObj,reportId);
     
      var ResultReceipt = ResultReceiptres.ApiStatus.Result;
      var addExpense = actionAddExpense(expense_obj,ResultReceipt);
      
      var expenseid=addExpense.ApiStatus.Result;
      
        for (var k = 0; k < attachments.length; k++) {
        var contentType = attachments[k].getContentType();
        var content=attachments[k].getAs(contentType);
        var expenseName=attachments[k].getName();
          
        uploadSingleReceipt(content,expenseid,expenseName,reportId);
          
      }}
      
      if(typeof(thId) != 'undefined' && thId != ''){
      var expeseResult= getSingleExpenseDetail(thId);
      //Logger.log(expeseResult);return
      if(expeseResult.Expense!=undefined && typeof(expeseResult.Expense)!='undefined'){
            expeseResult.Expense.dt=expeseResult.Expense.expense_date
            var responseListData=expeseResult.Expense;
            var reportid =responseListData.reportid;
            var expenseid=responseListData.expenseid;
            var reftxid=responseListData.reftxid;  
            var accessToken = event.gmail.accessToken;
            GmailApp.setCurrentMessageAccessToken(accessToken);
            var messageId = event.gmail.messageId;
            var msgs = GmailApp.getMessageById(messageId);
            var dt= msgs.getDate();
            var expdate = convert(new Date(dt));
            //expeseResult['Expense']['dt']=expdate;
            if (typeof(reportid)!='undefined' && reportid!='') {
              //showReportedView
            return showEditExpenseOption(expeseResult,reportName);
            } else {
            return showEditExpenseOption(expeseResult);
              //showEditFyled
            }
         
    }
  }
    }
 
}

/**
 * edited form oncancel event function
 * @return {CardService.Card} The card to show to the user.
 */
 
 
function onCancel(event){
     
    var accessToken = event.gmail.accessToken;
    GmailApp.setCurrentMessageAccessToken(accessToken);
    var messageId = event.gmail.messageId;
    var msgs = GmailApp.getMessageById(messageId);
    var dt= msgs.getDate();
    var expdate = convert(new Date(dt));
    var thId= event.gmail.threadId.split(':')[1];
    var expeseResult= getSingleExpenseDetail(thId);
    var expenseDetailObj =  JSON.parse(event.parameters.expensObj);  
    if(expeseResult.Expense!=undefined && typeof(expeseResult.Expense)!='undefined'){
    //Logger.log(expenseDetailObj);
    return showExpenseOption(expeseResult);
    }
    
}

/**
 * header naviagtion edit option click event function
 * @return {CardService.Card} The card to show to the user.
 */
 
function editExpense(event) {
   //Logger.log(event);
    var expense_obj= {};
    var accessToken = event.gmail.accessToken;
    GmailApp.setCurrentMessageAccessToken(accessToken);
    var messageId = event.gmail.messageId;
    var msgs = GmailApp.getMessageById(messageId);
    var dt= msgs.getDate();
    var expdate = convert(new Date(dt));
    var thId= event.gmail.threadId.split(':')[1];
    if(typeof(thId) != 'undefined' && thId != ''){
    var expeseResult= getSingleExpenseDetail(thId);
    if(expeseResult.Expense!=undefined && typeof(expeseResult.Expense)!='undefined'){
            var responseListData=expeseResult.Expense;
            var reportid =responseListData.reportid;
            var expenseid=responseListData.expenseid;
            var reftxid=responseListData.reftxid;  
            //Logger.log(expeseResult);
            return editMessageCard(expeseResult);
         
    }
  }

}


/**
 * login function
 * @return {CardService.Card} The card to show to the user.
 */


function doLogin(event){
     
     
    if (!event.formInputs || !event.formInputs.email || !event.formInputs.Password) {
      var validationArr=[];
     var formInputs={email:event.formInput.email,password:event.formInput.Password,};
     if(!event.formInputs.email){
     var obj={'key':'email'}
     validationArr.push(obj)
     }
     
     if(!event.formInputs.Password){
     var obj={'key':'Password'}
     validationArr.push(obj)
     }
     
     return makeLOgin('error',validationArr,formInputs);
    

    }else{
    
      var detail_user_obj = {
        username : event.formInputs.email,
        Password : event.formInputs.Password,
        
      }; 
      
       var dataLogin=loginAction(detail_user_obj);
        //Logger.log(dataLogin);return 
       if(dataLogin.LoginResponse.wsstatus.StatusCode=="200"){
           var authtoken=dataLogin.LoginResponse.userauth.authtoken;
           var profileid=dataLogin.LoginResponse.profilemaster.profileid;
           var corporateid=dataLogin.LoginResponse.profilemaster.corporateid;
           var newProperties = {authtoken: authtoken, profileid: profileid, corporateid: corporateid};
           userProperties.setProperties(newProperties, true);

           
           var thId= event.gmail.threadId;
           if(thId !=undefined){
           var card= onGmailMessage(event);
             
           }else{
           var card = onHomepage();
           }
           
         var navigation = CardService.newNavigation().popToRoot()
         .updateCard(card);
         var actionResponse = CardService.newActionResponseBuilder()
         .setNavigation(navigation);
         return actionResponse.build();
         
//          var nav = CardService.newNavigation().popToRoot()
//         .updateCard(card);
//    return CardService.newActionResponseBuilder()
//        .setStateChanged(true)
//        .setNavigation(nav)
//        .setOpenLink(
//            CardService.newOpenLink().setUrl('https://app.tripgain.com/')
//        .setOnClose(CardService.OnClose.RELOAD_ADD_ON)
//        .setOpenAs(CardService.OpenAs.OVERLAY)).build();
//         
           
       }else{
           var notification = CardService.newNotification()
          .setText("login Failed!! please try again.");
          return CardService.newActionResponseBuilder()
          .setNotification(notification)
          .build();
       }
       
    }
    
}

/**
 * login action
 * @return {CardService.Card} The card to show to the user.
 */

 function loginAction(obj){
 
    
   var formData = {
    "jsondata": "{\"LoginRequest\":{\"username\":\""+obj.username+"\",\"password\":\""+obj.Password+"\"}}"
  }
   
  const options = {
    method: 'POST',
    followRedirects: true,
    muteHttpExceptions: true,
    payload: formData,
  }; 

 var url = "https://app.tripgain.com/servicedispatch.jsp?opid=TG-LOGINUSER";
    
  const response = UrlFetchApp.fetch(url, options);
  if (response.getResponseCode() == 200) {
     
     var responseData= JSON.parse(response);
    //Logger.log(responseData);return
     var data = responseData|| []
     return data; 
  }
   
 }

/*  external login code */

function getTokenCallback(e) {
    
  var loginResponse = JSON.parse(e.parameter.tgprops);
  if(loginResponse.authtoken){
  var authtoken= loginResponse.authtoken;
  var profileid= loginResponse.profileid;
  var corporateid= loginResponse.corporateid;
  var newProperties = {authtoken: authtoken, profileid: profileid, corporateid: corporateid};
  userProperties.setProperties(newProperties, true);
  Logger.log(newProperties);
  return closeLoginWindow();  
  }else{
  Logger.log(loginResponse.authtoken);  
 return HtmlService.createHtmlOutput('Sorry! login Failed please try again. <script>setTimeout(function() { top.window.close() },6000)</script>')
  }
  
  
  
}


function closeLoginWindow(){
  return HtmlService.createHtmlOutput('Success! <script>setTimeout(function() { top.window.close() }, 2)</script>')
}
function buildOpenLinkAction()
{
    var state = generateNewStateToken("getTokenCallback", "tripgain");

    var myUrl="https://auth.tripgain.com/gauth/glogin.jsp";
    var htmlUrl = myUrl + "?redirect_uri=" + getRedirectURI() + "?state=" + state;

    return CardService.newOpenLink()
        .setUrl(htmlUrl)
        .setOpenAs(CardService.OpenAs.OVERLAY)
        .setOnClose(CardService.OnClose.RELOAD_ADD_ON);

}

function generateNewStateToken(callbackName, user_info) 
{
    return ScriptApp.newStateToken()
    .withMethod(callbackName)
    .withArgument("user_info", JSON.stringify(user_info))
    .withTimeout(3600)
    .createToken();
}

 
 


function getRedirectURI() 
{
    var scriptId = ScriptApp.getScriptId();
    return "https://script.google.com/macros/d/" + scriptId + "/usercallback";
}