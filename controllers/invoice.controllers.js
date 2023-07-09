import puppeteer from "puppeteer";

export const getCostcoInvoice = async (req, res) => {
  const { ticket, monto } = req.body;
  
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto("https://www3.costco.com.mx/facturacion")
  
    const inputTicket = await page.$("#ticket");
    const inputMonto = await page.$("#monto");
    const inputRfc = await page.$("#rfc");
    const buttonEnviar = await page.$("#btnEnviar");

    await inputTicket.type(ticket);
    await inputMonto.type(monto);
    await inputRfc.type(process.env.RFC);
    await buttonEnviar.click();

    await page.waitForNavigation();

    const buttonEnviar2 = await page.$("#btnEnviar");
    await buttonEnviar2.click();

    await page.waitForNavigation();

    await browser.close();

    res.status(200).json({ message: "Successfully created and sent invoice" });
  } catch (error) {
    res.status(400).json({ message: error.message })
  }

};

export const getWalmartInvoice = async (req, res) => {
  const { transaction, ticket } = req.body;

  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto("https://facturacion.walmartmexico.com.mx/frmDatos.aspx");
  
    const inputRfc = await page.$("#ctl00_ContentPlaceHolder1_txtMemRFC");
    const inputCP = await page.$("#ctl00_ContentPlaceHolder1_txtCP");
    const inputTicket = await page.$("#ctl00_ContentPlaceHolder1_txtTC");
    const inputTransaction = await page.$("#ctl00_ContentPlaceHolder1_txtTR");
    const buttonContinue = await page.$("#ctl00_ContentPlaceHolder1_btnAceptar");
  
    await inputRfc.type(process.env.RFC);
    await inputCP.type(process.env.CP);
    await inputTicket.type(ticket);
    await inputTransaction.type(transaction);
    await buttonContinue.click();

    await page.waitForNavigation();
  
    await page.select("#ctl00_ContentPlaceHolder1_ddlregimenFiscal", "621");
    await page.waitForTimeout(1000);
    await page.select("#ctl00_ContentPlaceHolder1_ddlusoCFDI", "G03");
    await page.waitForTimeout(1000);

    const buttonAccept = await page.$("#ctl00_ContentPlaceHolder1_btnAceptar");
    await buttonAccept.click();
    const buttonConfirm = await page.$("#ctl00_btnContinuar");
    await buttonConfirm.click();

    await page.waitForNavigation();

    const buttonEmail = await page.$("#ctl00_ContentPlaceHolder1_rdCorreo");
    await buttonEmail.click();

    const buttonInvoice = await page.$("#ctl00_ContentPlaceHolder1_btnFacturar");
    await buttonInvoice.click();

    await page.waitForNavigation();

    await browser.close();

    res.status(200).json({ message: "Successfully created and sent invoice" });

  } catch (error) {
    res.status(400).json({ message: error.message })
  }



}