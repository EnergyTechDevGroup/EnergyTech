namespace Tooltip {
    export function getShortForEnergy(energy: number): string {
        if(energy >= 1e9){
            return Math.floor(energy / 1e8) / 10 + "G";
        }
        if(energy >= 1e6){
            return Math.floor(energy / 1e5) / 10 + "M";
        }
        if(energy >= 1e3){
            return Math.floor(energy / 1e2) / 10 + "K";
        }
        return energy.toString();
    }

    export function addEnergyDisplay(id: number): void {
        ItemName.registerTooltipAddFunction(id,(item) => {
            return getShortForEnergy(ChargeItemRegistry.getEnergyStored(item)) + "/" + getShortForEnergy(ChargeItemRegistry.getMaxCharge(item.id)) + " Eu";
        });
    }

    export function addLevelDisplay(id: number,level?: number): void {
        ItemName.registerTooltipAddFunction(id,(item) => {
            return Translation.translate("Level") + ": " + (level || ToolAPI.getBlockDestroyLevel(item.id));
        });
    }
}