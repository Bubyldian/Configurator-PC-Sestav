import {Software} from "./dataTs/Software.js";
import {Hardware} from "./dataTs/Hardware.js";


const myCpu = new Hardware(2, "AMD Ryzen 5 5600X", 3000, "CPU", 0, "AM4");
console.log(myCpu.getDetails()); 

const zxc = new Software(101, "Windows 10 Home", 8000, true, true);
console.log(zxc.getDetails());
console.log("Total Price: " + zxc.calculatePrice());