import { observable, action, runInAction } from "mobx";
import TechnosApi from '../api/TechnosApi';
import { deburr } from 'lodash';

class SearchStore {
	@observable query="";
	@observable existingTechnos=[];
	@observable existingTechnosExactMatch = false;
	@observable existingTechnosLink=[];

	technosApi = new TechnosApi();

	setQuery(query) {
		this.query = query;
	}

	@action.bound
	getExistingTechnos(name) {
		this.technosApi.getTechnos(deburr(name), false, 0).then(res => {
			runInAction(() => {
				const exactMatch = res.filter(t => deburr(t.name.toUpperCase()) === deburr(name.toUpperCase()));
				if (exactMatch.length > 0) {
					this.existingTechnosExactMatch = true;
				} else {
					this.existingTechnosExactMatch = false;
				}
				this.existingTechnos.replace(this.sortTechnosByName(res));
			})
		});
	}

	@action.bound
	getExistingTechnosLink(name) {
		return this.technosApi.getTechnos(deburr(name), false, 0).then(res => {
			runInAction(() => {
				this.existingTechnosLink.replace(this.sortTechnosByName(res));
			})
			return res;
		});
	}

	@action.bound
	clearExistingTechnos() {
		this.existingTechnos.clear();
	}

	@action.bound
	clearExistingTechnosLink() {
		this.existingTechnosLink.clear();
	}

	sortTechnosByName(technos) {
		return technos.sort(function(a,b) {
			var x = a.name.toLowerCase();
			var y = b.name.toLowerCase();
			return x < y ? -1 : x > y ? 1 : 0;
		})
	}

}

const searchStore = new SearchStore();

export default searchStore;