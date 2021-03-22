const fs = require("fs");

var dir = process.cwd() + "/";

function Create(name) {
    if(!fs.existsSync(dir + name + "/")){
        fs.mkdir(dir + name + "/",function(err){
            if(err) console.log(err);
        });
    }
    fs.readdir(dir + "NONE/",(err,files) => {
        if(err) console.log(err);
        for(let i in files){
            if(!fs.existsSync(dir + name + "/" + files[i])){
                fs.readFile(dir + "NONE/" + files[i],(err,data) => {
                    if(err) console.log(err);
                    fs.writeFile(dir + name + "/" + files[i],data,(err) => {
                        if(err) console.log(err);
                    });
                });
            }
        }
        console.log(files.length + " files moved.");
    });
}

if(fs.existsSync(dir + "materials.json")){
    fs.readFile(dir + "materials.json",function(err,data){
        if(err) console.log(err);
        var materials = JSON.parse(data);
        for(let name in materials){
            Create(name.toUpperCase());
        }
    });
}