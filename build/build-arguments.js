const argv = require('yargs').argv

const BUILD_USE_LOCAL_STAGING = !!argv.localStaging

module.exports = {
  BUILD_USE_LOCAL_STAGING
}
