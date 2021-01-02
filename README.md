# simple-encryptor
A simple AES encryption/decryption Node.js app powered by Docker

## Install

This app uses Docker and Compose, you need to install these tools before using this app.

* Build the image :

```bash
docker-compose build
```

## How to use

### Encrypt mode

* Create a file named `to-encrypt.txt` within the `files` directory and fill it with some secret data
* Encrypt your data with an encryption key that you chose :

```bash
docker-compose run --rm -e MODE=e -e KEY=super_secret_key simple-encryptor
```

The encrypted data will be in the `encrypted.txt` file within the `files` directory.

You can also choose the name of the input file with the environment variable `INPUT_FILE_NAME` :
```bash
docker-compose run --rm -e MODE=e -e KEY=super_secret_key -e INPUT_FILE_NAME=my_file.txt simple-encryptor
```

### Decrypt mode

The app will try to decrypt a file named `encrypted.txt` in the `files` directory.

```bash
docker-compose run --rm -e MODE=d -e KEY=super_secret_key simple-encryptor
```

The decrypted data will be in the `decrypted.txt` file within the `files` directory.

You can specify the name of the input file the same way it is done with the encryption mode.
