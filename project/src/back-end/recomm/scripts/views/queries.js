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
              emit(key, {count: 3}); \
            }\
          }\
        } \
      }",

      "reduce": "function(key, values) { \
        var count = 0; \
        for(var i = 0; i < values.length; i++)\
        {\
          count = values[i].count\
        }\
        return(key, {count: count});\
      }"
    }
  }
}
module.exports = { viewDescriptor }
