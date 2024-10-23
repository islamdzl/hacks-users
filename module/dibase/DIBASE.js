const Web_Socket = require('ws')
class DIBASE {
    constructor(url ,user_data){
        this.url = url
        this.user_data = user_data
        this.base = {}
        this.cach_message
        this.log = (P, message)=>{
            console[P]('DIBASE :',message)
        }
        this.socket = new Web_Socket(url)
            this.socket.onerror = (err)=>{
                this.log('error','Error connecting on server DIBASE')
                return
            }
        this.socket.onopen = ()=>{
            this.socket.send(JSON.stringify({
                data_base:{
                set_domain:{
                    id:this.user_data.id,
                    domains:this.user_data.domains
                }
            }}))
            user_data.domains.forEach(({name, password})=>{
                this.socket.send(JSON.stringify({
                    data_base:{
                        get:{
                            password:password,
                            name:name,
                        }
                    }
                }))
            })
            this.log('log','Open Data Base Server!')
            this.onconnect()
        }
        this.socket.onmessage = async(message)=>{
            const data = JSON.parse(message.data)
            this.cach_message = data
            // console.log(">> message : ",JSON.stringify(data))
            if (data.data_base) {
                switch (true) {
                    case (typeof data.data_base.get != "undefined"):
                        if (data.data_base.get.path) {
                            let beforedata = this.base[data.data_base.get.name].data
                            let newdata = data.data_base.get.clear_end ? this.ECObject(data.data_base.get.path,this.base[data.data_base.get.name].data, data.data_base.get.data):this.EAObject(data.data_base.get.path,this.base[data.data_base.get.name].data, data.data_base.get.data)
                            this.base[data.data_base.get.name].data = newdata
                            if (! this.base[data.data_base.get.name].load) {
                                this.base[data.data_base.get.name].onload(newdata)
                                this.base[data.data_base.get.name].load = true
                            }
                            this.base[data.data_base.get.name].onchange({dataA:beforedata, dataB:newdata})
                            return
                        }
                        let beforedata = await this.base[data.data_base.get.name].data
                        this.base[data.data_base.get.name].data = data.data_base.get.data
                        if (! this.base[data.data_base.get.name].load) {
                            this.log('info',`Open base : ${data.data_base.get.name}!`)
                            this.base[data.data_base.get.name].onload(data.data_base.get.data)
                            this.base[data.data_base.get.name].load = true
                        }else{
                            this.base[data.data_base.get.name].onchange({dataA:beforedata, dataB:data.data_base.get.data})
                        }
                        break;
                        default:
                            break;
                        }
                    }
                    if (data.data_base) {
                        if (data.data_base.not_base) {
                            this.log('error',`Not data base name : ${data.data_base.not_base}\n        Difficulty in communication/access`)
                            this.base[data.data_base.not_base].onerror({ base_not_access : true })
                        }
                    }
                    if (data.type == 'server' && !data.login) {
                        this.log('error',`Error in server password!`)
                    }
        }
        this.user_data.domains.forEach(({name, password}) => {
            this.base[name] = {
                load:false,
                data:{},
                set:async (data, path, clear_end)=>{
                    if (path) {
                        this.socket.send(JSON.stringify({
                            data_base:{
                                set:{
                                    data_base:name,
                                    data,
                                    path,
                                    clear_end
                                }
                            }
                        }))
                        let ED = clear_end ? this.ECObject(path, this.base[name].data, data): this.EAObject(path, this.base[name].data, data)
                        this.base[name].onchange({dataA:this.base[name].data, dataB:ED})
                        this.base[name].data = ED
                        return
                    }
                    this.socket.send(JSON.stringify({
                        data_base:{
                            set:{
                                data_base:name,
                                data
                            }
                        }
                    }))
                    // console.log('sended')
                },
                get:async(path)=>{
                    let password
                    this.user_data.domains.forEach((base)=>{
                        if (base.name == name) {
                            password = base.password
                            return
                        }
                    })
                    this.socket.send(JSON.stringify({
                        data_base:{
                            get:{
                                password:password,
                                name:name,
                                path:path
                            }
                        }
                    }))
                },
                clear:(t)=>{
                    if (! t) {
                        return
                    }
                    this.socket.send(JSON.stringify({
                        data_base:{
                            set:{
                                data_base:name,
                                data:{},
                            }
                        }
                    }))
                },
                creat_path:async(path, clear_end)=>{
                    this.socket.send(JSON.stringify({
                        data_base:{
                            set:{ 
                                data_base:name,
                                setpath:path,
                                clear_end
                            }
                        }
                    }))
                    let new_data = await this.CPath(this.base[name].data, path, clear_end)
                    this.base[name].onchange({dataA:this.base[name].data, dataB:new_data})
                    this.base[name].data = new_data 
                },
                change:()=>{
                    this.base[name].onchange({dataA:{},dataB:this.base[name].data})
                },
                onload:()=>{},
                onchange:()=>{},
                onerror:()=>{}
            }
        });
        

    }
    onconnect (){}
    object_to_arrey(object) {
        return {keys:new Object.keys(object), values: new Object.values(object)}
    }
    creat_data_base(password, data){
        this.socket.send(JSON.stringify({
            data_base:{
                admins_server:{
                    no_admin:true,
                    password:password,
                    exec:{
                        create_base : { 
                            password:data.password, 
                            read_password:data.read_password, 
                            name:data.name
                        }
                    }
                }
            }
        }))
        let torf = new  Promise(async(resolve)=>{
            for (let i = 0; i < 50; i++) {
                await new Promise((R)=>setTimeout(() => {R(true)}, 100))  

                if (this.cach_message) {
                    if (this.cach_message.creat_base) {
                        this.socket.send(JSON.stringify({
                            data_base:{
                            set_domain:{
                                id:this.user_data.id,
                                domains:this.user_data.domains
                            }
                        }}))
                        setTimeout(async() => {
                            await this.base[this.cach_message.creat_base].get()
                            resolve(true)
                        }, 1000);
                        return
                    } 
                }
                if (this.cach_message.login == false) {
                    resolve(false) 
                    return
                }
            }
            resolve(false)
        })   
        return torf
    }
    ECObject(arr, dataA, dataB) {
        let current = dataA;
        for (let i = 0; i < arr.length - 1; i++) {
            const key = arr[i];
            if (typeof current[key] !== 'object' || current[key] === null) {
                current[key] = typeof arr[i + 1] === 'number' ? [] : {};
            }
            current = current[key];
        }
        const lastKey = arr[arr.length - 1];
        if (typeof lastKey === 'number') {
            current[lastKey] = [dataB];
        } else {
            current[lastKey] = dataB;
        }
        return dataA;
    }
    EAObject(arr, dataA, dataB) {
        let current = dataA;
        for (let i = 0; i < arr.length - 1; i++) {
            const key = arr[i];
            if (typeof current[key] !== 'object' || current[key] === null) {
                current[key] = typeof arr[i + 1] === 'number' ? [] : {};
            }
            current = current[key];
        }
        const lastKey = arr[arr.length - 1];
        if (typeof current[lastKey] === 'object' && current[lastKey] !== null) {
            current[lastKey] = Object.assign(current[lastKey], dataB);
        } else {
            current[lastKey] = dataB;
        }
        return dataA;
    }
    CPath(data, path, clear_end) {
        path.reduce((acc, key, index) => {
            if (index === path.length - 1) {
                acc[key] = clear_end ? {} : (acc[key] || {});
            } else {
                acc[key] = acc[key] || {};
            }
            return acc[key];
        }, data);
        return data;
    };
    GTPath(data, path){
        if (!this.IPath(data, path)) {
            return
        }
        path.forEach((p)=>{
            data = data[p]
        })
        return data
    }
    IPath(data, path){
        for (let i = 0; i < path.length; i++) { 
            if (! data[path[i]]) {
                return false
            }
            data = data[path[i]]
        }
        return true
    }
    help(bool){
        const info = `
        |===============|
        |MODULE > DIBASE|
        |=================> General <===================|
        |   - VERSION  :   1.1.0         BETA           |
        |   - OWNER    :   islamdzl                     |
        |   - DEVLOPER :   islamdzl                     |
        |   - SOURSE   :   closed                       |
        |   - GITHUB   :   https://github.com/islamdzl  |
        |=================> Object Base <=======================================|
        |.get( path )                    |=> return data                        |
        |.set(data,||path,||clear_end)   |=> onchange({ dataA , dataB })        |
        |.creat_path(data,path,clear end)|=> return new data                    |
        |.clear ( true/false )           |=> clear all data on data base        |
        |.change()                       |=> onchange({ {   } , dataB })        |
        |.load      =  false/true        |=> onload( data ) false && on get data|
        |.data      = data for database  |=> {}   type : Objec/JSON             |
        |-----------------------------------------------------------------------|
        |path : ["path", "to", "set", "data"]|[ 0 ]  |=> path to location data  |
        |data : {  example : "islamdzl"}             |=> yor data object        |
        |clear_end  : true/false                     |=> to clear end object    |
        |-----------------------------------------------------------------------|
        |.onload   : Function > ( data )                                        |
        |.onchange : Function > ({ dataA:data_before, dataB:data_aftter })      |
        |.onerror  : Function > ("message error")                               |
        |================> Function Tasks <==================================================================|
        | creat_data_base('server password ',{ name, password, read_password })     >>> return  true/false   |
        | object_to_arrey( { } ) > return keys and values arrey                     >>> return {keys,values} |
        | EAObject( path , dataA , dataB ) > Edite dataA to dataB in path           >>> return { new data }  |
        | CPath( data , path , clear_end ) > Creat path on object  | clear_end      >>> return { new data }  |
        | GTPath(data , path )             > Go to locatin path                     >>> return { yor data }  |
        | IPath( data , path )             > Check in path on data                  >>> return true/false    |
        | help( true/false )               > Return this info|if true print console >>> return  string       |
        |====================================================================================================|
        `
        if (bool) {
            this.log('info',info)
            return
        }
        return info
    }
}
module.exports = DIBASE