class ModLoader {
    static ic2(): boolean {
        let loader = false;
        ModAPI.addAPICallback("ICore",(api) => {
            loader = true; 
        });
        return loader;
    }
}