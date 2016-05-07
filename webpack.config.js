const path = require ( 'path' )

module.exports =
{ entry: './desktop.js'
  , output:
  { path: path.resolve ( __dirname, 'public' )
  , filename: 'bundle.js'
  , publicPath: '/'
  }
, resolve:
  { extensions: ['', '.js', '.ts', '.tsx'] }
, module:
  { loaders:
    [ { test: /(\.js|\.ts|\.tsx)$/
      , exclude: /node_modules/
      , loader: 'babel'
      , query:
        { "presets": [ "es2015" ]
        , "plugins":
          [ [ "transform-react-jsx", { "pragma": "Component.DOM" } ]
          ]
        }
      }
    ]
  }
}
