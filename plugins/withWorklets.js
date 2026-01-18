const { withSettingsGradle } = require('expo/config-plugins');

const withWorklets = (config) => {
    return withSettingsGradle(config, (config) => {
        if (config.modResults.language === 'groovy') {
            const workletsEntry = `
include ':react-native-worklets'
project(':react-native-worklets').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-worklets/android')
`;
            if (!config.modResults.contents.includes(':react-native-worklets')) {
                config.modResults.contents += workletsEntry;
            }
        }
        return config;
    });
};

module.exports = withWorklets;
