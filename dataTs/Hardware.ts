import { ConfigItem } from "./ConfigItem.js";

// trida pro klasicke hardwarove komponenty z katalogu
export class Hardware extends ConfigItem {
    private type: string; 
    private socket?: string;
    private ramType?: string;
    private capacity: number;

    constructor(
        id: number, 
        name: string, 
        basePrice: number, 
        type: string,
        capacity: number = 0,
        socket?: string,
        ramType?: string
    ) {
        super(id, name, basePrice);
        this.type = type;
        this.capacity = capacity;
        this.socket = socket;
        this.ramType = ramType;

        // kontrola pameti ram pri vytvoreni objektu at neprekrocime limity desky
        if (type === 'RAM' && !this.validateMemoryLimit(capacity)) {
            throw new Error("Překročen limit paměti pro tenhle typ.");
        }
    }

    public validateMemoryLimit(amount: number): boolean {
        if (this.ramType === 'DDR4' && amount > 32) return false;
        if (this.ramType === 'DDR5' && amount > 64) return false;
        return true;
    }

    calculatePrice(): number {
        // tady uz neni zadne slozite hdd, proste jenom zakladni cena krat pocet kusu
        return this.basePrice * this.quantity;
    }

    getDetails(): string {
        let details = `Typ: ${this.type}`;
        
        if (this.socket) details += `, Socket: ${this.socket}`;
        if (this.ramType) details += `, Paměť: ${this.ramType}`;
        if (this.capacity > 0) details += `, Kapacita: ${this.capacity}GB`;
        
        return details;
    }
}