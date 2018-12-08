const viewDescriptor = {
  "views": {
    "bestPurchases": {

      "map": "function (doc) { \
        if (doc.service == \"purchase\" && doc.jsonData) { \
          emit(doc.service, 1) \
        } \
      }",

      "reduce": "function(keys, values) { \
        return sum(values); \
      }"
    }
  }
}
module.exports = { viewDescriptor }
