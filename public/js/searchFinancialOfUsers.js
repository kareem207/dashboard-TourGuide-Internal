// Update PaidK tables functions
async function ClearDataFromTableUpdatePaidK(data){

    const myData1 = await data[1].innerHTML;
    const myData2 = await data[2].innerHTML;
    const myData3 = await data[0].innerHTML;
  
    myDataSpliter = await myData1.split("<br>");
    myDataOne = myDataSpliter[0];
    myDataSpliter2 = await myData2.split("<br>");
    myDataTwo = myDataSpliter2[0];
    myDataSpliter3 = await myData3.split("<br>");
    myDataThree = myDataSpliter3[0];
    return {
      phoneN:myDataOne,
      tripName:myDataTwo,
      fullName:myDataThree,
  
    };
  
  };
  
  
  
  async function getColData2(){
    const rowId = event.target.parentNode.parentNode.id;
    const data = await document.getElementById(rowId).querySelectorAll(".row-data");
    const returnedData = await ClearDataFromTableUpdatePaidK(data);
    console.log(returnedData);
    
    return returnedData ;
    }
  
  async function modelBut2(){
    const data = await getColData2();
    console.log(data);
    document.getElementById("modelTripName").innerHTML = data.tripName;
    document.getElementById("modelfullName").innerHTML = data.fullName;
    document.getElementById("modelPhoneN").innerHTML = data.phoneN;
   }
  
  async function updatePaidKBut(){
     var phone = document.getElementById("modelPhoneN").innerHTML;
     var tripName = document.getElementById("modelTripName").innerHTML;
     var data = {
      phone:phone,
      tripName:tripName
     };
  
    const options = {
      method: 'POST',
      headers: {
         'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };
        
    const rawResponse = await fetch('/submitPaidK',options);
    window.location.replace(`/searchFinancialOfUsers`);

    };
  
  