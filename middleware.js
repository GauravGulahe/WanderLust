const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "you must be logged in to create a listing!");
    res.redirect("/login");
  }
  next();
};

module.exports = isLoggedIn;
