import { ConfigItem } from "./ConfigItem.js";
import { SERVICE_PRICES } from "./data.js";

export class Software extends ConfigItem {
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
        if (this.includeOffice) total += SERVICE_PRICES.OFFICE_365;
        if (this.includeFlash) total += SERVICE_PRICES.FLASH_DRIVE;
        return total * this.quantity;
    }

    getDetails(): string {
        const addons = [];
        if (this.includeOffice) addons.push("MS Office 365");
        if (this.includeFlash) addons.push("Recovery USB flash disk");
        
        return `Software: ${this.getName()}${addons.length > 0 ? " + " + addons.join(" + ") : ""}`;
    }
}