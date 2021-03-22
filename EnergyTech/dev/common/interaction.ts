/// <reference path="../init/material.ts"/>

Callback.addCallback("PreLoaded",() => {
    RecipeUtils.addRecipe("mixer",[
        {id: ItemID.dustTin,count: 1,data: 0},
        {id: ItemID.dustCopper,count: 3,data: 0}
    ],[
        {id: ItemID.dustBronze,count: 4,data: 0}
    ],64);

    RecipeUtils.addRecipe("mixer",[
        {id: ItemID.dustSmallTin,count: 1,data: 0},
        {id: ItemID.dustSmallCopper,count: 3,data: 0}
    ],[
        {id: ItemID.dustSmallBronze,count: 4,data: 0}
    ],64);

    RecipeUtils.addRecipe("mixer",[
        {id: ItemID.dustTinyTin,count: 1,data: 0},
        {id: ItemID.dustTinyCopper,count: 3,data: 0}
    ],[
        {id: ItemID.dustTinyBronze,count: 4,data: 0}
    ],64);

    RecipeUtils.addCraftingShapeless({id: ItemID.dustBronze,count: 4,data: 0},[
        {id: ItemID.dustTin,data: 0},
        {id: ItemID.dustCopper,data: 0},
        {id: ItemID.dustCopper,data: 0},
        {id: ItemID.dustCopper,data: 0}
    ]);
    
    RecipeUtils.addCraftingShapeless({id: ItemID.dustSmallBronze,count: 4,data: 0},[
        {id: ItemID.dustSmallTin,data: 0},
        {id: ItemID.dustSmallCopper,data: 0},
        {id: ItemID.dustSmallCopper,data: 0},
        {id: ItemID.dustSmallCopper,data: 0}
    ]);

    RecipeUtils.addCraftingShapeless({id: ItemID.dustTinyBronze,count: 4,data: 0},[
        {id: ItemID.dustTinyTin,data: 0},
        {id: ItemID.dustTinyCopper,data: 0},
        {id: ItemID.dustTinyCopper,data: 0},
        {id: ItemID.dustTinyCopper,data: 0}
    ]);
});

MaterialRegistry.registerInteractionFunction((material,meta) => {
    if(!meta.ingot || !meta.nugget) return false;
    
    RecipeUtils.addShaped({id: meta.ingot,count: 1,data: 0},[
        [{id: meta.nugget,data: 0},{id: meta.nugget,data: 0},{id: meta.nugget,data: 0}],
        [{id: meta.nugget,data: 0},{id: meta.nugget,data: 0},{id: meta.nugget,data: 0}],
        [{id: meta.nugget,data: 0},{id: meta.nugget,data: 0},{id: meta.nugget,data: 0}]
    ]);

    RecipeUtils.addCraftingShapeless({id: meta.nugget,count: 9,data: 0},[
        {id: meta.ingot,data: 0}
    ]);
});

MaterialRegistry.registerInteractionFunction((material,meta) => {
    if(!meta.block || !meta.ingot) return false;
    
    RecipeUtils.addShaped({id: meta.block,count: 1,data: 0},[
        [{id: meta.ingot,data: 0},{id: meta.ingot,data: 0},{id: meta.ingot,data: 0}],
        [{id: meta.ingot,data: 0},{id: meta.ingot,data: 0},{id: meta.ingot,data: 0}],
        [{id: meta.ingot,data: 0},{id: meta.ingot,data: 0},{id: meta.ingot,data: 0}]
    ]);

    RecipeUtils.addCraftingShapeless({id: meta.ingot,count: 9,data: 0},[
        {id: meta.block,data: 0}
    ]);
});

MaterialRegistry.registerInteractionFunction((material,meta) => {
    if(!meta.dust || !meta.dustSmall) return false;
    
    RecipeUtils.addShaped({id: meta.dust,count: 1,data: 0},[
        [{id: meta.dustSmall,data: 0},{id: meta.dustSmall,data: 0},{id: meta.dustSmall,data: 0}],
        [{id: meta.dustSmall,data: 0},{id: meta.dustSmall,data: 0},{id: meta.dustSmall,data: 0}],
        [{id: meta.dustSmall,data: 0},{id: meta.dustSmall,data: 0},{id: meta.dustSmall,data: 0}]
    ]);

    RecipeUtils.addCraftingShapeless({id: meta.dustSmall,count: 9,data: 0},[
        {id: meta.dust,data: 0}
    ]);
});

