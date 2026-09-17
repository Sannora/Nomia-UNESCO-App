import fs from "fs";

const response = await fetch("http://127.0.0.1:8787/export-sites");

if (!response.ok) {
  throw new Error(
    `Export endpoint hata verdi: ${response.status} ${response.statusText}`
  );
}

const sites = await response.json();

console.log(`MongoDB'den ${sites.length} site alındı.`);

const escapeSql = (value) => {
  if (value === null || value === undefined) {
    return "NULL";
  }

  return `'${String(value).replace(/'/g, "''")}'`;
};

const escapeNumber = (value) => {
  if (value === null || value === undefined || value === "") {
    return "NULL";
  }

  const number = Number(value);

  return Number.isFinite(number) ? number : "NULL";
};

const escapeBoolean = (value) => {
  if (value === null || value === undefined) {
    return "NULL";
  }

  return value ? 1 : 0;
};

const statements = [];

for (const site of sites) {
  const coordinates = site.coordinates || {};

  const sql = `
INSERT OR REPLACE INTO sites (
    id,
    id_no,
    name,
    category,
    region,
    country,
    shortDescription,
    longDescription,
    dateInscribed,
    danger,
    latitude,
    longitude,
    image
) VALUES (
    ${escapeSql(site._id)},
    ${escapeNumber(site.id_no)},
    ${escapeSql(site.name)},
    ${escapeSql(site.category)},
    ${escapeSql(site.region)},
    ${escapeSql(site.country)},
    ${escapeSql(site.shortDescription)},
    ${escapeSql(site.longDescription)},
    ${escapeNumber(site.dateInscribed)},
    ${escapeBoolean(site.danger)},
    ${escapeNumber(coordinates.lat)},
    ${escapeNumber(coordinates.long)},
    ${escapeSql(site.image)}
);`;

  statements.push(sql.trim());
}

fs.writeFileSync(
  "./migration.sql",
  statements.join("\n"),
  "utf8"
);

console.log(
  `migration.sql oluşturuldu. ${statements.length} kayıt hazır.`
);