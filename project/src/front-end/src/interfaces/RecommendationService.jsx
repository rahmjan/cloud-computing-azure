import axios from 'axios' // we use this library as HTTP client
// you can overwrite the URI of the authentication micro-service
// with this environment variable
const url = process.env.REACT_APP_RECOMMENDATION_SERVICE_URL || 'http://localhost:3001'

class RecommendationService {
    setHandlers (updateBestSellers) {
	    this.updateBestSellers = updateBestSellers
	  }
    fetchBestSellers () {
			console.log('Call fetchBestSellers()')
      axios.get(`${url}/bestSellers`)
        .then((res) => {
						console.log('Best sellers are:')
            console.log(res.data.catalog)
						this.updateBestSellers(res.data.catalog)
        })
        .catch((error) => {
            console.error(error)
            console.error('Empty list of bestSellers')
						this.updateBestSellers([])
        })
    }
}

export default RecommendationService
