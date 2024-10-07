
  cordova.define('cordova/plugin_list', function(require, exports, module) {
    module.exports = [
      {
          "id": "cordova-sqlcipher-adapter.SQLitePlugin",
          "file": "plugins/cordova-sqlcipher-adapter/www/SQLitePlugin.js",
          "pluginId": "cordova-sqlcipher-adapter",
        "clobbers": [
          "SQLitePlugin"
        ]
        }
    ];
    module.exports.metadata =
    // TOP OF METADATA
    {
      "cordova-sqlcipher-adapter": "0.6.0"
    };
    // BOTTOM OF METADATA
    });
    