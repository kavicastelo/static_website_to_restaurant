let users = [];
let tempUsers = JSON.parse(localStorage.getItem('users'));
if(tempUsers!=null){
    users=tempUsers;
}
function User(username,email,type,avatar,password){
    this.username = username;
    this.email = email;
    this.type = type;
    this.avatar = avatar;
    this.password = password;
}
const registerUser=()=>{
    let tempPassword = $('#password').val().toString().trim();
    let encryptedPWD = CryptoJS.AES.encrypt(tempPassword,'infinity');
    let user = new User(
        $('#username').val().toString().trim(),
        $('#email').val().toString().trim(),
        $('#type').val(),
        "",
        encryptedPWD.toString()
    )
    if(!isAlreadyExists(user.username)){
        users.push(user)
        localStorage.setItem("users",JSON.stringify(users));
    }
    else{
        alert('This user is already exists');
    }
}

const isAlreadyExists=(name)=>{
    for(const temp of users){
        if(temp.username === name){
            return true;
        }
    }
    return false;
}