import { Software } from "./dataTs/Software.js";
import { Hardware } from "./dataTs/Hardware.js";
import { HARDWARE_CATALOG, SOFTWARE_CATALOG, SERVICE_PRICES } from "./dataTs/data.js";
import { Cart } from "./dataTs/Cart.js";

// Inicializace samostatne tridy kosiku s predanim ID jeho HTML elementu
const cart = new Cart("cart-list");

// DOM elementy formulare a ziveho nahledu
const cpuSelect = document.getElementById("cpu") as HTMLSelectElement;
const mbSelect = document.getElementById("mb") as HTMLSelectElement;
const ramSelect = document.getElementById("ram") as HTMLSelectElement;
const ssdSelect = document.getElementById("ssd") as HTMLSelectElement;
const hddSelect = document.getElementById("hdd") as HTMLSelectElement; 
const gpuSelect = document.getElementById("gpu") as HTMLSelectElement;
const osSelect = document.getElementById("os") as HTMLSelectElement;

const chkOffice = document.getElementById("office") as HTMLInputElement;
const chkFlash = document.getElementById("flash") as HTMLInputElement;

const resultList = document.getElementById("result-list") as HTMLUListElement;
const totalPriceEl = document.getElementById("total-price") as HTMLHeadingElement;
const btnCheckout = document.querySelector(".btn-checkout") as HTMLButtonElement;

// Generovani moznosti pro selecty pomoci foreach
function populateSelect(select: HTMLSelectElement, items: any[]) {
    select.innerHTML = '<option value="">-- vyber --</option>';
    items.forEach(item => {
        const opt = document.createElement("option");
        opt.value = item.id.toString();
        opt.textContent = `${item.name} (${item.basePrice} Kč)`;
        select.appendChild(opt);
    });
}

// Inicializace aplikace pri nacteni stranky
function init() {
    populateSelect(cpuSelect, HARDWARE_CATALOG.CPU);
    populateSelect(ssdSelect, HARDWARE_CATALOG.SSD);
    populateSelect(gpuSelect, HARDWARE_CATALOG.GPU);
    populateSelect(osSelect, SOFTWARE_CATALOG);
    validateSelection();
    cart.render(); // Prvotni vykresleni prazdneho kosiku
}

// Kontrola kompatibility a odemykani/zamykani prvku
function validateSelection() {
    const cpuId = parseInt(cpuSelect.value);
    
    if (isNaN(cpuId)) {
        mbSelect.disabled = true;
        ramSelect.disabled = true;
        mbSelect.innerHTML = '<option value="">-- čekám na CPU --</option>';
        ramSelect.innerHTML = '<option value="">-- čekám na CPU --</option>';
    } else {
        mbSelect.disabled = false;
        ramSelect.disabled = false;
    }

    // Tlacitko pro vlozeni do kosiku se odemkne jen pri kompletnim vyplneni povinnych poli
    const isComplete = cpuSelect.value && mbSelect.value && ramSelect.value && 
                       ssdSelect.value && gpuSelect.value && osSelect.value;

    btnCheckout.disabled = !isComplete;
    btnCheckout.style.opacity = isComplete ? "1" : "0.5";
    btnCheckout.style.cursor = isComplete ? "pointer" : "not-allowed";
}

// Reaktivni zmena zakladni desky a RAM podle zvoleneho socketu procesoru
cpuSelect.addEventListener("change", () => {
    validateSelection();
    const cpuId = parseInt(cpuSelect.value);
    if (isNaN(cpuId)) return calculateTotal();

    const selectedCpu = HARDWARE_CATALOG.CPU.find(cpu => cpu.id === cpuId);

    if (selectedCpu) {
        // Filtrujeme zakladni desky podle socketu
        const validMbs = HARDWARE_CATALOG.MB.filter(mb => mb.socket === selectedCpu.socket);
        populateSelect(mbSelect, validMbs);

        // Filtrujeme RAM podle generace (DDR4 pro AM4, DDR5 pro AM5, Intel LGA1700 zvladne oboje)
        const validRams = HARDWARE_CATALOG.RAM.filter(ram => {
            const sock = selectedCpu.socket;
            return (sock === "AM4" && ram.ramType === "DDR4") || 
                   (sock === "AM5" && ram.ramType === "DDR5") || 
                   sock === "LGA1700";
        });
        populateSelect(ramSelect, validRams);
    }
    calculateTotal();
});

// Pomocna funkce pro vyhledani komponentu v celem katalogu podle ID
function findPartById(id: number): any {
    const hw = HARDWARE_CATALOG;
    const allParts = [...hw.CPU, ...hw.MB, ...hw.RAM, ...hw.SSD, ...hw.GPU];
    return allParts.find(part => part.id === id) || null;
}

