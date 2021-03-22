/// <reference path="../../../init/machine.ts"/>

var block_mixer = IDRegistry.genBlockID("ENERGYTECH_MACHINE_MIXER");
Block.createBlock("ENERGYTECH_MACHINE_MIXER",[
    {name:"Mixer",texture:[["machine_casing",0],["mixer_top",0],["machine_casing",0],["machine",0],["machine_casing",0],["machine_casing",0]],inCreative:true}
]);
TileRenderer.setStandardModelWithRotation(block_mixer,2,[["machine_casing",0],["mixer_top",0],["machine_casing",0],["machine",0],["machine_casing",0],["machine_casing",0]]);
TileRenderer.registerModelWithRotation(block_mixer,2 ,[["machine_casing",0],["mixer_top",0],["machine_casing",0],["machine",0],["machine_casing",0],["machine_casing",0]]);
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

    getRecipeByName: function() {
        return "mixer";
    },

    getScreenByName: function() {
        return ContainerWindow("Mixer",{
            drawing:[
                {type:"bitmap",x:350,y:50,bitmap:"energy_background"},
                {type:"bitmap",x:600,y:175 + GUI_SCALE * 2,bitmap:"progress_background"},
            ],
        
            text: {
                "textEnergy": Translation.translate("Energy: ") + "0/0Eu"
            },
        
            elements:{
                "slotSource1":{type:"slot",x:320 + GUI_SCALE * 43,y:145},
                "slotSource2":{type:"slot",x:320 + GUI_SCALE * 43,y:205},
                "slotSource3":{type:"slot",x:380 + GUI_SCALE * 43,y:145},
                "slotSource4":{type:"slot",x:380 + GUI_SCALE * 43,y:205},
        
                "slotResult":{type:"slot",x:720,y:175,isValid:function(){return false;}},
        
                "scaleProgress":{type:"scale",x:600,y:175 + GUI_SCALE * 2,direction:0,value:0.5,bitmap:"progress_scale"},
                "scaleEnergy":{type:"scale",x:350 + GUI_SCALE * 6,y:50 + GUI_SCALE * 6,direction:1,value:0.5,bitmap:"energy_scale"}
            }
        });
    },

    render: function() {
        var config_side = (this.hasFullRotation?6:4);
        var config_count = 2;
        var config_active = true;

        if(World.getWorldTime()%20 == 0){
            var block = this.getBlock();
            TileRenderer.mapAtCoords(this.x,this.y,this.z,block.id,block.data + (this.getActive()?Math.floor(this.data.progress*config_count*config_side+(config_active?config_side:0)):0));
        }
    },

    tick: function() {
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