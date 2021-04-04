/// <reference path="../../../init/machine.ts"/>

var block_mixer = IDRegistry.genBlockID("ENERGYTECH_MACHINE_MIXER");
Block.createBlock("ENERGYTECH_MACHINE_MIXER",[
    {name:"Mixer",texture:[["machine_casing",0],["mixer_top",0],["machine_casing",0],["machine",0],["machine_casing",0],["machine_casing",0]],inCreative:true}
]);
TileRenderer.setStandardModelWithRotation(block_mixer,2,[["machine_casing",0],["mixer_top",0],["machine_casing",0],["machine",0],["machine_casing",0],["machine_casing",0]]);
TileRenderer.registerModelWithRotation(block_mixer,6 ,[["machine_casing",0],["mixer_top",0],["machine_casing",0],["machine",1],["machine_casing",0],["machine_casing",0]]);
TileRenderer.registerModelWithRotation(block_mixer,10,[["machine_casing",0],["mixer_top",1],["machine_casing",0],["machine",1],["machine_casing",0],["machine_casing",0]]);
TileRenderer.setRotationFunction(block_mixer);

MachineRegistry.setMachineDrop(block_mixer);
MachineRegistry.registerElectric(block_mixer,{
    defaultValues: {
        work_time: 100,
        energy_consume: 4,
        energy_storage: 10000
    },

    getRecipeByName() {
        return "mixer";
    },

    getScreenByName() {
        return ContainerWindow("Mixer",{
            drawing: [
                {type: "bitmap",x: 350,y: 50,bitmap: "energy_background"},
                {type: "bitmap",x: 600,y: 175+GUI_SCALE*2,bitmap: "progress_background"},
            ],
        
            text: {
                "textEnergy": Translation.translate("Energy") + ": " + "0/0Eu"
            },
        
            elements:{
                "slotSource1": {type: "slot",bitmap: "slot_dust",x: 448+GUI_SCALE*3,y: 145},
                "slotSource2": {type: "slot",bitmap: "slot_dust",x: 448+GUI_SCALE*3,y: 205},
                "slotSource3": {type: "slot",bitmap: "slot_dust",x: 508+GUI_SCALE*3,y: 145},
                "slotSource4": {type: "slot",bitmap: "slot_dust",x: 508+GUI_SCALE*3,y: 205},
        
                "slotResult": {type: "slot",bitmap: "slot_dust",x: 720,y: 175,isValid(){return false;}},
        
                "scaleProgress": {type: "scale",x: 600              ,y: 175+GUI_SCALE*2,direction: 0,value: 0.5,bitmap: "progress_scale"},
                "scaleEnergy"  : {type: "scale",x: 350 + GUI_SCALE*6,y: 50+GUI_SCALE*6 ,direction: 1,value: 0.5,bitmap: "energy_scale"  }
            }
        });
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
MachineRegistry.createInterface(block_mixer,{
    slots: {
        "slotSource1": {input: true},
        "slotSource2": {input: true},
        "slotSource3": {input: true},
        "slotSource4": {input: true},
        "slotResult": {output: true}
    }
});