import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InMemoryDataService {

  createDB() {

    const books = [
      { id: 1, title: 'How to learn Python', comment: 'This book teaches us from the fundamental part, so is was very understandable for everyone!' },
      { id: 2, title: 'Ruby on rails: the Fundamental', comment: 'Whoever knows Ruby can understand the contents easily.' },
      { id: 3, title: 'The Fundamental of Data Analysis', comment: "I recommend the book to the people who will study data analysis from now." }
    ];
    return { books };
  }

  constructor() { }
}
