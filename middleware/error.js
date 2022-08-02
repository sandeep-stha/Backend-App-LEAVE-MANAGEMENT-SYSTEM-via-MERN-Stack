//TO VALIDATE ASYNC-AWAIT ERRORS. WORKS ALONGSIDE EXPRESS ASYNC ERRORS PACKAGE
module.exports = (err, req, res, next) => {
  console.log(err);
  if (err) {
    if (err.name == "CastError")
      return res
        .status(404)
        .json({ status: false, msg: `Resource not found with this id :(` });
    else if (err.code === 11000)
      // FOR DUPLICATE VALUE ERROR
      return res
        .status(400)
        .json({ status: false, msg: "Duplicate field value entered :(" });
    else if (err.name == "ValidationError")
      //VALIDATION ERROR
      return res.status(400).json({
        status: false,
        msg: Object.values(err.errors).map((err) => err.message),
      });
    else if (err.code == "LIMIT_FILE_SIZE")
      //MAX FILE SIZE
      return res
        .status(400)
        .json({ status: false, msg: "File size cannot be greater than 2 Mb" });
    return res.status(500).json({ status: false, msg: err.message });
  }
};
