IMPORT("ChargeItem");
IMPORT("EnergyNet");
IMPORT("ItemName");
IMPORT("LiquidLib");
/* IMPORT("SoundLib"); */
IMPORT("StorageInterface");
IMPORT("TileRecipe");
IMPORT("TileRender");
IMPORT("ToolLib");

var GUI_SCALE: number = 3.2;
var ResDir: string = __dir__ + "res/";

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
    var item = Entity.getCarriedItem(player);
    if(ToolAPI.getToolData(item.id)){
        var level = ToolAPI.getBlockDestroyLevel(block.id);
        ToolLib.breakCarriedTool(Math.max(level*level,1),player);
    }
});

// remove vanilla tools
var VanillaToolIDs = [268,269,270,271,290,272,273,274,275,291,256,257,258,267,292,283,284,285,286,294,276,277,278,279,293];
for(let i in VanillaToolIDs){
    Recipes.deleteRecipe({id: VanillaToolIDs[i],count: 1,data: 0});
}