const fs = require('fs');
const path = require('path');


const saveChartToFile = (base64Chart, filename) => {
    // Extract the actual Base64 data
    const base64Image = base64Chart.split(';base64,').pop();

   
    const folderPath = path.join(__dirname, '..', 'charts');
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath); 
    }

    const filePath = path.join(folderPath, filename);

    // Save the Base64 data as a PNG file
    fs.writeFileSync(filePath, base64Image, { encoding: 'base64' });
    return filePath;
};

module.exports = { saveChartToFile };
