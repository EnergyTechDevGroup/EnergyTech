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

    getRecipeByName: function() {
        return "compressor";
    },

    getScreenByName: function() {
        return BasicMachineUI("Compressor");
    },

    render: function() {
        var config_side = (this.hasFullRotation?6:4);
        var config_count = 3;
        var config_active = false;

        if(World.getWorldTime()%20 == 0){
            var block = this.getBlock();
            TileRenderer.mapAtCoords(this.x,this.y,this.z,block.id,block.data + (this.getActive()?Math.floor(this.data.progress*config_count*config_side+(config_active?config_side:0)):0));
        }
    },

    tick: function() {
        this.render();
    }
});
MachineRegistry.createInterface(block_compressor,{
    slots: {
        "slotSource": {input: true},
        "slotResult": {output: true}
    }
});