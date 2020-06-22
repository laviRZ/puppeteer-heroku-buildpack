const puppeteer = require("puppeteer");
let browser;
setBrowser();
const url = "https://mypost.israelpost.co.il/שירותים/איתור-מיקוד/";
async function setBrowser() {
	browser = await puppeteer.launch();
}
async function getZip(address) {
	const page = await browser.newPage();
	await page.goto(url);
	await page.type("#City", address.city);
	await page.type("#Street", address.street);
	await page.type("#House", address.house);
	await page.click("#SearchZipSearch");
	const start = Date.now();
	while ((await getResult(page)) === "") {
		if (Date.now() - start >= 1800) break;
		console.log(Date.now() - start);
		address.city = address.city
			.split(address.city.includes("-") ? "-" : " ")
			.join(address.city.includes(" ") ? "-" : " ");
		await page.evaluate(
			(address) => (document.getElementById("City").value = address.city),
			address
		);

		await page.click("#SearchZipSearch");
		await page.screenshot({ path: "./screenshot.png" });
	}

	let resp;
	try {
		const res = (await getResult(page)).match(/\d+/)[0];
		resp = res;
	} catch (error) {
		console.log(await getResult(page));
		resp = "Not found";
	}
	await page.screenshot({ path: "screenshot.png" });
	page.close();
	console.log(resp);
	return resp;
}

//getZip({ city: "מודיעין-מכבים-רעות", street: "מגדל הלבנון", house: "26" });

async function getResult(page) {
	return await page.evaluate(
		() => document.getElementById("searchresult").innerHTML
	);
}

function hasNumber(s) {
	return /\d/.test(s);
}

module.exports = getZip;

async function sleep(ms) {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}
