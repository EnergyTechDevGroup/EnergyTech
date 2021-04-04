/// <reference path="material_create.ts"/>
 
class Material extends MaterialCreate {
    public level: number;
    
    public type: string;

    public block() {
        let type: string;
        if(this.type == "metal"){
            type = "block";
        }
        if(this.type == "gem"){
            type = "blockGem";
        }
        this._block("block",[{
            texture: [(api,source) => {
                api.draw(source + type,0,0,this.color);
                api.draw(source + type + "_OVERLAY",0,0,null);
                return [this.material.toLowerCase() + "_block",0];
            }]
        }]);
    }

    public coil() {
        var lower = this.material.toLowerCase();
        this._block("coil",[{
            texture: [
                (api,source) => {
                    api.draw(source + "coilBottom",0,0,this.color);
                    api.draw(source + "coilBottom_OVERLAY",0,0,null);
                    return [lower + "_coil_bottom",0];
                },
                (api,source) => {
                    api.draw(source + "coilTop",0,0,this.color);
                    api.draw(source + "coilTop_OVERLAY",0,0,null);
                    return [lower + "_coil_top",0];
                },
                (api,source) => {
                    api.draw(source + "coilSide",0,0,this.color);
                    api.draw(source + "coilSide_OVERLAY",0,0,null);
                    return [lower + "_coil_side",0];
                }
            ]
        }]);
    }

    public ore(stone) {
        if(!stone) stone = StoneAll;

        let type: string = "ore";
        if(this.type == "metal"){
            type = "ore";
        }
        if(this.type == "gem"){
            type = "oreGem";
        }

        for(let i in stone){
            var suffix = (stone[i] != "stone"?"_" + stone[i].toLowerCase():"");
            var block = this._block("ore",[{
                uid: "ore%s" + suffix,
                name: "%s Ore",
                texture: [(api,source) => {
                    api.draw(this.path + "terrain-atlas/stone/" + stone[i],0,0,null);
                    api.draw(source + type,0,0,this.color);
                    api.draw(source + type + "_OVERLAY",0,0,null);
                    return [this.material.toLowerCase() + "_ore" + suffix,0];
                }]
            }]);
            ToolAPI.registerBlockMaterial(block,"stone",this.level,true);
            Block.setDestroyTime(block,3);
        }
    }

    public oreSmall(stone) {
        if(!stone) stone = StoneAll;

        let type: string = "oreSmall";
        if(this.type == "metal"){
            type = "oreSmall";
        }
        if(this.type == "gem"){
            type = "oreGemSmall";
        }

        for(let i in stone){
            var suffix = (stone[i] != "stone"?"_" + stone[i].toLowerCase():"");
            var block = this._block("oreSmall",[{
                uid: "oreSmall%s" + suffix,
                name: "Small %s Ore",
                texture: [(api,source) => {
                    api.draw(this.path + "terrain-atlas/stone/" + stone[i],0,0,null);
                    api.draw(source + type,0,0,this.color);
                    api.draw(source + type + "_OVERLAY",0,0,null);
                    return [this.material.toLowerCase() + "_oreSmall" + suffix,0];
                }]
            }]);
            ToolAPI.registerBlockMaterial(block,"stone",Math.max(this.level - 1,1),true);
            Block.setDestroyTime(block,3);
        }
    }

    public dust() {
        this._item("dust",{
            texture: (api,source) => {
                api.draw(source + "dust",0,0,this.color);
                api.draw(source + "dust_OVERLAY",0,0,null);
                return {name: this.material + "_dust",meta: 0};
            }
        });
    }

    public dustImpure() {
        this._item("dustImpure",{
            name: "Impure Pile of %s Dust",
            texture: (api,source) => {
                api.draw(source + "dustImpure",0,0,this.color);
                api.draw(source + "dustImpure_OVERLAY",0,0,null);
                return {name: this.material + "_dustImpure",meta: 0};
            }
        });
    }

    public dustSmall() {
        this._item("dustSmall",{
            name: "Small Pile of %s Dust",
            texture: (api,source) => {
                api.draw(source + "dustSmall",0,0,this.color);
                api.draw(source + "dustSmall_OVERLAY",0,0,null);
                return {name: this.material + "_dustSmall",meta: 0};
            }
        });
    }

    public dustTiny() {
        this._item("dustTiny",{
            name: "Tiny Pile of %s Dust",
            texture: (api,source) => {
                api.draw(source + "dustTiny",0,0,this.color);
                api.draw(source + "dustTiny_OVERLAY",0,0,null);
                return {name: this.material + "_dustTiny",meta: 0};
            }
        });
    }

    public ingot() {
        this._item("ingot",{
            texture: (api,source) => {
                api.draw(source + "ingot",0,0,this.color);
                api.draw(source + "ingot_OVERLAY",0,0,null);
                return {name: this.material + "_ingot",meta: 0};
            }
        });
    }

    public gem() {
        this._item("gem",{
            uid: "%s",
            name: "%s",
            texture: (api,source) => {
                api.draw(source + "gem",0,0,this.color);
                api.draw(source + "gem_OVERLAY",0,0,null);
                return {name: this.material.toLowerCase(),meta: 0};
            }
        });
    }

