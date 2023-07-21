import puppeteer from "puppeteer";

export const getCostcoInvoice = async (req, res) => {
  const { ticket, monto } = req.body;

  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto("https://www3.costco.com.mx/facturacion");

    await page.waitForTimeout(3000);

    const inputTicket = await page.$("#ticket");
    const inputMonto = await page.$("#monto");
    const inputRfc = await page.$("#rfc");
    const buttonEnviar = await page.$("#btnEnviar");

    await inputTicket.type(ticket);
    await inputMonto.type(monto);
    await inputRfc.type(process.env.RFC);
    await buttonEnviar.click();

    await page.waitForTimeout(2000);

    const buttonEnviar2 = await page.$("#btnEnviar");
    await buttonEnviar2.evaluate((b) => {
      b.click();
    });

    await page.waitForTimeout(2000);

    await browser.close();

    res.status(200).json({ message: "Successfully created and sent invoice" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getWalmartInvoice = async (req, res) => {
  const { transaction, ticket } = req.body;

  try {
    /* Go to Walmart invoice page */
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto("https://facturacion.walmartmexico.com.mx/Default.aspx");

    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Enter");

    await page.goto("https://facturacion.walmartmexico.com.mx/frmDatos.aspx");

    await page.waitForTimeout(3000);

    /* Enter initial invoice data */
    const inputRfc = await page.$("#ctl00_ContentPlaceHolder1_txtMemRFC");
    const inputCP = await page.$("#ctl00_ContentPlaceHolder1_txtCP");
    const inputTicket = await page.$("#ctl00_ContentPlaceHolder1_txtTC");
    const inputTransaction = await page.$("#ctl00_ContentPlaceHolder1_txtTR");
    const buttonContinue = await page.$(
      "#ctl00_ContentPlaceHolder1_btnAceptar"
    );

    await inputRfc.type(process.env.RFC);
    await inputCP.type(process.env.CP);
    await inputTicket.type(ticket);
    await inputTransaction.type(transaction);
    await buttonContinue.click();

    await page.waitForNavigation();

    /* Enter specific invoice data (Régimen Fiscal and use of invoice) */
    await page.select("#ctl00_ContentPlaceHolder1_ddlregimenFiscal", "621");
    await page.waitForTimeout(1000);
    await page.select("#ctl00_ContentPlaceHolder1_ddlusoCFDI", "G03");
    await page.waitForTimeout(1000);

    const buttonAccept = await page.$("#ctl00_ContentPlaceHolder1_btnAceptar");
    await buttonAccept.click();

    await page.waitForTimeout(1000);

    const buttonConfirm = await page.$("#ctl00_btnContinuar");
    await buttonConfirm.click();

    await page.waitForNavigation();

    /* Select way of receiving invoice */
    const buttonEmail = await page.$("#ctl00_ContentPlaceHolder1_rdCorreo");
    await buttonEmail.click();

    /* Send invoice */
    const buttonInvoice = await page.$(
      "#ctl00_ContentPlaceHolder1_btnFacturar"
    );
    await buttonInvoice.click();

    const buttonClose = await page.$("#ctl00_ContentPlaceHolder1_btnCerrar");
    await buttonClose.click();
    
    await page.waitForTimeout(5000);

    await browser.close();

    res.status(200).json({ message: "Successfully created and sent invoice" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
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
    /* Enter to HEB Invoice Page */
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto("https://facturacion.heb.com.mx/cli/invoice-create");

    await page.waitForNavigation();
    await page.waitForTimeout(3000);

    await page.keyboard.press("Tab");
    await page.keyboard.press("Enter");

    const inputBranchOffice = await page.$("#mat-input-0");
    await inputBranchOffice.type(branchOffice);
    await page.keyboard.press("Enter");

    /* Enter initial information of invoice (ticket, date, branch office and total sale) */
    const inputTicket = await page.$("#mat-input-1");
    await inputTicket.type(ticket);

    const inputDate = await page.$("#mat-input-2");
    await inputDate.click();
    for (let i = 0; i < numDays; i++) {
      await page.keyboard.press("ArrowLeft");
    }
    await page.keyboard.press("Enter");

    const inputTotalSale = await page.$("#mat-input-3");
    await inputTotalSale.type(totalSale);

    await page.keyboard.press("Tab");
    await page.keyboard.press("Enter");
    await page.waitForTimeout(5000);

    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Enter");

    await page.waitForNavigation();
    await page.waitForTimeout(5000);

    /* Enter client information (RFC, email and invoice use) */
    const inputRfc = await page.$("#mat-input-6");
    await inputRfc.type(process.env.RFC);
    await page.keyboard.press("Tab");
    await page.waitForTimeout(5000);

    const inputEmail = await page.$("#mat-input-7");
    await inputEmail.type(process.env.EMAIL);

    const inputInvoiceUse = await page.$("#mat-input-5");
    await inputInvoiceUse.type("G03");
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");

    /* Send invoice to email */
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Enter");
    await page.waitForNavigation();
    await page.waitForTimeout(5000);

    await browser.close();

    res.status(200).json({ message: "Successfully created and sent invoice" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
