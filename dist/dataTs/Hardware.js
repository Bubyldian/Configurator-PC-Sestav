import { ConfigItem } from "./ConfigItem.js";
import { SERVICE_PRICES } from "./data.js";
// trida pro hardwarove dily
export class Hardware extends ConfigItem {
    constructor(id, name, basePrice, type, capacity = 0, socket, ramType) {
        super(id, name, basePrice);
        this.type = type;
        this.capacity = capacity;
        this.socket = socket;
        this.ramType = ramType;
        // kontrola pameti pri vytvareni objektu
        if (type === 'RAM' && !this.validateMemoryLimit(capacity)) {
            throw new Error("Překročen limit paměti pro tenhle typ.");
        }
    }
    validateMemoryLimit(amount) {
        if (this.ramType === 'DDR4' && amount > 32)
            return false;
        if (this.ramType === 'DDR5' && amount > 64)
            return false;
        return true;
    }
    calculatePrice() {
        let total = this.basePrice;
        // pridani ceny za kazdy dalsi TB nad 2tb
        if (this.type === 'HDD' && this.capacity > 2000) {
            const extraSize = this.capacity - 2000;
            const extraTb = extraSize / 1000;
            total += extraTb * SERVICE_PRICES.HDD_PER_TB;
        }
        return total * this.quantity;
    }
    getDetails() {
        let details = `Typ: ${this.type}`;
        if (this.socket)
            details += `, Socket: ${this.socket}`;
        if (this.ramType)
            details += `, Paměť: ${this.ramType}`;
        if (this.capacity > 0)
            details += `, Kapacita: ${this.capacity}GB`;
        return details;
    }
}
