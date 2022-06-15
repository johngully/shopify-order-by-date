  // Designed to work on the Product Detail page, but will work on any page with a named field
  function setupStickyField(fieldName, fieldSelector) {
    fieldSelector = fieldSelector ? fieldSelector : `#${fieldName}`;
    const field = $(fieldSelector);

    // Set sticky value
    const value = localStorage.getItem(fieldName);
    if (field.attr("type") === "checkbox") {
      if (value !== null && value !== undefined) {
        field.prop("checked", JSON.parse(value));
      }
    } else {
      field.val(value);
    }

    // Save value changes
    field.on("change", function() {
      const value = $(this).attr("type") === "checkbox" ? $(this).prop("checked") : $(this).val();
      localStorage.setItem(fieldName, value);
    });
  }
