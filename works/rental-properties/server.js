// ============================================================
// スミカ不動産 APIサーバー
//   npm start  →  http://localhost:3000
// PostgreSQL(sumika_estate)からデータを配信します。
// DB接続先は環境変数 DATABASE_URL で上書き可能です。
// ============================================================
const express = require("express");
const { Pool } = require("pg");

const PORT = process.env.PORT || 3000;
const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL || "postgresql://localhost:5434/sumika_estate"
});

const app = express();
app.use(express.static(__dirname));

// 建物・部屋の全データ(フロントの js/data.js と同じ形で返す)
app.get("/api/data", async (_req, res) => {
  try {
    const buildings = await pool.query(`
      SELECT id, name, type, address, access,
             built_year   AS "builtYear",
             structure,
             total_floors AS "totalFloors",
             total_units  AS "totalUnits",
             note
      FROM buildings ORDER BY id`);
    const rooms = await pool.query(`
      SELECT id,
             building_id    AS "buildingId",
             room_no        AS "roomNo",
             floor, layout,
             area::float8      AS area,
             direction, rent,
             management_fee AS "managementFee",
             deposit::float8   AS deposit,
             key_money::float8 AS "keyMoney",
             parking, pet, tags, description, images
      FROM rooms ORDER BY id`);
    res.json({ source: "postgresql", buildings: buildings.rows, rooms: rooms.rows });
  } catch (e) {
    console.error("DBエラー:", e.message);
    res.status(500).json({ error: "database unavailable" });
  }
});

app.get("/api/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ok", db: "connected" });
  } catch {
    res.status(500).json({ status: "ng", db: "disconnected" });
  }
});

app.listen(PORT, () => {
  console.log(`スミカ不動産サーバー起動: http://localhost:${PORT}`);
});
