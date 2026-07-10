// ============================================================
// APIサーバー稼働時は PostgreSQL のデータに差し替える
// (file:// で開いた場合やAPIがない場合は js/data.js の内容をそのまま使用)
// ============================================================

async function loadRemoteData() {
  if (location.protocol === "file:") return false;
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 1500);
    const res = await fetch("/api/data", { signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) return false;
    const data = await res.json();
    if (Array.isArray(data.buildings) && data.buildings.length > 0 &&
        Array.isArray(data.rooms) && data.rooms.length > 0) {
      BUILDINGS = data.buildings;
      ROOMS = data.rooms;
      assignDefaultImages(ROOMS);
      console.info("スミカ不動産: PostgreSQL のデータを表示しています");
      return true;
    }
  } catch {
    // API未起動・タイムアウト時は静的データにフォールバック
  }
  return false;
}
