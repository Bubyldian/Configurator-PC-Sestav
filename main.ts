import { Software } from "./dataTs/Software.js";
import { Hardware } from "./dataTs/Hardware.js";
import { HARDWARE_CATALOG, SOFTWARE_CATALOG, SERVICE_PRICES } from "./dataTs/data.js";
import { Cart } from "./dataTs/Cart.js";

// inicializace kosiku s predanim ID elementu
const cart = new Cart("cart-list");

// nacteni referenci na DOM elementy
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

// naplneni selectu daty pomoci foreach
function populateSelect(select: HTMLSelectElement, items: any[]) {
    select.innerHTML = '<option value="">-- vyber --</option>';
    items.forEach(item => {
        const opt = document.createElement("option");
        opt.value = item.id.toString();
        opt.textContent = `${item.name} (${item.basePrice} Kč)`;
        select.appendChild(opt);
    });
}

// prvotni nastaveni aplikace po nacteni stranky
function init() {
    populateSelect(cpuSelect, HARDWARE_CATALOG.CPU);
    populateSelect(ssdSelect, HARDWARE_CATALOG.SSD);
    populateSelect(gpuSelect, HARDWARE_CATALOG.GPU);
    populateSelect(osSelect, SOFTWARE_CATALOG);
    validateSelection();
    cart.render();
}

// overeni vyplneni povinnych poli a prepinani disabled stavu
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

    const isComplete = cpuSelect.value && mbSelect.value && ramSelect.value && 
                       ssdSelect.value && gpuSelect.value && osSelect.value;

    btnCheckout.disabled = !isComplete;
    btnCheckout.style.opacity = isComplete ? "1" : "0.5";
    btnCheckout.style.cursor = isComplete ? "pointer" : "not-allowed";
}

// zmena CPU -> dynamicka filtrace desek a pameti podle socketu
cpuSelect.addEventListener("change", () => {
    validateSelection();
    const cpuId = parseInt(cpuSelect.value);
    if (isNaN(cpuId)) return calculateTotal();

    const selectedCpu = HARDWARE_CATALOG.CPU.find(cpu => cpu.id === cpuId);

    if (selectedCpu) {
        // filtrace kompatibilnich MB
        const validMbs = HARDWARE_CATALOG.MB.filter(mb => mb.socket === selectedCpu.socket);
        populateSelect(mbSelect, validMbs);

        // filtrace kompatibilnich RAM (DDR4 vs DDR5)
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

// pomocne vyhledani komponentu v katalogu podle ID
function findPartById(id: number): any {
    const hw = HARDWARE_CATALOG;
    const allParts = [...hw.CPU, ...hw.MB, ...hw.RAM, ...hw.SSD, ...hw.GPU];
    return allParts.find(part => part.id === id) || null;
}

// prubezny vypocet a rendering ceny aktualni konfigurace
function calculateTotal() {
    validateSelection();
    let total = 0;
    resultList.innerHTML = "";

    const selectedIds = [
        parseInt(cpuSelect.value), parseInt(mbSelect.value),
        parseInt(ramSelect.value), parseInt(ssdSelect.value),
        parseInt(gpuSelect.value)
    ];

    // vypocet ceny a vypis hw polozek
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

    // vypocet ceny OS a doplňků
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

    // vypocet ceny volitelneho HDD
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

// listeners pro prepocitavani sumy
mbSelect.addEventListener("change", calculateTotal);
ramSelect.addEventListener("change", calculateTotal);
ssdSelect.addEventListener("change", calculateTotal);
hddSelect.addEventListener("change", calculateTotal);
gpuSelect.addEventListener("change", calculateTotal);
osSelect.addEventListener("change", calculateTotal);
chkOffice.addEventListener("change", calculateTotal);
chkFlash.addEventListener("change", calculateTotal);

// pridani sestavy do kosiku
btnCheckout.addEventListener("click", () => {
    const cpuId = parseInt(cpuSelect.value);
    const cpuData = findPartById(cpuId);
    if (!cpuData) return;

    const currentPrice = parseInt(totalPriceEl.textContent || "0");
    const newItem = new Hardware(cpuData.id, `Sestava (${cpuData.name})`, currentPrice, "sestava");
    
    cart.addItem(newItem);
});

// pomocne predvyplneni presetu
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

// spusteni aplikace
init();