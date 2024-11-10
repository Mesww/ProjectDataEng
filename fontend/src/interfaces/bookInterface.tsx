interface Books {
    _id: string;
    title: string;
    author: string;
    genre: string;
    isbn: string;
    available: boolean;
    due_date: string;
    publication_date: string;
}

export default Books;