document.addEventListener("DOMContentLoaded",function(){
    if(document.getElementById("regist")){
        const borderloading = document.getElementById("borderloading");
        const btnsubmit = document.getElementById("btnsubmit");
        borderloading.style.display = "none";

        document.getElementById("regist").addEventListener("submit",function(e){
            e.preventDefault();
            borderloading.style.display = "flex";
            btnsubmit.style.display = "none";

            setTimeout(() => {
                const name = document.getElementById("name").value;
                const email = document.getElementById("email").value;
                const password = document.getElementById("password").value;
                const confirm_password = document.getElementById("confirm_password").value;

                if (confirm_password != password) {
                    alert("Konfirmasi password tidak cocok!");
                    borderloading.style.display = "none";
                    btnsubmit.style.display = "block";
                    return;
                }

                fetch("http://127.0.0.1:8000/api/regist", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: name,
                        email: email,
                        password: password,
                        confirm_password: confirm_password
                    })
                })
                    .then(response => response.json())
                    .then(data => {
                        console.log("Respon dari API:", data);
                        alert("Registrasi berhasil!");
                        window.location.href = "index.html";
                    })
                    .catch(error => {
                        console.error("Terjadi error:", error);
                        alert("Terjadi kesalahan saat registrasi.");
                    })
                    .finally(() => {
                        borderloading.style.display = "none";
                        btnsubmit.style.display = "block";
                    });
            }, 3000);
        });
    }

    if (document.getElementById("login")) {
        const borderloading = document.getElementById("borderloading");
        const btnsubmit = document.getElementById("btnsubmit");
        borderloading.style.display = "none";
    
        document.getElementById("login").addEventListener("submit", function(e) {
            e.preventDefault();
    
            borderloading.style.display = "flex";
            btnsubmit.style.display = "none";
    
            setTimeout(() => {
                const email = document.getElementById("email").value;
                const password = document.getElementById("password").value;
    
                fetch("http://127.0.0.1:8000/api/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                })
                .then(response => {
                    if (!response.ok) {
                        return response.json().then(errorData => {
                            const errorMessage = errorData.message || "Login failed";
                            throw new Error(errorMessage);
                        });
                    }
                    return response.json();
                })
                .then(data => {
                    console.log("Respon dari API:", data);
                    if (data.token) {
                        localStorage.setItem("token", data.token);
                        alert("Login berhasil!");
                        window.location.href = "home.html";
                    } else {
                        alert("Login gagal, token tidak ada.");
                    }
                })
                .catch(error => {
                    console.log("Gagal Login:", error);
                    alert("Gagal login: " + error.message);
                })
                .finally(() => {
                    borderloading.style.display = "none";
                    btnsubmit.style.display = "block";
                });
    
            }, 3000);
        });
    }
    
})