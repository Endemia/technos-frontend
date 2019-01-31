import { observable, action } from "mobx";
import TechnosApi from '../api/TechnosApi';

class TechnosStore {
	@observable technos = [];

	technosApi = new TechnosApi();

	addTechno(techno) {
		this.technos.push(techno);
	}

	getTechnos() {
		this.technosApi.getTechnos();
	}
}

const technosStore = new TechnosStore();

export default technosStore;