MaterialRegistry.registerInteractionFunction((material,meta) => {
    if(!meta.dustSmall || !meta.dustTiny) return false;
    
    RecipeUtils.addShaped({id: meta.dustSmall,count: 1,data: 0},[
        [{id: meta.dustTiny,data: 0},{id: meta.dustTiny,data: 0},{id: meta.dustTiny,data: 0}],
        [{id: meta.dustTiny,data: 0},{id: meta.dustTiny,data: 0},{id: meta.dustTiny,data: 0}],
        [{id: meta.dustTiny,data: 0},{id: meta.dustTiny,data: 0},{id: meta.dustTiny,data: 0}]
    ]);

    RecipeUtils.addCraftingShapeless({id: meta.dustTiny,count: 9,data: 0},[
        {id: meta.dustSmall,data: 0}
    ]);
});

MaterialRegistry.registerInteractionFunction((material,meta) => {
    if(!meta.oreSmall || !meta.nugget) return false;
    
    for(let i in meta.oreSmall){
        Recipes.addFurnace(meta.oreSmall[i],0,meta.nugget,0);
    }
});

MaterialRegistry.registerInteractionFunction((material,meta) => {
    if(!meta.ore || !meta.ingot) return false;
    
    for(let i in meta.ore){
        Recipes.addFurnace(meta.ore[i],0,meta.ingot,0);
    }
});

MaterialRegistry.registerInteractionFunction((material,meta) => {
    if(!meta.ore || !meta.gem) return false;
    
    for(let i in meta.ore){
        Recipes.addFurnace(meta.ore[i],0,meta.gem,0);
    }
});

MaterialRegistry.registerInteractionFunction((material,meta) => {
    if(!meta.ore || !meta.dustImpure) return false;
    
    for(let i in meta.ore){
        var level = ToolAPI.getBlockDestroyLevel(meta.ore[i]);
        RecipeUtils.addRecipe("macerator",[
            {id: meta.ore[i],count: 1,data: 0}
        ],[
            {id: meta.dustImpure,count: 2,data: 0}
        ],level*64);
    }
});

MaterialRegistry.registerInteractionFunction((material,meta) => {
    if(!meta.ingot || !meta.dust) return false;
    
    RecipeUtils.addRecipe("macerator",[
        {id: meta.ingot,count: 1,data: 0}
    ],[
        {id: meta.dust,count: 1,data: 0}
    ],data*64);
});

MaterialRegistry.registerInteractionFunction((material,meta,data) => {
    if(!meta.nugget || !meta.dustSmall) return false;
    
    RecipeUtils.addRecipe("macerator",[
        {id: meta.nugget,count: 1,data: 0}
    ],[
        {id: meta.dustSmall,count: 1,data: 0}
    ],data*64);
});

MaterialRegistry.registerInteractionFunction((material,meta) => {
    if(!meta.ingot) return false;
    for(let i in meta){
        if(ToolAPI.getToolData(meta[i])){
            Item.addRepairItemIds(meta[i],[meta.ingot]);
        }
    }
});

MaterialRegistry.registerInteractionFunction((material,meta) => {
    if(!meta.gem) return false;
    for(let i in meta){
        if(ToolAPI.getToolData(meta[i])){
            Item.addRepairItemIds(meta[i],[meta.gem]);
        }
    }
});

MaterialRegistry.registerInteractionFunction((material,meta) => {
    if(!meta.ingot || !meta.hammer) return false;

    if(ic2){
        RecipeUtils.addShaped({id: meta.hammer,count: 1,data: 0},[
            [{id: meta.ingot,data: 0},{id: meta.ingot,data: 0},null],
            [{id: meta.ingot,data: 0},{id: meta.ingot,data: 0},{id: 280,data: 0}],
            [{id: meta.ingot,data: 0},{id: meta.ingot,data: 0},null]
        ]);
    } else {
        RecipeUtils.addShaped({id: meta.hammer,count: 1,data: 0},[
            [null,{id: meta.ingot,data: 0},{id: 287,data: 0}],
            [null,{id: 280,data: 0},{id: meta.ingot,data: 0}],
            [{id: 280,data: 0},null,null]
        ]);
    }
},"hammer");

