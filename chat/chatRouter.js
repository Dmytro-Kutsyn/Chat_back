import Router from "express";

const chatRouter = new Router()

chatRouter.get("/", (req, res) => {
  res.send("Test")
})

export default chatRouter;


// // Обработка маршрутов чата
// chatRouter.get('/', (req, res) => {

// });

// chatRouter.post('/', (req, res) => {

// });

// chatRouter.get('/:id', (req, res) => {

// });


// export default chatRouter;
