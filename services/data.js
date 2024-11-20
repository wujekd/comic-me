

const Data = {
    books: null,

}


const proxiedData = new Proxy(Data, {
    set(target, property, value ) {
        target[property] = value;

        if (property == "books") {
            window.dispatchEvent(new Event('booksloaded'));
        }
        return true;
    }
})


export default proxiedData;