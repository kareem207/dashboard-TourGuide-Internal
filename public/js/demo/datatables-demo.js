// Call the dataTables jQuery plugin
$(document).ready(function() {
  $('#dataTableAllUsers').DataTable({

  });
});


// Call the dataTables jQuery plugin
$(document).ready(function() {
  var table = $('#dataTableComingUsers').DataTable();
  table
      .column( '3:visible' )
      .order( 'asc' )
      .draw();
});

$(document).ready(function() {
  var table = $('#unPaidK').DataTable();
  table
      .column( '2:visible' )
      .order( 'asc' )
      .draw();
});


