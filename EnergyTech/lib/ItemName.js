LIBRARY({
    name: "ItemName",
    version: 4,
    shared: true,
    api: "CoreEngine"
});

var OpenGUI = false;
Callback.addCallback("NativeGuiChanged",function(name){
    OpenGUI = ({
        "inventory_screen": true,
        "inventory_screen_pocket": true,
        "survival_inventory_screen": true,
        "creative_inventory_screen": true
    }[name]?true:false);
});

var ItemName = {
    tooltipAddFunctions: {},

    getTooltipFunc: function(id){
        if(!this.tooltipAddFunctions[id]){
			this.tooltipAddFunctions[id] = [];
		}
        return this.tooltipAddFunctions[id];
    },

    registerTooltipAddFunction: function(id,state,prefix){
        var tooltip = this.getTooltipFunc(id);
        tooltip.push({func: state,prefix: (prefix || "null")});
    },
    
    removeTooltip: function(id){
        delete this.tooltipAddFunctions[id];
    },

    removeTooltipByPrefix: function(id,prefix){
        var tooltip = this.getTooltipFunc(id);
        for(let i in tooltip){
            if(tooltip[i].prefix == prefix){
                delete tooltip[i];
            }
        }
    },
    
    onAddTooltip: function(item,translate,name){
        var data = "";
        if(OpenGUI){
            var tooltip = this.getTooltipFunc(item.id);
            for(let i in tooltip){
                data += "\n" + Native.Color.GRAY + tooltip[i].func(item,translate,name);
            }
        }
        return data;
    }
}

Callback.addCallback("LevelLoaded",function(){
    for(let id in ItemName.tooltipAddFunctions){
        if(!Item.nameOverrideFunctions[parseInt(id)]){
            Item.registerNameOverrideFunction(parseInt(id),function(item,translate,name){
                return translate + ItemName.onAddTooltip(item,translate,name);
            });
        }
    }
});

EXPORT("ItemName",ItemName);