import axios from 'axios';
import config from '../conf/config.json';

class TechnosApi {

	constructor() {
		this.url = 'http://localhost:8080';
	}

	getTechnos(name, exactMatch, depth) {
		let url = this.url + "/?1";
		if (depth !== undefined) {
			url += '&depth=' + depth;
		} else {
			url += '&depth=' + config.treeDepth;
		}

		if (name) {
			url += '&name=' + name;
		}

		if (exactMatch) {
			url += '&exactMatch=true'
		}

		return axios.get(url)
  			.then(function (response) {
			    return response.data;
  			})
  			.catch(function (error) {
			    console.log(error);
  				throw error;
	  	    });
	}

	createTechno(name) {
		let url = this.url + '/';
		return axios.post(url, {'name': name})
  			.then(function (response) {
			    return response.data;
  			})
  			.catch(function (error) {
			    console.log(error);
  				throw error;
	  	    });
	}
}

export default TechnosApi;