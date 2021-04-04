/// <reference path="../../../init/machine.ts"/>

var block_macerator = IDRegistry.genBlockID("ENERGYTECH_MACHINE_MACERATOR");
Block.createBlock("ENERGYTECH_MACHINE_MACERATOR",[
    {name:"Macerator",texture:[["machine_casing",0],["machine_casing",0],["machine_casing",0],["macerator",0],["machine_casing",0],["machine_casing",0]],inCreative:true}
]);
TileRenderer.setStandardModelWithRotation(block_macerator,2,[["machine_casing",0],["machine_casing",0],["machine_casing",0],["macerator",0],["machine_casing",0],["machine_casing",0]]);
TileRenderer.registerModelWithRotation(block_macerator,2,[["machine_casing",0],["machine_casing",0],["machine_casing",0],["macerator",0],["machine_casing",0],["machine_casing",0]]);
TileRenderer.registerModelWithRotation(block_macerator,6,[["machine_casing",0],["machine_casing",0],["machine_casing",0],["macerator",1],["machine_casing",0],["machine_casing",0]]);
TileRenderer.setRotationFunction(block_macerator);

MachineRegistry.setMachineDrop(block_macerator);
MachineRegistry.registerElectric(block_macerator,{
    defaultValues: {
        work_time: 100,
        energy_consume:4,
        energy_storage:10000
    },

    getRecipeByName() {
        return "macerator";
    },

    getScreenByName() {
        return BasicMachineUI("Macerator");
    },

    render() {
        var config_count = 2;

        // render
        var data = this.networkData.getInt("blockData");
        if(this.getActive()){
            let meta = Math.round(this.data.progress/1*config_count);
            this.mapAtCoords(data+(this.hasFullRotation?6:4)*meta);
        } else {
            BlockRenderer.unmapAtCoords(this.x,this.y,this.z);
        }
    },

    tick() {
        this.render();
    }
});
MachineRegistry.createInterface(block_macerator,{
    slots: {
        "slotSource": {input: true},
        "slotResult": {output: true}
    }
});