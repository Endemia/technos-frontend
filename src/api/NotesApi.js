import apolloFetch from './ApolloFetch'

class NotesApi {

	getUserNotes() {
		const query = `
  			{
  				findNotes(userId: "c14736e0-32d6-11e9-b210-d663bd873d93") {
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
  				updateNote(userId: "c14736e0-32d6-11e9-b210-d663bd873d93", techno:"${techno}", note:${note})
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