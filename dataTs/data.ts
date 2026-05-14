// ukladame ceny sluzeb
export const SERVICE_PRICES = {
    OFFICE_365: 1490,
    FLASH_DRIVE: 250,
    HDD_PER_TB: 650
};

// databaze hardwaru
export const HARDWARE_CATALOG = [
    // CPU
    { id: 1, name: "AMD Ryzen 3 3100", basePrice: 1600, type: 'CPU', socket: 'AM4' },
    { id: 2, name: "AMD Ryzen 5 5600X", basePrice: 3200, type: 'CPU', socket: 'AM4' },
    { id: 3, name: "Intel Core i5-12400F", basePrice: 3100, type: 'CPU', socket: 'LGA1700' },
    { id: 4, name: "AMD Ryzen 5 7600", basePrice: 4900, type: 'CPU', socket: 'AM5' },
    { id: 5, name: "AMD Ryzen 7 9800X3D", basePrice: 12500, type: 'CPU', socket: 'AM5' },
    
    // zakladni desky pro kazdy socket
    { id: 20, name: "AM4 Zakladni deska", basePrice: 1500, type: 'MB', socket: 'AM4' },
    { id: 21, name: "LGA1700 Zakladni deska", basePrice: 2500, type: 'MB', socket: 'LGA1700' },
    { id: 22, name: "AM5 Zakladni deska", basePrice: 3500, type: 'MB', socket: 'AM5' },

    // GPU
    { id: 6, name: "NVIDIA GTX 1650 Ti", basePrice: 3800, type: 'GPU' },
    { id: 7, name: "NVIDIA RTX 4060", basePrice: 7500, type: 'GPU' },
    { id: 8, name: "NVIDIA RTX 5060 Ti 16GB", basePrice: 13500, type: 'GPU' },
    
    // RAM
    { id: 18, name: "DDR4 8GB 2666MHz", basePrice: 450, type: 'RAM', ramType: 'DDR4', capacity: 8 },
    { id: 9, name: "DDR4 16GB 3200MHz", basePrice: 900, type: 'RAM', ramType: 'DDR4', capacity: 16 },
    { id: 10, name: "DDR5 32GB 6000MHz", basePrice: 2800, type: 'RAM', ramType: 'DDR5', capacity: 32 },
    
    // SSD
    { id: 11, name: "SATA SSD 500GB", basePrice: 1100, type: 'SSD', capacity: 500 },
    { id: 12, name: "M.2 NVMe 1TB", basePrice: 1900, type: 'SSD', capacity: 1000 },
    { id: 13, name: "M.2 NVMe 2TB", basePrice: 3500, type: 'SSD', capacity: 2000 },
    
    // HDD
    { id: 14, name: "HDD 4TB", basePrice: 2000, type: 'HDD', capacity: 4000 }
];

// databaze softwaru
export const SOFTWARE_CATALOG = [
    { id: 101, name: "Windows 10 Home", basePrice: 2200, version: '10', edition: 'Home', licenseType: 'OEM' },
    { id: 102, name: "Windows 11 Home", basePrice: 2500, version: '11', edition: 'Home', licenseType: 'OEM' },
    { id: 103, name: "Windows 11 Pro", basePrice: 3800, version: '11', edition: 'Pro', licenseType: 'Retail' }
];