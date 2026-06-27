'use strict';

const { execSync } = require('child_process');
const path = require('path');

// electron-builder afterPack hook — ad-hoc sign the .app on macOS so it
// passes Gatekeeper's "damaged app" check on Apple Silicon without a paid
// Developer ID certificate.  CSC_IDENTITY_AUTO_DISCOVERY=false is still set
// so electron-builder doesn't attempt certificate lookup; we sign here instead.
exports.default = async function afterPack(context) {
  const { electronPlatformName, appOutDir, packager } = context;
  if (electronPlatformName !== 'darwin') return;

  const appPath = path.join(appOutDir, `${packager.appInfo.productName}.app`);
  console.log('[afterPack] Ad-hoc signing:', appPath);
  execSync(`codesign --force --deep --sign - "${appPath}"`, { stdio: 'inherit' });
  console.log('[afterPack] Ad-hoc signing complete.');
};
