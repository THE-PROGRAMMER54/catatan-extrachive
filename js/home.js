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
    
        res && res.data.map(data => {
          const card = `
            <div class="note-card">
              <div class="note-card-header">
                <h3>${data.judul}</h3>
                <div class="menu-wrapper">
                  <button class="menu-toggle" data-id="${data.id}">⋮</button>
                  <div class="note-menu">
                    <button onclick="Edit(${data.id})">Edit</button>
                    <button >Hapus</button>
                  </div>
                </div>
              </div>
              <p>${data.catatan}</p>
            </div>
          `;
          note.push(card);
        });

        listNote.innerHTML = note.join("");

        if(res.data <= 0){
            listNote.style.display = "none"
        }else{
            listNote.style.display = "block"
        }
    
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
  });
  
  // tambah data
  async function addcatatan(e){
    e.preventDefault();
    await fetch("http://127.0.0.1:8000/api/addcatatan",{
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
        alert("Data berhasil di simpan")
        location.reload();
    }).catch(error => {
        console.error("Error:", error.message);
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
      console.log(res);
      document.getElementById("judul").value = res.judul
      document.getElementById("catatan").value = res.catatan
      localStorage.setItem("editJudul",res.judul)
      localStorage.setItem("editCatatan",res.catatan)
    })
  }