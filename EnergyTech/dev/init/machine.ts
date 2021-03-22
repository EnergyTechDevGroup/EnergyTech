/// <reference path="recipe.ts"/>

var block_machine_casing = IDRegistry.genBlockID("machineCasing");
Block.createBlock("machineCasing",[
    {name: "Machine Casing",texture: [["machine_casing",0]],inCreative: true}
]);

var MachineRegistry =  {
    machineIDs: {},

    isMachine(id): number {
        return this.machineIDs[id];
    },

    setMachineDrop(id: number | string,casing?: number) {
        Block.registerDropFunction(id,function(){
            return [[casing || block_machine_casing,1,0]];
        });
    },

    registerPrototype(id: number,state) {
        this.machineIDs[id] = true;

        state.useNetworkItemContainer = true;

        state.getScreenName = state.getScreenName || function(player,coords) {
            return "main";
        };
        
        state.hasFullRotation = state.hasFullRotation || false;

        state.getFacing = state.getFacing || function() {
            return this.blockSource.getBlockData(this.x,this.y,this.z);
        };

        state.setFacing = state.setFacing || function(side) {
            if(this.getFacing() != side){
                this.blockSource.setBlock(this.x,this.y,this.z,this.blockID,side);
                this.networkData.putInt("blockData",side);
                this.networkData.sendChanges();
                return true;
            }
            return false;
        }

        state.setActive = state.setActive || function(isActive) {
            if(this.getActive() !== isActive){
                this.networkData.putBoolean("isActive",isActive);
                this.networkData.sendChanges();
            }
        };

        state.getActive = state.getActive || function() {
            return this.networkData.getBoolean("isActive");
        }

        state.render = state.render || function() {
            var block = this.getBlock();
            TileRenderer.mapAtCoords(this.x,this.y,this.z,block.id,block.data + (this.getActive()?4:0) + (this.hasFullRotation?2:0));
        }

        state.onRenderModel = state.onRenderModel || function() {
            if(this.getActive()){
                this.render();
            } else {
                BlockRenderer.unmapAtCoords(this.x,this.y,this.z);
            }
        };

        state.clientLoad = state.clientLoad || function() {
            this.onRenderModel();
            this.networkData.addOnDataChangedListener((data,isExternal) => {
                this.onRenderModel();
            });
        };

        state.clientUnload = state.clientUnload || function() {
            BlockRenderer.unmapAtCoords(this.x,this.y,this.z);
        };

        state.setContainer = state.setContainer || function() {};

        state.getBlock = function(){
            return {
                id: Network.serverToLocalId(this.networkData.getInt("blockId")),
                data: this.networkData.getInt("blockData")
            }
        }

        state.init = function(){
            this.networkData.putInt("blockId",this.blockID);
            this.networkData.putInt("blockData",this.getFacing());
            this.networkData.sendChanges();
            this.setContainer();
        }

        ToolAPI.registerBlockMaterial(id,"stone",1,true);
        Block.setDestroyTime(id,3);

        TileEntity.registerPrototype(id,state);
    },

    registerElectric(id: number,state: any,energy?: any) {
        this.setDefaultValues(state.defaultValues,{
            power_tier: 1,
            energy: 0,
            energy_storage: 0,
            energy_receive: 0,
            last_energy_receive: 0,
            energy_extract: 0,
            last_energy_extract: 0,
            voltage: 0,
            last_voltage: 0
        });

        state.__tick__ = state.tick || function() {};
        state.tick = function(): any {
            this.__tick__();

            this.container.setScale("scaleEnergy",this.data.energy / this.getEnergyStorage());
            this.container.setText("textEnergy",Translation.translate("Energy") + ": " + this.data.energy + "/" + this.getEnergyStorage() + "Eu");
        }

        state.getTier = state.getTier || function(): number {
            return this.data.power_tier;
        }
    
        state.getMaxVoltage = state.getMaxVoltage || function(): number {
            return power(this.getTier());
        }
        
        state.getMinVoltage = state.getMinVoltage || function(): number {
            return Math.max(power(this.getTier() - 1),0);
        }
    
    
        state.getEnergyStorage = state.getEnergyStorage || function(): number {
            return this.data.energy_storage;
        }

        state.energyExtract = state.energyExtract || function(type): number {
            return this.getMaxVoltage();
        }

        state.energyReceive = state.energyReceive || function(type,amount,voltage): number {
            var energy = 0;
            if(voltage > this.getMaxVoltage()){
                if(true){
                    World.setBlock(this.x,this.y,this.z,0,0);
                    World.explode(this.x + 0.5,this.y + 0.5,this.z + 0.5,1.2,true);
                    this.selfDestroy();
                    return 0;
                }
                energy = Math.min(this.getMaxVoltage(),this.getEnergyStorage() - this.data.energy);
            } else {
                energy = Math.min(amount,this.getEnergyStorage() - this.data.energy);
            }
            this.data.energy += energy;
            this.data.energy_receive += energy;
            this.data.voltage = Math.max(this.data.voltage,voltage);
            return energy;
        }

        state.energyTick = state.energyTick || function(type,src){
            var output = this.energyExtract(type);
            if(this.data.energy >= output){
                var energy = src.add(output) - output;
                this.data.energy_extract = energy;
                this.data.energy += energy;
            }
            this.data.last_energy_receive = this.data.energy_receive;
            this.data.energy_receive = 0;
            this.data.last_voltage = this.data.voltage;
            this.data.voltage = 0;
            this.data.last_energy_extract = this.data.energy_extract;
            this.data.energy_extract = 0;
        }
        
        this.registerPrototype(id,state);
        ICRender.getGroup("et-wire").add(id,-1);
        EnergyTileRegistry.addEnergyTypeForId(id,energy || EU);
    },

    registerGenerator(id: number,state: any,energy?: any) {
        state.canReceiveEnergy = () => {
            return false;
        }
    
        state.isEnergySource = () => {
            return true;
        }

        this.registerElectric(id,state,energy);
    },

    registerEnergySource(id: number,state: any,energy?: any) {
        state.isEnergySource = () => {
            return true;
        }
        this.registerElectric(id,state,energy);
    },

    updateUIHeader(window,text: string) {
        var header = window.getWindow("header");
        header.contentProvider.drawing[2].text = text;
    },

    createInterface(id,state) {
        var tile = TileEntity.getPrototype(id);
        if(tile){
            tile.defaultValues.progress = 0;

            StorageInterface.createInterface(id,this.setDefaultValues({
                isValidInput(item) {
                    return RecipeUtils.isValidInput(tile.getRecipeByName(),item);
                }
            },state,true));

            tile._tick_ = tile.tick;
            tile.tick = function(){
                this._tick_();
                
                RecipeUtils.executeRecipeToTileTick(tile.getRecipeByName(),this);
            }
        }
    },

    setDefaultValues(state: {[key: string]: any},values?: {[key: string]: any},exist?: boolean) {
        if(values){
            state = state || {};
            for(let i in values){
                if(exist || !state[i]) state[i] = values[i];
            }
        }
    },

    getLiquidFromItem(liquid,input,output,tank) {
        if(!tank) tank = this.liquidStorage;
        var storage = StorageInterface.getInterface(this);
        var empty = LiquidLib.getEmptyItem(input.id,input.data);
        if(empty && (!liquid && storage.canReceiveLiquid(empty.liquid) || empty.liquid == liquid) && !this.liquidStorage.isFull(empty.liquid) && (output.id == empty.id && output.data == empty.data && output.count < Item.getMaxStack(empty.id) || output.id == 0)){
            var count = Math.min(Math.floor((tank.getLimit(empty.liquid) - tank.getAmount(liquid).toFixed(3))/empty.amount),1);
            if(count > 0){
                tank.addLiquid(empty.liquid,empty.amount*count);
                input.count -= count;
                output.setSlot(empty.id,output.count + count,empty.data);
                if(input.count == 0) input.id = input.data = 0;
            } else if(input.count == 1 && empty.storage){
                var amount = Math.min(tank.getLimit(empty.liquid) - tank.getAmount(liquid).toFixed(3),empty.amount);
                tank.addLiquid(empty.liquid,amount);
                input.data += amount*1000;
            }
            input.markDirty();
            output.markDirty();
            return true;
        }
        return false;
	},
	
	addLiquidToItem(liquid,input,output,tank) {
        if(!tank) tank = this.liquidStorage;
        var amount = tank.getAmount(liquid).toFixed(3);
        if(amount > 0){
            var full = LiquidLib.getFullItem(input.id, input.data, liquid);
            if(full && (output.id == full.id && output.data == full.data && output.count < Item.getMaxStack(full.id) || output.id == 0)){
                if(amount >= full.amount){
                    tank.getLiquid(liquid,full.amount);
                    input.setSlot(input.id,input.count - 1,input.data);
                    input.validate();
                    output.setSlot(full.id,output.count + 1,full.data);
                } else if(input.count == 1 && full.storage){
                    if(input.id == full.id){
                        amount = tank.getLiquid(liquid, full.amount);
                        input.setSlot(input.id,1,input.data - amount*1000);
                    } else {
                        amount = tank.getLiquid(liquid, full.storage);
                        input.setSlot(full.id,1,(full.storage - amount)*1000);
                    }
                }
            }
        }
    },

    setHeatTransportInitParams:function(id){
        var prototype = TileEntity.getPrototype(id);

        this.setDefaultValues(prototype.defaultValues,{
            heat:0,
            heat_storage:0
        });

        prototype.isStorageHeat = true;

        prototype.getHeatStorage = prototype.getHeatStorage || function(){
            return this.data.heat_storage;
        }

        prototype.canExtractHeat = prototype.canExtractHeat || function(side){
            return true;
        }
        
        prototype.canReceiveHeat = prototype.canReceiveHeat || function(side){
            return true;
        }

        prototype.heatTick = prototype.heatTick || function(){}

        prototype.___tick___ = prototype.tick || function(){};
        prototype.tick = function(){
            this.___tick___();

            if(World.getThreadTime()%20 == 0){
                if(this.data.heat > 0){
                    for(let side = 0;side < 6;side++){
                        if(this.canExtractHeat(side)){
                            var coords = World.getRelativeCoords(this.x,this.y,this.z,side);
                            var tile = World.getTileEntity(coords.x,coords.y,coords.z);
                            if(tile && tile.isStorageHeat){
                                // receive
                                if(tile.canReceiveHeat([1,0,3,2,5,4][side]) && tile.data.heat < tile.getHeatStorage()){
                                    var heat = Math.min(Math.min(this.data.heat,16),tile.getHeatStorage() - tile.data.heat);
                                    tile.data.heat += heat;
                                    this.heatTick(heat);
                                }
                            }
                        }
                    }
                }
            }
            
            if(this.data.heat > this.getHeatStorage()) this.data.heat = this.getHeatStorage();
        }
    },

    getShortForEnergy(energy) {
        if(energy >= 1e9){
            return Math.floor(energy / 1e8) / 10 + "G";
        }
        if(energy >= 1e6){
            return Math.floor(energy / 1e5) / 10 + "M";
        }
        if(energy >= 1e3){
            return Math.floor(energy / 1e2) / 10 + "K";
        }
        return energy;
    },

    addEnergyTooltipDisplay(id) {
        ItemName.registerTooltipAddFunction(id,(item) => {
            return this.getShortForEnergy(ChargeItemRegistry.getEnergyStored(item)) + "/" + this.getShortForEnergy(ChargeItemRegistry.getMaxCharge(item.id)) + " Eu";
        });
    }
}

