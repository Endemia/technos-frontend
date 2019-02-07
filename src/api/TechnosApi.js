import axios from 'axios';

class TechnosApi {

	constructor() {
		this.url = 'http://localhost:8080';
	}

	getTechnos(name) {
		let url = this.url + '/';
		if (name) {
			url += '?name=' + name;
		}
		return axios.get(url)
  			.then(function (response) {
			    return response.data;
  			})
  			.catch(function (error) {
			    console.log(error);
	  	    });
	}

}

export default TechnosApi;