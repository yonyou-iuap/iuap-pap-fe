const fs = require('fs-extra');

const reg = new RegExp(/\/\/design\.yonyoucloud\.com\/static\/iconfont/,'g')

const filePath = './build';
const context = '/iuap-pap-training-fe/';
const ctn = filePath+context


let readDir = fs.readdirSync(ctn);

readDir.forEach(item=>{
    replaceApp(item)
})
replaceVendor();
function replaceVendor(){
    let data = fs.readFileSync(`${ctn}vendors.css`,'utf-8');  
    data = data.replace(reg,`${context}fonts`)
    fs.writeFileSync(`${ctn}vendors.css`, data);  
}

function replaceApp(path){
    fs.pathExists(`${ctn}${path}/app.css`, (err, flag) => {
        if(flag){
            let data = fs.readFileSync(`${ctn}${path}/app.css`,'utf-8');
            data = data.replace(reg,`${context}fonts`);
            fs.writeFileSync(`${ctn}${path}/app.css`,data); 
        }
    })
}