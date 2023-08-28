const os = require('os')
const path = require('path')
const { expect } = require('chai')
const { spawn, spawnSync } = require('child_process')
const { Builder, By, Capabilities, until } = require('selenium-webdriver')

// create the path to the expected application binary
const application = path.resolve(
  __dirname,
  '..',
  '..',
  '..',
  'src-tauri',
  'target',
  'release',
  'testing_tauri_driver'
)

// keep track of the webdriver instance we create
let driver

// keep track of the tauri-driver process we start
let tauriDriver

before(async function () {
  // set timeout to 2 minutes to allow the program to build if it needs to
  this.timeout(120000)

  // ensure the program has been built
  spawnSync('cargo', ['build', '--release'])

  // start tauri-driver
  tauriDriver = spawn(
    path.resolve(os.homedir(), '.cargo', 'bin', 'tauri-driver'),
    [],
    { stdio: [null, process.stdout, process.stderr] }
  )

  const capabilities = new Capabilities()
  capabilities.set('tauri:options', { application })
  capabilities.setBrowserName('wry')

  // start the webdriver client
  driver = await new Builder()
    .withCapabilities(capabilities)
    .usingServer('http://127.0.0.1:4444/')
    .build()
})

after(async function () {
  // stop the webdriver session
  await driver.quit()

  // kill the tauri-driver process
  tauriDriver.kill()
})

describe('Hello Tauri', () => {

  it('should generate the correct greeting message', async function() {

    // this.timeout(120000);
    // await driver.sleep(60000);

    // Locate the input field, clear it, and then enter the name "Bob"
    let inputField = await driver.wait(until.elementLocated(By.id('greet-input')), 5000);
    await inputField.clear();
    await inputField.sendKeys('Bob');

    // Locate the "Greet" button and click it
    let greetButton = await driver.findElement(By.css('button[type="submit"]'));
    await greetButton.click();

    // Wait for the greeting message to appear and then check its text
    let greetingMsg = await driver.wait(until.elementLocated(By.css('p:last-child')), 5000);
    let msgText = await greetingMsg.getText();

    // Assertion
    assert.strictEqual(msgText, "Hello, Bob! You've been greeted from Rust!");
  });

})