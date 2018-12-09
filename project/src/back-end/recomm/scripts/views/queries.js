const viewDescriptor = {
  "views": {
    "bestPurchases": {

      "map": "function (doc) \
      { \
        if (doc.service == \"purchase\" && doc.jsonData) \
        { \
          for(var key in doc.jsonData)\
          {\
            if ( key != \"date\" && key != \"totalPrice\" )\
            {\
            \
              for(var key2 in doc.jsonData) \
              {\
                if ( key2 != \"date\" && key2 != \"totalPrice\" && key2 != key ) \
                {\
                  emit(key, {product: key2.toString(), quantity: doc.jsonData[key2].quantity}); \
                }\
              }\
            \
            }\
          }\
        } \
      }",

      "reduce": "function(key, values) { \
        var count = 0; \
\
        \
        for(var i = 0; i < values.length; i++)\
        {\
          \
        }\
        \
        \
        \
        return(key, {count: count});\
      }"
    }
  }
}
module.exports = { viewDescriptor }
