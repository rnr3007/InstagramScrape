require('dotenv').config();

const {sleep, writeCsvRow} = require('./common');
const fs = require('fs');
const crypto = require('crypto');

const APP_PKG = process.env.APP_PKG;
const APP_ID = process.env.APP_ID;

/**
 * @description Simulate infinite scroll
 * @param {WebdriverIO.Browser} driver 
 */
async function simulateScroll(driver) {
    const {width, height} = await driver.getWindowSize();
    const randomConstantX = parseInt(process.env.RANDOM_CONSTANTS_X)
    const midRandomConstantX = parseInt(randomConstantX / 2)
    const randomConstantY = parseInt(process.env.RANDOM_CONSTANTS_Y)
    const midRandomConstantY = parseInt(randomConstantY / 2)

    const {xInit, yInit, xTo, yTo} = {
        xInit: parseInt(width * midRandomConstantX / randomConstantX),
        yInit: parseInt(height * (midRandomConstantY + (midRandomConstantY / 2)) / randomConstantY),
        xTo: parseInt(width * (midRandomConstantX + 1) / randomConstantX),
        yTo: parseInt(height * (midRandomConstantY - 1) / randomConstantY),
    };
      
    await driver.touchPerform([
        {
            action: 'press',
            options: {x: crypto.randomInt(xInit, xInit * 2),  y: crypto.randomInt(yInit, yInit + yTo)}
        },
        {
            action: 'wait',
            options: {ms: crypto.randomInt(100, 400)}
        },
        {
            action: 'moveTo',
            options:{x: crypto.randomInt(xTo, xTo * 2), y: crypto.randomInt(parseInt(yTo * 3 / 4), yTo)}            
        },
        {
            action: 'release'
        }
    ]);
};

/**
 * 
 * @param {WebdriverIO.Browser} driver
 */
async function goToHome(driver) {
    await driver.pressKeyCode(3);
};

/**
 * 
 * @param {WebdriverIO.Browser} driver
 */
async function goBack(driver) {
    await driver.pressKeyCode(4);
}

/**
 * 
 * @param {WebdriverIO.Browser} driver 
 * @param {string} igusername
 * @description Find the first instagram profile shown on the search result. Scrape the profile data
 */
async function extractInstaUser(driver, igusername = `rivarnr`) {
    let instagramIcon;
    
    try {
        // Tries to find instagram app
        while(true) {
            await driver.getPageSource();
            instagramIcon = await driver.$(`//android.widget.TextView[@text="${APP_ID}"]`);
            
            if (instagramIcon) {
                await instagramIcon.click();
                await driver.getPageSource();
                await sleep(crypto.randomInt(2000, 3000));
                break;
            }
            await sleep(crypto.randomInt(400, 1000));
            await simulateScroll(driver);
        }
    
        // Press explore icon if exists
        await driver.$(`//android.widget.FrameLayout[@content-desc="Search and explore"]/android.widget.ImageView[@resource-id="${APP_PKG}:id/tab_icon"]`)?.click();
        await sleep(crypto.randomInt(1000, 2000));
    
        // Press search bar and write the igusername to be searched
        let searchBox = await driver.$(`//android.widget.EditText[@resource-id="${APP_PKG}:id/action_bar_search_edit_text"]`);
        await searchBox.click();
        await sleep(crypto.randomInt(1000, 1500));
    
        // Search the igusername
        await searchBox.sendKeys(igusername.split(""));
        await driver.getPageSource();
        // Randomize value mimicking the human behavior when typing
        await sleep(crypto.randomInt(500, 1000) * igusername.length);
    
        // Go to the first match profile and wait for the data
        await driver.$(`(//android.widget.ImageView[@resource-id="${APP_PKG}:id/row_search_avatar_in_ring"])[1]`)?.click();
        await driver.getPageSource();
        await sleep(crypto.randomInt(1000, 2000));
    
        // Retrieve posts, followers, friends, 
        const username = await (await driver.$(`//android.widget.TextView[@resource-id="${APP_PKG}:id/action_bar_title"]`))?.getText();
        const fullname = await (await driver.$(`//android.widget.TextView[@resource-id="${APP_PKG}:id/profile_header_full_name_above_vanity"]`))?.getText();
        const posts = await (await driver.$(`//android.widget.TextView[@resource-id="${APP_PKG}:id/profile_header_familiar_post_count_value"]`))?.getText();
        const followers = await (await driver.$(`//android.widget.TextView[@resource-id="${APP_PKG}:id/profile_header_familiar_followers_value"]`))?.getText();
        const friends = await (await driver.$(`//android.widget.TextView[@resource-id="${APP_PKG}:id/profile_header_familiar_following_value"]`))?.getText();
        const bio = await (await driver.$(`//com.facebook.compose.view.MetaComposeView[@resource-id="${APP_PKG}:id/profile_user_info_compose_view"]/android.view.View/android.view.View/android.widget.TextView`))?.getText();
    
        writeCsvRow(process.env.OUTPUT_FILE, {
            username, fullname, posts, followers, friends, bio
        });

        return {
            data: {
                username,
                fullname,
                posts,
                followers,
                friends,
                bio
            }
        }
    }
    catch (e) {
        return {
            err: 'Error happened',
            errMessage: e
        }
    }
    
    // Back to Home
    await goBack(driver);
    await goBack(driver);
}

module.exports = {simulateScroll, goToHome, extractInstaUser};
