document.addEventListener("DOMContentLoaded", function () {
    const fab = document.getElementById('fab');
    const fabMenu = document.getElementById('fabMenu');

    fab.addEventListener('click', function () {
      fabMenu.classList.toggle('show');
      fab.classList.toggle('rotate');
    });

    document.addEventListener('click', function (e) {
      if (!fab.contains(e.target) && !fabMenu.contains(e.target)) {
        fabMenu.classList.remove('show');
      }
    });

// ambil data
fetch("http://127.0.0.1:8000/api/home",{
    method: "GET",
    headers:{ 
        "Content-Type" : "application/json",
        "authorization": "Bearer " + localStorage.getItem("token")}
})
.then(response => {
    if(!response.ok){
        throw new error("gagal ambil data dari api")
    }
    return response.json()
})
.then(data => {
    console.log("data api " + JSON.stringify(data, null, 0))
})
.catch(error => {
    console.error("Error:", error.message);
});

});