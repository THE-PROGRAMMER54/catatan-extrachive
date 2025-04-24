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

const loadinguser = document.getElementById("borderloadinguser")
const loadingpass = document.getElementById("borderloadingpass")
const loadingdelete = document.getElementById("borderloadingdelete")
const edituser = document.getElementById("edituser")
const editpass = document.getElementById("editpass")
const deleteuser = document.getElementById("deleteuser")
loadinguser.style.display = "none";
loadingpass.style.display = "none";
loadingdelete.style.display = "none";
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
  

  async function ubahNameEmail(e) {
    e.preventDefault()
    edituser.style.display = "none"
    loadinguser.style.display = "flex"
    await fetch(`http://127.0.0.1:8000/api/edituser`,{
      method:"POST",
      credentials:"include",
      headers:{'Content-Type': "application/json"},
      body: JSON.stringify({
        name: document.getElementById("username").value,
        email: document.getElementById("email").value
      })
    })
    .then(async (response) => {
      data = await response.json()
      if(!response){
        throw new Error("gagal mengganti username dan password anda " + data);
      }
      alert(data.success)
    })
    .catch((error) => {
      console.log(error.message)
    })
    .finally(() => {
      edituser.style.display = "block"
      loadinguser.style.display = "none"
    })
  }
  
  async function ubahPassword(e) {
    e.preventDefault();
    editpass.style.display = "none"
    loadingpass.style.display = "flex"
    await fetch("http://127.0.0.1:8000/api/ubahpassword", {
      method: "POST",
      credentials: 'include',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        password: document.getElementById("password").value,
        new_password: document.getElementById("new_password").value,
        confirm_password: document.getElementById("confirm_password").value
      })
    }).then(async (response) => {
      const data = await response.json();
      if (!response.ok) {
      return alert(data.error);
      }
      alert("berhasil mengganti password anda");
      window.location.reload()
    }).catch((error) => {
      console.log(error.error);
    })
    .finally(() => {
      editpass.style.display = "block"
      loadingpass.style.display = "none"
    })
  }
  
  async function hapusakun(e) {
    e.preventDefault()
    const konfirmasi = confirm('Apakah Anda yakin akan menghapus akun Anda?')
    if(!konfirmasi) return
    await fetch("http://127.0.0.1:8000/api/hapususer",{
      method:"POST",
      headers:{"Content-Type" : "application/json"},
      credentials:"include"
    }).then(async (response) => {
      const data = await response.json();
      if (!response.ok) {
      return alert("Gagal menghapus akun anda: " + data.message);
      }
      alert("berhasil menghapus akun anda");
      window.location.reload()
    }).catch((error) => {
      console.log(error.message);
    })
  }