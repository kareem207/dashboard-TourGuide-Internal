function removeTags(str) {
    if ((str===null) || (str===''))
    return false;
    else 
    str = "" + str;
    // Regular expression to identify HTML tags in
    // the input string. Replacing the identified - HTML tag with a null string.
    return str.replace( /(<([^>]+)>)/ig, '');
    }

    async function codePhoneN(phoneN){
      if (phoneN[0]==='+' ||phoneN[0]==='#' || phoneN[1]==='+' ||phoneN[1]==='#')
        phoneN = phoneN.replace("+", "k").replace("#", "a");
      return phoneN
    }

    async function ClearDataFromTableAllUsers(data){
      const myData1 = await data[1].innerHTML;
      const myData2 = await data[3].innerHTML;
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
        fullName:myDataThree
      };
    }

    async function getColData(){
    const rowId = event.target.parentNode.parentNode.id;
    const data = await document.getElementById(rowId).querySelectorAll(".row-data");
    const returnedData = await ClearDataFromTableAllUsers(data);
    console.log(returnedData);
    
    return returnedData ;
    }


    async function EditBut(){
      const data = await getColData();
      var phone = data.phoneN;
      var tripName = data.tripName;
      var phone = await codePhoneN(phone);
      
      window.location.replace(`/updateUser?phoneN=${phone}&tripName=${tripName}`);
    }

    async function modelBut(){
      const data = await getColData();
      console.log(data);
      document.getElementById("modelTripName").innerHTML = data.tripName;
      document.getElementById("modelfullName").innerHTML = data.fullName;
      document.getElementById("modelPhoneN").innerHTML = data.phoneN;
    }

    async function deleteBut(){
      var phone = document.getElementById("modelPhoneN").innerHTML;
      var tripName = document.getElementById("modelTripName").innerHTML;
      phone = await codePhoneN(phone);

      window.location.replace(`/submitDeleteTripBut?phoneN=${phone}&tripName=${tripName}`);
    }







