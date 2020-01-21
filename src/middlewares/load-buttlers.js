const NodeCache = require( "node-cache" );
// const myCache = new NodeCache( { stdTTL: 100, checkperiod: 120 } );
var _ = require('lodash');

class Butler{

    constructor({ name, butlerId, maxWorkHr }){

        this.name = `butler-${ Math.floor( Math.random()*100)}`;
        this.butlerId = `butler-${ Math.floor( Math.random()*100)}`;
        this.maxWorkHr = 8;
        this.isAssigned = false;
        this.jobsIds = [];
        this.spreadClientIds = new Set();
    }

    subtractTime(unit){

         this.maxWorkHr = this.maxWorkHr-unit;
    }

    isTimeLeft(){

        return this.maxWorkHr > 0 ? true : false;
    }

    getTime(){

        return this.maxWorkHr;
    }

    checkButler(job){

        if(job.hours <= this.maxWorkHr){

            this.jobsIds.push(job.requestId);
            this.subtractTime(job.hours);
        }
    }

    isTimeEqualTo(hour){

         return hour <= this.maxWorkHr 
    }

    getBttlerId(){

        return this.butlerId;
    }

    allocateTime(jobs){

        if(this.isTimeLeft() && jobs.length > 0){

            jobs.forEach(job => {
                
                if( this.isTimeEqualTo( job.hours)){
    
                    this.jobsIds.push(job.requestId);

                    if(!this.spreadClientIds.has(job.clientId)){
                        this.spreadClientIds.add(job.clientId);
                    }
                    this.subtractTime(job.hours)
    
                }
            });
    
            for(let i=0; i< this.jobsIds.length; i++){
                
                let index = _.findIndex(jobs, item=>item.requestId === this.jobsIds[i] );
                if(index > -1){
    
                    jobs.splice(index, 1);
                }

            }

          
        }
    }

    getButlerExistance(){

        let clientIds = Array.from(this.spreadClientIds);
        return  { requests : this.jobsIds, clientIds };
    }

    setAssigned(){

       return this.isAssigned = true;
    }
}

module.exports= { Butler }
