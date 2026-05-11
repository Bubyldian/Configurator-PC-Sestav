export class ConfigItem {
    constructor(id, name, basePrice) {
        this.quantity = 1;
        if (id <= 0)
            throw new Error("ID musí být kladné číslo.");
        if (!name.trim())
            throw new Error("Název nesmí být prázdný.");
        if (basePrice < 0)
            throw new Error("Cena nesmí být záporná.");
        this.id = id;
        this.name = name;
        this.basePrice = basePrice;
    }
    getName() { return this.name; }
    getId() { return this.id; }
}
