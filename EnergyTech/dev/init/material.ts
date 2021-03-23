/// <reference path="texture.ts"/>

var StoneAll: string[] = ["andesite","diorite","end_stone","granite","netherrack","stone"];

Recipes.deleteRecipe({id: 268,count: 1,data: 0});
Recipes.deleteRecipe({id: 269,count: 1,data: 0});
Recipes.deleteRecipe({id: 270,count: 1,data: 0});
Recipes.deleteRecipe({id: 271,count: 1,data: 0});
Recipes.deleteRecipe({id: 290,count: 1,data: 0});

Recipes.deleteRecipe({id: 272,count: 1,data: 0});
Recipes.deleteRecipe({id: 273,count: 1,data: 0});
Recipes.deleteRecipe({id: 274,count: 1,data: 0});
Recipes.deleteRecipe({id: 275,count: 1,data: 0});
Recipes.deleteRecipe({id: 291,count: 1,data: 0});

Recipes.deleteRecipe({id: 256,count: 1,data: 0});
Recipes.deleteRecipe({id: 257,count: 1,data: 0});
Recipes.deleteRecipe({id: 258,count: 1,data: 0});
Recipes.deleteRecipe({id: 267,count: 1,data: 0});
Recipes.deleteRecipe({id: 292,count: 1,data: 0});

Recipes.deleteRecipe({id: 283,count: 1,data: 0});
Recipes.deleteRecipe({id: 284,count: 1,data: 0});
Recipes.deleteRecipe({id: 285,count: 1,data: 0});
Recipes.deleteRecipe({id: 286,count: 1,data: 0});
Recipes.deleteRecipe({id: 294,count: 1,data: 0});

Recipes.deleteRecipe({id: 276,count: 1,data: 0});
Recipes.deleteRecipe({id: 277,count: 1,data: 0});
Recipes.deleteRecipe({id: 278,count: 1,data: 0});
Recipes.deleteRecipe({id: 279,count: 1,data: 0});
Recipes.deleteRecipe({id: 293,count: 1,data: 0});

class Material {
    private path: string = __dir__ + "res/";

    private material: string;
    private color: string;
    private itemType: string;
    private level: number;
    
    public addElement(name: string,id: number,isArrow?: boolean) {
        ItemName.registerTooltipAddFunction(id,() => {
            return Translation.translate("Materials") + ": " + name;
        });

        MaterialRegistry.addMaterialElement(this.material.toLowerCase(),name,id,isArrow);
        Item.addCreativeGroup("et_" + name,Translation.translate("Materials"),[id]);
    }

    private _item(type: string,state?: {[key: string]: any}) {
        if(!state) state = {}

        var icon = new TextureBuilder(this.path + "items-opaque/materials/" + type + "/",state.x,state.y);
        var texture = (api,source) => {
            api.draw(source + type,0,0,this.color);
            api.draw(source + type + "_OVERLAY",0,0,null);
            return [[this.material + "_" + type,0]];
        }
        state.texture = state.texture || texture;
        icon.file = state.texture(icon,(this.path + "texture-source/" + this.material.toUpperCase() + "/"));
        icon.write(false);

        state.uid = state.uid || "%s" + toTitleCase(this.material);
        state.name = state.name || "%s " + toTitleCase(type);

        var item = IDRegistry.genItemID(state.uid.replace("%s",type));
        Item.createItem(IDRegistry.getNameByID(item),state.name.replace("%s",toTitleCase(this.material)),{name: icon.file[0][0],meta: icon.file[0][1]},{stack: (state.stack || 64)});

        this.addElement(type,item,state.isArrow);
        return item;
    }

    private _block(type: string,state?: {[key: string]: any},specialType?: Block.SpecialType) {
        if(!state) state = {}

        var icon = new TextureBuilder(this.path + "terrain-atlas/materials/" + type + "/",state.x,state.y);
        var texture = (api,source) => {
            api.draw(source + type,0,0,this.color);
            api.draw(source + type + "_OVERLAY",0,0,null);
            return [[this.material + "_" + type,0]];
        }
        state.texture = state.texture || texture;
        icon.file = state.texture(icon,(this.path + "texture-source/" + this.material.toUpperCase() + "/"));
        icon.write(false);

        state.uid = state.uid || type + "%s";
        state.name = state.name || "%s " + toTitleCase(type);

        var block = IDRegistry.genBlockID(state.uid.replace("%s",toTitleCase(this.material)));
        Block.createBlock(IDRegistry.getNameByID(block),[
            {name: state.name.replace("%s",toTitleCase(this.material)),texture: icon.file,inCreative: true}
        ],specialType);

        ItemName.registerTooltipAddFunction(block,() => {
            return Translation.translate("Level") + ": " + this.level;
        });

        this.addElement(type,block,state.isArrow);
        return block;
    }
    
