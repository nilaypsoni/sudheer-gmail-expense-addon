
var MAX_MESSAGE_LENGTH = 40;
//var authToken="AUTHTOKEN96b9228f-ebc8-4f3c-a9b1-0def5965a307";

var userProperties = PropertiesService.getUserProperties();

/**
 * Callback for rendering the homepage card.
 * @return {CardService.Card} The card to show to the user.
*/
 
 var cache = CacheService.getScriptCache();
 var authtoken = userProperties.getProperty('authtoken');
 
// var billableArr = getBillable();
// var reportsArr = getReports();
// var categoryArr = getCategory();

 var billableArr = [];
 var reportsArr = [];
 var categoryArr = [];
 
function redirectLogin(){
  return makeLOgin();

} 

function makeLOgin(type,validationArr,formData) {

    isError=false;
    
   if(type=="error"){
    
     isError=true;
     var textValidationTitle = CardService.newTextParagraph()
    .setText("Errors while Login");
    
     var cardSectionValidation = CardService.newCardSection()
     .addWidget(textValidationTitle)
      
     for (var i = 0; i < validationArr.length; i++) {
      var errorObj = validationArr[i];
      if(errorObj['key']=='email'){
      
      var amountValidation =  CardService.newTextParagraph()
      .setText('*  <font color="#FF1F1F">Email field cannot be empty.</font>');
      cardSectionValidation.addWidget(amountValidation)
      }
      
      if(errorObj['key']=='Password'){
      
      var purposeValidation =  CardService.newTextParagraph()
      .setText('*  <font color="#FF1F1F">Password field cannot be empty.</font>');
      cardSectionValidation.addWidget(purposeValidation)
      
      }
    }
       
   }  
   
   if(formData != undefined){
    // Logger.log(formData);return
     var emailVal = formData.email?formData.email:"";
     var passwordVal = formData.password?formData.password:'';
      }else{
      var emailVal = "";
      var passwordVal = "";
      }
    
   var username = CardService.newTextInput()
  .setFieldName("email")
  .setTitle("Email (*)")
  .setValue(emailVal);
  
   var password = CardService.newTextInput()
  .setFieldName("Password")
  .setTitle("Password (*)");
  
  

  
  var onSubmitAction = CardService.newAction()
  .setFunctionName("doLogin")
  .setLoadIndicator(CardService.LoadIndicator.SPINNER);
  var submitButton = CardService.newTextButton()
  .setText("Login")
  .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
  .setBackgroundColor('#032F55')
  .setOnClickAction(onSubmitAction);
  
   var cardSectionmain = CardService.newCardSection()
  .addWidget(username)
  .addWidget(password)
  .addWidget(submitButton);

    
  if(isError){
  
   const card = CardService.newCardBuilder()
  .addSection(cardSectionValidation)
  .addSection(cardSectionmain)
   return card.build();
  
   return CardService.newActionResponseBuilder()
    .setNavigation(CardService.newNavigation().popToRoot()
         .updateCard(card))
    .build()
   
  }else{
   
   const card1 = CardService.newCardBuilder()
  .addSection(cardSectionmain)
   return card1.build();
  
   return CardService.newActionResponseBuilder()
    .setNavigation(CardService.newNavigation().popToRoot()
         .updateCard(card1))
    .build()
   
  }

}

