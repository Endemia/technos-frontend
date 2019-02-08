import axios from 'axios';
import config from '../conf/config.json';

class TechnosApi {

	constructor() {
		this.url = 'http://localhost:8080';
	}

	getTechnos(name) {
		let url = this.url + '/?depth=' + config.treeDepth;
		if (name) {
			url += '&name=' + name;
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