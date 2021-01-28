var clockdatabaseRef = firebase.database().ref('DevicelogDB/');
var usersdatabaseRef = firebase.database().ref('users/');
var table_data='';

// --------------------------Display Data From DB--------------------------------
clockdatabaseRef.once('value', function(snapshot) {
    usersdatabaseRef.on("value",gotData,errData)
    function gotData(data) {
        var qrcodes = data.val();

        snapshot.forEach(function(childSnapshot) {
            temp=[]
            var childData = childSnapshot.val();
            
            if (k = childData.deviceQRcode) {
                if(qrcodes[k] == undefined) {
                    comment = 'User deleted'
                    var employeeFirstname = comment
                    var employeeLastname = comment
                    var employeeId = comment
                    var devicenumber = comment
                }
                else {
                    var employeeFirstname = qrcodes[k].employeeFirstname;
                    var employeeLastname = qrcodes[k].employeeLastname;
                    var employeeId = qrcodes[k].employeeId;
                    var devicenumber = qrcodes[k].devicenumber;
                }
            }
            table_data += '<tr onclick="printRow(this)">'
            table_data += '<td>'
            table_data += document.createTextNode(devicenumber).textContent
            table_data += '</td>'
            table_data += '<td>'
            table_data += document.createTextNode(employeeId).textContent
            table_data += '</td>'
            table_data += '<td>'
            table_data += document.createTextNode(employeeFirstname).textContent
            table_data += '</td>'
            table_data += '<td>'
            table_data += document.createTextNode(employeeLastname).textContent
            table_data += '</td>'
            table_data += '<td>'
            table_data += document.createTextNode(childData.clockindate).textContent
            table_data += '</td>'
            table_data += '<td>'
            table_data += document.createTextNode(childData.clockintime).textContent
            table_data += '</td>'
            table_data += '</tr>'

        });
        $('#table_body').append(table_data)

        $(document).ready(function() {
            $('#tbl_devicelog_list').DataTable({
                "pageLength": 50
            });
        });
    }
    function  errData(error) {
        console.log(error.message, error.code)    
    }
});
// --------------------------Display Data From DB End--------------------------------


function select(el) {
    return document.querySelector(el);
}

function reload_page() {
    window.location.reload();
}

function logout(){
    firebase.auth().signOut();
    window.location.href="index.html";
    // adminLog('Log out');
};


function exportTableToExcel(tableID, filename = ''){
    var downloadLink;
    var dataType = 'application/vnd.ms-excel';
    var tableSelect = document.getElementById(tableID);
    var tableHTML = tableSelect.outerHTML.replace(/ /g, '%20');;

    filename = filename?filename+'.xls':'report_data.xls';

    downloadLink = document.createElement("a");
    document.body.appendChild(downloadLink);
    

    if(navigator.msSaveOrOpenBlob){
        var blob = new Blob(['\ufeff', tableHTML], {
        type: dataType
        });
        navigator.msSaveBlob(blob, filename);
    } 
    else{
        downloadLink.href = 'data:' + dataType + ', ' + tableHTML;
        downloadLink.download = filename;
        downloadLink.click();
    }
    adminLog('Export report table');
} 

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

