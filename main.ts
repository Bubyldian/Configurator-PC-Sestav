import { Software } from "./dataTs/Software.js";
import { Hardware } from "./dataTs/Hardware.js";
import { HARDWARE_CATALOG, SOFTWARE_CATALOG } from "./dataTs/data.js";
import { ConfigItem } from "./dataTs/ConfigItem.js";

// ziskani elementu z html
const cpuSelect = document.getElementById("cpu") as HTMLSelectElement;
const mbSelect = document.getElementById("mb") as HTMLSelectElement;
const ramSelect = document.getElementById("ram") as HTMLSelectElement;
const ssdSelect = document.getElementById("ssd") as HTMLSelectElement;
const hddSelect = document.getElementById("hdd") as HTMLSelectElement;
const gpuSelect = document.getElementById("gpu") as HTMLSelectElement;
const osSelect = document.getElementById("os") as HTMLSelectElement;

const chkOffice = document.getElementById("office") as HTMLInputElement;
const chkFlash = document.getElementById("flash") as HTMLInputElement;
const calcBtn = document.getElementById("calc-btn") as HTMLButtonElement;

const resultDiv = document.getElementById("result") as HTMLDivElement;
const resultList = document.getElementById("result-list") as HTMLUListElement;
const totalPriceH3 = document.getElementById("total-price") as HTMLHeadingElement;

// pomocne funkce pro naplneni selectu
function populateSelect(select: HTMLSelectElement, items: any[]) {
    // smazeme stare moznosti krome prvni (vyzva k vyberu)
    select.innerHTML = '<option value="">-- vyberte --</option>';
    for (let i = 0; i < items.length; i++) {
        const option = document.createElement("option");
        option.value = items[i].id.toString();
        option.textContent = `${items[i].name} (${items[i].basePrice} kc)`;
        select.appendChild(option);
    }
}

// inicializace zakladnich vyberu (ktere nezavisi na nicem jinem)
function init() {
    const cpus = [];
    const ssds = [];
    const hdds = [];
    const gpus = [];

    for (let i = 0; i < HARDWARE_CATALOG.length; i++) {
        const item = HARDWARE_CATALOG[i];
        if (item.type === 'CPU') cpus.push(item);
        if (item.type === 'SSD') ssds.push(item);
        if (item.type === 'HDD') hdds.push(item);
        if (item.type === 'GPU') gpus.push(item);
    }

    populateSelect(cpuSelect, cpus);
    populateSelect(ssdSelect, ssds);
    populateSelect(hddSelect, hdds);
    populateSelect(gpuSelect, gpus);
    populateSelect(osSelect, SOFTWARE_CATALOG);
}

// logika pro vyber procesoru (zpristupni spravne desky a pameti)
cpuSelect.addEventListener("change", () => {
    const cpuId = parseInt(cpuSelect.value);
    
    // pokud uzivatel vyber zrusi, zase vsechno zamkneme
    if (isNaN(cpuId)) {
        mbSelect.innerHTML = '<option value="">-- nejdriv vyber procesor --</option>';
        ramSelect.innerHTML = '<option value="">-- nejdriv vyber procesor --</option>';
        mbSelect.disabled = true;
        ramSelect.disabled = true;
        document.getElementById("step-mb")?.classList.add("disabled");
        document.getElementById("step-ram")?.classList.add("disabled");
        validateForm();
        return;
    }

    let selectedCpu = null;
    for (let i = 0; i < HARDWARE_CATALOG.length; i++) {
        if (HARDWARE_CATALOG[i].id === cpuId) {
            selectedCpu = HARDWARE_CATALOG[i];
            break;
        }
    }

    if (selectedCpu) {
        const mbs = [];
        const rams = [];

        for (let i = 0; i < HARDWARE_CATALOG.length; i++) {
            const item = HARDWARE_CATALOG[i];
            
            // deska musi mit stejny socket jako cpu
            if (item.type === 'MB' && item.socket === selectedCpu.socket) {
                mbs.push(item);
            }
            
            // validace pameti podle platformy
            if (item.type === 'RAM') {
                if (selectedCpu.socket === 'AM4' && item.ramType === 'DDR4') rams.push(item);
                if (selectedCpu.socket === 'AM5' && item.ramType === 'DDR5') rams.push(item);
                if (selectedCpu.socket === 'LGA1700') rams.push(item); // intel bere obe
            }
        }

        // odemknuti formularu
        populateSelect(mbSelect, mbs);
        populateSelect(ramSelect, rams);
        mbSelect.disabled = false;
        ramSelect.disabled = false;
        document.getElementById("step-mb")?.classList.remove("disabled");
        document.getElementById("step-ram")?.classList.remove("disabled");
    }
    
    validateForm();
});

// validace pro povoleni tlacitka (musi byt vyplneny povinne pole)
function validateForm() {
    if (cpuSelect.value && mbSelect.value && ramSelect.value && ssdSelect.value && gpuSelect.value && osSelect.value) {
        calcBtn.disabled = false;
    } else {
        calcBtn.disabled = true;
    }
}

// posluchace pro zmeny ve formulari pro kontrolu tlacitka
mbSelect.addEventListener("change", validateForm);
ramSelect.addEventListener("change", validateForm);
ssdSelect.addEventListener("change", validateForm);
gpuSelect.addEventListener("change", validateForm);
osSelect.addEventListener("change", validateForm);

// vytvoreni objektu a vypocet po kliknuti
calcBtn.addEventListener("click", () => {
    // vyuzivame oop tridy z faze 2
    const setup: ConfigItem[] = [];

    // funkce pro hledani v katalogu
    const getHwData = (id: number) => {
        for (let i = 0; i < HARDWARE_CATALOG.length; i++) {
            if (HARDWARE_CATALOG[i].id === id) return HARDWARE_CATALOG[i];
        }
        return null;
    };

    const hwIds = [
        parseInt(cpuSelect.value), parseInt(mbSelect.value), 
        parseInt(ramSelect.value), parseInt(ssdSelect.value), 
        parseInt(gpuSelect.value)
    ];

    // volitelny hdd
    if (hddSelect.value) hwIds.push(parseInt(hddSelect.value));

    // oziveni hardveru
    for (let i = 0; i < hwIds.length; i++) {
        const data = getHwData(hwIds[i]);
        if (data) {
            setup.push(new Hardware(data.id, data.name, data.basePrice, data.type, data.capacity, data.socket, data.ramType));
        }
    }

    // oziveni softveru
    const osId = parseInt(osSelect.value);
    let osData = null;
    for (let i = 0; i < SOFTWARE_CATALOG.length; i++) {
        if (SOFTWARE_CATALOG[i].id === osId) {
            osData = SOFTWARE_CATALOG[i];
            break;
        }
    }

    if (osData) {
        setup.push(new Software(osData.id, osData.name, osData.basePrice, chkOffice.checked, chkFlash.checked));
    }

    // polymorfismus: vypis dat
    resultList.innerHTML = "";
    let total = 0;

    for (let i = 0; i < setup.length; i++) {
        const item = setup[i];
        const price = item.calculatePrice();
        total += price;

        const li = document.createElement("li");
        li.innerHTML = `<strong>${item.getName()}</strong> <br> <small>${item.getDetails()}</small> <br> <em>${price} kc</em>`;
        resultList.appendChild(li);
    }

    totalPriceH3.textContent = `celkova cena: ${total} kc`;
    
    // zobrazeni vysledku
    resultDiv.classList.remove("hidden");
});

// spusteni appky
init();