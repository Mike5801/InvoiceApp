export const renderCostcoPage = (res, variables) => {
  res.render('pages/Costco/index', variables);
}

export const renderWalmartPage = (res, variables) => {
  res.render('pages/Walmart/index', variables);
}

export const renderHebPage = (res, variables) => {
  res.render('pages/Heb/index', variables);
}

export const renderSignInPage = (res, variables) => {
  res.render("pages/SignIn/index", variables);
}

export const renderVerifyTokenPage = (res, variables) => {
  res.render("pages/VerifyToken/index", variables);

}