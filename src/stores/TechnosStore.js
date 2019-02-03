import { observable, action, runInAction } from "mobx";
import TechnosApi from '../api/TechnosApi';

class TechnosStore {
	@observable technos = {
		nodes:[],
		links:[]
	};

	technosApi = new TechnosApi();

	addTechno(techno) {
		this.technos.push(techno);
	}

	@action.bound
	getTechnos() {
		this.technosApi.getTechnos().then(res => {
			runInAction(() => {
				this.technos.nodes = res.nodes;
				this.technos.links = res.links;
			})
		});
	}
}

const technosStore = new TechnosStore();

export default technosStore;