MaterialRegistry.registerInteractionFunction((material,meta,data) => {
    if(!meta.ingot || !meta.plate) return false;
    var hammer = MaterialRegistry.getAll("hammer");
    for(let i in hammer){
        RecipeUtils.addShaped({id: meta.plate,count: 1,data: 0},[
            [{id: hammer[i],data: -1,damage: 20}],
            [{id: meta.ingot,data: 0}],
            [{id: meta.ingot,data: 0}]
        ]);
    }
    RecipeUtils.addRecipe("bending_machine",[
        {id: meta.ingot,const: 1,data: 0}
    ],[
        {id: meta.plate,const: 1,data: 0}
    ],data*64);
},"plate");

MaterialRegistry.registerInteractionFunction((material,meta) => {
    if(!meta.sword || !meta.ingot) return false;
    RecipeUtils.addShaped({id:  meta.sword,count: 1,data: 0},[
        [{id: meta.ingot,data: 0}],
        [{id: meta.ingot,data: 0}],
        [{id: 280,data: 0}]
    ]);
},"sword");

MaterialRegistry.registerInteractionFunction((material,meta) => {
    if(!meta.shovel || !meta.ingot) return false;
    RecipeUtils.addShaped({id: meta.shovel,count: 1,data: 0},[
        [{id: meta.ingot,data: 0}],
        [{id: 280,data: 0}],
        [{id: 280,data: 0}]
    ]);
},"shovel");

MaterialRegistry.registerInteractionFunction((material,meta) => {
    if(!meta.pickaxe || !meta.ingot) return false;
    RecipeUtils.addShaped({id: meta.pickaxe,count: 1,data: 0},[
        [{id: meta.ingot,data: 0},{id: meta.ingot,data: 0},{id: meta.ingot,data: 0}],
        [null,{id: 280,data: 0},null],
        [null,{id: 280,data: 0},null]
    ]);
},"pickaxe");

MaterialRegistry.registerInteractionFunction((material,meta) => {
    if(!meta.axe || !meta.ingot) return false;
    RecipeUtils.addShaped({id: meta.axe,count: 1,data: 0},[
        [{id: meta.ingot,data: 0},{id: meta.ingot,data: 0},null],
        [{id: meta.ingot,data: 0},{id: 280,data: 0},null],
        [null,{id: 280,data: 0},null]
    ]);
    RecipeUtils.addShaped({id:  meta.axe,count: 1,data: 0},[
        [null,{id: meta.ingot,data: 0},{id: meta.ingot,data: 0}],
        [null,{id: 280,data: 0},{id: meta.ingot,data: 0}],
        [null,{id: 280,data: 0},null]
    ]);
},"axe");

MaterialRegistry.registerInteractionFunction((material,meta) => {
    if(!meta.hoe || !meta.ingot) return false;
    RecipeUtils.addShaped({id: meta.hoe,count: 1,data: 0},[
        [{id: meta.ingot,data: 0},{id: meta.ingot,data: 0},null],
        [null,{id: 280,data: 0},null],
        [null,{id: 280,data: 0},null]
    ]);
    RecipeUtils.addShaped({id:  meta.hoe,count: 1,data: 0},[
        [null,{id: meta.ingot,data: 0},{id: meta.ingot,data: 0}],
        [null,{id: 280,data: 0},null],
        [null,{id: 280,data: 0},null]
    ]);
},"hoe");

MaterialRegistry.registerInteractionFunction((material,meta) => {
    if(!meta.wrench || !meta.ingot) return false;
    RecipeUtils.addShaped({id: meta.wrench,count: 1,data: 0},[
        [{id: meta.ingot,data: 0},null,{id: meta.ingot,data: 0}],
        [{id: meta.ingot,data: 0},{id: meta.ingot,data: 0},{id: meta.ingot,data: 0}],
        [null,{id: meta.ingot,data: 0},null]
    ]);
},"wrench");

MaterialRegistry.registerInteractionFunction((material,meta) => {
    if(!meta.file || !meta.plate) return false;
    RecipeUtils.addShaped({id:  meta.file,count: 1,data: 0},[
        [{id: meta.plate,data: 0}],
        [{id: meta.plate,data: 0}],
        [{id: 280,data: 0}]
    ]);
},"file");