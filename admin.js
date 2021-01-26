// To download and display
var databaseRef = firebase.database().ref('AdminLog/');
var table_data='';

// ----------------------Display Data From DB----------------------
databaseRef.once('value', function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
        var childData = childSnapshot.val();

        table_data += '<tr id="row">'
        table_data += '<td>'
        table_data += document.createTextNode(childData.DateTime).textContent
        table_data += '</td>'
        table_data += '<td>'
        table_data += document.createTextNode(childData.UserEmail).textContent
        table_data += '</td>'
        table_data += '<td>'
        table_data += document.createTextNode(childData.Action).textContent
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


function select(el) {
    return document.querySelector(el);
}

function reload_page() {
    window.location.reload();
}

function logout(){
    adminLog('Log out');
    firebase.auth().signOut();
    window.location.href="index.html";
};



function exportTableToExcel(tableID, filename = ''){
    var downloadLink;
    var dataType = 'application/vnd.ms-excel';
    var tableSelect = document.getElementById(tableID);
    var tableHTML = tableSelect.outerHTML.replace(/ /g, '%20');;

    filename = filename?filename+'.xls':'edit_log.xls';

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
        adminLog('Export admin table');
    }
} 



