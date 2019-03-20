import apolloFetch from './ApolloFetch'
import config from '../conf/config.json';

class TechnosApi {

	getTechnos(name, exactMatch, depth) {
		name = name || "";
		exactMatch = exactMatch || false;
		
		if (depth === undefined) {
			depth = config.treeDepth;
		}
		
		const query = `
  			{
  				findTechnos(name: "${name}", depth: ${depth}, exactMatch: ${exactMatch}) {
    				name
    				niveau
    				children {
	      				name
    				}
    			}
  			}
		`

		return apolloFetch({ query })
  			.then(function (response) {
			    return response.data.findTechnos;
  			})
  			.catch(function (error) {
			    console.log(error);
  				throw error;
	  	    });
	}

	centerOn(name) {
		const query = `
  			{
  				centerOnTechno(name: "${name}") {
    				name
    				niveau
    				children {
	      				name
    				}
    			}
  			}
		`

		return apolloFetch({ query })
  			.then(function (response) {
			    return response.data.centerOnTechno;
  			})
  			.catch(function (error) {
			    console.log(error);
  				throw error;
	  	    });
	}

	createTechno(name, links, linkType) {
		const query = `
	  		mutation {
	  			addTechno(name: "${name}", links: [${links.map(l=> "\"" + l + "\"").join(',')}], linkType: "${linkType}") {
      				name
	  			}
	  		}
		`;

		return apolloFetch({ query })
  			.then(function (response) {
			    return response.data.addTechno;
  			})
  			.catch(function (error) {
			    console.log(error);
  				throw error;
	  	    });
	}

	createLink(from, to) {
		const query = `
	  		mutation {
	  			addLink(from: "${from}", to: "${to}") {
      				name
	  			}
	  		}
		`;

		return apolloFetch({ query })
  			.then(function (response) {
			    return response.data.addLink;
  			})
  			.catch(function (error) {
			    console.log(error);
  				throw error;
	  	    });
	}
}

export default TechnosApi;