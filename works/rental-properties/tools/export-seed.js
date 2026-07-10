// ============================================================
// js/data.js から db/seed.sql を生成します
//   node tools/export-seed.js
// ============================================================
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const dataSrc = fs.readFileSync(path.join(ROOT, "js/data.js"), "utf8");
const { BUILDINGS, ROOMS } = new Function(dataSrc + "; return { BUILDINGS, ROOMS };")();

function q(str) {
  return "'" + String(str).replace(/'/g, "''") + "'";
}

function qj(obj) {
  return q(JSON.stringify(obj)) + "::jsonb";
}

const lines = [
  "-- ============================================================",
  "-- スミカ不動産 シードデータ(tools/export-seed.js により自動生成)",
  `-- 生成日: ${new Date().toISOString().slice(0, 10)}`,
  "-- ============================================================",
  "",
  "BEGIN;",
  "TRUNCATE rooms, buildings;",
  ""
];

for (const b of BUILDINGS) {
  lines.push(
    `INSERT INTO buildings (id, name, type, address, access, built_year, structure, total_floors, total_units, note) VALUES (` +
    [q(b.id), q(b.name), q(b.type), q(b.address), qj(b.access), b.builtYear, q(b.structure), b.totalFloors, b.totalUnits, q(b.note)].join(", ") +
    ");"
  );
}

lines.push("");

for (const r of ROOMS) {
  lines.push(
    `INSERT INTO rooms (id, building_id, room_no, floor, layout, area, direction, rent, management_fee, deposit, key_money, parking, pet, tags, description, images) VALUES (` +
    [q(r.id), q(r.buildingId), q(r.roomNo), r.floor, q(r.layout), r.area, q(r.direction), r.rent, r.managementFee, r.deposit, r.keyMoney, q(r.parking), r.pet, qj(r.tags), q(r.description), qj(r.images)].join(", ") +
    ");"
  );
}

lines.push("", "COMMIT;", "");

fs.writeFileSync(path.join(ROOT, "db/seed.sql"), lines.join("\n"));
console.log(`db/seed.sql を生成しました(建物 ${BUILDINGS.length}件 / 部屋 ${ROOMS.length}件)`);
