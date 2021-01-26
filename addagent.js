var databaseRef = firebase.database().ref('users/');
var table_data='';


// ----------------------Display Data From DB----------------------
databaseRef.once('value', function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
        var childKey = childSnapshot.key;
        var childData = childSnapshot.val();

        table_data += '<tr id="row">'
        table_data += '<td>'
        table_data += document.createTextNode(childData.devicenumber).textContent
        table_data += '</td>'
        table_data += '<td>'
        table_data += document.createTextNode(childData.employeeId).textContent
        table_data += '</td>'
        table_data += '<td>'
        table_data += document.createTextNode(childData.employeeFirstname).textContent
        table_data += '</td>'
        table_data += '<td>'
        table_data += document.createTextNode(childData.employeeLastname).textContent
        table_data += '</td>'
        table_data += '<td>'
        table_data += document.createTextNode(childKey).textContent
        table_data += '</td>'
        table_data += '<td>'
        table_data += '<button style="margin: 8px;" onclick="printQR(this)" id="'
        table_data += childData.url.toString()
        table_data += '">Print QRCode</button>'
        table_data += '<button onclick="delete_user(this)">Delete</button>'
        table_data += '</td>'
        table_data += '</tr>'
    });
    $('#table_body').append(table_data)

    $(document).ready(function() {
        $('#tbl_devicelog_list').DataTable( {
            "pageLength": 50
        });
    });
    
})
// ----------------------Display Data From DB End----------------------

function adminLog(el) {
    var user = firebase.auth().currentUser
    email = user.email;
    dateTime = moment().format('MMMM Do YYYY h:mm:ss a');
    action = el

    var uid = firebase.database().ref().child('AdminLog').push().key;
    var data = {
        DateTime: dateTime,
        UserEmail: email,
        Action: action,
    }   
    var updates = {};
    updates['/AdminLog/' + uid ] = data;
    firebase.database().ref().update(updates);
    // reload_page();
}    
            
            
    



// mia 3/13/2020
function printQR(el) {
    img = el.id
    tr=el.closest("#row"); //get Row value
    td=tr.getElementsByTagName("td");
    devNum = td[0].innerHTML
    eeId = td[1].innerHTML
    Fname = td[2].innerHTML
    Lname = td[3].innerHTML
    var pwa = window.open("", "", "width = 900, height = 700");
    pwa.document.open();
    pwa.document.write(ImagetoPrint(img,devNum,eeId,Fname,Lname));
    pwa.document.close();
    adminLog('Print QR Code');
}

function ImagetoPrint(img,devNum,eeId,Fname,Lname){
    return "<html><head><scri"+"pt>function step1(){\n" +
            "setTimeout('step2()', 10);}\n" +
            "function step2(){window.print();window.close()}\n" +
            "</scri" + "pt><style>\n .tag {text-align: center; float:left; LINE-HEIGHT:1px; padding:20px;}\n"+
            "</style></head><body onload='step1()'>\n" +

            "<div class='tag'>\n<img src='" + img + "' />\n" +
            "<p> Dev No: "+devNum+"</p>\n" +
            "<p> ID: "+eeId+"</p>\n" +
            "<p> "+Fname+"</p>\n" +
            "<p> "+Lname+"</p></div>\n" +
            "</body></html>";
}


// mia 3/11/2020
function printAll() {
    table = document.getElementsByTagName("tbody")[0].rows;
    img=[]
    devNum=[]
    eeId=[]
    Fname=[]
    Lname=[]

    for(i=0; i<table.length; i++) {
        img1 = table[i].cells[5].getElementsByTagName("button")[0].id
        devNum1 = table[i].cells[0].innerHTML
        eeId1 = table[i].cells[1].innerHTML
        Fname1 = table[i].cells[2].innerHTML
        Lname1 = table[i].cells[3].innerHTML
        img.push(img1)
        devNum.push(devNum1)
        eeId.push(eeId1)
        Fname.push(Fname1)
        Lname.push(Lname1)
    }
    var pwa = window.open("", "", "width = 900, height = 700");
    pwa.document.open();
    pwa.document.write(ImagetoPrint2(img,devNum,eeId,Fname,Lname));
    pwa.document.close();
    adminLog('Print all QR codes');
}

