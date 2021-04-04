/// <reference path="../../../init/machine.ts"/>

var block_compressor = IDRegistry.genBlockID("ENERGYTECH_MACHINE_COMPRESSOR");
Block.createBlock("ENERGYTECH_MACHINE_COMPRESSOR",[
    {name:"Compressor",texture:[["machine_casing",0],["machine_casing",0],["machine_casing",0],["compressor",0],["machine_casing",0],["machine_casing",0]],inCreative:true}
]);
TileRenderer.setStandardModelWithRotation(block_compressor,2,[["machine_casing",0],["machine_casing",0],["machine_casing",0],["compressor",0],["machine_casing",0],["machine_casing",0]]);
TileRenderer.registerModelWithRotation(block_compressor,2 ,[["machine_casing",0],["machine_casing",0],["machine_casing",0],["compressor",0],["machine_casing",0],["machine_casing",0]]);
TileRenderer.registerModelWithRotation(block_compressor,6 ,[["machine_casing",0],["machine_casing",0],["machine_casing",0],["compressor",1],["machine_casing",0],["machine_casing",0]]);
TileRenderer.registerModelWithRotation(block_compressor,10,[["machine_casing",0],["machine_casing",0],["machine_casing",0],["compressor",2],["machine_casing",0],["machine_casing",0]]);
TileRenderer.setRotationFunction(block_compressor);

MachineRegistry.setMachineDrop(block_compressor);
MachineRegistry.registerElectric(block_compressor,{
    defaultValues: {
        work_time: 100,
        energy_consume: 4,
        energy_storage: 10000
    },

    getRecipeByName() {
        return "compressor";
    },

    getScreenByName() {
        return BasicMachineUI("Compressor");
    },

    render() {
        var config_count = 3;

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
MachineRegistry.createInterface(block_compressor,{
    slots: {
        "slotSource": {input: true},
        "slotResult": {output: true}
    }
});