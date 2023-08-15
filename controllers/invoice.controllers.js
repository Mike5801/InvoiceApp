import puppeteer from "puppeteer";
import dotenv from "dotenv";
import { errorStatus } from "../utils/statusHandler.utils.js";
import costcoNavigation from "../utils/costcoNavigation.utils.js";
import walmartNavigation from "../utils/walmartNavigation.utils.js";
import hebNavitation from "../utils/hebNavigation.utils.js";
import {
  renderCostcoPage,
  renderWalmartPage,
  renderHebPage,
} from "../utils/renderPage.utils.js";

const viewVariables = {
  status: null,
  message: "",
};

dotenv.config();

const RFC = process.env.RFC;
const CP = process.env.CP;
const EMAIL = process.env.EMAIL;

export const getMainPage = (req, res) => {
  res.render("pages/Main/index");
};

export const getSuccessPage = (req, res) => {
  res.render("pages/StatusSuccess/index");
}

export const getCostcoInvoicePage = (req, res) => {
  viewVariables.status = null;
  viewVariables.message = "";

  renderCostcoPage(res, viewVariables);
};

export const getCostcoInvoice = async (req, res) => {
  const { ticket, monto } = req.body;

  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setViewport({ width: 1024, height: 1600 });
    page.setDefaultNavigationTimeout(0);

    await costcoNavigation.goToPage(
      page,
      "https://www3.costco.com.mx/facturacion"
    );

    await costcoNavigation.enterTicketInformation(
      browser,
      page,
      ticket,
      monto,
      RFC
    );

    await costcoNavigation.sendInvoice(browser, page);

    await browser.close();

    res.redirect("/invoice/success");
  } catch (error) {
    viewVariables.status = errorStatus.status;
    viewVariables.message = errorStatus.message;

    console.error(error);

    renderCostcoPage(res, viewVariables);
  }
};



export const getWalmartInvoicePage = (req, res) => {
  const { company } = req.query;

  viewVariables.company = company;
  viewVariables.status = null;
  viewVariables.message = "";

  renderWalmartPage(res, viewVariables);
};

export const getWalmartInvoice = async (req, res) => {
  const { transaction, ticket } = req.body;

  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(0);

    await walmartNavigation.goToPage(
      page,
      "https://facturacion.walmartmexico.com.mx/Default.aspx",
      "https://facturacion.walmartmexico.com.mx/frmDatos.aspx"
    );

    await walmartNavigation.enterTicketInformation(
      browser,
      page,
      RFC,
      CP,
      ticket,
      transaction
    );

    await walmartNavigation.enterInvoiceInformation(page);

    await walmartNavigation.sendInvoice(browser, page);

    await browser.close();

    res.redirect("/invoice/success");
  } catch (error) {
    viewVariables.status = errorStatus.status;
    viewVariables.message = errorStatus.message;

    console.error(error);

    renderWalmartPage(res, viewVariables);
  }
};

export const getHebInvoicePage = (req, res) => {
  viewVariables.status = null;
  viewVariables.message = "";

  renderHebPage(res, viewVariables);
};

export const getHebInvoice = async (req, res) => {
  const { ticket, date, totalSale } = req.body;
  const branchOffice = "(2986) HEB SLP SAN LUIS POTOSI";

  const today = new Date();
  const todayTime = today.getTime();

  const dateFormat = new Date(date);
  const dateTime = dateFormat.getTime();
  const diffDates = Math.abs(todayTime - dateTime);
  const numDays = Math.floor(diffDates / (1000 * 60 * 60 * 24));

  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(0);

    await hebNavitation.goToPage(
      page,
      "https://facturacion.heb.com.mx/cli/invoice-create"
    );

    await hebNavitation.enterTicketInformation(
      browser,
      page,
      branchOffice,
      ticket,
      numDays,
      totalSale
    );

    await hebNavitation.enterInvoiceInformation(browser, page, RFC, EMAIL);

    await hebNavitation.sendInvoice(page);

    await browser.close();

    res.redirect("/invoice/success");
  } catch (error) {
    viewVariables.message = errorStatus.message;
    viewVariables.status = errorStatus.status;

    console.error(error);

    renderHebPage(res, viewVariables);
  }
};
