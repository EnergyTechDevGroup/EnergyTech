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

    getRecipeByName: function() {
        return "macerator";
    },

    getScreenByName: function() {
        return BasicMachineUI("Macerator");
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
MachineRegistry.createInterface(block_macerator,{
    slots: {
        "slotSource": {input: true},
        "slotResult": {output: true}
    }
});