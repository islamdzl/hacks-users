
const ecp_start_1 = document.getElementById('ecp-start_1') 
const ecp_present_1 = document.getElementById('ecp-present_1') 
const ecp_end_1 = document.getElementById('ecp-end_1') 
const ecp_start_2 = document.getElementById('ecp-start_2') 
const ecp_present_2 = document.getElementById('ecp-present_2') 
const ecp_end_2 = document.getElementById('ecp-end_2') 
var ecp_plat_form_config = {}
var ecp_group_config = {}
var ecp_plat_form = async(data,p)=>{
    let ecp_plat_form_render = ()=>{
        if (ecp_plat_form_config.array.length == 0) {
            ecp_start_1.innerText = ''
            ecp_present_1.innerText = '):'
            ecp_end_1.innerText = ''
        }
        for (let i = 0; i < ecp_plat_form_config.array.length; i++) {
            if (ecp_plat_form_config.array[i] == ecp_plat_form_config.index_m) {
                ecp_plat_form_config.index_s ? ecp_plat_form_config.array[i - 1] ? ecp_start_1.innerText = ecp_plat_form_config.array[i - 1] : ecp_start_1.innerText = ecp_plat_form_config.array[ecp_plat_form_config.array.length -1] : ecp_start_1.innerText = ""
                ecp_plat_form_config.index_m ? ecp_present_1.innerText = ecp_plat_form_config.array[i] : ecp_present_1.innerText = "):"
                ecp_plat_form_config.index_e ? ecp_plat_form_config.array[i + 1] ? ecp_end_1.innerText = ecp_plat_form_config.array[i + 1] : ecp_end_1.innerText = ecp_plat_form_config.array[0] : ecp_end_1.innerText = ""
                return
            }
        }
    }
    if (data) {
        ecp_plat_form_config.array = ['all_users' ,... Object.keys(data.type)]
        let avalable = false
        for (let i = 0; i < ecp_plat_form_config.array.length; i++) {
            if (ecp_plat_form_config.array[i] == ecp_plat_form_config.index_m) {
                ecp_plat_form_config.index_s ? ecp_plat_form_config.array[i - 1] ? ecp_start_1.innerText = ecp_plat_form_config.array[i - 1] : ecp_start_1.innerText = ecp_plat_form_config.array[ecp_plat_form_config.array.length -1] : ecp_start_1.innerText = ""
                ecp_plat_form_config.index_m ? ecp_present_1.innerText = ecp_plat_form_config.array[i] : ecp_present_1.innerText = "):"
                ecp_plat_form_config.index_e ? ecp_plat_form_config.array[i + 1] ? ecp_end_1.innerText = ecp_plat_form_config.array[i + 1] : ecp_end_1.innerText = ecp_plat_form_config.array[0] : ecp_end_1.innerText = ""
                avalable = true
            }
        }
        if (! avalable) {
            ecp_plat_form_config.index_s = ecp_plat_form_config.array[ecp_plat_form_config.array.length - 1]
            ecp_plat_form_config.index_m = ecp_plat_form_config.array[0]
            ecp_plat_form_config.index_e = ecp_plat_form_config.array[1]
        }
        ecp_plat_form_render()
        ecp_start_1.classList.add('ecp-opacity');
        ecp_present_1.classList.add('ecp-opacity');
        ecp_end_1.classList.add('ecp-opacity');
        ecp_plat_form_config.index_m == 'all_users' ? document.getElementById('ecp-group').style.height = "0px" : document.getElementById('ecp-group').style.height = "110px"
        setTimeout(()=>{
            ecp_start_1.classList.remove('ecp-opacity');
            ecp_present_1.classList.remove('ecp-opacity');
            ecp_end_1.classList.remove('ecp-opacity');
            ecp_plat_form_config.index_m == 'all_users' ? ecp_group({}): ecp_group(DATA.type[ecp_plat_form_config.index_m])
        },400)
        return
    }    
    if (p == '+') {
        for (let i = 0; i < ecp_plat_form_config.array.length; i++) { 
            if (ecp_plat_form_config.array[i] == ecp_plat_form_config.index_e) {
                ecp_plat_form_config.index_s = ecp_plat_form_config.index_m
                ecp_plat_form_config.index_m = ecp_plat_form_config.index_e
                ecp_plat_form_config.array[i + 1] ? ecp_plat_form_config.index_e = ecp_plat_form_config.array[i + 1] : ecp_plat_form_config.index_e = ecp_plat_form_config.array[0]
                ecp_plat_form_config.index_m == 'all_users' ? document.getElementById('ecp-group').style.height = "0px" : document.getElementById('ecp-group').style.height = "110px"
                await set_style_to_right(ecp_start_1, ecp_present_1, ecp_end_1)
                ecp_plat_form_render()
                setTimeout(() => {
                    ecp_plat_form_config.index_m == 'all_users' ? ecp_group({}):ecp_group(DATA.type[ecp_plat_form_config.index_m])
                }, 200);
                return
            }            
        }
    }else if (p == '-'){
        for (let i = 0; i < ecp_plat_form_config.array.length; i++) {
            if (ecp_plat_form_config.array[i] == ecp_plat_form_config.index_s) {
                ecp_plat_form_config.index_e = ecp_plat_form_config.index_m
                ecp_plat_form_config.index_m = ecp_plat_form_config.index_s
                ecp_plat_form_config.array[i - 1] ? ecp_plat_form_config.index_s = ecp_plat_form_config.array[i - 1] : ecp_plat_form_config.index_s = ecp_plat_form_config.array[ecp_plat_form_config.array.length -1]
                ecp_plat_form_config.index_m == 'all_users' ? document.getElementById('ecp-group').style.height = "0px" : document.getElementById('ecp-group').style.height = "110px"
                await set_style_to_left(ecp_start_1, ecp_present_1, ecp_end_1)
                ecp_plat_form_render()
                setTimeout(() => {
                    ecp_plat_form_config.index_m == 'all_users' ? ecp_group({}):ecp_group(DATA.type[ecp_plat_form_config.index_m])
                }, 200);
                return
            }
        }
    }
}

