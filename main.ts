import { HARDWARE_CATALOG, SOFTWARE_CATALOG, EXTRA_PRICES } from './data';

abstract class ConfigItem {
    #id: number;
    #name: string;
    protected basePrice: number;
    public quantity: number = 1;

    constructor(id: number, name: string, basePrice: number) {
        if (id <= 0) throw new Error("ID musí být kladné číslo.");
        if (!name.trim()) throw new Error("Název nesmí být prázdný.");
        if (basePrice < 0) throw new Error("Cena nesmí být záporná.");

        this.#id = id;
        this.#name = name;
        this.basePrice = basePrice;
    }

    public getName(): string { return this.#name; }
    abstract calculatePrice(): number;
    abstract getDetails(): string;
}

class Hardware extends ConfigItem {
    constructor(
        id: number,
        name: string,
        basePrice: number,
        private type: string,
        private capacity: number = 0,
        private socket?: string,
        private ramType?: string
    ) {
        super(id, name, basePrice);
    }

    public validateMemoryLimit(amount: number): boolean {
        if (this.ramType === 'DDR4' && amount > 32) return false;
        if (this.ramType === 'DDR5' && amount > 64) return false;
        return true;
    }

    calculatePrice(): number {
        return this.basePrice * this.quantity;
    }

    getDetails(): string {
        return `Hardware: ${this.type}` + 
               (this.socket ? `, Socket: ${this.socket}` : "") + 
               (this.capacity ? `, Kapacita: ${this.capacity}GB` : "");
    }
}

class Software extends ConfigItem {
    constructor(
        id: number,
        name: string,
        basePrice: number,
        public includeOffice: boolean = false,
        public includeFlash: boolean = false
    ) {
        super(id, name, basePrice);
    }

    calculatePrice(): number {
        let total = this.basePrice;
        if (this.includeOffice) total += EXTRA_PRICES.OFFICE_365;
        if (this.includeFlash) total += EXTRA_PRICES.FLASH_DRIVE;
        return total * this.quantity;
    }

    getDetails(): string {
        return `Software: ${this.getName()}` + 
               (this.includeOffice ? " + MS Office 365" : "") + 
               (this.includeFlash ? " + Recovery USB" : "");
    }
}

function runDemo() {
    try {
        const officePC: ConfigItem[] = [
            new Hardware(1, "Ryzen 3 3100", 1600, "CPU", 0, "AM4"),
            new Hardware(9, "DDR4 8GB", 900, "RAM", 8, undefined, "DDR4"),
            new Hardware(11, "SATA SSD 500GB", 1100, "SSD", 500),
            new Software(101, "Windows 10 Home", 2200)
        ];

        const gamingPC: ConfigItem[] = [
            new Hardware(5, "Ryzen 7 9800X3D", 12500, "CPU", 0, "AM5"),
            new Hardware(10, "DDR5 32GB", 2800, "RAM", 32, undefined, "DDR5"),
            new Hardware(8, "RTX 5060 Ti 16GB", 13500, "GPU"),
            new Software(103, "Windows 11 Pro", 3800, true, true)
        ];

        const builds = [
            { name: "Kancelářská sestava", items: officePC },
            { name: "Herní sestava", items: gamingPC }
        ];

        builds.forEach(build => {
            console.log(`\n--- ${build.name.toUpperCase()} ---`);
            let sum = 0;
            build.items.forEach(item => {
                const price = item.calculatePrice();
                sum += price;
                console.log(`${item.getName()} | ${item.getDetails()} | Cena: ${price} Kč`);
            });
            console.log(`Celková cena: ${sum} Kč`);
        });

    } catch (e: any) {
        console.error("Chyba aplikace: " + e.message);
    }
}

runDemo();