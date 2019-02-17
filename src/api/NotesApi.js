import axios from 'axios';

class NotesApi {

	constructor() {
		this.url = 'http://localhost:8080';
	}

	getUserNotes() {
		let url = this.url + '/notes';
		return axios.get(url)
  			.then(function (response) {
			    return response.data;
  			})
  			.catch(function (error) {
			    console.log(error);
  				throw error;
	  	    });
  	}

	updateUserNote(techno, note) {
		let url = this.url + '/notes';
		return axios.post(url, {'techno': techno, 'note': note})
  			.then(function (response) {
			    return response.data;
  			})
  			.catch(function (error) {
			    console.log(error);
  				throw error;
	  	    });
	}

	getAllNotes() {
		let url = this.url + '/notes/all';
		return axios.get(url)
  			.then(function (response) {
			    return response.data;
  			})
  			.catch(function (error) {
			    console.log(error);
  				throw error;
	  	    });
	}
}

export default NotesApi;