import { Software } from "./dataTs/Software.js";
import { Hardware } from "./dataTs/Hardware.js";
import { HARDWARE_CATALOG, SOFTWARE_CATALOG } from "./dataTs/data.js";
// hardware z databaze podle id
function getHw(id) {
    let data = null;
    // projdeme celou databazi hardwaru
    for (let i = 0; i < HARDWARE_CATALOG.length; i++) {
        if (HARDWARE_CATALOG[i].id === id) {
            data = HARDWARE_CATALOG[i];
            break; // nasli jsme, koncime cyklus
        }
    }
    // pokud jsme nic nenasli, vyhodime chybu
    if (!data)
        throw new Error("dil nenalezen.");
    return new Hardware(data.id, data.name, data.basePrice, data.type, data.capacity, data.socket, data.ramType);
}
// projdeme celou databazi softwaru a hledame podle id, navic muzeme nastavit jestli chceme k tomu office a flashku
function getSw(id, includeOffice = false, includeFlash = false) {
    let data = null;
    // projdeme celou databazi softwaru polozku po polozce
    for (let i = 0; i < SOFTWARE_CATALOG.length; i++) {
        if (SOFTWARE_CATALOG[i].id === id) {
            data = SOFTWARE_CATALOG[i];
            break; // nasli jsme, koncime cyklus
        }
    }
    // pokud jsme nic nenasli, vyhodime chybu
    if (!data)
        throw new Error("softver nenalezen.");
    return new Software(data.id, data.name, data.basePrice, includeOffice, includeFlash);
}
// 1. kancelarsky pc (zen 2 am4, 8gb ddr4, sata 500gb, win 10 home oem)
const officePc = [
    getHw(1), // Ryzen 3 3100
    getHw(20), // AM4 deska
    getHw(18), // 8GB DDR4
    getHw(11), // 500GB SATA
    getSw(101, true, false) // Win 10 Home OEM + Office (bez flashky)
];
// 2. domaci pracovni pc (12400f lga1700, 16gb ddr4, 1tb m.2, 1650ti, win 11 home oem)
const homePc = [
    getHw(3), // i5-12400F
    getHw(21), // LGA1700 deska
    getHw(9), // 16GB DDR4
    getHw(12), // 1TB M.2
    getHw(6), // 1650 Ti
    getSw(102, false, true) // Win 11 Home OEM + zachranna flashka
];
// 3. herni pc (7600 am5, 32gb ddr5, 2tb m.2, 5060ti, win 11 pro retail)
const gamingPc = [
    getHw(4), // Ryzen 5 7600
    getHw(22), // AM5 deska
    getHw(10), // 32GB DDR5
    getHw(13), // 2TB M.2
    getHw(8), // 5060 Ti
    getSw(103, false, false) // Win 11 Pro Retail (bez ofisu a flashky)
];
// vypis + vypocet cele sestavy
function printSetup(name, setup) {
    console.log(`\n--- ${name} ---`);
    let total = 0;
    setup.forEach(part => {
        // projde vsechny dily a spusti u kazdeho vlastni metodu
        console.log(`[id: ${part.getId()}] ${part.getName()} | ${part.getDetails()} -> ${part.calculatePrice()} kc`);
        total += part.calculatePrice();
    });
    console.log(`celkova cena sestavy: ${total} kc`);
}
// vypsani do konzole prohlizece
printSetup("kancelarsky pocitac", officePc);
printSetup("domaci pracovni pc", homePc);
printSetup("vykonna herni masina", gamingPc);
