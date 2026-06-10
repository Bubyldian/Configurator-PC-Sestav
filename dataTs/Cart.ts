import { ConfigItem } from "./ConfigItem.js";

export class Cart {
    // privatni pole pro ukladani polozek v pameti
    private items: ConfigItem[] = [];
    private cartListElement: HTMLUListElement;

    // konstruktor s inicializaci a kontrolou existence elementu v DOM
    constructor(cartListId: string) {
        this.cartListElement = document.getElementById(cartListId) as HTMLUListElement;
        if (!this.cartListElement) {
            throw new Error(`Element s id "${cartListId}" nebyl nalezen.`);
        }
    }

    // getter pro vnejsi pristupy k polozkam
    public getItems(): ConfigItem[] {
        return this.items;
    }

    // vlozeni nove polozky nebo inkrementace quantity u duplicity
    public addItem(newItem: ConfigItem): void {
        const existingItem = this.items.find(item => item.getId() === newItem.getId());

        if (existingItem) {
            existingItem.quantity++;
        } else {
            this.items.push(newItem);
        }

        this.render();
    }

    // odstraneni polozky z pole podle indexu
    public removeItem(index: number): void {
        if (index >= 0 && index < this.items.length) {
            this.items.splice(index, 1);
            this.render();
        }
    }

    // vycisteni celeho obsahu kosiku
    public clear(): void {
        this.items = [];
        this.render();
    }

    // vykresleni stavu kosiku do HTML a prirazeni eventu
    public render(): void {
        this.cartListElement.innerHTML = "";

        if (this.items.length === 0) {
            this.cartListElement.innerHTML = '<li class="empty-cart-msg">košík je prázdný</li>';
            return;
        }

        this.items.forEach((item, index) => {
            const li = document.createElement("li");
            li.className = "cart-item";
            li.innerHTML = `
                <div class="cart-item-info">
                    📦 <strong>${item.getName()}</strong> 
                    <span class="cart-item-qty">${item.quantity}x</span>
                </div>
                <div class="cart-item-actions">
                    <span class="cart-item-price">${item.calculatePrice()} Kč</span>
                    <button class="btn-delete" data-index="${index}">❌ smazat</button>
                </div>
            `;
            this.cartListElement.appendChild(li);
        });

        // delegace udalosti smazani na tlacitka
        const delBtns = this.cartListElement.querySelectorAll(".btn-delete");
        delBtns.forEach(btn => {
            btn.addEventListener("click", (e) => {
                const targetBtn = e.target as HTMLButtonElement;
                const idx = parseInt(targetBtn.getAttribute("data-index") || "0");
                this.removeItem(idx);
            });
        });
    }
}