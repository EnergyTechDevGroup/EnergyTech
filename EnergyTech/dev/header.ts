IMPORT("ChargeItem");
IMPORT("EnergyNet");
IMPORT("ItemName");
IMPORT("LiquidLib");
/* IMPORT("SoundLib"); */
IMPORT("StorageInterface");
IMPORT("TileRender");
IMPORT("ToolLib");
IMPORT("VanillaRecipe");

VanillaRecipe.setResourcePath(__dir__ + "res/");

var GUI_SCALE: number = 3.2;

const EU: EnergyType = EnergyTypeRegistry.assureEnergyType("Eu",1);

function power(tier: number): number {
    return 32 * Math.pow(4,tier - 1);
}

function toTitleCase(string: string) {
    var data = string.split(/\s+/); 
    for(let i in data){
        data[i] = data[i].slice(0,1).toUpperCase() + data[i].slice(1);
    }
    return data.join(" ");
}

// the higher the block level, the higher the tool loss.
Callback.addCallback("DestroyBlock",(coords,block,player) => {
    var level = ToolAPI.getBlockDestroyLevel(block.id);
    ToolLib.breakCarriedTool(Math.max(level*level,1),player);
});

class ModLoader {
    static ic2(): boolean {
        let loader = false;
        ModAPI.addAPICallback("ICore",(api) => {
            loader = true; 
        });
        return loader;
    }
}