function loginScreen(e) {
  //Logger.log("authtoken");return
   var saveExp = CardService.newKeyValue()
   .setIconUrl("http://54.39.16.196/attachment.png")
   .setMultiline(true)
   .setContent('Never lose track of expenses again Save expenses and e-receipts from your email with a single click.');

   var saveExp1 = CardService.newKeyValue()
   .setIconUrl("http://54.39.16.196/attachment.png")
   .setMultiline(true)
   .setContent('Intelligent data extraction Amount, merchant name, category are auto-extracted for more than 100 merchants like Uber, Paypal, Amazon, Ola');

  var saveExp2 = CardService.newKeyValue()
   .setIconUrl("http://54.39.16.196/attachment.png")
   .setMultiline(true)
   .setContent('Auto capture receipts Email and PDF attachments are automatically attached to your expenses');
  
    
   var cardSectionmain = CardService.newCardSection()
  .addWidget(saveExp)
  .addWidget(saveExp1)
  .addWidget(saveExp2);
    
  var onSubmitAction = CardService.newAction()
  .setFunctionName("onclickLoginbtn")
  .setLoadIndicator(CardService.LoadIndicator.SPINNER);

  var submitButton = CardService.newTextButton()
  .setText("Login")
  .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
  .setBackgroundColor('#032F55')
  .setOpenLink(buildOpenLinkAction());
  
  var onCancelAction = CardService.newAction()
  .setFunctionName("onCancel")
  
  .setLoadIndicator(CardService.LoadIndicator.SPINNER);

  var cancelButton = CardService.newTextButton()
  .setText("SignUp")
  .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
  .setBackgroundColor('#000000')
  .setOnClickAction(onCancelAction);
  
  
  var buttonSet = CardService.newButtonSet()
   // .addButton(cancelButton)
    .addButton(submitButton);
    
  var cardSectionFooter = CardService.newCardSection()
  .addWidget(buttonSet);
  
    const card = CardService.newCardBuilder()
    
  .addSection(cardSectionmain)
  .addSection(cardSectionFooter)
  return card.build();
  
   return CardService.newActionResponseBuilder()
    .setNavigation(CardService.newNavigation().popToRoot()
         .updateCard(card))
    .build()
  


}

function onHomepage(e) {
//Logger.log(e);return
  //return logoutAddon()
var authtoken = userProperties.getProperty('authtoken');
//Logger.log(authtoken);return
if ( authtoken == null) {
    
    return loginScreen();
}else{
 var scriptProperties = PropertiesService.getScriptProperties();
var data = userProperties.getProperties();
for (var key in scriptProperties) {
  //Logger.log('Key: %s, Value: %s', key, data[key]);
}
    var logoutAction = CardService.newAction()
  .setFunctionName("logoutAddon")
  
  .setLoadIndicator(CardService.LoadIndicator.SPINNER);
  
  var headerBtnLogout = CardService.newCardAction()
    .setText("Sign out")
    .setOnClickAction(logoutAction);
    
  var whitespaces = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
  var whitespaces2 = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
   return CardService
     .newCardBuilder()
     .addCardAction(headerBtnLogout)
     .addSection(
          CardService.newCardSection()
              .addWidget(CardService.newImage().setImageUrl(
                  'https://www.google.com/images/emails/addon/gmail_welcome_card.png'))
                  .addWidget(CardService.newTextParagraph().setText(whitespaces +'Get started by opening an email or'+whitespaces+'<br>'+whitespaces2+whitespaces2+'conversation'+whitespaces2+whitespaces2 )))
          .build();
}

  
}



/**
 * show alredy added expense card screen
 * @return {CardService.Card} The card to show to the user.
 */

