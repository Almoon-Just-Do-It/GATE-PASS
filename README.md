# NSU IT Equipment Gate Pass

A lightweight web app for generating and printing an NSU-style IT equipment gate pass and storing each submission in Google Sheets.

## Included
- Product types: MVP, Screen, Monitor, Mouse, Keyboard, Switcher, HDMI, Smartboard, Other
- Product ID, Serial Number, vendor company, vendor representative/carrier, destination, purpose and IT representative
- Live printable A4 pass with generated pass number and device date/time
- Signature spaces for IT Representative (left) and Vendor Representative (right)
- Google Apps Script backend that appends each record to a Google Sheet

## 1. Create the Google Sheet (your Google account)
1. Sign in to **iamabdullahalmoon@gmail.com** in your browser.
2. Open https://script.google.com/ and create a **New project**.
3. Replace the editor contents in `Code.gs` with the supplied `Code.gs` file.
4. Select `setup` in the function dropdown and click **Run**. Approve the requested Google permissions.
5. In the execution log, open the Spreadsheet URL. The spreadsheet will be created in the signed-in Google account.

## 2. Deploy the Apps Script backend
1. In Apps Script click **Deploy → New deployment**.
2. Click the gear icon and choose **Web app**.
3. Set **Execute as:** Me.
4. Set **Who has access:** Anyone (or the access policy allowed by your organization).
5. Click **Deploy**, authorize if prompted, and copy the Web app URL ending in `/exec`.
6. Open `app.js` and replace:
   `PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE`
   with the copied URL.

**Important:** Anyone who can access the public web app can submit rows to this spreadsheet. For real institutional use, restrict access to authorized users (if your Google Workspace policy allows it), and ask NSU IT/administration for approval before using the official logo or deploying an institutional workflow.

## 3. Run or publish the website
- Local test: open `index.html` in Chrome. (The form and print preview work locally; Sheets saving requires the Apps Script URL.)
- Public hosting: upload `index.html` and `app.js` to a GitHub repository and enable GitHub Pages, or host them on your approved web server.
- Keep `Code.gs` in Apps Script; do not publish it in the website repository if you prefer to keep backend source separate.

## Notes
- The date/time uses the browser device clock.
- The browser's `no-cors` request mode cannot read the Apps Script response. The page reports that the submission was sent, but verify the row in Google Sheets after initial setup.
- The current logo image is loaded from an NSU website asset URL. If it changes or is blocked, replace the two logo `src` values in `index.html` with an approved local logo file.
- The pass number is generated in the browser and is a convenience identifier, not a tamper-proof sequence.