var ecp_group = async(data,p)=>{ 
    let ecp_group_render = ()=>{
        if (ecp_group_config.array.length == 0) {
            ecp_start_2.innerText = ''
            ecp_present_2.innerText = '):'
            ecp_end_2.innerText = ''
        }
        for (let i = 0; i < ecp_group_config.array.length; i++) {
            if (ecp_group_config.array[i] == ecp_group_config.index_s) {
                ecp_group_config.index_s ? ecp_group_config.array[i -1] ? ecp_start_2.innerText = ecp_group_config.array[i -1] : ecp_start_2.innerText = ecp_group_config.array[ecp_group_config.array.length -1] : ecp_start_2.innerText = ""
                ecp_group_config.index_m ? ecp_present_2.innerText = ecp_group_config.array[i] : ecp_present_2.innerText = "):"
                ecp_group_config.index_e ? ecp_group_config.array[i + 1] ? ecp_end_2.innerText = ecp_group_config.array[i + 1] : ecp_end_2.innerText = ecp_group_config.array[0] : ecp_end_2.innerText = ""
                return
            }
        }
    }
    if (data) {
        ecp_group_config.array = Object.keys(data)
        let available = false
        for (let i = 0; i < ecp_group_config.array.length; i++) {
            if (ecp_group_config.array[i] == ecp_group_config.index_s) {
                ecp_group_config.index_s ? ecp_group_config.array[i -1] ? ecp_start_2.innerText = ecp_group_config.array[i -1] : ecp_start_2.innerText = ecp_group_config.array[ecp_group_config.array.length -1] : ecp_start_2.innerText = ""
                ecp_group_config.index_m ? ecp_present_2.innerText = ecp_group_config.array[i] : ecp_present_2.innerText = "):"
                ecp_group_config.index_e ? ecp_group_config.array[i + 1] ? ecp_end_2.innerText = ecp_group_config.array[i + 1] : ecp_end_2.innerText = ecp_group_config.array[0] : ecp_end_2.innerText = ""
                available = true
            }
        }
        if (! available) {
            ecp_group_config.index_s = ecp_group_config.array[ecp_group_config.array.length - 1]
            ecp_group_config.index_m = ecp_group_config.array[0]
            ecp_group_config.index_e = ecp_group_config.array[1]
        }
        ecp_group_render()
        ecp_start_2.classList.add('ecp-opacity');
        ecp_present_2.classList.add('ecp-opacity');
        ecp_end_2.classList.add('ecp-opacity');
        setTimeout(()=>{
            ecp_start_2.classList.remove('ecp-opacity');
            ecp_present_2.classList.remove('ecp-opacity');
            ecp_end_2.classList.remove('ecp-opacity');
        },400)
    }    
    if (p == '+') {
        for (let i = 0; i < ecp_group_config.array.length; i++) { 
            if (ecp_group_config.array[i] == ecp_group_config.index_e) {
                ecp_group_config.index_s = ecp_group_config.index_m
                ecp_group_config.index_m = ecp_group_config.index_e
                ecp_group_config.array[i + 1] ? ecp_group_config.index_e = ecp_group_config.array[i + 1] : ecp_group_config.index_e = ecp_group_config.array[0]
                await set_style_to_right(ecp_start_2, ecp_present_2, ecp_end_2)
                ecp_group_render()
                ecp_plat_form_config.index_m == 'all_users' ? render_users(Object.values(DATA.all_users ? DATA.all_users : {})) : render_users(Object.values(DATA.type[ecp_plat_form_config.index_m][ecp_group_config.index_s] ? DATA.type[ecp_plat_form_config.index_m][ecp_group_config.index_s] : {}))
                return
            }            
        }
    }else if (p == '-'){
        for (let i = 0; i < ecp_group_config.array.length; i++) {
            if (ecp_group_config.array[i] == ecp_group_config.index_s) {
                ecp_group_config.index_e = ecp_group_config.index_m
                ecp_group_config.index_m = ecp_group_config.index_s
                ecp_group_config.array[i - 1] ? ecp_group_config.index_s = ecp_group_config.array[i - 1] : ecp_group_config.index_s = ecp_group_config.array[ecp_group_config.array.length -1]
                await set_style_to_left(ecp_start_2, ecp_present_2, ecp_end_2)
                ecp_group_render()
                ecp_plat_form_config.index_m == 'all_users' ? render_users(Object.values(DATA.all_users ? DATA.all_users : {})) : render_users(Object.values(DATA.type[ecp_plat_form_config.index_m][ecp_group_config.index_s] ? DATA.type[ecp_plat_form_config.index_m][ecp_group_config.index_s] : {}))
                return
            }
        }
    }
    ecp_plat_form_config.index_m == 'all_users' ? render_users(Object.values(DATA.all_users ? DATA.all_users : {})) : render_users(Object.values(DATA.type[ecp_plat_form_config.index_m][ecp_group_config.index_s] ? DATA.type[ecp_plat_form_config.index_m][ecp_group_config.index_s] : {}))
}