function showExpenseOption(ExpenseDetail,reportid,action){
//Logger.log(ExpenseDetail);return
    var currency = ExpenseDetail.Expense.currency;
    var totalAmount = ExpenseDetail.Expense.total_amount;
    var status = ExpenseDetail.Expense.status;
    var expenseDate= ExpenseDetail.Expense.expense_date;
    var category = ExpenseDetail.Expense.category;
    category = category.toLowerCase();
    var expenseName = ExpenseDetail.Expense.expense_name;
    var merchantName = ExpenseDetail.Expense.merchant_name;
    var paymentstatus = ExpenseDetail.Expense.paymentstatus;
    var expenseid = ExpenseDetail.Expense.expenseid;
    var isreimbursable = ExpenseDetail.Expense.isreimbursable;
    var isBillable = ExpenseDetail.Expense.isbillable;
    //var formattedDate = Utilities.formatDate(new Date(expenseDate), "GMT", "EEE, MMM d, ''yyyy");
    var formattedDate = expenseDate.split(' ')[0]; 
   
   var makeAChoiceCurrency = CardService.newKeyValue()
    .setTopLabel("Currency")
    .setContent(""+currency+" <br>&nbsp;<br>");

    var totalAmount = CardService.newKeyValue()
    .setTopLabel("Amount")
    .setContent(""+totalAmount+" <br>&nbsp;<br>");

    var expStatus = CardService.newKeyValue()
    .setTopLabel("Status")
    .setContent(""+status+" <br>&nbsp;<br>");

    var expMerchant = CardService.newKeyValue()
    .setTopLabel("Merchant Name")
    .setContent(""+merchantName+" <br>&nbsp;<br>");

    var expDate = CardService.newKeyValue()
    .setTopLabel("Date")
    .setContent(""+formattedDate+" <br>&nbsp;<br>");

    var expcategory = CardService.newKeyValue()
    .setTopLabel("Category")
    .setContent(""+category+" <br>&nbsp;<br>");

  var cardSectionmain = CardService.newCardSection()
  .addWidget(makeAChoiceCurrency)
  .addWidget(totalAmount)
  .addWidget(expStatus)
  .addWidget(expMerchant)
  .addWidget(expDate)
  .addWidget(expcategory)

  var onSubmitAction = CardService.newAction()
  .setFunctionName("onSubmitViewApp")
  
  .setLoadIndicator(CardService.LoadIndicator.SPINNER);

  var submitButton = CardService.newTextButton()
   .setText("VIEW IN APP")
   .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
   .setBackgroundColor('#032F55')
   .setOpenLink(CardService.newOpenLink()
   .setUrl("https://app.tripgain.com/expenses#all-expenses_2")
   .setOpenAs(CardService.OpenAs.FULL_SIZE)
   .setOnClose(CardService.OnClose.NOTHING));
              
//  var submitButton = CardService.newTextButton()
//  .setText("VIEW IN APP")
//  .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
//  .setBackgroundColor('#032F55')
//
//  .setOnClickAction(onSubmitAction);
  
  var cardSectionFooter = CardService.newCardSection()
  .addWidget(submitButton);


   var action1 = CardService.newAction()
   .setFunctionName("editExpense")
  
  .setLoadIndicator(CardService.LoadIndicator.SPINNER);
  
  var headerBtnEdit = CardService.newCardAction()
    .setText("EDIT")
    .setOnClickAction(action1);
 
   var action2 = CardService.newAction()
  .setFunctionName("deleteExpense")
  
  .setLoadIndicator(CardService.LoadIndicator.SPINNER);
  
   var headerBtnDelete = CardService.newCardAction()
    .setText("DELETE")
    .setOnClickAction(action2);
    
   var logoutAction = CardService.newAction()
   .setFunctionName("logoutAddon")
  
   .setLoadIndicator(CardService.LoadIndicator.SPINNER);
  
   var headerBtnLogout = CardService.newCardAction()
    .setText("Sign out")
    .setOnClickAction(logoutAction);
    
   
    return CardService.newCardBuilder()
    .addSection(cardSectionmain)
    .addSection(cardSectionFooter)
    .addCardAction(headerBtnEdit)
    .addCardAction(headerBtnLogout)
    .build();
}



