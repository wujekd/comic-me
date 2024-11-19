const APIs = {
    url: "../data/books.json",
    fetchBooks: async ()=> {
        const result = await fetch(APIs.url);
        return await result.json();
    }
};

export default APIs;