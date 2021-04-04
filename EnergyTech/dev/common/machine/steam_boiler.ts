/// <reference path="../../init/machine.ts"/>

var block_steam_boiler = IDRegistry.genBlockID("ENERGYTECH_MACHINE_STEAM_BOILER");
Block.createBlock("ENERGYTECH_MACHINE_STEAM_BOILER",[
    {name:"Steam Boiler",texture:[["machine_casing",0],["machine_casing",0],["machine_casing",0],["steam_boiler",0],["machine_casing",0],["machine_casing",0]],inCreative:true}
]);
TileRenderer.setStandardModelWithRotation(block_steam_boiler,2,[["machine_casing",0],["machine_casing",0],["machine_casing",0],["steam_boiler",0],["machine_casing",0],["machine_casing",0]]);
TileRenderer.registerModelWithRotation(block_steam_boiler,2,[["machine_casing",0],["machine_casing",0],["machine_casing",0],["steam_boiler",1],["machine_casing",0],["machine_casing",0]]);
TileRenderer.setRotationFunction(block_steam_boiler);

MachineRegistry.setMachineDrop(block_steam_boiler);
MachineRegistry.registerPrototype(block_steam_boiler,{
    defaultValues: {
		progress: 0,
		work_time: 120,
		heat_storage: 1000
    },

    canReceiveHeat() {
        return true;
    },

    canExtractHeat() {
		return false;
    },

    getScreenByName() {
		return ContainerWindow("Steam Boiler",{
            drawing: [
                {type: "bitmap",x: 825-GUI_SCALE*3,y: 147-GUI_SCALE*6,bitmap: "liquid_background"},
                {type: "bitmap",x: 882-GUI_SCALE*3,y: 147-GUI_SCALE*6,bitmap: "liquid_background"},
            ],
        
            text: {
                "textHeat": Translation.translate("Heat") + ": " + "0/0Hu"
            },
        
            elements: {
                "scaleLiquid1": {type:"scale", x:825+GUI_SCALE*3,y: 147,direction: 1,value: 0.5,bitmap: "liquid_water",overlay: "liquid_scale"},
                "scaleLiquid2": {type:"scale", x:882+GUI_SCALE*3,y: 147,direction: 1,value: 0.5,bitmap: "liquid_steam",overlay: "liquid_scale"},
                
                "slotLiquid1": {type: "slot",x: 670,y: 325,bitmap: "slot_bucket",isValid(id,count,data){return LiquidLib.getItemLiquid(id,data) == "water";}},
                "slotLiquid2": {type: "slot",x: 730,y: 325,bitmap: "slot_bucket",isValid(){return false;}}
            }
        });
    },

    setContainer() {
		this.waterTank = new LiquidTank(this,"water",8);
		this.steamTank = new LiquidTank(this,"steam",8);
    },
    
    tick() {
		var input = this.container.getSlot("slotLiquid1");
		var output = this.container.getSlot("slotLiquid2");
		this.getLiquidFromItem(input,output,this.waterTank);

        if(World.getThreadTime()%20 == 0){
            if(this.data.heat > 0){
                this.data.heat--;
            } else {
                this.setActive(false);
            }

            if(this.data.heat >= this.getHeatStorage()/2){
                this.setActive(true);
            }
    
            if(this.getActive()){
                if(this.waterTank.getAmount("water") > 0){
                    this.data.progress += 1/this.data.work_time;
                    if(this.data.progress.toFixed(3) >= 1){
                        this.waterTank.getLiquid("water",0.008);
                        this.steamTank.addLiquid("steam",0.060);
                        this.data.progress = 0;
                    }
                } else {
                    World.setBlock(this.x,this.y,this.z,0,0);
                    World.explode(this.x + 0.5,this.y + 0.5,this.z + 0.5,1,true);
                    this.selfDestroy();
                }
			}
        }

        this.waterTank.updateUiScale("scaleLiquid1");
		this.steamTank.updateUiScale("scaleLiquid2");
		this.container.setText("textHeat",Translation.translate("Heat") + ": " + this.data.heat + "/" + this.getHeatStorage() + "Hu");
	},

	getLiquidFromItem: MachineRegistry.getLiquidFromItem
});
MachineRegistry.setHeatTransportInitParams(block_steam_boiler);
StorageInterface.createInterface(block_steam_boiler,{
    canReceiveLiquid(liquid,side) {
        return liquid == "water";
    },
    
    canTransportLiquid(liquid,side) {
        return liquid == "steam";
    },

    addLiquid(liquid,amount) {
        var tile = this.tileEntity;
        return tile.waterTank.addLiquid(liquid,amount);
    },

    getLiquid(liquid,amount) {
        var tile = this.tileEntity;
        return tile.steamTank.getLiquid(liquid,amount);
    },

    getLiquidStored(mode) {
        var tile = this.tileEntity;
        return mode == "input"?tile.waterTank.getLiquidStored():tile.steamTank.getLiquidStored();
    }
});