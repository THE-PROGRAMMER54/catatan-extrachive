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