const timeout = 60e3;
const loggingInterval = 15*60e3;
class CustomIdRegistry extends Map{
    constructor(){
        super(...arguments);
        setInterval(()=>{
            this.deleteAll((key, value) => Date.now() > value.expires)
        }, timeout/2)
        setInterval(() => {
            console.log(`CustomId: ${this.size} pairs stored, sequence no. ${this.seq}`)
        }, loggingInterval)
        this.seq = 0;
    }
    deleteAll(fn){
        let del = [];
        for(let [key, value] of this){
            if(fn(key, value)) del.push(key)
        }
        del.forEach(key => this.delete(key))
        return del.length;
    }
    resolve(customid, keepEntry=false){
        let value = this.get(customid);
        if(!keepEntry){
            this.delete(customid);
            if(value.group){
                this.deleteAll((key, _value) => _value.group === value.group);
            }
        }
        return value;
    }
    /**
     * Adds a value to db 
     * @param {object} customData 
     * @returns {string}
     */
    add(customData){
        if(!customData.userid){
            throw new Error("User id is required to add customid")
        }
        if(!customData.expires){
            customData.expires = Date.now()+timeout;
        }else if(customData.expires < Date.now()){
            throw new Error("Attempted to set an expired expiry time.")
        }
        let customId = Date.now() + '' + Math.random() + '' + Math.random() + '' + ((++this.seq)%10000);
        this.set(customId, customData);
        return customId;
    }
}

module.exports = new CustomIdRegistry();