    public block() {
        let type: string;
        if(this.itemType == "metal"){
            type = "blockMetal";
        }
        if(this.itemType == "gem"){
            type = "blockGem";
        }
        this._block("block",{
            texture: (api,source) => {
                api.draw(source + type,0,0,this.color);
                api.draw(source + type + "_OVERLAY",0,0,null);
                return [[this.material.toLowerCase() + "_block",0]];
            }
        });
    }

    public coil() {
        this._block("coil",{
            texture: (api,source) => {
                var lower = this.material.toLowerCase();

                api.draw(source + "coilBottom",0,0,this.color);
                api.draw(source + "coilBottom_OVERLAY",0,0,null);

                var top = new TextureBuilder(this.path + "terrain-atlas/materials/coil/");
                top.draw(source + "coilTop",0,0,this.color);
                top.draw(source + "coilTop_OVERLAY",0,0,null);
                top.file = [[lower + "_coil_top",0]];
                top.write(false);

                var side = new TextureBuilder(this.path + "terrain-atlas/materials/coil/");
                side.draw(source + "coilSide",0,0,this.color);
                side.draw(source + "coilSide_OVERLAY",0,0,null);
                side.file = [[lower + "_coil_side",0]];
                side.write(false);

                return [[lower + "_coil_bottom",0],[lower + "_coil_top",0],[lower + "_coil_side",0]];
            }
        });
    }

    public ore(stone) {
        if(!stone) stone = StoneAll;

        let type: string = "ore";
        if(this.itemType == "metal"){
            type = "ore";
        }
        if(this.itemType == "gem"){
            type = "oreGem";
        }

        for(let i in stone){
            var suffix = (stone[i] != "stone"?"_" + stone[i].toLowerCase():"");
            var block = this._block("ore",{
                uid: "ore%s" + suffix,
                name: "%s Ore",
                texture: (api,source) => {
                    for(let count = 0;count <= 3;count++){
                        api.draw(this.path + "terrain-atlas/stone/" + stone[i],0,16*count,null);
                    }
                    api.draw(source + type,0,0,this.color);
                    api.draw(source + type + "_OVERLAY",0,0,null);
                    return [[this.material.toLowerCase() + "_ore" + suffix,0]];
                },
                isArrow: true
            });

            ToolAPI.registerBlockMaterial(block,"stone",this.level,true);
            Block.setDestroyTime(block,3);
        }
    }

    public oreSmall(stone) {
        if(!stone) stone = StoneAll;

        let type: string = "oreSmall";
        if(this.itemType == "metal"){
            type = "oreSmall";
        }
        if(this.itemType == "gem"){
            type = "oreGemSmall";
        }

        for(let i in stone){
            var suffix = (stone[i] != "stone"?"_" + stone[i].toLowerCase():"");
            var block = this._block("oreSmall",{
                uid: "oreSmall%s" + suffix,
                name: "Small %s Ore",
                texture: (api,source) => {
                    for(let count = 0;count <= 3;count++){
                        api.draw(this.path + "terrain-atlas/stone/" + stone[i],0,16*count,null);
                    }
                    api.draw(source + type,0,0,this.color);
                    api.draw(source + type + "_OVERLAY",0,0,null);
                    return [[this.material.toLowerCase() + "_oreSmall" + suffix,0]];
                },
                isArrow: true
            });

            ToolAPI.registerBlockMaterial(block,"stone",Math.max(this.level - 1,1),true);
            Block.setDestroyTime(block,3);
        }
    }

    public dust() {
        this._item("dust");
    }

    public dustImpure() {
        this._item("dustImpure",{
            name: "Impure Pile of %s Dust"
        });
    }

    public dustSmall() {
        this._item("dustSmall",{
            name: "Small Pile of %s Dust"
        });
    }

    public dustTiny() {
        this._item("dustTiny",{
            name: "Tiny Pile of %s Dust"
        });
    }

    public ingot() {
        this._item("ingot");
    }

    public gem() {
        this._item("gem",{
            uid: "%s",
            name: "%s",
            texture:(api,source) => {
                api.draw(source + "gem",0,0,this.color);
                api.draw(source + "gem_OVERLAY",0,0,null);
                return [[this.material.toLowerCase(),0]];
            }
        });
    }

    public nugget() {
        this._item("nugget");
    }
    
