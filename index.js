const express = require("express")
const app = express()
app.use(express.json())
const uuid = require("uuid")

const port = 3000

const orders = []

const checkOrderId = (request, response, next) =>{
    const {id} = request.params
    const index = orders.findIndex(order => order.id === id)
    if(index < 0) {
        return response.status(404).json({message: "Order not found"})
    }
    request.orderId = id
    request.orderIndex = index
    next()
}

const infoAction = (request, response, next) => {
    console.log(`${request.method} url: http://localhost:${port}${request.url}`)
    next()
}
app.use(infoAction)

app.get("/order", (request, response) =>{
    return response.json(orders)
})

app.post("/order", (request, response) => {
    const {order, clienteName, price, status} = request.body
    const demand = {id:uuid.v4(), order, clienteName, price, status}
    orders.push(demand)
    return response.json(orders)
})

app.put("/order/:id", checkOrderId, (request, response) =>{
    const {order, clienteName, price, status} = request.body
    const id = request.orderId
    const updateOrder = {id, order, clienteName, price, status}
    const index = request.orderIndex
    orders[index] = updateOrder

    return response.json(orders)
})

app.delete("/order/:id", checkOrderId, (require, response) => {
    const index = require.orderIndex
    orders.splice(index,1)

    return response.status(204).json()
})

app.get("/order/:id", checkOrderId, (require,response) =>{
    const index = require.orderIndex

    return response.json(orders[index])
})

app.patch("/order/:id", checkOrderId, (require,response) =>{
    const index = require.orderIndex    
    orders[index].status = require.body.status
    
    return response.json(orders)
})

app.listen(port, () => {
        console.log(`Running in http://localhost:${port}/order ✌️`)
    })