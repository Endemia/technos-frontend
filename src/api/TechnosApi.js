import axios from 'axios';

class TechnosApi {

	constructor() {
		this.url = 'http://localhost:8080';
	}

	getTechnos() {
		return axios.get(this.url + '/')
  			.then(function (response) {
			    return response.data;
  			})
  			.catch(function (error) {
			    console.log(error);
	  	    });
	}

}

export default TechnosApi;