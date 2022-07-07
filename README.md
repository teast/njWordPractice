# njWordPractice

A small tool for practicing vocabulary

## Pre-requirements

You need to have npm installed and then cordova.

To install cordova:

```bash
npm install cordova -g
```

Then you need to get an working android env. Check https://cordova.apache.org/ for information.

### Compile

When you want to compile this the first time you need to install needed platforms

```bash
# Android
cordova platform add android

# browser
cordova platform add browser
```

You will also need to install all needed npm packages:

```bash
npm install
```

Now to compile you can just issue following command:

```bash
# Android
cordova build android

# browser
cordova build browser
```

### Run

To run this project you do it with cordova commands:

```bash
# Android
cordova run android

# browser
cordova run browser
```