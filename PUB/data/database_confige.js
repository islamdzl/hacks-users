const delet_user = (path)=>{
    console.log(path)
    socket.send(JSON.stringify({
        delete_user:path
    }))
}
const clear_database = ()=>{
    socket.send(JSON.stringify({
        clear_database:true
    }))
}