/**
 * show alredy added expense card edit screen
 * @return {CardService.Card} The card to show to the user.
 */
 
 function onModeChange(e) {
   Logger.log(e.formInput)
}
function editMessageCard(ExpenseDetail){
     //Logger.log(ExpenseDetail);
    billableArr = getBillable();
    reportsArr = getReports();
    categoryArr = getCategory();
     
    var billable_arr = billableArr;
    var report_arr = reportsArr;
    var category_arr=categoryArr;
    
    var currency = ExpenseDetail.Expense.currency;
    var totalAmount = ExpenseDetail.Expense.total_amount;
    var status = ExpenseDetail.Expense.status;
    var expenseDate= ExpenseDetail.Expense.dt;
    var category = ExpenseDetail.Expense.category;
    category = category.toLowerCase();
    var report = ExpenseDetail.Expense.reportname;
    var reportid = ExpenseDetail.Expense.reportid;
    var reportName=getReportName(reportid,reportsArr) 
    
    //Logger.log("reportid=="+reportid+" reportName "+reportName);
    var customerId = ExpenseDetail.Expense.customerid;
    var customerCompany=getCustomerCompanyName(customerId,billable_arr) 
    
    var expenseName = ExpenseDetail.Expense.expense_name;
    var merchantName = ExpenseDetail.Expense.merchant_name;
    var paymentstatus = ExpenseDetail.Expense.paymentstatus;
    var expenseid = ExpenseDetail.Expense.expenseid;
    var isreimbursable = ExpenseDetail.Expense.isreimbursable;
    var isBillable = ExpenseDetail.Expense.isbillable;
   
    //gger.log(ExpenseDetail);
    var formattedDate = ExpenseDetail.Expense.expense_date.split(' ')[0];
    cache.put('expenseDate', formattedDate);
    var makeAChoiceCurrency = CardService.newSelectionInput().setType(CardService.SelectionInputType.DROPDOWN)
   .setTitle('Currency (*)')
   .setFieldName('currencyChoice');

    if(currency !== ""){
  
    makeAChoiceCurrency.addItem(currency,currency,true);
    
    }else{
    
    makeAChoiceCurrency.addItem('INR','INR',true);
    
    } 
   
  makeAChoiceCurrency.addItem('USD','USD',false);
  makeAChoiceCurrency.addItem('AED','AED',false);
  makeAChoiceCurrency.addItem('GBP','GBP',false);
  makeAChoiceCurrency.addItem('EUR','EUR',false);
  makeAChoiceCurrency.addItem('MYR','MYR',false);
  makeAChoiceCurrency.addItem('BHT','BHT',false);
  makeAChoiceCurrency.addItem('SGD','SGD',false);

  var amountField = CardService.newTextInput()
  .setFieldName("amount")
  .setTitle("Amount (*)")
  .setValue(totalAmount);

   var purposeField = CardService.newTextInput()
  .setFieldName("purpose")
  .setHint("E.g Client Meeting")
  .setTitle("Purpose (*)");


//  var dateField = CardService.newTextInput()
//  .setFieldName("mailDate")
//  .setHint("(YYYY MMMM DD)")
//  .setTitle("Date of Spend")
//  .setValue(formattedDate);
  
  var myDate = formattedDate;
  
  //Logger.log(myDate)  
  myDate = myDate.split("-");
   
  var newDate = new Date( myDate[0], myDate[1] - 1, myDate[2]);
  var newDateStamp = newDate.getTime();
  //Logger.log(newDateStamp)

  
  var dateField = CardService.newDatePicker()
    .setTitle("Date of Spend (*)")
    
    .setFieldName("mailDate")
    // Set default value as Jan 1, 2018 UTC. Either a number or string is acceptable.
    .setValueInMsSinceEpoch(newDateStamp);


  var merchantField = CardService.newTextInput()
  .setFieldName("merchant")
  .setHint("E.g Uber")
  .setTitle("Merchant (*)")
  .setValue(merchantName);
  
  var makeAChoiceCategory=CardService.newSelectionInput().setType(CardService.SelectionInputType.DROPDOWN)
  .setTitle('Category (*)')
  .setFieldName('catChoice')
  
    if(category != undefined && category !==""){
    makeAChoiceCategory.addItem(category,category,true);
    }else{
      makeAChoiceCategory.addItem('Others','Others',true);
    }
   
  for (var i = 0; i < category_arr.length; i++) {
      var categoryname = category_arr[i]['categoryname'];
      makeAChoiceCategory.addItem(categoryname,categoryname,false);
           
    }   
    
 var makeAChoiceReports=CardService.newSelectionInput().setType(CardService.SelectionInputType.DROPDOWN)
  .setTitle('Reports (*)')
  .setFieldName('reportChoice')
  
    if(reportName != undefined && reportName !==""){
    makeAChoiceReports.addItem(reportName,reportName,true);
    }
  
     if(report_arr.length == 0){
       makeAChoiceReports.addItem('NA','NA',true);
     }
  
   for (var i = 0; i < report_arr.length; i++) {
      var report_name = report_arr[i]['report_name'];
      var reportid = report_arr[i]['reportid'];
      makeAChoiceReports.addItem(report_name,report_name,false);
           
    }   
   

  var makeAChoiceBillable=CardService.newSelectionInput().setType(CardService.SelectionInputType.DROPDOWN)
  .setTitle('Billable (*)')
  .setFieldName('bilChoice')
  
    if(customerCompany != undefined && customerCompany !== "" && isBillable){
    makeAChoiceBillable.addItem(customerCompany,customerCompany,true);
    }else{
    makeAChoiceBillable.addItem('','',true);
    }
    
   if(billable_arr.length == 0){
     makeAChoiceBillable.addItem('NA','NA',true);
   }
  
  for (var i1  = 0; i1 < billable_arr.length; i1++) {
      var customerid = billable_arr[i1]['customerid'];
      var companyname = billable_arr[i1]['companyname'];
      makeAChoiceBillable.addItem(companyname,companyname,false);
           
    } 
   
    
   var switchKeyValueBillable = CardService.newKeyValue()
        .setContent("Billable")
   .setSwitch(CardService.newSwitch()
        .setFieldName("isBillable_switch")
        .setValue(true)
        .setSelected(isBillable));
        
    
    
  //Logger.log(isreimbursable);
     var switchKeyValue = CardService.newKeyValue()
        .setContent("Reimbursable")
    .setSwitch(CardService.newSwitch()
        .setFieldName("Reimbursable_switch")
        .setValue(true)
        .setSelected(isreimbursable));
        
   var cardSectionmain = CardService.newCardSection()
  .addWidget(makeAChoiceCurrency)
  .addWidget(amountField)
  .addWidget(purposeField)
  .addWidget(dateField)
  .addWidget(merchantField)
  .addWidget(makeAChoiceCategory)
  .addWidget(makeAChoiceReports)
  .addWidget(switchKeyValue)
  .addWidget(switchKeyValueBillable)
  .addWidget(makeAChoiceBillable)

  
  var onSubmitAction = CardService.newAction()
  .setFunctionName("onSubmit")
  
  .setParameters({expenseDetailObj: JSON.stringify({expenseid: expenseid,action: 'edit'})})
  .setLoadIndicator(CardService.LoadIndicator.SPINNER);

  var submitButton = CardService.newTextButton()
  .setText("Save")
  .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
  .setBackgroundColor('#032F55')
  .setOnClickAction(onSubmitAction);
  
  var onCancelAction = CardService.newAction()
  .setFunctionName("onCancel")
  .setParameters({expensObj: JSON.stringify({expenseid: expenseid,expenseDate:expenseDate}),action: 'edit'})
  .setLoadIndicator(CardService.LoadIndicator.SPINNER);

  var cancelButton = CardService.newTextButton()
  .setText("Cancel")
  .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
  .setBackgroundColor('#000000')
  .setOnClickAction(onCancelAction);
  
  
  var buttonSet = CardService.newButtonSet()
    .addButton(cancelButton)
    .addButton(submitButton);
    
  var cardSectionFooter = CardService.newCardSection()
  .addWidget(buttonSet);
  
  var logoutAction = CardService.newAction()
  .setFunctionName("logoutAddon")
  
  .setLoadIndicator(CardService.LoadIndicator.SPINNER);
  
  var headerBtnLogout = CardService.newCardAction()
    .setText("Sign out")
    .setOnClickAction(logoutAction);
  
  return CardService.newCardBuilder()
  .addSection(cardSectionmain)
  .addSection(cardSectionFooter)
  .addCardAction(headerBtnLogout)
  .build();


}

