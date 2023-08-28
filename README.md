This is an attempt to get the Tauri driver working, including using Selenium to click a button which will then result in a Rust command being invoked.  It is currently not working.

Prerequisities:
* Tauri Driver: on Ubuntu 22, this can be installed with `cargo install tauri-driver`
* WebKitWebDriver: on Ubuntu 22, this can be installed with `sudo apt-get install webkit2gtk-driver`

To reproduce the issue:

1. `cd src-tauri`
2. `cargo build --release`
3. `cd ../webdriver/selenium/`
4. `yarn install`
5. `yarn test`
