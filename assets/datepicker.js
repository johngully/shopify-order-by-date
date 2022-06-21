function setupDatePicker(options) {
// options: {
//   defaultDate: "2022-12-31" // default value
//   allowedDates: []          // specific days allowed (other days disabled)
//   leadDays: 1               // days after today (prior days disabled)
// }
  const defaultDate = moment(options.defaultDate).format("MM/DD/YYYY") || "";
  const leadDays = options.leadDays || 1;
  const allowedDates = options.allowedDates || [];

  const dateContainer = $(".datepicker");
  const dateInput = $(".datepicker input");

  // Create the date picker
  dateContainer.datepicker({
    inline: true,
    defaultDate: defaultDate,
    altField: ".datepicker input",
    beforeShowDay: (date) => {
      // Date must obey lead time requirements
      let leadTime = true;
      if (leadDays) {
        const leadTimeDate = new Date(Date.now() + (leadDays-1) * 86400000);
        leadTime = date > leadTimeDate;
      }

      // Only show dates that are in the list of "allowedDates"
      let specificDates = true;
      if (allowedDates.length) {
        const dateString = moment(date).format("YYYY-MM-DD");
        specificDates = allowedDates.includes(dateString)
      }
      
      return [ leadTime && specificDates ]
    },
    onSelect: () => { datePicker.hide(); }
                            });
  const datePicker = $(".ui-datepicker");

  // Since the pop-over is used, do not display the datepicker until it is clicked
  datePicker.hide();

  // When the input is clicked, display the pop-over
  dateInput.on("click touchstart", function () { 
    dateInput.attr("readonly", true); // set the input to readonly if the user attempts to enter a value
    datePicker.show();
  });

  // The date picker should use the default date, but the input should be initialized with an empty date
  //dateContainer.datepicker("setDate", defaultDate);
  dateInput.val(defaultDate);
  dateInput.attr("readonly", true);

  // Sync text changes with the datepicker
  dateInput.change(function () { 
    dateContainer.datepicker("setDate", $(this).val()); 
  });

  // Close the datepicker when click elsewhere
  $(document).on('mouseup touchstart', function(e) {
    var isDateInput = dateInput.is(e.target);
    var isDatePicker = datePicker.is(e.target);
    var isChildOfDatePicker = datePicker.has(e.target).length;

    // If the target of the click isn't the text input, the date picker, or a descendant of the date picker
    if (!isDateInput && !isDatePicker && !isChildOfDatePicker) {
      datePicker.hide();
    }
  });

  $(".product-form__buttons button[type=submit]").on("click touchstart", function () {
    dateInput.attr("readonly", false); // Temporarily make the date input editable so that it will be validated       
  });
}

function getDateFromQueryString(key) {
  const dateString = (new URLSearchParams(window.location.search)).get(key)
  let returnDate = "";
  if (dateString) {
    const testDate = new Date(dateString);
    returnDate = isValidDate(testDate) ? dateString : "";      
  }
  return returnDate;
}
  
function isValidDate(value) {
  return value instanceof Date && !isNaN(value);
}

function getProductTags() {
  const productTagsString = $("section[data-product-tags]").data("product-tags");
  const productTags = productTagsString.replace(/,\s*$/, "").split(","); // remove trailing comma, and split into an array
  return productTags;
}

function filterArrayToDates(tags) {
  const dateTags = tags.filter(tag => {
    const dateTag = new Date(tag);
    return isValidDate(dateTag);
  });
  return dateTags;
}