export abstract class ConfigItem {
    protected id: number;
    protected name: string;
    protected basePrice: number;
    public quantity: number = 1;

    constructor(id: number, name: string, basePrice: number) {
        if (id <= 0) throw new Error("ID musí být kladné číslo.");
        if (!name.trim()) throw new Error("Název nesmí být prázdný.");
        if (basePrice < 0) throw new Error("Cena nesmí být záporná.");

        this.id = id;
        this.name = name;
        this.basePrice = basePrice;
    }

    public getName(): string { return this.name; }
    public getId(): number { return this.id; }

    abstract calculatePrice(): number;
    abstract getDetails(): string;
}