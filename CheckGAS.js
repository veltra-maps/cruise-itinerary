/**
 * ========================================
 * CruiseMapper Port Info Maintenance Script
 * ========================================
 * このGoogle Apps Scriptは、"Port by Country" シート上で `Port Flag = 1` の行だけを対象に、
 * CruiseMapperの港POIページ（https://www.cruisemapper.com/?poi=XXXX）をクロールし、
 * 以下の情報を自動取得・追記します：
 *
 * - PortName（末尾の "cruise port" を除去）
 * - PortCountry（カテゴリから国名のみ抽出）
 * - PortRegion（カテゴリ全体）
 * - LOCODE
 * - 緯度・経度
 * - CruiseMapper上のポート固有URL（https://www.cruisemapper.com/ports/xxxxx）
 * - GoogleMap URL（緯度経度付き）
 *
 * すべての出力は列名ベースでマッピングされており、シート構成の変更にも対応可能です。
 */
function fetchPortDetailsForFlaggedRowsOnly() {
  const sheet =
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Port by Country");
  const lastRow = sheet.getLastRow();
  const header = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const data = sheet.getRange(2, 1, lastRow - 1, header.length).getValues();

  // Map column headers to indices
  const getColIndex = (name) => header.indexOf(name);
  const portNoIndex = getColIndex("PortNo");
  const flagIndex = getColIndex("Port Flag");

  // Output columns
  const portRegionIndex = getColIndex("PortRegion");
  const locodeIndex = getColIndex("LOCODE");
  const latIndex = getColIndex("Latitude");
  const lngIndex = getColIndex("Longitude");
  const portMapUrlIndex = getColIndex("Port Map URL (CruiseMapper)");
  const googleMapIndex = getColIndex("GoogleMap");
  const portNameIndex = getColIndex("PortName");
  const portCountryIndex = getColIndex("PortCountry");
  const portUrlIndex = getColIndex("Port URL (CruiseMapper)");

  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    const rowIndex = i + 2;

    const flag = row[flagIndex];
    if (flag !== 1 && flag !== "1") {
      continue;
    }
    const portNo = row[portNoIndex];
    Logger.log(
      `▶ Row ${rowIndex}: PortNo=${portNo}, PortCountry=${
        row[getColIndex("PortCountry")]
      }, PortName=${row[getColIndex("PortName")]}`
    );

    const port = fetchPortDetailsFromCruiseMapper(portNo);

    if (!port) {
      sheet.getRange(rowIndex, portRegionIndex + 1).setValue("N/A");
      sheet.getRange(rowIndex, locodeIndex + 1).setValue("N/A");
      sheet.getRange(rowIndex, latIndex + 1).setValue("N/A");
      sheet.getRange(rowIndex, lngIndex + 1).setValue("N/A");
      sheet
        .getRange(rowIndex, portMapUrlIndex + 1)
        .setValue(`https://www.cruisemapper.com/?poi=${portNo}`);
      sheet.getRange(rowIndex, googleMapIndex + 1).setValue("N/A");
      sheet.getRange(rowIndex, portNameIndex + 1).setValue("N/A");
      sheet.getRange(rowIndex, portCountryIndex + 1).setValue("N/A");
      sheet.getRange(rowIndex, portUrlIndex + 1).setValue("N/A");
    } else {
      const googleMapsUrl = `https://www.google.com/maps?q=${port.lat},${port.lng}`;
      sheet
        .getRange(rowIndex, portRegionIndex + 1)
        .setValue(port.category || "N/A");
      sheet.getRange(rowIndex, locodeIndex + 1).setValue(port.locode || "N/A");
      sheet.getRange(rowIndex, latIndex + 1).setValue(port.lat || "N/A");
      sheet.getRange(rowIndex, lngIndex + 1).setValue(port.lng || "N/A");
      sheet
        .getRange(rowIndex, portMapUrlIndex + 1)
        .setValue(`https://www.cruisemapper.com/?poi=${portNo}`);
      sheet.getRange(rowIndex, googleMapIndex + 1).setValue(googleMapsUrl);
      sheet
        .getRange(rowIndex, portNameIndex + 1)
        .setValue(port.portName || "N/A");
      sheet
        .getRange(rowIndex, portCountryIndex + 1)
        .setValue(port.portCountry || "N/A");
      sheet
        .getRange(rowIndex, portUrlIndex + 1)
        .setValue(port.portUrl || "N/A");
    }
  }

  Logger.log(
    "✅ Port Flag = 1 の行の港情報を取得・追記しました（列名ベースで処理）"
  );
}

