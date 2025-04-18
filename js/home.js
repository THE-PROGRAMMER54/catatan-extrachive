document.addEventListener("DOMContentLoaded",async function () {
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
    async function getdata() {
      await fetch("http://127.0.0.1:8000/api/home", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "authorization": "Bearer " + localStorage.getItem("token")
        }
      })
      .then(async response => {
        if (!response.ok) {
          throw new Error("Gagal ambil data dari API");
        }
    
        const res = await response.json();
        const listNote = document.querySelector(".note-list");
        const note = [];
    
        if(res.data != 0){
          res && res.data.map(data => {
            const card = `
              <div class="note-card">
                <div class="note-card-header">
                  <h3>${data.judul}</h3>
                  <div class="menu-wrapper">
                    <button class="menu-toggle" data-id="${data.id}">⋮</button>
                    <div class="note-menu">
                      <button onclick="Edit(${data.id})">Edit</button>
                      <button onclick="hapus(${data.id})">Hapus</button>
                    </div>
                  </div>
                </div>
                <p>${data.catatan}</p>
              </div>`
            note.push(card);
          });
        }else{
          const card = `
          <div class="note-card">
           <p style="text-align: center; justify-content: center; display: flex; color: rgb(137, 135, 135);">Tidak Ada Catatan</p>
          </div>`
          note.push(card);
        }

        listNote.innerHTML = note.join("");
    
        document.querySelectorAll(".menu-toggle").forEach(toggle => {
          toggle.addEventListener("click", function (e) {
            e.stopPropagation();
            const menu = this.nextElementSibling;
            menu.classList.toggle("show");
    
            document.querySelectorAll(".note-menu").forEach(m => {
              if (m !== menu) m.classList.remove("show");
            });
          });
        });
    
        document.addEventListener("click", function () {
          document.querySelectorAll(".note-menu").forEach(menu => {
            menu.classList.remove("show");
          });
        });
    
      })
      .catch(error => {
        console.error("Error:", error.message);
      });
    }
    getdata();
    const id = localStorage.getItem("id_catatan")
    const judul = localStorage.getItem("editJudul")
    const catatan = localStorage.getItem("editCatatan")
    document.getElementById("id_catatan").value = id
    document.getElementById("judul").value = judul
    document.getElementById("catatan").value = catatan
    const btn = document.getElementById("btn")
    
    if (id) {
      isiBtn = `
        <button type="submit" class="edit">Simpan</button>
        <button type="button" class="batal">Batalkan</button>
      `;
    } else {
      isiBtn = `<button class="tambah" type="submit">Tambah</button>`;
    }
    
    btn.innerHTML = isiBtn;

    const header = document.querySelector("#header")
    if(id){
      header.textContent = "Edit Catatan"
    }else{
      header.textContent = "Tambah Catatan"
    }

    const resetButton = document.querySelector(".batal");
    if (resetButton) {
      resetButton.addEventListener("click", function () {
        reset();
      });
    }
    
  });
  
  // tambah data
  async function addcatatan(e){
    e.preventDefault();
    const id = document.getElementById("id_catatan").value
    url = "";
    if(id !== ""){
      url = `http://127.0.0.1:8000/api/editcatatan/${id}`
    }else{
      url = "http://127.0.0.1:8000/api/addcatatan"
    }

    await fetch(url,{
      method: 'POST',
      headers:{
        'Content-Type' : 'application/json',
        'authorization' : 'bearer ' + localStorage.getItem("token")
      },
      body: JSON.stringify({
        judul : document.getElementById("judul").value,
        catatan : document.getElementById("catatan").value
      })
    }).then(async response => {
        data = await response.json()
        if(!response.ok){
            throw new Error("Gagal mengirim data " + data.message);
        }
        console.log('Catatan berhasil disimpan:', data);
        
        if(id !== ""){
          alert("Berhasil Mengedit Data");
        }else{
          alert("Berhasil Menambahkan Data");
        }
        
        location.reload();
    }).catch(error => {
        console.error("Error: ",error.message);
    })
  }

  // ambil data berdasarkan id untuk di edit
  async function Edit(id){
    await fetch(`http://127.0.0.1:8000/api/geteditcatatan/${id}`,{
      method: 'POST',
      headers:{
        'Content-Type' : 'application/json',
        'authorization' : `bearer ${localStorage.getItem("token")}`
      },
      body: {
        id: id
      }
    }).then(async jawa => {
      const res = await jawa.json()
      localStorage.setItem("editJudul",res.judul)
      localStorage.setItem("editCatatan",res.catatan)
      localStorage.setItem("id_catatan",res.id)
      location.reload();
    })
  }

  function reset() {
    localStorage.removeItem("id_catatan");
    localStorage.removeItem("editJudul");
    localStorage.removeItem("editCatatan");
  
    document.getElementById("id_catatan").value = "";
    document.getElementById("judul").value = "";
    document.getElementById("catatan").value = "";
  
    const btn = document.getElementById("btn");
    btn.innerHTML = `<button type="submit">Tambah</button>`;
    location.reload();
  }
  
  async function hapus(id) {
    await fetch(`http://127.0.0.1:8000/api/hapuscatatan/${id}`,{
      method: 'POST',
      headers:{
        'Content-Type' : 'application/json',
        'authorization' : `bearer ${localStorage.getItem("token")}`
      },
      body: {
        id: id
      }
  }).then(async response => {
    data = await response.json()
    if(!response.ok){
        throw new Error("Gagal mengirim data " + data.message);
    }
    console.log('Catatan berhasil dihapus:', data);
    localStorage.removeItem("id_catatan");
    localStorage.removeItem("editJudul");
    localStorage.removeItem("editCatatan");
    alert("Berhasil menghapus Data");
    location.reload();
}).catch(error => {
    console.error("Error: ",error.message);
})
}