function status(request, response) {
  response.status(200).json({
    chave: "test",
  });
}

export default status;
