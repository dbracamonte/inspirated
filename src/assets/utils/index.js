function arrayPartitions(array, partitionIn) {
  if (!partitionIn) {
    console.error("La propiedad partitionIn debe contener un valor valido!");
    return [];
  }

  if (array.length <= partitionIn) return [array];

  const numPartitions = Math.ceil(array.length / partitionIn);
  const arrayParticionados = [];

  for (let i = 0; i < numPartitions; i++) {
    const from = i * partitionIn;
    const to = ((i + 1) * partitionIn);
    // console.log({ from }, { to });
    const partition = array.slice(from, to);
    arrayParticionados.push(partition);
  }

  return arrayParticionados;
}

function JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel) {
  //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
  let arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;

  let CSV = '';
  //Set Report title in first row or line

  CSV += ReportTitle + '\r\n\n';

  //This condition will generate the Label/Header
  if (ShowLabel) {
    let label = "";

    //This loop will extract the label from 1st index of on array
    for (let index in arrData[0]) {

      //Now convert each value to string and comma-seprated
      label += index + ',';
    }

    label = label.slice(0, -1);

    //append Label row with line break
    CSV += label + '\r\n';
  }

  //1st loop is to extract each row
  for (let i = 0; i < arrData.length; i++) {
    let row = "";

    //2nd loop will extract each column and convert it in string comma-seprated
    for (let position in arrData[i]) {
      row += '"' + arrData[i][position] + '",';
    }

    row.slice(0, row.length - 1);

    //add a line break after each row
    CSV += row + '\r\n';
  }

  if (CSV === '') {
    alert("Invalid data");
    return;
  }

  //Generate a file name
  let fileName = "MyReport_";
  //this will remove the blank-spaces from the title and replace it with an underscore
  fileName += ReportTitle.replace(/ /g, "_");

  //Initialize file format you want csv or xls
  let uri = 'data:text/csv;charset=utf-8,' + escape(CSV);

  // Now the little tricky part.
  // you can use either>> window.open(uri);
  // but this will not work in some browsers
  // or you will not get the correct file extension    

  //this trick will generate a temp <a /> tag
  let link = document.createElement("a");
  link.href = uri;

  //set the visibility hidden so it will not effect on your web-layout
  link.style = "visibility:hidden";
  link.download = fileName + ".csv";

  //this part will append the anchor tag and remove it after automatic click
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function formatMoney(n, c, d, t) {
  c = isNaN(c = Math.abs(c)) ? 2 : c;
  d = typeof d === 'undefined' ? "." : d;
  t = typeof t === 'undefined' ? "," : t;

  let s = n < 0 ? "-" : "",
    i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))),
    j = i.length > 3 ? i.length % 3 : 0;

  return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};

function randomString(length) {
  let text = "";
  let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

const statusTickets = {
  'waiting': 'En Espera',
  'approved': 'Aprobado',
  'rejected': 'Rechazado',
}

const statusCodes = {
  detained: 'In-Habilitado',
  released: 'Habilitado',
  used: 'Usado',
};

const typeReasedCode = {
  'more-tickets': 'Para más de 5 Tickets',
  'platea-tickets': 'Para optar por entradas a platea',
};

const statuses = ['waiting', 'approved', 'rejected'];

module.exports = {
  statuses,
  formatMoney,
  statusCodes,
  randomString,
  statusTickets,
  typeReasedCode,
  arrayPartitions,
  JSONToCSVConvertor,
};