LIBRARY({
    name: "ItemName",
    version: 5,
    shared: false,
    api: "CoreEngine"
});
var OpenGUI = false;
Callback.addCallback("NativeGuiChanged", function (name) {
    OpenGUI = ({
        "inventory_screen": true,
        "inventory_screen_pocket": true,
        "survival_inventory_screen": true,
        "creative_inventory_screen": true
    }[name] ? true : false);
});
var ItemName;
(function (ItemName) {
    var data = {};
    function initNameData(id) {
        data[id] = { "name": function (item, translate, name) {
                return translate;
            }, "tooltip": [] };
    }
    function registerNameOverrideFunction(id, state) {
        if (!data[id])
            initNameData(id);
        data[id].name = state;
    }
    ItemName.registerNameOverrideFunction = registerNameOverrideFunction;
    function registerTooltipAddFunction(id, state) {
        if (!data[id])
            initNameData(id);
        data[id].tooltip.push({ "tooltip": state });
    }
    ItemName.registerTooltipAddFunction = registerTooltipAddFunction;
    function removeTooltip(id) {
        if (data[id])
            data[id].tooltip = [];
    }
    ItemName.removeTooltip = removeTooltip;
    function setName(id, name) {
        registerNameOverrideFunction(id, function () {
            return name;
        });
    }
    ItemName.setName = setName;
    function getColor(color) {
        return Native.Color[color.toUpperCase()] || color;
    }
    ItemName.getColor = getColor;
    function onOverrideName(item, translate, name) {
        var meta = data[item.id];
        if (meta) {
            return meta.name(item, translate, name) + onAddTooltip(item);
        }
    }
    function onAddTooltip(item) {
        var tooltip = "";
        if (OpenGUI) {
            var meta = data[item.id].tooltip;
            if (meta) {
                for (var i in meta) {
                    tooltip += "\n" + getColor("gray") + meta[i].tooltip(item);
                }
            }
        }
        return tooltip;
    }
    Callback.addCallback("ItemNameOverride", function (item, translate, name) {
        return onOverrideName(item, translate, name);
    });
})(ItemName || (ItemName = {}));
Item.setName = ItemName.setName;
Item.registerNameOverrideFunction = ItemName.registerNameOverrideFunction;
EXPORT("ItemName", ItemName);
