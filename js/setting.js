const checkUser = () => {
    const cname = "token"
    const cookies = document.cookie.split(';')

    for (let cookie of cookies) {
        cookie = cookie.trim()
        if(cookie.indexOf(cname + "=") === 0){
            const res = cookie.split("=")[1]
            if(res === "") document.location.href = "index.html"
            return
        }
    }
    return (document.location.href = "index.html");
}

checkUser()

// get data user
async function dataUser() {
    try {
        const response = await fetch("http://127.0.0.1:8000/api/getedituser",{
            method: "GET",
            credentials:"include",
            headers:{"Content-Type": "application/json"}
        })
        if(!response.ok) {
            throw new Error(`Gagal ambil data dari API`);
        }
        const res = await response.json();
        console.log(res)   
        const username = document.getElementById("username")
        const email = document.getElementById("email")
        username.value = res.name
        email.value = res.email
    } catch (error) {
        console.error("Error:", error.message);
    }
}
dataUser()


// dom agar muncul setelah html di render
document.addEventListener("DOMContentLoaded", async function () {
    const fab = document.getElementById("fab");
    const fabMenu = document.getElementById("fabMenu");
  
    fab.addEventListener("click", function () {
      fabMenu.classList.toggle("show");
      fab.classList.toggle("rotate");
    });
  
    document.addEventListener("click", function (e) {
      if (!fab.contains(e.target) && !fabMenu.contains(e.target)) {
        fabMenu.classList.remove("show");
      }
    });
  
})


async function logout() {
    const yakin = confirm("Apakah Kamu Yakin Ingin Logout?");
    if (!yakin) return;
  
    await fetch(`http://127.0.0.1:8000/api/logout`, {
      method: "POST",
      credentials: 'include',
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          throw new Error("Gagal Logout data " + data.message);
        }
        alert("Berhasil Logout Data");    
        window.location.href = "index.html"
      })
      .catch((error) => {
        console.error("Error: ", error.message);
      });
  }
  