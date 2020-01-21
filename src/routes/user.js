var router = require('express').Router();
var _ = require('lodash');
var { Butler } = require('../middlewares/load-buttlers')
router.post('/assign',function(req,res, next){

        
    let params = req.body;


    let result = groupByClientId(params) 

    let clientIds =  Object.keys(result)
    
    let butlers = params.map(id=> new Butler({}))

    let assignedJob = [];

     butlers.map(butler=>{

        clientIds.map(key=>{

            if(butler.isTimeLeft()){

                if(result[key].jobs.length > 0){

                    butler.allocateTime(result[key].jobs)
                }
            }
             
        })

        if(butler.jobsIds.length > 0){

            assignedJob.push(butler.getButlerExistance())
        }
    })    

    let allButlers = []

    let requests =  assignedJob.reduce((acc, curr)=>{

        //  if(acc)
        let {  clientIds, ...rest } = curr;
        allButlers.push(rest);

        return [ ...[], ...acc, ...clientIds]
    },[])
    
    
    res.status(200).json({butlers:allButlers , spreadClientIds: Array.from( new Set( requests))})
    
    
})

function sortJobs(a, b) {

        if (a.hours < b.hours) {
          return 1;
        }
        if (a.hours > b.hours) {
          return -1;
        }
      
        // names must be equal
        return 0;
}

function groupByClientId(clients){
    
    let clientsJob = {};
    if(_.isArray(clients) &&  clients.length > 0){

    _.map(clients,function(o){
            
            if(clientsJob[o.clientId]){
                o.assigned = false
                clientsJob[o.clientId]['jobs'].push(o);
            }else{
    
                o.assigned = false
                clientsJob[o.clientId] = {};
              clientsJob[o.clientId]['jobs'] = []
              clientsJob[o.clientId]['jobs'].push(o);
          }
      })

      Object.keys(clientsJob).map(key=>{

        clientsJob[key].jobs.sort(sortJobs);
      })

      return clientsJob
    }else{

         return {}
    }
}

module.exports = router;
