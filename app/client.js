const form = document.querySelector("#add-product");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  console.log("formdata", formData);
});
