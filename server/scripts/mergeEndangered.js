import fs from "fs";

const fullSitesPath = "../data/whc_sites_fixed.json";
const endangeredSitesPath = "../data/whc_sites_endangered.json";
const outputPath = "../data/whc_sites_with_danger.json";

const fullSites = JSON.parse(fs.readFileSync(fullSitesPath, "utf8"));
const endangeredSites = JSON.parse(fs.readFileSync(endangeredSitesPath, "utf8"));

const lookup = {}

for ( const site of fullSites ) {
    site.danger = false;
    lookup[site.name] = site;
}

let successCount = 0;
let failCount = 0;

for (const site of endangeredSites) {
    if(lookup[site.name_en]){
        lookup[site.name_en].danger = true;
        successCount++
    }else{
        failCount++
        console.log(site.name, "eşleşmedi.");
    }
}

fs.writeFileSync(
    outputPath,
    JSON.stringify(fullSites, null, 2),
    "utf8",
);

console.log("Eşleşmeler tamamlandı.");
console.log("Başarılı eşleşmeler:", successCount);
console.log("Başarısız eşleşmeler:", failCount);