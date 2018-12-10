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
                  emit([key, key2], doc.jsonData[key2].quantity); \
                }\
              }\
            \
            }\
          }\
        } \
      }",

      "reduce": "function(key, vals) { \
        return sum(vals);\
      }"
    }
  }
}
module.exports = { viewDescriptor }