/**
 * create new expense card screen
 * @return {CardService.Card} The card to show to the user.
 */
 
function createMessageCard(expenseDetailObj,type,validationArr,formData) {
    //Logger.log(expenseDetailObj);return 
     var isError=false;
     billableArr = getBillable();
     reportsArr = getReports();
     categoryArr = getCategory();
    //Logger.log(reportsArr);return 
     var  billable_arr = billableArr;
     var report_arr = reportsArr;
     var category_arr=categoryArr;
       
     var uiSettings = chekLogin();
     
      var data =  getParseEmailBody(expenseDetailObj);  
   
     //Logger.log(data); 
     
   if(type=="error"){
     isError=true;
     var textValidationTitle = CardService.newTextParagraph()
    .setText("Errors while creating an expense");
    
     var cardSectionValidation = CardService.newCardSection()
     .addWidget(textValidationTitle)
      
     for (var i = 0; i < validationArr.length; i++) {
      var errorObj = validationArr[i];
      if(errorObj['key']=='amount'){
      
      var amountValidation =  CardService.newTextParagraph()
      .setText('*  <font color="#FF1F1F">Amount field cannot be empty.</font>');
      cardSectionValidation.addWidget(amountValidation)
      }
      if(errorObj['key']=='date'){
      
      var dateValidation = CardService.newTextParagraph()
      .setText('*  <font color="#FF1F1F"> Please enter a valid date in the format (YYYY MMM DD).</font>');
      
      cardSectionValidation.addWidget(dateValidation)
      
      }
      if(errorObj['key']=='purpose'){
      
      var purposeValidation =  CardService.newTextParagraph()
      .setText('*  <font color="#FF1F1F">Purpose field cannot be empty.</font>');
      cardSectionValidation.addWidget(purposeValidation)
      
      }
    }
    
       
   }  
   
   if(formData != undefined){
    // Logger.log(formData);return
     var amountVal = formData.amount?formData.amount:"";
     var dateVal = formData.date?formData.date:'';
     var purposeVal = formData.purpose?formData.purpose:'';
      }else{
      var amountVal = "";
      var dateVal = "";
      var purposeVal = "";
      }
      
   var makeAChoiceCurrency=CardService.newSelectionInput().setType(CardService.SelectionInputType.DROPDOWN)
     .setTitle('Currency (*)')
     .setFieldName('currencyChoice');

  if(data != undefined && data.curreny!=undefined &&data.curreny !== ""){
    makeAChoiceCategory.addItem(data.curreny,data.curreny,true);
    }else{
    makeAChoiceCurrency.addItem('INR','INR',true);
    } 
   
   makeAChoiceCurrency.addItem('USD','USD',false);
   makeAChoiceCurrency.addItem('AED','AED',false);
   makeAChoiceCurrency.addItem('GBP','GBP',false);
   makeAChoiceCurrency.addItem('EUR','EUR',false);
   makeAChoiceCurrency.addItem('MYR','MYR',false);
   makeAChoiceCurrency.addItem('BHT','BHT',false);
   makeAChoiceCurrency.addItem('SGD','SGD',false);

   var amountField = CardService.newTextInput()
  .setFieldName("amount")
  .setTitle("Amount (*)")
  .setValue(amountVal);

  var purposeField = CardService.newTextInput()
  .setFieldName("purpose")
  .setHint("E.g Client Meeting")
  .setTitle("Purpose")
  .setValue(purposeVal);

//  var dateField = CardService.newTextInput()
//  .setFieldName("mailDate")
//  .setHint("(YYYY MMMM DD)")
//  .setTitle("Date of Spend")
//  .setValue(data.expensedate);
  
  if(data != undefined && data.expensedate != undefined && data.expensedate !== ""){
  
  var myDate = data.expensedate;  
    
  }else{
    
  var myDate = expenseDetailObj.dt;
  }
  
    
  myDate = myDate.split("/");
   
  var newDate = new Date( myDate[0], myDate[1] - 1, myDate[2]);
  var newDateStamp = newDate.getTime();
  //Logger.log(newDateStamp)

  
   var dateField = CardService.newDatePicker()
    .setTitle("Date of Spend (*)")
     
    .setFieldName("mailDate")
    
    .setValueInMsSinceEpoch(newDateStamp);
 
  if(data != undefined && data.merchant != undefined && data.merchant !== ""){
    
    var merchant= data.merchant;
    
  }else{
    
    var merchant= '';
    
  }

  var merchantField = CardService.newTextInput()
  .setFieldName("merchant")
  .setHint("E.g Uber")
  .setTitle("Merchant (*)")
  .setValue(merchant);
  
  var makeAChoiceCategory=CardService.newSelectionInput().setType(CardService.SelectionInputType.DROPDOWN)
  .setTitle('Category (*)')
  .setFieldName('catChoice')
  
  if(data != undefined && data.category != undefined && data.category !==""){
    
    makeAChoiceCategory.addItem(data.category,data.category,true);
    
    }else{
      
      makeAChoiceCategory.addItem('Others','Others',true);
      
    }
  
  for (var i = 0; i < category_arr.length; i++) {
      var categoryname = category_arr[i]['categoryname'];
      makeAChoiceCategory.addItem(categoryname,categoryname,false);
           
    }   
    
    
   var makeAChoiceReports = CardService.newSelectionInput().setType(CardService.SelectionInputType.DROPDOWN)
  .setTitle('Reports (*)')
  .setFieldName('reportChoice')
         
   if(report_arr.length == 0){
     makeAChoiceReports.addItem('NA','NA',true);
   }
  
  for (var i1  = 0; i1 < report_arr.length; i1++) {
      var report_name = report_arr[i1]['report_name'];
      var reportid = parseInt(report_arr[i1]['reportid']);
      if(i1==0){
      makeAChoiceReports.addItem(report_name,report_name,true);
      }else{
      makeAChoiceReports.addItem(report_name,report_name,false);
      }
           
    } 
    
 
 
 var makeAChoiceBillable=CardService.newSelectionInput().setType(CardService.SelectionInputType.DROPDOWN)
  .setTitle('Billable (*)')
  .setFieldName('bilChoice')
 
  if(billable_arr.length == 0){
     makeAChoiceBillable.addItem('NA','NA',true);
   }
  
  for (var i1  = 0; i1 < billable_arr.length; i1++) {
      var customerid = billable_arr[i1]['customerid'];
      var companyname = billable_arr[i1]['companyname'];
      
      if(i1==0){
      makeAChoiceBillable.addItem('','',true);
      }else{
      makeAChoiceBillable.addItem(companyname,companyname,false);
      }
           
    } 
    
  
  var switchKeyValue = CardService.newKeyValue()
        .setContent("Reimbursable")
    .setSwitch(CardService.newSwitch()
        .setFieldName("Reimbursable_switch")
        .setValue(true)
        .setSelected(true));
        
        
    var switchKeyValueBillable = CardService.newKeyValue()
        .setContent("Billable")
        .setSwitch(CardService.newSwitch()
        .setFieldName("isBillable_switch")
        .setValue(true)
        .setSelected(false));
        
        
  if(expenseDetailObj.fileDetails.length != 0){
   var rnum=expenseDetailObj.fileDetails.length;
  }else{
   var rnum=1;
  }
  
    var rece=rnum+" receipts";
    var attachmentKeyValue = CardService.newKeyValue()
   .setIconUrl("http://54.39.16.196/attachment.png")
    .setContent(rece);
  
  
    var logoutAction = CardService.newAction()
   .setFunctionName("logoutAddon")
  
    .setLoadIndicator(CardService.LoadIndicator.SPINNER);
  
     var headerBtnLogout = CardService.newCardAction()
    .setText("Sign out")
    .setOnClickAction(logoutAction);
    
    
  var cardSectionmain = CardService.newCardSection()
  .addWidget(makeAChoiceCurrency)
  .addWidget(amountField)
  .addWidget(purposeField)
  .addWidget(dateField)
  .addWidget(merchantField)
  .addWidget(makeAChoiceCategory)
  .addWidget(makeAChoiceReports)
  .addWidget(switchKeyValue)
  .addWidget(switchKeyValueBillable)
  .addWidget(makeAChoiceBillable)
  .addWidget(attachmentKeyValue);

   
  expenseDetailObj['action']='add';
  var onSubmitAction = CardService.newAction()
  .setFunctionName("onSubmit")
  .setParameters({expenseDetailObj:JSON.stringify(expenseDetailObj) })
  .setLoadIndicator(CardService.LoadIndicator.SPINNER);

  var submitButton = CardService.newTextButton()
  .setText("Submit")
  .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
  .setBackgroundColor('#032F55')

  .setOnClickAction(onSubmitAction);
  
  var cardSectionFooter = CardService.newCardSection()
  .addWidget(submitButton);
  
  if(isError){
  return CardService.newCardBuilder()
  .addSection(cardSectionValidation)
  .addSection(cardSectionmain)
  .addSection(cardSectionFooter)
  .addCardAction(headerBtnLogout)
  .build();
  }else{
   return CardService.newCardBuilder()
  .addSection(cardSectionmain)
  .addSection(cardSectionFooter)
  .addCardAction(headerBtnLogout)
  .build();
  }
  

}


//function onBillableChange(event){
//  var expenseDetailObj =  JSON.parse(event.parameters.expenseDetailObj);
//}

function truncate(message) {
  if (message.length > MAX_MESSAGE_LENGTH) {
    message = message.slice(0, MAX_MESSAGE_LENGTH);
    message = message.slice(0, message.lastIndexOf(' ')) + '...';
  }
  return message;
}
