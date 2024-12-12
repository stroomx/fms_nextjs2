// nice select

$(document).ready(function () {
  $("select").niceSelect();
});

// Dropdown hover

$(document).ready(function () {
  $(".btn-group").hover(
    function () {
      $(this).addClass("show");
      $(this).find(".dropdown-menu").addClass("show");
    },
    function () {
      $(this).removeClass("show");
      $(this).find(".dropdown-menu").removeClass("show");
    }
  );
});

// donut chart

$(".data-attributes span").peity("donut");


function displayFileName() {
    const fileInput = document.getElementById('fileInput');
    const fileNameDisplay = document.getElementById('fileName');

    // Check if a file is selected
    if (fileInput.files.length > 0) {
        const fileName = fileInput.files[0].name;
        fileNameDisplay.innerText = 'Selected File: ' + fileName;
    } else {
        fileNameDisplay.innerText = 'No files uploaded';
    }
}