    public plate() {
        let type: string;
        if(this.itemType == "metal"){
            type = "plate";
        }
        if(this.itemType == "gem"){
            type = "plateGem";
        }
        this._item("plate",{
            texture: (api,source) => {
                api.draw(source + type,0,0,this.color);
                api.draw(source + type + "_OVERLAY",0,0,null);
                return [[this.material.toLowerCase() + "_plate",0]];
            }
        });
    }

    protected _tool(type: string,state?: {[key: string]: any}) {
        if(!state) state = {};
        state.stack = 1;

        var item = this._item(type,state);
        ToolLib.setTool(item,this.material,state.toolType || {});

        ItemName.registerTooltipAddFunction(item,(item) => {
            var max = Item.getMaxDamage(item.id);
            return Translation.translate("Durability") + ": " + (max +  item.data) + "/" + max;
        });
    }
    
    public hammer() {
        this._tool("hammer",{
            toolType: ToolType.pickaxe
        });
    }

    public sword() {
        this._tool("sword",{
            toolType: ToolType.sword
        });
    }

    public shovel() {
        this._tool("shovel",{
            toolType: ToolType.shovel
        });
    }

    public pickaxe() {
        this._tool("pickaxe",{
            toolType: ToolType.pickaxe
        });
    }

    public axe() {
        this._tool("axe",{
            toolType: ToolType.axe
        });
    }

    public hoe() {
        this._tool("hoe",{
            toolType: ToolType.hoe
        });
    }

    public wrench() {
        this._tool("wrench",{
            toolType(coords,item,block,player) {
                if(MachineRegistry.isMachine(block.id)){
                    World.drop(coords.x,coords.y,coords.z,block.id,1,0);
                    ToolLib.breakCarriedTool(50,player);
                }
            }
        });
    }
    
    public mortar() {
        this._tool("mortar");
    }
    
    public cutter() {
        this._tool("cutter");
    }

    public file() {
        this._tool("file");
    }

    public saw() {
        this._tool("saw",{
            toolType: ToolType.axe
        });
    }

    public screwdriver() {
        this._tool("screwdriver",{
            toolType: {
                useItem(coords,item,block,player) {
                    if(MachineRegistry.isMachine(block.id)){
                        var tile = World.getTileEntity(coords.x,coords.y,coords.z);
                        if(tile) tile.setFacing(tile.getFacing()+1%(tile.hasFullRotation?6:4));
                    }
                }
            }
        });
    }

    constructor(material: string,color: string,itemType: string,level: number) {
        this.material = material;
        this.color = color;
        this.itemType = itemType;
        this.level = level;
    }
}

var MaterialRegistry = {
    interactionFunctions: [],

    materials: {},

    data: {},

    registerMaterial(name,color: string,itemType: string,level: number): Material {
        var material = this.getMaterial(name);
        if(!material) material = new Material(name,color,itemType,level);
        return material;
    },

    getMaterial(name): Material {
        return this.materials[name];
    },

    getAll(material): number[] {
        var item = [];
        for(let i in this.data){
            var data = this.data[i];
            if(data[material]){
                item.push(data[material]);
            }
        }
        return item;
    },

    addMaterialElement(material: string,name: string,id: number,isArrow?: boolean){
        if(!this.data[material]) this.data[material] = {}
        if(!this.data[material][name] && isArrow){
            this.data[material][name] = [];
        }
        if(Array.isArray(this.data[material][name])) {
            this.data[material][name].push(id);
        } else {
            this.data[material][name] = id;
        }
    },

    registerInteractionFunction(state: Function,type?: string) {
        this.interactionFunctions.push({func: state,type: (type || "null")});
    }
}

var materials = FileTools.ReadJSON(__dir__ + "res/texture-source/materials.json");
for(let name in materials){
    // tool material
    var data = materials[name].data;
    ToolAPI.addToolMaterial(name,data);

    // material
    var mate = MaterialRegistry.registerMaterial(name,data.color,data.type,data.level);
    for(let type in materials[name].elements){
        var element = materials[name].elements[type];
        if(element.cover){
            mate.addElement(type,element.cover);
            if(type != "ore") continue;
        }
        var int1 = null;
        if(type == "ore"){
            int1 = (element.stone == "all"?StoneAll:element.stone);
        }
        mate[type](int1);
    }
    Callback.invokeCallback("et-material-translate",name,materials[name].translate);
}

Callback.addCallback("PreLoaded",() => {
    for(let name in MaterialRegistry.data) {
        var data = MaterialRegistry.data[name];
        for(let i in MaterialRegistry.interactionFunctions) {
            var interaction = MaterialRegistry.interactionFunctions[i];
            interaction.func(name,data,(materials[name].data || {}));
        }
    }
});