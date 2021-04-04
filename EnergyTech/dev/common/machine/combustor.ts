/// <reference path="../../init/machine.ts"/>

var block_chamber = IDRegistry.genBlockID("ENERGYTECH_MACHINE_CHAMBER");
Block.createBlock("ENERGYTECH_MACHINE_CHAMBER",[
    {name:"Chamber",texture:[["chamber_bottom",0],["chamber_top",0],["chamber ",0],["chamber",0],["chamber",0],["chamber",0]],inCreative:true}
]);
TileRenderer.setStandardModelWithRotation(block_chamber,2,[["chamber_bottom",0],["chamber_top",0],["chamber",0],["chamber",0],["chamber",0],["chamber",0]]);
TileRenderer.registerModelWithRotation(block_chamber,2,[["chamber_bottom",0],["chamber_top",0],["chamber",1],["chamber",1],["chamber",1],["chamber",1]]);
TileRenderer.setRotationFunction(block_chamber);

MachineRegistry.setMachineDrop(block_chamber,45);
MachineRegistry.registerPrototype(block_chamber,{
    defaultValues: {
        meta: 0,
        burn: 0,
        max_burn: 0,
        heat_storage: 1000
    },

    getScreenByName() {
        return ContainerWindow("Chamber",{
            drawing: [
                {type: "bitmap",x: 607,y: 181,bitmap: "fire_background",scale: GUI_SCALE}
            ],
            
            text: {
                "textHeat": Translation.translate("Heat") + ": " + "0/0Hu"
            },

            elements: {
                "scaleBurn": {type: "scale",x: 607,y: 181,direction: 1,value: 0.5,bitmap: "fire_scale",scale: GUI_SCALE},
                "slotFuel": {type: "slot",x: 600,y :230,isValid: (id,count,data) => {
                    return Recipes.getFuelBurnDuration(id,data) > 0;
                }}
            }
        });
    },

    canReceiveHeat() {
        return false;
    },

    canExtractHeat(side) {
		return side == Native.BlockSide.UP;
    },

    tick(){
        if(this.data.burn <= 0){
            this.data.burn = this.data.max_burn = this.getFuelBurnDuration("slotFuel")/4;
        }

        if(this.data.burn > 0){
            this.setActive(true);
            this.data.burn--;
            if(World.getThreadTime()%20 == 0){
                this.data.heat += Math.min(4,this.getHeatStorage() - this.data.heat);
            }
        } else {
            this.setActive(false);
        }

        this.container.setScale("scaleBurn",this.data.burn / this.data.max_burn || 0);
        this.container.setText("textHeat",Translation.translate("Heat") + ": " + this.data.heat + "/" + this.getHeatStorage() + "Hu");
    },

    getFuelBurnDuration: MachineRegistry.getFuelBurnDuration
});
MachineRegistry.setHeatTransportInitParams(block_chamber);