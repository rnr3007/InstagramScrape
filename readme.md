# Requirements
## Development Requirement
+ [ ] Java Development Kit (JDK) 18
+ [ ] NodeJS 20.11.0 
   (Latest version doesn't support the appium due to the security fixes)
+ [ ] Android Studio 
+ [ ] Appium 2.0.1
## Server Running Requirement
+ [ ] Docker and docker compose. 
+ [ ] Running Appium server
	+ [ ] Android setup (if you are using real device)

# Development Requirement Installation and Setup

## 1. JDK 18
1. Install Java Development Kit (JDK) 18 
2. Set the JAVA_HOME in the environment variable. Use path retrieved from command: 
   ```
   where javac
   ```
   as the value.![[Pasted image 20260525080057.png]]

## 2. NodeJS 20.11.0
1. If you're already having another version of nodeJs:
	1. Install Node Version Manager (nvm), 
	   this is a tool that will manage Node version inside your PC. This tool could be helpful if you have several different Node version to work with
	   Find the suitable version for Windows from [here](https://github.com/coreybutler/nvm-windows/releases)
	2. After the nvm installation completed, check its availability from the command line and then Install Node version 20.11.0 and switch to it using command:

```
nvm install 20.11.0
nvm use 20.11.0
```

2. Verify the node version using this command and make sure it shows the v20.11.0
   ```
   node --version
   ```


## 3. Android Studio and Android SDK Tools
1. Install latest version of Android Studio (LTS) from https://developer.android.com/studio
2. After it completely installed, open **Settings** > **Languages & Frameworks** > **Android SDK**
3. Choose tab **SDK Tools**
4. Checklist on
	1. Android SDK Build-Tools
	2. Android SDK Command-line Tools (latest)
	3. Android SDK Platform-Tools
	4. Android SDK Tools (obsolete)
5. Download the SDK Tools that is not available, and then Apply
6. Set the ANDROID_HOME environment variable as the installed path for Android SDK![[Pasted image 20260525075530.png]]
7. Add the `platform-tools` from the ANDROID_HOME into the Path variable. This will enable command, i.e. `adb` in the whole command line![[Pasted image 20260525085430.png]]

## 4. Appium Installation and Setup
1. Open command line and install appium using command:
   ```
   npm i appium@2.0.1
   ```
2. Install the uiautomator2 driver using appium
   ```
   appium driver install uiautomator2@2.12.2
   ```
3. Install the appium-inspector from this URL: [Appium-Inspector-2026.5.1-win.exe](https://github.com/appium/appium-inspector/releases/download/v2026.5.1/Appium-Inspector-2026.5.1-win.exe) (for Windows 11)

# Program Setup
## Disclaimer
* This program created for Android device with **Gesture Navigation** enabled instead of three-button navigation. Please setup your device to match the same settings.
* **Please place Instagram inside the home screen of your Android phone**. This is necessary to open the Instagram app. The coder doesn't initiate Instagram from the package name in order to prevent automation blocker. The coder write the things to simulate user touch the instagram app from the home.

## 1. Android Setup
To do this task, I used Android 12 with HiOS, different device may have different setting to enable the **USB Debugging**
1. Connect the Android device to the working device (laptop or PC)
2. Open **Settings** > **Developer Options**
3. Enable:
	+ [ ] **USB debugging**
	+ [ ] **Stay Awake**
	+ [ ] **Disable adb authorization timeout**

## 2. Server Setup
1. Clone this repository 
   ```
   git clone https://github.com/rnr3007/InstagramScrape.git && \
   cd InstagramScrape
   ```
2. Change the content inside the `./instagram-scrape/.env` to match your need.

>Before running this step, make sure you already have an instance server for appium running

>Use related APPIUM_HOST and APPIUM_PORT as stated in [[#Running Appium server in Windows 11|here]]

3. Build and run the docker compose 
   ```
   docker compose build && docker compose up --force-recreate
   ```
4. Test the API using curl, by default the scrape result will be available on `./instagram-scrape/output.csv` with `;` delimiter

# Extra Note
## Running Appium server in Windows 11
1. Make sure you have installed all of the pre-requisites inside [[#Development Requirement Installation and Setup]], especially steps [[#3. Android Studio and Android SDK Tools]] and [[#4. Appium Installation and Setup]]
2. Use
   ```
   appium -a 0.0.0.0 -p 4723 --allow-cors
   ```
   in command line to start appium. It will receive all request from any IP at port 4723 and allowing Cross-Originated Resource Sharing.
3. Take a note for the appium server IP since you will need it to fill the .env value![[Pasted image 20260526134143.png]]
## Extra Notes in the Implementation and Further Improvement
1. The real mobile session can be simulated using Appium with the help of Android Studio's Android Emulator, however in this test I'm using my own mobile device due to the insufficient resource.

2. Based on online reference, there are multiple factor that the app will check, .e.g: hardware, OS and firmware version, carrier data, network identity, usage pattern, sensor behavior, etc. 
   We can implement some way to mimic a real device behavior as the way to 'rotate device fingerprint'.

3. Avoiding rate limit could be implemented by using random "pause" moment. Mimicking a real human behavior, i.e. when he/she is reading something or retrieving interesting data. This is also implemented in the code. Especially the code where I scripted the "typing" behavior, the program will sleep with rate between .25 to .5 second per letter typed

4. Refreshing token could be done by re-open the app and re-login into it. However, too many re-login attempts could rise any suspicion to the user's account.
   Due to that thing, I implemented the way to access instagram by simulating user's click from the Android phone's home screen.

5. One from many options to solve sophisticated captcha could be by some Image Processing capability. The automation process send the captcha screenshot into the image processor, and the image processor will tries to solve it.

6. I implemented a way to mimic touch event by a human by giving a random coordinate where the distribution is focused in the middle of the screen. It is an assumption given from my usual 'scrolling' style. However, this simulation could be done by analyzing the "Visual taps Feedback" and "Pointer Location" from the Android's Developer Options.