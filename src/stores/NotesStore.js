import { observable, action } from "mobx";
import NotesApi from '../api/NotesApi';

class NotesStore {
	@observable userNotes=[];
	@observable allNotes=[{techno:"test"}];

	notesApi = new NotesApi();

	@action.bound
	getUserNotes() {
		this.notesApi.getUserNotes().then(res => 
			res ? this.userNotes.replace(res.notes) : []
		);
	}

	@action.bound
	getAllNotes() {
		this.notesApi.getAllNotes().then(res =>
			res ? this.allNotes.replace(res) : []
		);
	}

	@action.bound
	updateUserNote(techno, note) {
		this.notesApi.updateUserNote(techno, note).then(res => {
			const technoNote = this.userNotes.filter(n => n.techno === techno);
			if (technoNote.length > 0) {
				technoNote[0].note = note;
			} else {
				this.userNotes.push({techno: techno, note: note});
			}
		})
	}
}

const notesStore = new NotesStore();

export default notesStore;