var set_style_to_right = async(s, m, e)=>{
    s.classList.add('to_right_s');
    m.classList.add('to_right_m');
    e.classList.add('to_right_e');
    await new Promise((resolve)=>{
        setTimeout(() => {
            resolve(true)
            s.classList.remove('to_right_s');
            m.classList.remove('to_right_m');
            e.classList.remove('to_right_e');
            s.classList.add('ecp-opacity');
            m.classList.add('ecp-opacity');
            e.classList.add('ecp-opacity');
            setTimeout(()=>{
            s.classList.remove('ecp-opacity');
            m.classList.remove('ecp-opacity');
            e.classList.remove('ecp-opacity');
            },400)
        }, 700);
    })

}
var set_style_to_left = async(s, m, e)=>{
    s.classList.add('to_left_s');
    m.classList.add('to_left_m');
    e.classList.add('to_left_e');
    await new Promise((resolve)=>{
        setTimeout(() => {
            resolve(true)
            s.classList.remove('to_left_s');
            m.classList.remove('to_left_m');
            e.classList.remove('to_left_e');
            s.classList.add('ecp-opacity');
            m.classList.add('ecp-opacity');
            e.classList.add('ecp-opacity');
            setTimeout(()=>{
            s.classList.remove('ecp-opacity');
            m.classList.remove('ecp-opacity');
            e.classList.remove('ecp-opacity');
            },400)
        }, 700);
    })
}
console.error = console.info()