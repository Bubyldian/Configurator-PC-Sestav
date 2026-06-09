export class Cart {
    // konstruktor nastavi vazbu na prislusny DOM element
    constructor(cartListId) {
        // privatni stavove pole pro ukladani polozek kosiku
        this.items = [];
        this.cartListElement = document.getElementById(cartListId);
        if (!this.cartListElement) {
            throw new Error(`Element s id "${cartListId}" nebyl nalezen.`);
        }
    }
    // verejny getter pro pristup k polozkam z vnejsiho kodu
    getItems() {
        return this.items;
    }
    // metoda pro pridani polozky nebo zvyseni quantity pri duplicite
    addItem(newItem) {
        // kontrola existence polozky v poli podle ID
        const existingItem = this.items.find(item => item.getId() === newItem.getId());
        if (existingItem) {
            // pokud existuje, zvysi se pouze pocet kusu
            existingItem.quantity++;
        }
        else {
            // pokud neexistuje, prida se novy objekt do pole
            this.items.push(newItem);
        }
        // automaticke prekresleni UI po zmene stavu
        this.render();
    }
    // odstraneni polozky z pole na zaklade indexu
    removeItem(index) {
        if (index >= 0 && index < this.items.length) {
            this.items.splice(index, 1);
            this.render();
        }
    }
    // komplektni vycisteni pole kosiku
    clear() {
        this.items = [];
        this.render();
    }
    // vykresleni aktualniho stavu kosiku do HTML struktury
    render() {
        this.cartListElement.innerHTML = "";
        // zobrazeni defaultni zpravy pro prazdny kosik
        if (this.items.length === 0) {
            this.cartListElement.innerHTML = '<li class="empty-cart-msg">košík je prázdný</li>';
            return;
        }
        // generovani HTML obsahu pro kazdy prvek v poli items
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
        // prirazeni event listeneru pro smazani na vygenerovana tlacitka
        const delBtns = this.cartListElement.querySelectorAll(".btn-delete");
        delBtns.forEach(btn => {
            btn.addEventListener("click", (e) => {
                const targetBtn = e.target;
                const idx = parseInt(targetBtn.getAttribute("data-index") || "0");
                this.removeItem(idx);
            });
        });
    }
}
