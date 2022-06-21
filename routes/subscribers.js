const express = require('express')
//const subscriber = require('./models/subscriber')
const router = express.Router()
const Subscriber = require('./models/subscriber')

//getting all
router.get('/', async(req, res) => {
   try{
    const subscribers = await Subscriber.find()
    res.json(subscribers)//alle subscribers senden
   }catch (err){
    res.status(500).json({ message: err.message})
   }//error on my server
})

//getting one
router.get('/:id', getSubscriber, (req, res) => {
    res.json(res.subscriber)
})

//create one
router.post('/', async (req, res) => {
    const subscriber = new Subscriber({
        name: req.body.name,
        subscribedToChannel: req.body.subscribedToChannel
    })

    try{
        const newSubscriber = await subscriber.save()
        res.status(201).json(newSubscriber)//200 alles ok. 201 erfolgreich gebaut
    }catch (err){
        res.status(400).json({ message: err.message })//400. falsches user input. mit {} wrapped in an objct
    }
})

//update one
router.patch('/', getSubscriber, async (req, res) => {//bei put wird alles upgedated. bei patch auc einzelne teile
    if(req.body.name != null){
        res.subscriber.name = req.body.name
    }
    if(req.body.subscribedToChannel != null){
        res.subscriber.subscribedToChannel = req.body.subscribedToChannel
    }
    try {
        const updatedSubscriber = await res.subscriber.save()
        res.json(updatedSubscriber)
    } catch (err) {
        res.status(400).json({ message: err.message})    
    }
})

//delete one
router.delete('/:id', getSubscriber, async (req, res) => {
    try{
        await res.subscriber.remove()
        res.json({ message: 'Deleted Subscriber'})
    }catch(err){
        res.status(500).json({ message: err.message})   
    }

})

async function getSubscriber(req, res, next){
    let subscriber
    try{
        subscriber = await Subscriber.findById(req.params.id)
        if(subscriber == null){
            return res.status(404).json({message: 'Cannot find subscriber'})//error on my server
        }
    }catch(err){
        return res.status(500).json({ message: err.message})   
    }
    res.subscriber = subscriber
    next()
}

module.exports = router