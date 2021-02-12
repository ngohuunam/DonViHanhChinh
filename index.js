const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');

// const sourceArray = [];
// const danhSachQuanHuyen = {};
// const danhSachPhuongXa = {};
const result = {};
try {
  fs.createReadStream(path.resolve(__dirname, 'source.csv'))
    .pipe(csv.parse({ headers: true }))
    .on('error', (error) => console.error(error))
    .on('data', (row) => {
      // sourceArray.push(row);
      const tenTinhThanh = row['Tỉnh Thành Phố'];
      const tenQuanHuyen = row['Quận Huyện'];
      const tenPhuongXa = row['Phường Xã'];
      const maTP = row['Mã TP'];
      // danhSachQuanHuyen[tenTinhThanh] = danhSachQuanHuyen[tenTinhThanh] || [];
      result[tenTinhThanh] = result[tenTinhThanh] || {
        'Mã TP': maTP,
        'Tỉnh Thành Phố': tenTinhThanh,
        'Danh sách Quận Huyện': [],
        'Quận Huyện': {},
      };
      // if (danhSachQuanHuyen[tenTinhThanh].indexOf(tenQuanHuyen) < 0) danhSachQuanHuyen[tenTinhThanh].push(tenQuanHuyen);
      if (result[tenTinhThanh]['Danh sách Quận Huyện'].indexOf(tenQuanHuyen) < 0) result[tenTinhThanh]['Danh sách Quận Huyện'].push(tenQuanHuyen);

      // danhSachPhuongXa[tenTinhThanh] = danhSachPhuongXa[tenTinhThanh] || {};
      // danhSachPhuongXa[tenTinhThanh][tenQuanHuyen] = danhSachPhuongXa[tenTinhThanh][tenQuanHuyen] || [];
      result[tenTinhThanh]['Quận Huyện'][tenQuanHuyen] = result[tenTinhThanh]['Quận Huyện'][tenQuanHuyen] || {
        'Mã TP': maTP,
        'Tỉnh Thành Phố': tenTinhThanh,
        'Mã QH': row['Mã QH'],
        'Danh sách Phường Xã': [],
        'Phường Xã': {},
      };
      // if (danhSachPhuongXa[tenTinhThanh][tenQuanHuyen].indexOf(tenPhuongXa) < 0) danhSachPhuongXa[tenTinhThanh][tenQuanHuyen].push(tenPhuongXa);
      if (result[tenTinhThanh]['Quận Huyện'][tenQuanHuyen]['Danh sách Phường Xã'].indexOf(tenPhuongXa) < 0) {
        result[tenTinhThanh]['Quận Huyện'][tenQuanHuyen]['Danh sách Phường Xã'].push(tenPhuongXa);
      }
      result[tenTinhThanh]['Quận Huyện'][tenQuanHuyen]['Phường Xã'][tenPhuongXa] = {
        ...row,
        ...{ 'Danh sách Đường Phố': [], 'Đường Phố': {} },
      };
    })
    .on('end', (rowCount) => {
      // sourceArray.map((detail) => {
      //   const tenTinhThanh = detail['Tỉnh Thành Phố'];
      //   const tenQuanHuyen = detail['Quận Huyện'];
      //   const tenPhuongXa = detail['Phường Xã'];
      //   result[tenTinhThanh] = result[tenTinhThanh] || { 'Mã TP': detail['Mã TP'], 'Tỉnh Thành Phố': tenTinhThanh, 'Danh sách Quận Huyện': danhSachQuanHuyen[tenTinhThanh], 'Quận Huyện': {} };
      //   result[tenTinhThanh]['Quận Huyện'][tenQuanHuyen] = result[tenTinhThanh]['Quận Huyện'][tenQuanHuyen] || {
      //     'Mã TP': detail['Mã TP'],
      //     'Tỉnh Thành Phố': tenTinhThanh,
      //     'Mã QH': detail['Mã QH'],
      //     'Danh sách Phường Xã': danhSachPhuongXa[tenTinhThanh][tenQuanHuyen],
      //     'Phường Xã': {},
      //   };
      //   result[tenTinhThanh]['Quận Huyện'][tenQuanHuyen]['Phường Xã'][tenPhuongXa] = { ...detail, ...{ 'Danh sách Đường Phố': [], 'Đường Phố': {} } };
      // });

      // let data = JSON.stringify(danhSachQuanHuyen, null, 2);
      // let tenFileJson = 'danh_sach_quan_huyen.json';
      // fs.writeFileSync(tenFileJson, data);
      // console.log(tenFileJson + ' is saved.');

      // data = JSON.stringify(danhSachPhuongXa, null, 2);
      // tenFileJson = 'danh_sach_phuong_xa.json';
      // fs.writeFileSync(tenFileJson, data);
      // console.log(tenFileJson + ' is saved.');

      data = JSON.stringify(result, null, 2);
      tenFileJson = 'tinhThanh_quanHuyen_phuongXa_duongPho.json';
      fs.writeFileSync(tenFileJson, data);
      console.log(tenFileJson + ' is saved.');

      // console.log(`source: ${rowCount} rows, sourceArray len: ${sourceArray.length}`);
    });
} catch (error) {
  console.error(error);
}
