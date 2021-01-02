const fs = require("fs");
const crypto = require("crypto");
require("dotenv").config();

const encrypt = () => {
    const iv = crypto.randomBytes(16);
    const alg = "aes-256-ctr";

    if (!process.env.KEY) {
        console.error(
            'Missing encryption key. Fill "KEY" env variable in .env file.'
        );
        return;
    }

    const key = crypto
        .createHash("sha256")
        .update(process.env.KEY)
        .digest("hex");

    if (!!process.env.INPUT_FILE_NAME) {
        if (!fs.existsSync(`files/${process.env.INPUT_FILE_NAME}`)) {
            console.error(
                `No file named ${process.env.INPUT_FILE_NAME} in the files directory.`
            );
            return;
        }
    } else {
        if (!fs.existsSync("files/to-encrypt.txt")) {
            console.error("The to-encrypt.txt file does not exist.");
            return;
        }
    }

    const inputFilePath = !!process.env.INPUT_FILE_NAME
        ? `files/${process.env.INPUT_FILE_NAME}`
        : "files/to-encrypt.txt";
    const outputFilePath = "files/encrypted.txt";

    // Create the encrypted.txt file if it does not exist
    fs.closeSync(fs.openSync("files/encrypted.txt", "a"));

    const cipher = crypto.createCipheriv(alg, Buffer.from(key, "hex"), iv);
    const input = fs.readFileSync(inputFilePath);

    let encrypted = cipher.update(input);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    encrypted = iv.toString("hex") + ":" + encrypted.toString("hex");
    fs.writeFileSync(outputFilePath, encrypted);

    console.log("Encrypted data generated in encrypted.txt.");
};

const decrypt = () => {
    const alg = "aes-256-ctr";

    if (!process.env.KEY) {
        console.error(
            'Missing decryption key. Fill "KEY" env variable in .env file.'
        );
        return;
    }

    const key = crypto
        .createHash("sha256")
        .update(process.env.KEY)
        .digest("hex");

    if (!!process.env.INPUT_FILE_NAME) {
        if (!fs.existsSync(`files/${process.env.INPUT_FILE_NAME}`)) {
            console.error(
                `No file named ${process.env.INPUT_FILE_NAME} in the files directory.`
            );
            return;
        }
    } else {
        if (!fs.existsSync("files/encrypted.txt")) {
            console.error("The encrypted.txt file does not exist.");
            return;
        }
    }

    const inputFilePath = !!process.env.INPUT_FILE_NAME
        ? `files/${process.env.INPUT_FILE_NAME}`
        : "files/encrypted.txt";
    const outputFilePath = "files/decrypted.txt";

    // Create the decrypted.txt file if it does not exist
    fs.closeSync(fs.openSync("files/decrypted.txt", "a"));

    const input = fs.readFileSync(inputFilePath).toString();

    const data = input.split(":");
    const iv = Buffer.from(data.shift(), "hex");
    const encryptedText = Buffer.from(data.join(":"), "hex");
    const decipher = crypto.createDecipheriv(alg, Buffer.from(key, "hex"), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    fs.writeFileSync(outputFilePath, decrypted.toString());

    console.log("Decrypted data generated in decrypted.txt.");
};

if (process.env.MODE === "e") {
    encrypt();
} else if (process.env.MODE === "d") {
    decrypt();
} else {
    console.error(
        'No mode selected. Add a MODE variable in the .env file with "e" for encryption mode, "d" for decryption mode.'
    );
}
