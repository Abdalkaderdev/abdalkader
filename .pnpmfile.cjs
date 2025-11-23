// This file is used by pnpm for configuration
module.exports = {
  hooks: {
    readPackage: readPackage
  }
}

function readPackage(pkg) {
  return pkg
}
