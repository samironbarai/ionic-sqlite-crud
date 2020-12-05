import { Component, OnInit } from "@angular/core";
import { DatabaseService } from "../database.service";

@Component({
  selector: "app-person",
  templateUrl: "./person.page.html",
  styleUrls: ["./person.page.scss"],
})
export class PersonPage implements OnInit {
  personName: string = "";
  persons: any = [];
  category_id: number = 0;
  categories: any = [];

  editMode: boolean = false;
  selected_category_id: number = 0;
  editId: number = 0;

  constructor(public database: DatabaseService) {
    this.getCategories();
    this.getPersons();
  }

  ngOnInit() {}

  getCategories() {
    this.database.getCategories().then((data) => {
      this.categories = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          this.categories.push(data.rows.item(i));
        }
      }
    });
  }

  addPerson() {
    if (!this.personName.length) {
      alert("Enter person name");
      return;
    }

    if (this.category_id === 0) {
      alert("Select category");
      return;
    }

    if (this.editMode) {
      this.database
        .editPerson(this.personName, this.category_id, this.editId)
        .then((data) => {
          this.personName = "";
          this.editMode = false;
          this.editId = 0;
          this.selected_category_id = 0;
          alert(data);
          this.getPersons();
        });
    } else {
      // add
      this.database
        .addPerson(this.personName, this.category_id)
        .then((data) => {
          this.personName = "";
          this.category_id = 0;
          alert(data);
          this.getPersons();
        });
    }
  }

  getPersons() {
    this.database.getPersons().then((data) => {
      this.persons = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          this.persons.push(data.rows.item(i));
        }
      }
    });
  }

  deletePerson(id: number) {
    this.database.deletePerson(id).then((data) => {
      alert(data);
      this.getPersons();
    });
  }

  editPerson(person: any) {
    this.editMode = true;
    this.selected_category_id = person.category_id;
    this.personName = person.person;
    this.editId = person.id;
  }
}
