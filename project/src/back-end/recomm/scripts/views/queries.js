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

      "reduce": "function(key, vals) { \
        var count = vals.reduce(function(a,b){\
                    if (a.product == b.product) \
                    {\
                      return a.quantity + b.quantity; \
                    }});\
        return(key, count);\
      }"
    }
  }
}
module.exports = { viewDescriptor }