function ImagetoPrint2(img,devNum,eeId,Fname,Lname){
    printSentence = "<html><head><scri"+"pt>function step1(){\n" +
            "setTimeout('step2()', 10);}\n" +
            "function step2(){window.print();window.close()}\n" +
            "</scri" + "pt><style>\n .tag {text-align: center; float:left; LINE-HEIGHT:1px; padding:20px;}\n"+
            "</style></head><body onload='step1()'>\n"
    for(i=0; i<devNum.length; i++) {
        temp = "<div class='tag'>\n<img src='" + img[i] + "' />\n" +
                "<p> Dev No: "+ devNum[i] +"</p>\n" +
                "<p> ID: "+ eeId[i] +"</p>\n" +
                "<p> "+ Fname[i] +"</p>\n" +
                "<p> "+ Lname[i] +"</p></div>\n"
        printSentence += temp
    }
      printSentence += "</body></html>";
    return printSentence
}


// mia 4 edit
function save_user() {
    devnum = document.getElementById('deviceno_field').value;
    eeID = document.getElementById('eid_field').value;
    fname = document.getElementById('fname_field').value;
    lname = document.getElementById('lname_field').value;
    if (fname == "" || lname == "" || devnum == "" || eeID == "") {
        alert("All fields are required.");
        exit;
    } else {
        var device_number = document.getElementById('deviceno_field').value;
        var eid = document.getElementById('eid_field').value;
        var emp_fname = document.getElementById('fname_field').value;
        var emp_lname = document.getElementById('lname_field').value;
        var uid = firebase.database().ref().child('users').push().key;
        

        firebase.database().ref("users/").orderByChild("devicenumber").equalTo(device_number).once("value").then(function(snapshot) {
            if (snapshot.exists()){
                console.log('Device number exists.')
            }
            else {
                firebase.database().ref("users/").orderByChild("employeeId").equalTo(eid).once("value").then(function(snapshot1) {                   
                    if (snapshot1.exists()){
                        console.log('Paycom ID exists.')
                    }
                    else {
                        var qr = new QRious({
                            element: document.getElementById('qr'),
                            value: uid,
                            mime: 'image/png'
                        });
                        var qrcode = qr.toDataURL();
                        var storageRef = firebase.storage().ref('QRCode/'+uid+'.png');
                        var uploadtask = storageRef.putString(qrcode,'data_url');
                    
                        uploadtask.on('state_changed',
                            function progress(snapshot) {
                                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                                console.log('Upload is ' + progress + '% done');
                                switch (snapshot.state) {
                                case firebase.storage.TaskState.PAUSED: // or 'paused'
                                    console.log('Upload is paused');
                                    break;
                                case firebase.storage.TaskState.RUNNING: // or 'running'
                                    console.log('Upload is running');
                                    break;
                                }
                            },
                            function error(err) {
                    
                            },
                            function complete() 
                            {
                                uploadtask.snapshot.ref.getDownloadURL().then(function (downloadUrl)
                                    {        
                                        var data = {qrcode: uid,
                                            devicenumber: device_number,
                                            employeeId: eid,
                                            employeeFirstname: emp_fname,
                                            employeeLastname: emp_lname,
                                            url: downloadUrl
                                    }
                                        var updates = {};
                                        updates['/users/' + uid ] = data;
                                        firebase.database().ref().update(updates);
                                    })
                                    reload_page()
                            });
                        alert('The user is created successfully!');
                        adminLog('Add employee');
                    }
                })
            }
        });
    } 
}
    

// mia code 1
function save_user1() {
    var device_number = field1
    var eid = field2
    var emp_fname = field3
    var emp_lname = field4
    var uid = firebase.database().ref().child('users').push().key;
    var qr = new QRious({
        element: document.getElementById('qr'),
        value: uid,
        mime: 'image/png'
    });
    var qrcode = qr.toDataURL();
    var storageRef = firebase.storage().ref('QRCode/'+uid+'.png');
    var uploadtask = storageRef.putString(qrcode,'data_url');

    uploadtask.on('state_changed',
        function progress(snapshot) {
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED: // or 'paused'
                console.log('Upload is paused');
                break;
            case firebase.storage.TaskState.RUNNING: // or 'running'
                console.log('Upload is running');
                break;
            }
        },
        function error(err) {

        },
        function complete() 
        {
            uploadtask.snapshot.ref.getDownloadURL().then(function (downloadUrl)
                {        
                    var data = {qrcode: uid,
                        devicenumber: device_number,
                        employeeId: eid,
                        employeeFirstname: emp_fname,
                        employeeLastname: emp_lname,
                        url: downloadUrl
                }
                    var updates = {};
                    updates['/users/' + uid ] = data;
                    firebase.database().ref().update(updates);
                });
            
        });
    //alert('The user is created successfully!');
}
    

