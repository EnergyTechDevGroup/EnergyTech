namespace RecipeUtils {
    export function addShaped(output,input) {
        
        var item = {}
        for(let i1 = 0;i1 < Math.min(3,input.length);i1++){
            for(let i2 = 0;i2 < Math.min(3,input[i1].length);i2++){
                if(input[i1][i2]){
                    var shaped = [[0,1,2],[3,4,5],[6,7,8]][i1][i2];
                    let data = input[i1][i2];
                    data.field = shaped;
                    item[shaped] = data;
                }
            }
        }

        var field = [];
        for(let i in item){
            field.push(i,item[i].id,item[i].data);
        }

        Recipes.addShaped(output,["012","345","678"],field,function(api,field,result){
            for(let i in item){
                item[i].remove = true;
                Callback.invokeCallback("et-recipe",api,item[i],result);

                if(item[i].onCrafting){
                    item[i].onCrafting(api,item[i],result);
                } else if(item[i].remove){
                    api.decreaseFieldSlot(parseInt(i));
                }
            }
        });
    }

    export function addShapeless(output,item) {
        Recipes.addShapeless(output,item,function(api,field,result){
            for(let i in item){
                item[i].remove = true;
                Callback.invokeCallback("et-recipe",api,item[i],result);

                if(item[i].onCrafting){
                    item[i].onCrafting(api,item[i],result);
                } else if(item[i].remove){
                    api.decreaseFieldSlot(parseInt(i));
                }
            }
        });
    }

    export function addRecipe(name,source,result,extra) {
        TileRecipe.addRecipe(name,source,result,extra);
    }
}

Callback.addCallback("et-recipe",(api,item,result) => {
    if(item.damage){
        item.remove = false;
        item.data += item.damage;
        if(item.data >= Item.getMaxDamage(item.id)){
            api.decreaseFieldSlot(item.field);
        }
    }
});