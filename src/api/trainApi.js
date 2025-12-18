/* =====================================================
   RAPID API CONFIG
===================================================== */

const RAPID_HEADERS = {
  "X-RapidAPI-Key": import.meta.env.VITE_RAPIDAPI_KEY,
  "X-RapidAPI-Host": import.meta.env.VITE_RAPIDAPI_HOST,
};

/* =====================================================
   1️⃣ LIVE TRAIN STATUS
   Endpoint: /liveTrain
===================================================== */

export async function fetchTrainStatus(trainNumber, startDay = 1) {
  if (!trainNumber) {
    throw new Error("Train number is required");
  }

  const BASE_URL = "https://irctc-api2.p.rapidapi.com/liveTrain";

  try {
    const res = await fetch(
      `${BASE_URL}?trainNumber=${trainNumber}&startDay=${startDay}`,
      { headers: RAPID_HEADERS }
    );

    if (!res.ok) {
      throw new Error(`Live Train API Error: ${res.status}`);
    }

    const json = await res.json();

    return {
      success: json.success ?? true,
      data: json.data || {},
      message: json.message || "",
    };
  } catch (err) {
    console.error("LIVE TRAIN API ERROR 👉", err.message);
    throw err;
  }
}

/* =====================================================
   2️⃣ PNR STATUS
   Endpoint: /pnrStatus
===================================================== */

export async function fetchPnrStatus(pnr) {
  if (!pnr || pnr.length !== 10) {
    throw new Error("Enter a valid 10-digit PNR number");
  }

  const BASE_URL = "https://irctc-api2.p.rapidapi.com/pnrStatus";

  try {
    const res = await fetch(`${BASE_URL}?pnr=${pnr}`, {
      headers: RAPID_HEADERS,
    });

    if (!res.ok) {
      throw new Error(`PNR API Error: ${res.status}`);
    }

    const json = await res.json();

    return {
      success: json.success ?? false,
      data: json.data || null,
      message: json.message || "PNR not found",
    };
  } catch (err) {
    console.error("PNR API ERROR 👉", err.message);
    throw err;
  }
}

/* =====================================================
   3️⃣ LIVE STATION BOARD
   Endpoint: /liveStation
===================================================== */

export async function fetchLiveStation(source, destination = "", hours = 8) {
  if (!source) {
    throw new Error("Source station code required");
  }

  const BASE_URL = "https://irctc-api2.p.rapidapi.com/liveStation";

  try {
    const res = await fetch(
      `${BASE_URL}?source=${source}&destination=${destination}&hours=${hours}`,
      { headers: RAPID_HEADERS }
    );

    if (!res.ok) {
      throw new Error(`Live Station API Error: ${res.status}`);
    }

    const json = await res.json();

    return {
      success: json.success ?? true,
      trains: json.data || [],
      message: json.message || "",
    };
  } catch (err) {
    console.error("LIVE STATION ERROR 👉", err.message);
    throw err;
  }
}

/* =====================================================
   4️⃣ TRAIN SCHEDULE
   Endpoint: /trainSchedule
   ✅ NORMALIZED RESPONSE
===================================================== */

export async function fetchTrainSchedule(trainNumber) {
  if (!trainNumber) {
    throw new Error("Train number required");
  }

  const BASE_URL = "https://irctc-api2.p.rapidapi.com/trainSchedule";

  try {
    const res = await fetch(
      `${BASE_URL}?trainNumber=${trainNumber}`,
      { headers: RAPID_HEADERS }
    );

    if (!res.ok) {
      throw new Error(`Schedule API Error: ${res.status}`);
    }

    const json = await res.json();

    // ✅ Normalize route safely
    const route =
      json?.data?.route ||
      json?.data?.schedule ||
      json?.data?.stations ||
      [];

    return {
      success: json.success ?? true,
      train_name: json?.data?.train_name || "",
      train_number: json?.data?.train_number || trainNumber,
      route,
      message: json.message || "",
    };
  } catch (err) {
    console.error("TRAIN SCHEDULE ERROR 👉", err.message);
    throw err;
  }
}
