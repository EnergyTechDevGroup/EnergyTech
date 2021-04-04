/// <reference path="material_type.ts"/>

var StoneAll: string[] = ["andesite","diorite","end_stone","granite","netherrack","stone"];

namespace MaterialRegistry {
    let interactionFunctions = [];
    let materials = {};

    export function registerMaterial(name,color: string,type: string,level: number): Material {
        if(!materials[name]){
            materials[name] = new Material(name,color,type,level);
        }
        return materials[name];
    }

    export function getAll(name): number[] {
        var item = [];
        for(let i in materials){
            var element = materials[i].elements[name];
            if(element){
                for(let i in element){
                    item.push(element[i]);
                }
            }
        }
        return item;
    }

    export function addToElement(name: string,type: string,id: number){
        if(materials[name]){
            materials[name].addToElement(type,id);
            return true;
        }
        return false;
    }

    export function registerInteractionFunction(state: Function,type?: string) {
        interactionFunctions.push({func: state,type: (type || "null")});
    }

    export function onInteraction() {
        for(let name in materials) {
            for(let i in interactionFunctions) {
                interactionFunctions[i].func(name,materials[name].elements,(materials[name].data || {}));
            }
        }
    }

    export function onReadLocalMaterial() {
        var Materials = FileTools.ReadJSON(ResDir + "texture-source/materials.json");
        for(let name in Materials){
            var data = Materials[name].data;
        
            // tool material
            if(!Materials[name].noToolData){
                ToolAPI.addToolMaterial(name,data);
            }
        
            // material
            var mate = registerMaterial(name,data.color,data.type,data.level);
            // element
            for(let type in Materials[name].elements){
                var element = Materials[name].elements[type];
                // cover
                if(element.cover){
                    mate.addToElement(type,element.cover);
                    continue;
                }
                // callback
                var int1 = null;
                if(type == "ore"){
                    int1 = (element.stone == "all"?StoneAll:element.stone);
                }
                mate[type](int1);
            }
            Callback.invokeCallback("et-material-translate",name,Materials[name].translate);
        }
    }

    onReadLocalMaterial();
    Callback.addCallback("PreLoaded",() => {
        onInteraction();
    });
}