const notFound = (req, res) => res.status(404).send(`The route: ${req.url} does not exist.`)

module.exports = notFound