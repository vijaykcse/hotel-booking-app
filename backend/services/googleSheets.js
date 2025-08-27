import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import dotenv from 'dotenv';

dotenv.config();

function extractSheetId(rawValue) {
  if (!rawValue) return undefined;
  const match = String(rawValue).match(/\/(?:d)\/([a-zA-Z0-9-_]+)/);
  if (match && match[1]) return match[1];
  return String(rawValue);
}

const googleServiceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const googlePrivateKey = (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n');
const googleSheetId = extractSheetId(process.env.GOOGLE_SHEET_ID);

let doc = null;
try {
  if (googleServiceAccountEmail && googlePrivateKey && googleSheetId) {
    const serviceAccountAuth = new JWT({
      email: googleServiceAccountEmail,
      key: googlePrivateKey,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    doc = new GoogleSpreadsheet(googleSheetId, serviceAccountAuth);
  } else {
    console.warn('[googleSheets] Missing env vars. Expected GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY, GOOGLE_SHEET_ID');
  }
} catch (error) {
  console.error('[googleSheets] Failed to initialize GoogleSpreadsheet:', error?.message || error);
}

export const getRooms = async () => {
  try {
    if (!doc) {
      console.warn('[googleSheets] Google Sheet not configured. Returning empty rooms list.');
      return [];
    }
    await doc.loadInfo();
    const sheet = doc.sheetsByTitle['Rooms'];
    const rows = await sheet.getRows();
    return rows.map(row => ({
      id: row.get('id'),
      name: row.get('name'),
      roomType: row.get('roomType'),
      description: row.get('description'),
      imageUrl: row.get('imageUrl'),
      basePrice: {
        single: +row.get('basePriceSingle'),
        double: +row.get('basePriceDouble'),
      },
      extraPerson: {
        adult: +row.get('extraPersonAdult'),
        child: +row.get('extraPersonChild'),
      },
      amenities: (row.get('amenities') || '').split(',').filter(Boolean),
      maxOccupancy: +row.get('maxOccupancy'),
    }));
  } catch (error) {
    console.error('[googleSheets.getRooms] Failed to read rooms:', error?.message || error);
    return [];
  }
};

export const checkAvailability = async (startDate, endDate, roomId) => {
  try {
    if (!doc) {
      console.warn('[googleSheets] Google Sheet not configured. Assuming availability = true.');
      return true;
    }
    await doc.loadInfo();
    const sheet = doc.sheetsByTitle['Inventory'];
    const rows = await sheet.getRows();

    const start = new Date(startDate);
    const end = new Date(endDate);

    for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
      const dateString = d.toISOString().split('T')[0];
      const inventoryRow = rows.find(r => r.get('date') === dateString && r.get('roomId') === roomId);
      if (!inventoryRow || +inventoryRow.get('availableCount') <= 0) {
        return false;
      }
    }
    return true;
  } catch (error) {
    console.error('[googleSheets.checkAvailability] Failed to check:', error?.message || error);
    return true;
  }
};

async function getOrCreateSheet(title, headerValues) {
  await doc.loadInfo();
  let sheet = doc.sheetsByTitle[title];
  if (!sheet) {
    sheet = await doc.addSheet({ title, headerValues });
  }
  return sheet;
}

export const bookRoom = async ({ roomId, startDate, endDate, adults = 1, numChildren = 0, ratePlanId = '', totalPrice = 0 }) => {
  try {
    if (!doc) {
      console.warn('[googleSheets] Not configured, simulating booking');
      return { success: true, bookingId: `SIM-${Date.now()}` };
    }

    await doc.loadInfo();
    const inventorySheet = doc.sheetsByTitle['Inventory'];
    if (!inventorySheet) {
      return { success: false, message: 'Inventory sheet not found' };
    }
    const rows = await inventorySheet.getRows();

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Re-check availability first
    for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
      const dateString = d.toISOString().split('T')[0];
      const row = rows.find(r => r.get('date') === dateString && r.get('roomId') === roomId);
      if (!row || +row.get('availableCount') <= 0) {
        return { success: false, message: `No availability on ${dateString}` };
      }
    }

    // Decrement inventory
    for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
      const dateString = d.toISOString().split('T')[0];
      const row = rows.find(r => r.get('date') === dateString && r.get('roomId') === roomId);
      const available = +row.get('availableCount');
      row.set('availableCount', String(available - 1));
      await row.save();
    }

    // Log booking
    const bookingsSheet = await getOrCreateSheet('Bookings', [
      'id','roomId','startDate','endDate','adults','children','ratePlanId','totalPrice'
    ]);
    const bookingId = `BK-${Date.now()}`;
    await bookingsSheet.addRow({
      id: bookingId,
      roomId,
      startDate,
      endDate,
      adults: String(adults),
      children: String(numChildren),
      ratePlanId,
      totalPrice: String(totalPrice)
    });

    return { success: true, bookingId };
  } catch (error) {
    console.error('[googleSheets.bookRoom] Failed:', error?.message || error);
    return { success: false, message: error?.message || 'Booking failed' };
  }
};
