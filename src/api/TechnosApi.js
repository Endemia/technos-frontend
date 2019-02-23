import { createApolloFetch } from 'apollo-fetch'
import config from '../conf/config.json';

class TechnosApi {

	constructor() {
		const uri= 'http://localhost:8080/graphql';
		this.apolloFetch = createApolloFetch({ uri });
	}

	getTechnos(name, exactMatch, depth) {
		name = name || "";
		exactMatch = exactMatch || false;
		depth = depth || config.treeDepth;
		
		const query = `
  			{
  				findTechnos(name: "${name}", depth: ${depth}, exactMatch: ${exactMatch}) {
    				name
    				children {
	      				name
    				}
    			}
  			}
		`

		return this.apolloFetch({ query })
  			.then(function (response) {
			    return response.data.findTechnos;
  			})
  			.catch(function (error) {
			    console.log(error);
  				throw error;
	  	    });
	}

	createTechno(name) {
		const query = `
	  		mutation {
	  			addTechno(name: "${name}") {
      				name
	  			}
	  		}
		`;

		return this.apolloFetch({ query })
  			.then(function (response) {
			    return response.data.addTechno;
  			})
  			.catch(function (error) {
			    console.log(error);
  				throw error;
	  	    });
	}
}

export default TechnosApi;