// @ts-nocheck
LIBRARY({
    name: "TileRecipe",
    version: 1,
    shared: false,
    api: "CoreEngine"
});
var TileRecipeRegistry;
(function (TileRecipeRegistry) {
    var data = {};
    function getRecipe(name, create) {
        if (!data[name] && create)
            data[name] = [];
        return data[name];
    }
    TileRecipeRegistry.getRecipe = getRecipe;
    function addRecipe(name, source, result, extra) {
        getRecipe(name, true).push({ "source": source, "result": result, "extra": (typeof (extra) == "number" ? { "work_time": extra } : extra) });
    }
    TileRecipeRegistry.addRecipe = addRecipe;
    function isValidInput(item, side, tile) {
        var recipe = tile.recipe.getRecipeData();
        if (recipe) {
            for (var i in recipe) {
                var input = recipe[i].source;
                if (input.id == item.id && input.data == item.data) {
                    return true;
                }
            }
        }
        return false;
    }
    TileRecipeRegistry.isValidInput = isValidInput;
})(TileRecipeRegistry || (TileRecipeRegistry = {}));
var TileRecipe = /** @class */ (function () {
    function TileRecipe(tile) {
        this.tileEntity = tile;
    }
    TileRecipe.prototype.getRecipeData = function () {
        var tile = this.tileEntity;
        if (tile.getRecipeByName) {
            return TileRecipeRegistry.getRecipe(tile.getRecipeByName(), true);
        }
        return null;
    };
    TileRecipe.prototype.getInputSlot = function () {
        var tile = this.tileEntity;
        if (tile.interface) {
            var slot = [];
            for (var i in tile.interface.slots) {
                if (tile.interface.slots[i].input) {
                    slot.push(i);
                }
            }
            return slot;
        }
        return tile.getTransportSlots().input;
    };
    TileRecipe.prototype.getOutputSlot = function () {
        var tile = this.tileEntity;
        if (tile.interface) {
            var slot = [];
            for (var i in tile.interface.slots) {
                if (tile.interface.slots[i].output) {
                    slot.push(i);
                }
            }
            return slot;
        }
        return tile.getTransportSlots().output;
    };
    TileRecipe.prototype.getItemCount = function (slot, id, data) {
        var item = {};
        for (var i in slot) {
            if (slot[i].id > 0) {
                var key1 = slot[i].id;
                item[key1] = item[key1] || 0;
                item[key1] += slot[i].count;
                var key2 = slot[i].id + ":" + slot[i].data;
                item[key2] = item[key2] || 0;
                item[key2] += slot[i].count;
            }
        }
        return item[id + (!data || data == -1 ? "" : ":" + data)];
    };
    TileRecipe.prototype.getValidRecipeData = function () {
        var recipe = this.getRecipeData();
        if (recipe) {
            for (var i1 in recipe) {
                var valid = true;
                for (var i2 in recipe[i1].source) {
                    var input = recipe[i1].source[i2];
                    var count = this.getItemCount(this.parSlot(this.getInputSlot()), input.id, input.data);
                    if (!count || count < input.count) {
                        valid = false;
                        break;
                    }
                }
                if (valid)
                    return recipe[i1];
            }
        }
        return null;
    };
    TileRecipe.prototype.parSlot = function (slot) {
        var item = [];
        for (var i in slot) {
            var container = this.tileEntity.container;
            item.push(container.getSlot(slot[i]));
        }
        return item;
    };
    TileRecipe.prototype.outSourceToSlot = function (recipe) {
        for (var i1 in recipe.source) {
            var input = recipe.source[i1];
            var count = input.count;
            var slot = this.parSlot(this.getInputSlot());
            for (var i2 in slot) {
                var item = slot[i2];
                if (item.id == input.id && item.data == input.data) {
                    var remove = Math.min(count, item.count);
                    count -= remove;
                    item.count -= remove;
                    item.validate();
                }
            }
        }
        for (var i1 in recipe.result) {
            var output = recipe.result[i1];
            var count = output.count;
            var slot = this.parSlot(this.getOutputSlot());
            for (var i2 in slot) {
                var item = slot[i2];
                if (item.id == 0 || item.id == output.id && item.data == output.data) {
                    var maxStack = Item.getMaxStack(slot[i2].id);
                    var add = Math.min(count, maxStack - slot[i2].count);
                    count -= add;
                    slot[i2].setSlot(output.id, slot[i2].count + add, output.data);
                }
            }
            if (count > 0) {
                var tile = this.tileEntity;
                World.drop(tile.x + 0.5, tile.y + 0.5, tile.z + 0.5, output.id, count, output.data);
                count = 0;
            }
        }
    };
    return TileRecipe;
}());
Callback.addCallback("TileEntityAdded", function (tileEntity) {
    tileEntity.tileRecipe = new TileRecipe(tileEntity);
});
EXPORT("TileRecipe", TileRecipeRegistry);
