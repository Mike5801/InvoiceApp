export const isAuth = (req, res, next) => {
  if (!req.session.auth) {
    res.redirect("/");
  }

  next();
}