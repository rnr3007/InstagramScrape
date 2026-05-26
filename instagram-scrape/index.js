require('dotenv').config();

const express = require('express');

const {remote} = require('webdriverio');
const {goToHome, extractInstaUser} = require('./action');
const {execSync} = require('child_process');

const API_PORT = process.env.API_PORT;
const DEVICE_ID = process.env.ANDROID_ID;
const ANDROID_LAUNCHER = process.env.ANDROID_DEFAULT_LAUNCHER.toString().match(/\{([^}]+)\}/)[1];
const LAUNCHER_PKG = ANDROID_LAUNCHER.split('/')[0];
const LAUNCHER_ACT = `.${ANDROID_LAUNCHER.split('\.').at(-1)}`;

// Configure the capability for the webdriver
const capabilites = {
    // Define the Device configuration, apps, and activity that will be used
    platformName: 'Android',
    'appium:automationName': 'UiAutomator2',
    'appium:deviceName': DEVICE_ID,
    'appium:appPackage': LAUNCHER_PKG,
    'appium:appActivity': LAUNCHER_ACT,
    // Make use of the existing session instead of keep trying to log in into a new one
    'appium:noReset': true,
    // Make ease the searcing process
    'appium:disableWindowAnimation': false,
    'appium:unicodeKeyboard': true,
    'appium:resetKeyboard': true
};

// Configuration for the appium server along with its default value
const wdOpts = {
    host: process.env.APPIUM_HOST || 'localhost',
    port: parseInt(process.env.APPIUM_PORT, 10) || 4723,
    logLevel: 'warn',
    capabilities: capabilites
};


async function run() {
    // Initialize device driver
    const driver = await remote(wdOpts);
    
    // Initialize API service to be consumed on port 3000
    const serve = express();

    serve.get('/api/v1/:username', (req, res) => {
        try {
            // Go to the home screen to open new Instagram instance
            await goToHome(driver);
            await goToHome(driver);
    
            // Search instagram user
            const username = req.params.username;
            const result = await extractInstaUser(driver, username);
    
            // Close the app and back to home, make sure the home is really reached
            await goToHome(driver);
            await goToHome(driver);
    
            if (!(result.err)) {
                res.status(200).json({
                    result
                })
            } else {
                res.status(500).json({
                    result
                })
            } 
        } catch (e) {
            res.status(500).json({
                err: 'Error happened',
                errMessage: e
            })
        }
    })
}

run().catch(console.error);

