import useGoogleSheets from 'use-google-sheets';

const fetchGoogleSheetData = async () => {
  try {
    const res = await fetch(
      'https://sheet.best/api/sheets/6c478cdd-3b8b-4cb2-8d08-6ec388512718',
    );
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export default fetchGoogleSheetData;