function update_user() {
        var data = {
            user_id: user_id,
            user_name: user_name
        }

        var updates = {};
        updates['/users/ '+ user_id] = data;
        firebase.database().ref().update(updates);

        alert('The user is updated successfully!');

        reload_page();
}

function delete_user(el) {
    tr = el.closest("#row"); //get Row value
    td = tr.getElementsByTagName("td");
    userId = td[4].innerHTML

    firebase.database().ref('users/').child(userId).remove();
    alert('The user is deleted succesfully');
    adminLog('Delete employee');
    reload_page();
}

function logout(){
    adminLog('Log out');
    firebase.auth().signOut();
    window.location.href="index.html";
};

function reload_page() {
    window.location.reload();
}

// Add users by csv file
function updateCsvFile(files) {
    // Check for the various File API support.
    
    if (window.FileReader) {
        // FileReader are supported.
        getAsText(files[0]);
    } else {
        alert('FileReader are not supported in this browser.');
    }
  }

function getAsText(fileToRead) {
    var reader = new FileReader();
    // Read file into memory as UTF-8      
    reader.readAsText(fileToRead);
    // Handle errors load
    reader.onload = loadHandler;
    reader.onerror = errorHandler;
}

function loadHandler(event) {
    var csv = event.target.result;
    processData(csv);
}

function processData(csv) {
    var allTextLines = csv.split(/\r\n|\n/);
    wronglines=[]
    for (var i=1; i<(allTextLines.length); i++) {
        k=i
        var data = allTextLines[i].split(',');
        if( data.length == 4 && data[0].length <= 4 && /^[0-9]+$/.test(data[0]) && data[1].length == 4 && /^[0-9]+$/.test(data[1]) && /^[A-Za-z]+$/.test(data[2]) && /^[A-Za-z]+$/.test(data[3])) {
                checking(data, k)
        }
        else{
            wronglines.push(k)
        }
    }
    if (wronglines.length > 0) {
        console.log("Row " + wronglines.toString() + " have(has) wrong data format.");
    }
    // if (existlines.length > 0) {
    //     alert("Row " + existlines.toString() + " already exist(s).");
    // }
    alert("Please reload the page to update the table.");
    adminLog('Upload CSV file');
}

function checking(data, indexRow) {
    firebase.database().ref("users/").orderByChild("devicenumber").equalTo(data[0]).once("value").then(function(snapshot) {
        if (snapshot.exists()){
            console.log('Row ' + indexRow.toString() + ' Device No. exists.')
        }
        else {
            firebase.database().ref("users/").orderByChild("employeeId").equalTo(data[1]).once("value").then(function(snapshot1) {                   
                if (snapshot1.exists()){
                    console.log('Row ' + indexRow.toString() + ' Paycom ID exists.')
                }
                else {
                    field1=data[0]
                    field2=data[1]
                    field3=data[2]
                    field4=data[3]
                    save_user1();
                }
            })
        }
    });
}

function errorHandler(evt) {
if(evt.target.error.name == "NotReadableError") {
    alert("Canno't read file !");
    }
}

// mia code 4 (number only)

function validate(evt) {
    var theEvent = evt || window.event;
  
    // Handle paste
    if (theEvent.type === 'paste') {
        key = event.clipboardData.getData('text/plain');
    } else {
    // Handle key press
        var key = theEvent.keyCode || theEvent.which;
        key = String.fromCharCode(key);
    }
    var regex = /[0-9]|\./;
    if( !regex.test(key) ) {
      theEvent.returnValue = false;
      if(theEvent.preventDefault) theEvent.preventDefault();
    }
  }

function validate1(evt) {
    var theEvent = evt || window.event;
  
    // Handle paste
    if (theEvent.type === 'paste') {
        key = event.clipboardData.getData('text/plain');
    } else {
    // Handle key press
        var key = theEvent.keyCode || theEvent.which;
        key = String.fromCharCode(key);
    }
    var regex = /^[A-Za-z]+$/;
    if( !regex.test(key) ) {
      theEvent.returnValue = false;
      if(theEvent.preventDefault) theEvent.preventDefault();
    }
}
