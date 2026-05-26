require('dotenv').config();

const express = require('express');

const {remote} = require('webdriverio');
const {goToHome, extractInstaUser} = require('./action');
const {execSync} = require('child_process');

const API_PORT = process.env.API_PORT;

// Configure the capability for the webdriver
const capabilites = {
    // Define the Device configuration, apps, and activity that will be used
    platformName: 'Android',
    'appium:automationName': 'UiAutomator2',
    // Make use of the existing session instead of keep trying to log in into a new one
    'appium:noReset': true,
    // Make ease the searcing process
    'appium:disableWindowAnimation': false,
    'appium:unicodeKeyboard': true,
    'appium:resetKeyboard': true
};

// Configuration for the appium server along with its default value
const wdOpts = {
    hostname: process.env.APPIUM_HOST,
    port: parseInt(process.env.APPIUM_PORT, 10),
    logLevel: 'warn',
    capabilities: capabilites
};

function run() {    
    // Initialize API service to be consumed on port 3000
    try {    
        const serve = express();
    
        serve.get('/api/v1/:username', async (req, res) => {
            try {
                // Initialize device driver
                const driver = await remote(wdOpts);
    
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
                    errMsg: e.message
                })
            }
        })
    
        serve.listen(API_PORT, () => {
            console.log('Server is running');
        })
    } catch(e) {
        console.log(e.message);
    }
};

run();

