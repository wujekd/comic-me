

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
            console.log("subs event dispatched")
            window.dispatchEvent(new Event('subs'));
        }

        if (property == "logged"){
            console.log("logged event triggered")
            window.dispatchEvent(new Event("logged"))
        }
        return true;
    }
})



export default proxiedData;