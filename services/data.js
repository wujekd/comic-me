

const Data = {
    stories: null,
    logged: null,
    subscriptions: null

}



const proxiedData = new Proxy(Data, {
    set(target, property, value ) {
        target[property] = value;

        if (property == "stories") {
            window.dispatchEvent(new Event('storiesloaded'));
        }

        if (property == "subscriptions"){
            window.dispatchEvent(new Event('subs'));
        }
        return true;
    }
})



export default proxiedData;