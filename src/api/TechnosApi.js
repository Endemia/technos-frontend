import axios from 'axios';

class TechnosApi {

	constructor() {
		this.url = 'http://localhost:8080';
	}

	getTechnos() {
		console.log(this.url + '/');
		axios.get(this.url + '/')
  			.then(function (response) {
			    console.log(response);
			    return response;
  			})
  			.catch(function (error) {
			    // handle error
			    console.log(error);
	  	    });
	}

}

export default TechnosApi;