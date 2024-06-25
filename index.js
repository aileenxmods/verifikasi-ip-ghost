const axios = require("axios");
const chalk = require("chalk");
const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout
});

let ipListUrl = "";

// Function to set the IP list URL
const setIpListUrl = (url) => {
  ipListUrl = url;
};

// Function to fetch data from a URL
const fetchData = async (url) => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw new Error(`Error fetching data from the server: ${error.message}`);
  }
};

// Function to ask a question in the command line
const askQuestion = (prompt) => {
  return new Promise((resolve) => readline.question(prompt, resolve));
};

// Function to validate the IP address
const validateIP = async () => {
  try {
    const ipAddress = await fetchData("https://api64.ipify.org?format=json").then(response => response.ip);
    if (!ipListUrl) {
      console.log(chalk.red("IP list URL not set. Please set it using setIpListUrl function."));
      return null;
    }
    const ipList = await fetchData(ipListUrl);

    const ipEntry = ipList.find(entry => entry.IP === ipAddress);

    if (!ipEntry) {
      console.log(chalk.red(`IP TIDAK VALID / TIDAK TERDAFTAR\nIP: ${ipAddress}\nSilahkan Hubungi GhostX-Mods [ t.me/AnakManis5 ] untuk Melakukan Pendaftaran IP`));
      return null;
    }

    if (!ipEntry.Access) {
      console.log(chalk.red(`IP ANDA DI BLOKIR\nIP: ${ipAddress}\nSilahkan Hubungi GhostX-Mods [ t.me/AnakManis5 ] untuk Informasi Lebih Lanjut`));
      return null;
    }

    console.log(chalk.green(`  --------------------------------------------------------------------------.
  |
  |                               © GhostX-Mods                                 |
  |                                                                          |
  |  Terimakasih Atas Pembelian Script nya. Jika Terdapat Error Pada Script, |
  |                        Harap Lapor Ke Ownerku !!                         |
  |                                                                          |
  '--------------------------------------------------------------------------'
Ip Server : ${ipAddress}
Username: ${ipEntry.Nama}
`));

    return ipEntry;
  } catch (error) {
    console.log(chalk.red("\nADA KESALAHAN SAAT MEMERIKSA IP ANDA"));
    return null;
  }
};

// Function to verify the verification code
const verifyCode = async (expectedCode) => {
  while (true) {
    const code = await askQuestion(chalk.yellow.bold("Masukkan kode verifikasi: "));
    if (code.trim() === expectedCode) {
      return true;
    } else {
      console.log(chalk.red("Kode verifikasi salah. Coba lagi."));
    }
  }
};

module.exports = {
  validateIP,
  verifyCode,
  setIpListUrl
};