// Prubezny prepocet ceny aktualni sestavy v zivem nahledu (Summary sidebar)
function calculateTotal() {
    validateSelection();
    let total = 0;
    resultList.innerHTML = "";

    const selectedIds = [
        parseInt(cpuSelect.value), parseInt(mbSelect.value),
        parseInt(ramSelect.value), parseInt(ssdSelect.value),
        parseInt(gpuSelect.value)
    ];

    // Iterace pres hardwarove komponenty a polymorfni plneni ziveho rozpisu
    selectedIds.forEach(id => {
        if (isNaN(id)) return;
        const part = findPartById(id);
        
        if (part) {
            const item = new Hardware(part.id, part.name, part.basePrice, part.type, part.capacity || 0, part.socket, part.ramType);
            total += item.calculatePrice();
            
            const li = document.createElement("li");
            li.className = "summary-item";
            li.innerHTML = `<div>${item.getName()}</div><div>${item.calculatePrice()} Kč</div>`;
            resultList.appendChild(li);
        }
    });

    // Zpracovani software a pridavnych sluzeb
    const osId = parseInt(osSelect.value);
    if (!isNaN(osId)) {
        const osData = SOFTWARE_CATALOG.find(os => os.id === osId);
        if (osData) {
            const softItem = new Software(osData.id, osData.name, osData.basePrice, chkOffice.checked, chkFlash.checked);
            total += softItem.calculatePrice();
            
            const li = document.createElement("li");
            li.className = "summary-item";
            li.innerHTML = `<div>${softItem.getName()}</div><div>${softItem.calculatePrice()} Kč</div>`;
            resultList.appendChild(li);
        }
    }

    // Vypocet ceny pro volitelny klasicky HDD
    const hddCap = parseInt(hddSelect.value);
    if (!isNaN(hddCap) && hddCap > 0) {
        const hddCost = (hddCap / 1000) * SERVICE_PRICES.HDD_PER_TB;
        total += hddCost;
        
        const li = document.createElement("li");
        li.className = "summary-item";
        li.innerHTML = `<div>HDD ${(hddCap / 1000)}TB</div><div>${hddCost} Kč</div>`;
        resultList.appendChild(li);
    }

    totalPriceEl.textContent = `${total} Kč`;
}

// Posluchace udalosti pro zmeny ve formulari pro okamzity prepocet ceny
mbSelect.addEventListener("change", calculateTotal);
ramSelect.addEventListener("change", calculateTotal);
ssdSelect.addEventListener("change", calculateTotal);
hddSelect.addEventListener("change", calculateTotal);
gpuSelect.addEventListener("change", calculateTotal);
osSelect.addEventListener("change", calculateTotal);
chkOffice.addEventListener("change", calculateTotal);
chkFlash.addEventListener("change", calculateTotal);

// Zpracovani tlacitka "Do kosiku" - delegace dat do instance tridy Cart
btnCheckout.addEventListener("click", () => {
    const cpuId = parseInt(cpuSelect.value);
    const cpuData = findPartById(cpuId);
    if (!cpuData) return;

    // Ziskame aktualni celkovou cenu vypoctenou na klientske strane
    const currentPrice = parseInt(totalPriceEl.textContent || "0");
    
    // Vytvorime novy objekt hardwarove sestavy (identifikujeme ji primarne podle CPU id)
    const newItem = new Hardware(cpuData.id, `Sestava (${cpuData.name})`, currentPrice, "sestava");
    
    // Pridame do kosiku - vnitrni metoda tridy Cart uz sama vyresi quantity i nasledny render
    cart.addItem(newItem);
});

// Pomocna funkce pro rychle predvyplneni konfigurace (Preset loader)
function loadPreset(cpu: number, mb: number, ram: number, ssd: number, gpu: number, os: number) {
    cpuSelect.value = cpu.toString();
    cpuSelect.dispatchEvent(new Event('change'));

    mbSelect.value = mb.toString();
    ramSelect.value = ram.toString();
    ssdSelect.value = ssd.toString();
    gpuSelect.value = gpu.toString();
    osSelect.value = os.toString();
    
    hddSelect.value = "";
    chkOffice.checked = false;
    chkFlash.checked = false;

    calculateTotal();
}

// DOM tlacitka pro rychly vyber predvoleb
const btnOffice = document.getElementById("preset-office") as HTMLButtonElement;
const btnHome = document.getElementById("preset-home") as HTMLButtonElement;
const btnGaming = document.getElementById("preset-gaming") as HTMLButtonElement;

btnOffice.addEventListener("click", () => loadPreset(1, 20, 18, 11, 6, 101));
btnHome.addEventListener("click", () => loadPreset(3, 21, 9, 12, 6, 102));
btnGaming.addEventListener("click", () => loadPreset(4, 22, 10, 13, 8, 103));

// Spusteni aplikace
init();