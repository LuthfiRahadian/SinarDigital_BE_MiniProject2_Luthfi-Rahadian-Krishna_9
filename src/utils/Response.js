function success(res, data = null, message = "Success") {
  return res.json({ status: "success", message, data });
}

function error(res, message = "Something went wrong", code = 500) {
  return res.status(code).json({ status: "error", message });
}

module.exports = { success, error };
