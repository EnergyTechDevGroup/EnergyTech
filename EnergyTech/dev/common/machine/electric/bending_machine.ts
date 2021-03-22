/// <reference path="../../../init/machine.ts"/>

var block_bending_machine = IDRegistry.genBlockID("ENERGYTECH_MACHINE_BENDING_MACHINE");
Block.createBlock("ENERGYTECH_MACHINE_BENDING_MACHINE",[
    {name:"Bending Machine",texture:[["machine_casing",0],["machine_casing",0],["machine_casing",0],["machine",0],["machine_casing",0],["machine_casing",0]],inCreative:true}
]);
TileRenderer.setStandardModelWithRotation(block_bending_machine,2,[["machine_casing",0],["machine_casing",0],["machine_casing",0],["machine",0],["machine_casing",0],["machine_casing",0]]);
TileRenderer.registerModelWithRotation(block_bending_machine,2,[["machine_casing",0],["machine_casing",0],["machine_casing",0],["machine",0],["machine_casing",0],["machine_casing",0]]);
TileRenderer.registerModelWithRotation(block_bending_machine,6,[["machine_casing",0],["machine_casing",0],["machine_casing",0],["machine",1],["machine_casing",0],["machine_casing",0]]);
TileRenderer.setRotationFunction(block_bending_machine);

MachineRegistry.setMachineDrop(block_bending_machine);
MachineRegistry.registerElectric(block_bending_machine,{
    defaultValues: {
        work_time: 100,
        energy_consume: 4,
        energy_storage: 10000
    },

    getRecipeByName: function() {
        return "bending_machine";
    },

    getScreenByName: function() {
        return BasicMachineUI("Bending Machine");
    }
});
MachineRegistry.createInterface(block_bending_machine,{
    slots: {
        "slotSource": {input: true},
        "slotResult": {output: true}
    }
});