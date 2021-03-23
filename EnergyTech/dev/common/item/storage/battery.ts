/// <reference path="../../../init/machine.ts"/>

var item_lithium_battery = IDRegistry.genItemID("ENERGYTECH_BATTERY_LITHIUM_BATTERY");
Item.createItem("ENERGYTECH_BATTERY_LITHIUM_BATTERY","Lithium Battery",{name:"lithium_battery",meta:0},{stack:1,isTech:true});
ChargeItemRegistry.registerItem(item_lithium_battery,"Eu",1e4,32,1,true,true);
MachineRegistry.addEnergyTooltipDisplay(item_lithium_battery);

Item.registerIconOverrideFunction(item_lithium_battery,function(item){
	return {name: "lithium_battery",meta: Math.round((27 - item.data) / 26 * 6)}
});

var item_nuclear_battery = IDRegistry.genItemID("ENERGYTECH_BATTERY_NUCLEAR_BATTERY");
Item.createItem("ENERGYTECH_BATTERY_NUCLEAR_BATTERY","Nuclear Battery",{name:"nuclear_battery",meta:0},{stack:1,isTech:true});
ChargeItemRegistry.registerItem(item_nuclear_battery,"Eu",1e9,32,1,true,true);
MachineRegistry.addEnergyTooltipDisplay(item_nuclear_battery);

Item.registerIconOverrideFunction(item_nuclear_battery,function(item){
	return {name: "nuclear_battery",meta: Math.round((27 - item.data) / 26 * 6)}
});

ChargeItemRegistry.registerChargeFunction(item_nuclear_battery,function(){
    return 0;
});

ChargeItemRegistry.registerDischargeFunction(item_nuclear_battery,function(item,amount,transf){
    var stored = ChargeItemRegistry.getEnergyStored(item);
    var energy = Math.min(amount,Math.min(stored,transf));
    ChargeItemRegistry.setEnergyStored(item,stored - energy);
    return energy;
});

Item.addCreativeGroup("et_battery",Translation.translate("Materials"),[
    item_lithium_battery,
    item_nuclear_battery
]);