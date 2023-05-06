import useGoogleSheets from 'use-google-sheets';
import { v4 as uuidv4 } from 'uuid';

const fetchGoogleSheetData = async () => {
  try {
    const res = await fetch(
      'https://sheet.best/api/sheets/5e4d94fd-503f-44ed-bdf4-1d3d29a49e81',
    );
    const data = await res.json();
    const newData = data.map((item: any) => ({ ...item, id: uuidv4() }));
    return newData;
  } catch (error) {
    console.log(error);
  }
};

export default fetchGoogleSheetData;
