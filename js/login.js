const login=()=>{
    let users = [];
    let tempUsers = JSON.parse(localStorage.getItem('users'));
    if(tempUsers!=null){
        users=tempUsers;
    }
    const username = $('#username').val().toString().trim();
    const pass = $('#password').val().toString().trim();
    for(const temp of users){
        if(temp.username===username){
            let decryptedPWD = CryptoJS.AES.decrypt(temp.password,'infinity')
                .toString(CryptoJS.enc.Utf8);
            if(pass===decryptedPWD){
                window.location.replace('./dashBoard.html');
                return;
            }
            else{
                alert('Incorrect Password');
                return;
            }
        }
    }
    alert('incorrect username');
}