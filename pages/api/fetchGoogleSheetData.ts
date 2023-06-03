import useGoogleSheets from 'use-google-sheets';
import { v4 as uuidv4 } from 'uuid';

const fetchGoogleSheetData = async () => {
  try {
    const res = await fetch(
      'https://sheet.best/api/sheets/b3034561-ca3b-4f30-a783-b9a6bd0240e6',
    );
    const data = await res.json();
    const newData = data.map((item: any) => ({ ...item, id: uuidv4() }));
    return newData;
  } catch (error) {
    console.log(error);
  }
};

export default fetchGoogleSheetData;