/**
 * 港の緯度経度と詳細情報を取得
 */
function getPortInfoFromPOIPage(poiId) {
  const url = `https://www.cruisemapper.com/?poi=${poiId}`;
  const html = UrlFetchApp.fetch(url).getContentText("utf-8");

  const nameMatch = html.match(/<h1 id="trackerItemTitle">\s*(.*?)\s*<\/h1>/);
  const rawPortName = nameMatch ? nameMatch[1].trim() : "N/A";
  const cleanedPortName = rawPortName.replace(/cruise port$/i, "").trim();

  const categoryMatch = html.match(
    /<h2 id="trackerItemCategory">\s*(.*?)\s*<\/h2>/
  );
  const rawCategory = categoryMatch ? categoryMatch[1].trim() : "N/A";
  const portCountry = rawCategory.split(" - ")[0].trim();

  const locodeMatch = html.match(
    /<li id="trackerItemSpec_2">[\s\S]*?LOCODE[\s\S]*?<span class="specValue"[^>]*>\s*([A-Z]{5})\s*<\/span>/
  );
  const locode = locodeMatch ? locodeMatch[1] : "N/A";

  const coordMatch = html.match(
    /Coordinates<\/span><span class="specValue"\s*>\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*<\/span>/
  );
  //const coordMatch = html.match(/Coordinates<\/span><span class="specValue"\s*>\s*([\d.]+)\s*,\s*([\d.]+)\s*<\/span>/);
  const lat = coordMatch ? coordMatch[1] : "N/A";
  const lng = coordMatch ? coordMatch[2] : "N/A";

  if (cleanedPortName && lat && lng) {
    /*
    Logger.log(`港名: ${cleanedPortName}`);
    Logger.log(`エリア: ${rawCategory}`);
    Logger.log(`LOCODE: ${locode}`);
    Logger.log(`緯度: ${lat}, 経度: ${lng}`);
    */
    return {
      poiId,
      portName: cleanedPortName,
      portCountry,
      category: rawCategory,
      locode,
      lat,
      lng,
    };
  } else {
    Logger.log(`港情報が不完全です（POI: ${poiId}）`);
    return null;
  }
}

/**
 * 港の緯度経度と詳細情報を取得（CruiseMapper用・関数名変更版）
 */
function fetchPortDetailsFromCruiseMapper(poiId) {
  const url = `https://www.cruisemapper.com/?poi=${poiId}`;
  const html = UrlFetchApp.fetch(url).getContentText("utf-8");

  const nameMatch = html.match(/<h1 id="trackerItemTitle">\s*(.*?)\s*<\/h1>/);
  const rawPortName = nameMatch ? nameMatch[1].trim() : "N/A";
  const cleanedPortName = rawPortName.replace(/cruise port$/i, "").trim();

  const categoryMatch = html.match(
    /<h2 id="trackerItemCategory">\s*(.*?)\s*<\/h2>/
  );
  const rawCategory = categoryMatch ? categoryMatch[1].trim() : "N/A";
  const portCountry = rawCategory.split(" - ")[0].trim();

  const locodeMatch = html.match(
    /<li id="trackerItemSpec_2">[\s\S]*?LOCODE[\s\S]*?<span class="specValue"[^>]*>\s*([A-Z]{5})\s*<\/span>/
  );
  const locode = locodeMatch ? locodeMatch[1] : "N/A";

  const coordMatch = html.match(
    /Coordinates<\/span><span class="specValue"\s*>\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*<\/span>/
  );
  const lat = coordMatch ? coordMatch[1] : "N/A";
  const lng = coordMatch ? coordMatch[2] : "N/A";

  const portUrlMatch = html.match(
    /<a href="(https:\/\/www\.cruisemapper\.com\/ports\/[^"]+)"\s+id="trackerItemAction_1"/
  );
  const portUrl = portUrlMatch ? portUrlMatch[1] : "N/A";

  if (cleanedPortName && lat && lng) {
    return {
      poiId,
      portName: cleanedPortName,
      portCountry,
      category: rawCategory,
      locode,
      lat,
      lng,
      portUrl,
    };
  } else {
    Logger.log(`港情報が不完全です（POI: ${poiId}）`);
    return null;
  }
}
