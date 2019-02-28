import apolloFetch from './ApolloFetch'

class NotesApi {

	getUserNotes() {
		const query = `
  			{
  				findNotes {
				    userId
				    notes {
				      	techno
				      	note
				   	}
			    }
  			}
		`
		return apolloFetch({ query })
  			.then(function (response) {
			    return response.data.findNotes;
  			})
  			.catch(function (error) {
			    console.log(error);
  				throw error;
	  	    });
  	}

	updateUserNote(techno, note) {
		const query = `
			mutation {
  				updateNote(techno:"${techno}", note:${note})
			}
		`

		return apolloFetch({ query })
  			.then(function (response) {
			    return response.data;
  			})
  			.catch(function (error) {
			    console.log(error);
  				throw error;
	  	    });
	}

	getAllNotes() {
		const query = `
			{
				allNotes {
				    techno
				    notes {
				      	user {
			        		userId
			        		nom
			        		prenom
			      		}
			      		note
			    	}
			    }
			}
		`

		return apolloFetch({ query })
  			.then(function (response) {
			    return response.data.allNotes;
  			})
  			.catch(function (error) {
			    console.log(error);
  				throw error;
	  	    });
	}
}

export default NotesApi;