Callback.addCallback("et-material-translate",(material,translate) => {
    function add(name: string,language: {[key: string]: string}) {
        for(let i in language){
            language[i] = language[i].replace("%s",translate[i] || toTitleCase(material));
        }
        Translation.addTranslation(name.replace("%s",toTitleCase(material)),language);
    }

    // material
    add("%s Block"              ,{zh: "%s块"      ,ru: "%s руда"                });
    add("%s Coil"               ,{zh: "%s线圈"                                  });
    add("%s Dust"               ,{zh: "%s粉"      ,ru: "%s пыль"                });
    add("Impure Pile of %s Dust",{zh: "含杂%s粉"                                });
    add("Small Pile of %s Dust" ,{zh: "小堆%s粉"                                });
    add("Tiny Pile of %s Dust"  ,{zh: "小撮%s粉"  ,ru: "Небольшая кучка %s пыли"});
    add("%s Ingot"              ,{zh: "%s锭"      ,ru: "%s слиток"              });
    add("%s Nugget"             ,{zh: "%s粒"                                    });
    add("%s Ore"                ,{zh: "%s矿石"    ,ru: "%s руда"                });
    add("Small %s Ore"          ,{zh: "贫瘠%s矿石"                              });
    add("%s Plate"              ,{zh: "%s板"      ,ru: "%s пластина"            });
    add("%s Hammer"             ,{zh: "%s锤"                                    });
    add("%s Sword"              ,{zh: "%s剑"                                    });
    add("%s Shovel"             ,{zh: "%s铲"                                    });
    add("%s Pickaxe"            ,{zh: "%s镐"                                    });
    add("%s Axe"                ,{zh: "%s斧"                                    });
    add("%s Hoe"                ,{zh: "%s锄"                                    });
    add("%s Wrench"             ,{zh: "%s扳手"                                  });
    add("%s Mortar"             ,{zh: "%s研钵"                                  });
    add("%s Cutter"             ,{zh: "%s剪线钳"                                });
    add("%s File"               ,{zh: "%s锉刀"                                  });
    add("%s Saw"                ,{zh: "%s锯"                                    });
    add("%s Screwdriver"        ,{zh: "%s螺丝刀"                                });
});

// machine
Translation.addTranslation("Compressor"  ,{zh: "压缩机"  });
Translation.addTranslation("Macerator"   ,{zh: "打粉机"  });
Translation.addTranslation("Mixer"       ,{zh: "搅拌机"  });
Translation.addTranslation("Steam Boiler",{zh: "蒸汽锅炉"});

// info
Translation.addTranslation("Materials"  ,{zh: "材料"    });
Translation.addTranslation("Level"      ,{zh: "等级"    });
Translation.addTranslation("Durability" ,{zh: "耐久"    });
Translation.addTranslation("Power Tier" ,{zh: "能源等级"});
Translation.addTranslation("Max Voltage",{zh: "最高电压"});
Translation.addTranslation("Min Voltage",{zh: "最低电压"});

// materials translate: "res/texture-source/materials.json".