function ContainerWindow(header,state: {drawing?: any[],text?: {[key: string]: any},elements: {[key: string]: any}}) {
    state.drawing.push({"type": "bitmap","x": 900,"y": 325,"bitmap": "logo","scale": GUI_SCALE});

    if(state.text){
        var index = 0;

        for(let i in state.text){
            state.elements[i] = {"type": "text",font: {size: 15,color: android.graphics.Color.parseColor("#96dcdc")},x: 700,y: 75 + 30 * index++,width: 300,height: 30,text: state.text[i]}
        }

        if(index > 1){
            state.drawing.push({"type": "bitmap","x": 700 - GUI_SCALE * 4,"y": 75 - GUI_SCALE * 4,"bitmap": "info","scale": GUI_SCALE});   
        } else {
            state.drawing.push({"type": "bitmap","x": 700 - GUI_SCALE * 4,"y": 75 - GUI_SCALE * 4,"bitmap": "info_small","scale": GUI_SCALE});
        }
    }

    for(let i in state.drawing){
        var drawing = state.drawing[i];
        drawing.scale = drawing.scale || GUI_SCALE;
    }

    for(let i in state.elements){
        var element = state.elements[i];
        element.scale = element.scale || GUI_SCALE;
        if(element.type == "slot"){
            element.bitmap = "slot_empty";
        }
    }
    
    var window = new UI.StandartWindow({
        standard:{
            header: {text: {text: Translation.translate(header)}},
            inventory: {standard: true},
            background: {standard: true}
        },
        
        "drawing": state.drawing || [],
        "elements": state.elements || {}
    });

    Callback.addCallback("LevelLoaded",() => {
        MachineRegistry.updateUIHeader(window,Translation.translate(header));
    });

    return window;
}

function BasicMachineUI(name) {
    return ContainerWindow(name,{
        drawing:[
            {type:"bitmap",x:350,y:50,bitmap:"energy_background"},
            {type:"bitmap",x:600,y:175 + GUI_SCALE * 2,bitmap:"progress_background"},
        ],
    
        text: {
            "textEnergy": Translation.translate("Energy: ") + "0/0Eu"
        },
    
        elements:{
            "slotSource":{type:"slot",x:350 + GUI_SCALE * 43,y:175},
            "slotResult":{type:"slot",x:720,y:175,isValid:function(){return false;}},
    
            "scaleProgress":{type:"scale",x:600,y:175 + GUI_SCALE * 2,direction:0,value:0.5,bitmap:"progress_scale"},
            "scaleEnergy":{type:"scale",x:350 + GUI_SCALE * 6,y:50 + GUI_SCALE * 6,direction:1,value:0.5,bitmap:"energy_scale"}
        }
    });
}