    public nugget() {
        this._item("nugget",{
            texture: (api,source) => {
                api.draw(source + "nugget",0,0,this.color);
                api.draw(source + "nugget_OVERLAY",0,0,null);
                return {name: this.material + "_nugget",meta: 0};
            }
        });
    }
    
    public plate() {
        let type: string;
        if(this.type == "metal"){
            type = "plate";
        }
        if(this.type == "gem"){
            type = "plateGem";
        }
        this._item("plate",{
            texture: (api,source) => {
                api.draw(source + type,0,0,this.color);
                api.draw(source + type + "_OVERLAY",0,0,null);
                return {name: this.material.toLowerCase() + "_plate",meta: 0};
            }
        });
    }

    public hammer() {
        this._tool("hammer",{
            type: ToolType.pickaxe,
            texture: (api,source) => {
                api.draw(source + "hammer",0,0,this.color);
                api.draw(source + "hammer_OVERLAY",0,0,null);
                return {name: this.material + "_hammer",meta: 0};
            }
        });
    }

    public sword() {
        this._tool("sword",{
            type: ToolType.sword,
            texture: (api,source) => {
                api.draw(source + "sword",0,0,this.color);
                api.draw(source + "sword_OVERLAY",0,0,null);
                return {name: this.material + "_sword",meta: 0};
            }
        });
    }

    public shovel() {
        this._tool("shovel",{
            type: ToolType.shovel,
            texture: (api,source) => {
                api.draw(source + "shovel",0,0,this.color);
                api.draw(source + "shovel_OVERLAY",0,0,null);
                return {name: this.material + "_shovel",meta: 0};
            }
        });
    }

    public pickaxe() {
        this._tool("pickaxe",{
            type: ToolType.pickaxe,
            texture: (api,source) => {
                api.draw(source + "pickaxe",0,0,this.color);
                api.draw(source + "pickaxe_OVERLAY",0,0,null);
                return {name: this.material + "_pickaxe",meta: 0};
            }
        });
    }

    public axe() {
        this._tool("axe",{
            type: ToolType.axe,
            texture: (api,source) => {
                api.draw(source + "axe",0,0,this.color);
                api.draw(source + "axe_OVERLAY",0,0,null);
                return {name: this.material + "_axe",meta: 0};
            }
        });
    }

    public hoe() {
        this._tool("hoe",{
            type: ToolType.hoe,
            texture: (api,source) => {
                api.draw(source + "hoe",0,0,this.color);
                api.draw(source + "hoe_OVERLAY",0,0,null);
                return {name: this.material + "_hoe",meta: 0};
            }
        });
    }

    public wrench() {
        this._tool("wrench",{
            type: {
                useItem(coords,item,block,player) {
                    if(MachineRegistry.isMachine(block.id)){
                        World.drop(coords.x,coords.y,coords.z,block.id,1,0);
                        ToolLib.breakCarriedTool(50,player);
                    }
                }
            },
            texture: (api,source) => {
                api.draw(source + "wrench",0,0,this.color);
                api.draw(source + "wrench_OVERLAY",0,0,null);
                return {name: this.material + "_wrench",meta: 0};
            }
        });
    }
    
    public mortar() {
        this._tool("mortar",{
            texture: (api,source) => {
                api.draw(source + "mortar",0,0,this.color);
                api.draw(source + "mortar_OVERLAY",0,0,null);
                return {name: this.material + "_mortar",meta: 0};
            }
        });
    }
    
    public cutter() {
        this._tool("cutter",{
            texture: (api,source) => {
                api.draw(source + "cutter",0,0,this.color);
                api.draw(source + "cutter_OVERLAY",0,0,null);
                return {name: this.material + "_cutter",meta: 0};
            }
        });
    }

    public file() {
        this._tool("file",{
            texture: (api,source) => {
                api.draw(source + "file",0,0,this.color);
                api.draw(source + "file_OVERLAY",0,0,null);
                return {name: this.material + "_file",meta: 0};
            }
        });
    }

    public saw() {
        this._tool("saw",{
            type: ToolType.axe,
            texture: (api,source) => {
                api.draw(source + "saw",0,0,this.color);
                api.draw(source + "saw_OVERLAY",0,0,null);
                return {name: this.material + "_saw",meta: 0};
            }
        });
    }

    public screwdriver() {
        this._tool("screwdriver",{
            type: {
                useItem(coords,item,block,player) {
                    if(MachineRegistry.isMachine(block.id)){
                        var tile = World.getTileEntity(coords.x,coords.y,coords.z);
                        if(tile) tile.setFacing(tile.getFacing()+1%(tile.hasFullRotation?6:4));
                    }
                }
            },
            texture: (api,source) => {
                api.draw(source + "screwdriver",0,0,this.color);
                api.draw(source + "screwdriver_OVERLAY",0,0,null);
                return {name: this.material + "_screwdriver",meta: 0};
            }
        });
    }

    constructor(material: string,color: string,type: string,level: number) {
        super(material,color);
        this.type = type;
        this.level = level;
    }
}